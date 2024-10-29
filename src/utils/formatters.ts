export function formatNumber(value: number): string {
  return new Intl.NumberFormat('ko-KR').format(value);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR').format(date);
}