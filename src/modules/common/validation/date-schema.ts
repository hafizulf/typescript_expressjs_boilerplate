import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

const format = "DD/MM/YYYY HH:mm:ss";

export const validateDateString = (dateString: string): Date => {
  // Parse the date string as Asia/Jakarta time (interprets input as local time, then converts to UTC internally)
  const parsedDate = dayjs.tz(dateString, format, "Asia/Jakarta");
  if (!parsedDate.isValid()) {
    throw new Error(`Invalid date format: ${dateString}. Expected format: ${format}`);
  }
  return parsedDate.toDate();
};
