var mn = [
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

export function month_names(index) {
  return mn[index - 1] === undefined ? "" : mn[index - 1];
}