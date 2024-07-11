// Helper function to normalize dates to midnight
export default function dateHandler(date: Date) {
    if (date instanceof Date) {
      date.setHours(0, 0, 0, 0);
    }
    return date;
  }