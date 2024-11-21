import moment from "moment";

export const validateDateString = (dateString: string): Date => {
  const momentDate = moment(dateString, "DD/MM/YYYY HH:mm:ss", true); // Strict parsing
  if (!momentDate.isValid()) {
    throw new Error("Invalid date format");
  }
  return momentDate.toDate(); // Return as JavaScript Date object
};
