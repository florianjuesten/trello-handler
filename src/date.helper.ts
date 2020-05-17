export const isBefore = (dateA: Date, dateB: Date): boolean => dateA < dateB;
export const isAfter = (dateA: Date, dateB: Date): boolean => dateA > dateB;

export const getDaysBetween = (dateInitial: Date, dateFinal: Date): number => ((dateFinal as unknown as number) - ((dateInitial as unknown) as number)) / (1000 * 3600 * 24)

export const isSameDate = (dateA: Date, dateB: Date): boolean => dateA.toISOString() === dateB.toISOString();

export const prevDay = (date: Date): Date => {
  const prevDate = new Date(date.getTime())
  prevDate.setDate(date.getDate() - 1)
  return prevDate
}

export const nextDay = (date: Date): Date => {
  const nextDate = new Date(date.getTime())
  nextDate.setDate(date.getDate() + 1)
  return nextDate
}
