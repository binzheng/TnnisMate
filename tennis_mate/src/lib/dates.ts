export function formatDateTime(date: Date, locale = 'ja-JP'): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: false,
    }).format(date);
  } catch {
    return date.toLocaleString();
  }
}

export function parseLocalDateTime(value: string): Date | null {
  // expects 'yyyy-MM-ddTHH:mm'
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

