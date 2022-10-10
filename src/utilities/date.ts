const days = [
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

export const getTimestamp = () => {
  const date = new Date();
  const day = days[date.getDay()];
  const dt = parseDate(String(date.getDate()));
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hour = date.getHours();
  let mins = String(date.getMinutes());
  let seconds = String(date.getSeconds());
  mins = mins.length === 1 ? "0" + mins : mins;
  seconds = seconds.length === 1 ? "0" + seconds : seconds;
  return `${day} ${dt} ${month} ${year} ${hour}:${mins}:${seconds}`;
};

const parseDate = (dt: string) => {
  const extensions: { [key: string]: string } = {
    "1": "st",
    "2": "nd",
    "3": "rd",
  };
  const lastChar = dt.slice(dt.length);
  return extensions[lastChar] ? dt + extensions[lastChar] : dt + "th";
};
