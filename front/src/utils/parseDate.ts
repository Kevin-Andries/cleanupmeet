export function parseDate(
  date: string,
  { year, month, day }: { year: boolean; month: boolean; day: boolean } = {
    year: true,
    month: true,
    day: true,
  }
) {
  return new Date(date).toLocaleDateString("en-US", {
    year: year ? "numeric" : undefined,
    month: month ? "long" : undefined,
    day: day ? "numeric" : undefined,
  });
}
