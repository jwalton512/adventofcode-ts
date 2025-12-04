export const dayToString = (day: number | string) => {
  return day.toString().padStart(2, '0')
}
