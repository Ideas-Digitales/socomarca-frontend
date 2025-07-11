/**
 * Formats a number as Chilean Peso currency with points as thousand separators
 * and no decimal places
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "$1.000" instead of "$1.000,00")
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats a number with points as thousand separators (no currency symbol)
 * @param amount - The amount to format
 * @returns Formatted number string (e.g., "1.000" instead of "1.000,00")
 */
export function formatNumber(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) {
    return '0';
  }

  const integerAmount = Math.round(amount);
  
  return integerAmount.toLocaleString('es-CL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-CL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};