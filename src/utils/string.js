const truncate = (string, len) => {
  if (string.length > len) return string.substring(0, len) + "...";
  else return string;
};

export default truncate;