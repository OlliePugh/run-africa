
from selenium.webdriver import Chrome, ChromeOptions
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
import time
import pickle
from datetime import datetime
from dateutil.relativedelta import relativedelta
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
import requests
import gpxpy
import json

# Get environment variables
EMAIL = os.getenv('STRAVA_EMAIL')
PASSWORD = os.environ.get('STRAVA_PASSWORD')

def data_to_gpx_to_json(gpx_string):
    gpx = gpxpy.parse(gpx_string)
    gpx_data = []

    for track in gpx.tracks:
        for segment in track.segments:
            segment_points = []

            for point in segment.points:
                segment_points.append([point.latitude, point.longitude])

            gpx_data.append(segment_points)

    return gpx_data[0]  # returns array

opts = ChromeOptions()
opts.add_argument("--window-size=1024,720")

driver = Chrome(options=opts)
driver.implicitly_wait(1)

try:
    cookies = pickle.load(open("cookies.pkl", "rb"))
    for cookie in cookies:
        driver.add_cookie(cookie)
except:
    pass

driver.get("https://www.strava.com/login")
driver.find_element(By.ID, "email").send_keys(EMAIL)
driver.find_element(By.ID, "password").send_keys(PASSWORD)
driver.find_element(By.ID, "login-button").click()
pickle.dump(driver.get_cookies(), open("cookies.pkl", "wb"))


def scrape_run(driver, link):
    
    data = {}
    driver.get(link)
    
    date_string = driver.find_element(By.XPATH, "//time").text
    date_format = "%A, %d %B %Y"

    strongs = driver.find_elements(By.XPATH, "//strong")  # last is just noise

    run_name = driver.find_element(By.CLASS_NAME, "activity-name").text

    # Convert cookies to the required format for the requests library
    cookies_dict = {cookie['name']: cookie['value'] for cookie in driver.get_cookies()}

    # Make a request to the endpoint using the cookies
    url = link + "/export_gpx"  # Replace with your endpoint URL
    response = requests.get(url, cookies=cookies_dict)

    # Get the response content as a string
    download_contents = response.content.decode('utf-8')

    data["date"] = datetime.strptime(date_string, date_format).timestamp()
    data["distance"] = strongs[0].text
    data["moving_time"] = strongs[1].text
    data["pace"] = strongs[2].text
    data["elevation"] = strongs[3].text
    data["calories"] = strongs[4].text
    data["elapsed_time"] = strongs[5].text
    data["url"] = link
    data["run_name"] = run_name
    data["path"] = data_to_gpx_to_json(download_contents)

    return data



# get the runs
first_run = datetime(2023, 4, 22)  # date of the first run

# Start with the current date
target_month = datetime(2023, 5, 22)#datetime.today()

def map_a_tags(item):
    try:
        return item.get_attribute("href")
    except:
        return None

all_runs = []

while target_month >= first_run:
    # # Format the target month as desired (YYYYMM)
    formatted_month = target_month.strftime("%Y%m")
    driver.get("https://www.strava.com/athletes/22704023#interval?interval="+formatted_month+"&interval_type=month&chart_type=miles&year_offset=0")
    
    page_height = driver.execute_script("return document.body.scrollHeight")

    # Define the duration in seconds for scrolling
    scroll_duration = 2

    # Start time
    start_time = time.time()

    # Scroll continuously for the specified duration
    while time.time() - start_time < scroll_duration:
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(1)  # Wait for 1 second between scrolls

    # # Re-locate the links each time
    links = driver.find_elements(By.XPATH, "//div[@class='feed-ui']//a[starts-with(@href, '/activities/')]")
    
    links = list(map(map_a_tags, links))
    links = list(set(links))
    # Remove duplicates by converting to a set and back to a list
    
    for link in links:
        if not link:  # if is empty
            continue
        
        try:
            result = scrape_run(driver, link)
            if (result["date"] >= first_run):
                all_runs.append(result)
                with open("runs/{}-{}.json".format(result["run_name"], result["calories"]).replace("\\"," "), "w") as file:
                    json.dump(result, file)
        except:  # if something goes wrong just ignore it
            print("failed to scrape " +link)
            pass
    

    print("https://www.strava.com/athletes/22704023#interval?interval="+formatted_month+"&interval_type=month&chart_type=miles&year_offset=0")
    target_month -= relativedelta(months=1)


with open("all_runs.json", "w") as file:
    json.dump(all_runs, file)

driver.close()
