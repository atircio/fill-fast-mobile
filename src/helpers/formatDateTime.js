const formatDateTime = (text) => {
  // Remove all non-numeric characters
  const numericText = text.replace(/[^\d]/g, "");

  // Check the length of the numeric input
  const maxLength = 8; // DD-MM-YYYY (8 characters in total)
  if (numericText.length > maxLength) {
    // Limit the input to the maximum length
    return numericText.substring(0, maxLength);
  }

  // Format the date with hyphens (DD-MM-YYYY)
  let formattedDate = "";
  if (numericText.length >= 2) {
    formattedDate += numericText.substring(0, 2) + "-";
  }
  if (numericText.length >= 4) {
    formattedDate += numericText.substring(2, 4) + "-";
  }
  if (numericText.length >= 6) {
    formattedDate += numericText.substring(4, 8);
  }

  return formattedDate;
};
