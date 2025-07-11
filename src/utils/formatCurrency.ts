/**
 * Formats a number as Chilean Peso currency with points as thousand separators
 * and no decimal places
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "$1.000" instead of "$1.000,00")
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) {
    return '$0';
  }

  // Convert to integer to remove any decimal places, then format with points
  const integerAmount = Math.round(amount);
  
  return integerAmount.toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

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