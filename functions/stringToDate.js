module.exports = function stringToDate(dateString, UTCOffset) {
  const parts = dateString.split("/");
  const date = new Date(
    parseInt(parts[2], 10),
    parseInt(parts[1], 10) - 1,
    parseInt(parts[0], 10)
  );
  if (parts.length !== 3 || isNaN(date)) return null;
  date.setHours(date.getHours() - UTCOffset);
  return date;
};
