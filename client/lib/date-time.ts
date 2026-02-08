export function getTime(datetime: string) {
  const date = new Date(datetime.split(".")[0]);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
