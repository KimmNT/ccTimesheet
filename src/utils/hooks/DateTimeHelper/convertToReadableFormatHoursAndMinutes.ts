export const convertToReadableFormatHoursAndMinutes = (time: number) => {
  const convertedTime = new Date(time);
  const hours = convertedTime.getHours().toString().padStart(2, "0");
  const minutes = convertedTime.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};
