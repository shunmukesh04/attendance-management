const calculateHours = (checkInTime, checkOutTime) => {
  if (!checkInTime || !checkOutTime) {
    return 0;
  }
  const diff = checkOutTime - checkInTime;
  return Math.round((diff / (1000 * 60 * 60)) * 100) / 100; // Round to 2 decimal places
};

module.exports = calculateHours;

