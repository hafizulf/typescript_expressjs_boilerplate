import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const format = "DD/MM/YYYY HH:mm:ss";

// Validate a single date string and return a JavaScript Date object
export const validateDateString = (dateString: string): Date => {
  const parsedDate = dayjs(dateString, format, true); // Strict parsing
  if (!parsedDate.isValid()) {
    throw new Error(`Invalid date format: ${dateString}. Expected format: ${format}`);
  }
  return parsedDate.toDate();
};
