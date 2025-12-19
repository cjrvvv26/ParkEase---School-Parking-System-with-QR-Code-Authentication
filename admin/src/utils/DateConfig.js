const getDate = () => {
  const weekend = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
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

  const today = new Date();
  const month = months[today.getMonth()];
  const year = today.getFullYear();
  const day = weekend[today.getDay() - 1];

  return `${month} ${today.getDate()} ${year}, ${day}`;
};

export default getDate;
