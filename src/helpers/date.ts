export const formatEpochToString = (epoch: number) => {
  const date = new Date(epoch * 1000); // Convert seconds to milliseconds
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayOfWeek = daysOfWeek[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];

  // Get the appropriate suffix for the day
  let daySuffix;
  if (day === 1 || day === 21 || day === 31) {
    daySuffix = "st";
  } else if (day === 2 || day === 22) {
    daySuffix = "nd";
  } else if (day === 3 || day === 23) {
    daySuffix = "rd";
  } else {
    daySuffix = "th";
  }

  const formattedString = `${dayOfWeek}, ${day}${daySuffix} ${month}`;
  return formattedString;
};

export const daysSinceStart = () => {
  // Get the current date
  const currentDate = new Date();

  // Set the target date (April 22, 2023)
  const targetDate = new Date("2023-04-22");

  // Calculate the time difference in milliseconds
  const timeDiff = currentDate.getTime() - targetDate.getTime();

  // Convert the time difference from milliseconds to days
  return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
};
