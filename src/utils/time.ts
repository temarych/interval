export function getTime(date: Date) {
  return date.toISOString().split("T")[1].split(".")[0];
}

export function getDay(date: Date) {
  return date.toISOString().split("T")[0];
}

export function getDate(day: string, time?: string) {
  return new Date(time ? `${day}T${time}Z` : day);
}

export function getMillisecondsFromTime(time: string) {
  const [hours = 0, minutes = 0, seconds = 0] = time.split(":");
  const allSeconds = Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
  return allSeconds * 1000;
}

export function getTimeFromMilliseconds(milliseconds: number) {
  const toTwoDigit = (number: number) => Math.log10(number) > 1 ? `${number}` : `0${number}`;
  const allSeconds = milliseconds / 1000;
  const hours = Math.floor(allSeconds / 3600);
  const minutes = Math.floor((allSeconds - hours * 3600) / 60);
  const seconds = (allSeconds - hours * 3600 - minutes * 60);
  return [hours, minutes, seconds].map(toTwoDigit).join(":");
}