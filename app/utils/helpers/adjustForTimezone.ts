export function adjustForTimezone(date: Date, offset: number): Date {
  var timeOffsetInMS: number = offset * 60000;
  date.setTime(date.getTime() + timeOffsetInMS);
  return date;
}
