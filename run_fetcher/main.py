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
import os
from dotenv import load_dotenv

load_dotenv()

# Get environment variables
EMAIL = os.getenv('STRAVA_EMAIL')
PASSWORD = os.environ.get('STRAVA_PASSWORD')
SHOULD_LOG_IN = True


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
# just a nice to have doesn't matter if it fails (i.e. fail doesn't exist)
except:
    pass

if (SHOULD_LOG_IN):
    driver.get("https://www.strava.com/login")
    driver.find_element(By.ID, "email").send_keys(EMAIL)
    driver.find_element(By.ID, "password").send_keys(PASSWORD)
    driver.find_element(By.ID, "login-button").click()
    pickle.dump(driver.get_cookies(), open(
        "cookies.pkl", "wb"))  # save the auth tokens


def scrape_run(driver, link):

    data = {}
    driver.get(link)

    date_string = driver.find_element(By.XPATH, "//time").text
    date_format = "%A, %d %B %Y"

    strongs = driver.find_elements(By.XPATH, "//strong")  # last is just noise

    run_name = driver.find_element(By.CLASS_NAME, "activity-name").text

    # Convert cookies to the required format for the requests library
    cookies_dict = {cookie['name']: cookie['value']
                    for cookie in driver.get_cookies()}

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
FIRST_RUN = datetime(2023, 4, 22)  # date of the first run

# Start with the current date
target_month = datetime.today().replace(day=22)  # kinda hacky fix


def map_a_tags(item):
    try:
        return item.get_attribute("href")
    except:
        return None


all_runs = []
new_runs = []

new_link_found = False

while target_month >= FIRST_RUN:
    # # Format the target month as desired (YYYYMM)
    formatted_month = target_month.strftime("%Y%m")
    driver.get("https://www.strava.com/athletes/22704023#interval?interval=" +
               formatted_month+"&interval_type=month&chart_type=miles&year_offset=0")

    # Scroll continuously for the specified duration
    page_height = driver.execute_script("return document.body.scrollHeight")
    scroll_duration = 2
    start_time = time.time()
    while time.time() - start_time < scroll_duration:  # scroll down to load all
        driver.execute_script(
            "window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(1)  # Wait for 1 second between scrolls

    # Find all links on the page
    links = driver.find_elements(
        By.XPATH, "//div[@class='feed-ui']//a[starts-with(@href, '/activities/')]")

    links = list(map(map_a_tags, links))
    links = list(set(links))
    # Remove duplicates by converting to a set and back to a list

    for link in links:
        if not link:  # if is empty
            continue  # go to the next link

        activity_id = link.split("/")[-1]

        if (os.path.exists(f"runs/{activity_id}.json")):
            print("skipping run as already downloaded " + link)
            continue  # ignore this link as we have already download it

        try:
            result = scrape_run(driver, link)
            if (result["date"] >= FIRST_RUN.timestamp()):
                all_runs.append(result)
                file_name = f"runs/{activity_id}.json"
                new_runs.append(file_name)
                with open(file_name, "w") as file:
                    json.dump(result, file)
                new_link_found = True
            print("successfully scraped " + link)
        except:  # if something goes wrong just ignore it
            print("failed to scrape " + link)
            pass

    print("https://www.strava.com/athletes/22704023#interval?interval=" +
          formatted_month+"&interval_type=month&chart_type=miles&year_offset=0")

    if not new_link_found:
        print("no new runs found on page - exiting early")
        break

    target_month -= relativedelta(months=1)


# Iterate over each file in the folder
for filename in os.listdir("runs"):
    # if its in new runs then we dont need to read the file again
    if filename.endswith(".json") and filename not in new_runs:
        file_path = os.path.join("runs", filename)
        with open(file_path) as file:
            # Load the JSON data from the file
            json_data = json.load(file)
            # Add the JSON data to the all_runs array
            all_runs.append(json_data)

with open("../src/all_runs.json", "w") as file:
    json.dump(all_runs, file)

driver.close()
