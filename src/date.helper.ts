export const isBefore = (dateA: Date, dateB: Date): boolean => dateA < dateB;
export const isAfter = (dateA: Date, dateB: Date): boolean => dateA > dateB;

export const getDaysBetween = (dateInitial: Date, dateFinal: Date): number => ((dateFinal as unknown as number) - ((dateInitial as unknown) as number)) / (1000 * 3600 * 24)

export const isSameDay = (dateA: Date, dateB: Date): boolean => {
  if (dateA.getFullYear() !== dateB.getFullYear()) return false
  if (dateA.getMonth() !== dateB.getMonth()) return false
  if (dateA.getDate() !== dateB.getDate()) return false
  return true
}

export const getDayBefore = (date: Date): Date => {
  const prevDate = new Date(date.getTime())
  prevDate.setDate(date.getDate() - 1)
  return prevDate
}

export const getDayAfter = (date: Date): Date => {
  const nextDate = new Date(date.getTime())
  nextDate.setDate(date.getDate() + 1)
  return nextDate
}

export const getSpecificDayOfMonth = (day: number, hours?: number, minutes?: number) => {
  const specificDate = new Date()
  specificDate.setDate(day)

  if (hours) specificDate.setHours(hours)
  if (minutes) specificDate.setMinutes(minutes)

  specificDate.setSeconds(0)
  specificDate.setMilliseconds(0)

  return specificDate
}

export const getSpecificDayByDayOffset = (differenceInDays: number) => {
  const specificDate = new Date()
  specificDate.setDate(specificDate.getDate() + differenceInDays)
  return specificDate
}
