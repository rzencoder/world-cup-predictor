const dateFormater = (date) => {
  const months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dateArray = date.split('-');
  if (dateArray[1].charAt(0) === '0') {
    dateArray[1] = dateArray[1].slice(1);
  }
  return dateArray[2] + ' ' + months[dateArray[1]] + ' ' + dateArray[0];
};

export default dateFormater;
