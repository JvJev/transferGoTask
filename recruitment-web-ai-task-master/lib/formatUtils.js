// Utility functions for formatting cryptocurrency data

/**
 * Check if a value is a valid number
 */
function isValidNumber(value) {
  return value != null && !isNaN(parseFloat(value)) && isFinite(value);
}

/**
 * Format currency with proper locale formatting
 */
function formatCurrency(value, options = {}) {
  if (!isValidNumber(value)) return 'N/A';
  
  return parseFloat(value).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
    ...options
  });
}

/**
 * Format large numbers with B/M/K notation (with $ prefix)
 */
function formatLargeNumber(value) {
  if (!isValidNumber(value)) return 'N/A';
  
  const numValue = parseFloat(value);
  
  if (numValue >= 1e12) return `$${(numValue / 1e12).toFixed(2)}T`;
  if (numValue >= 1e9) return `$${(numValue / 1e9).toFixed(2)}B`;
  if (numValue >= 1e6) return `$${(numValue / 1e6).toFixed(2)}M`;
  if (numValue >= 1e3) return `$${(numValue / 1e3).toFixed(2)}K`;
  
  return formatCurrency(numValue);
}

/**
 * Format supply numbers with B/M/K notation (no $ prefix)
 */
function formatSupply(supply) {
  if (!isValidNumber(supply)) return 'N/A';
  
  const numValue = parseFloat(supply);
  
  if (numValue >= 1e12) return `${(numValue / 1e12).toFixed(2)}T`;
  if (numValue >= 1e9) return `${(numValue / 1e9).toFixed(2)}B`;
  if (numValue >= 1e6) return `${(numValue / 1e6).toFixed(2)}M`;
  if (numValue >= 1e3) return `${(numValue / 1e3).toFixed(2)}K`;
  
  return numValue.toLocaleString();
}

/**
 * Format percentage with + sign for positive values
 */
function formatPercentage(value) {
  if (!isValidNumber(value)) return 'N/A';
  
  const numValue = parseFloat(value);
  return `${numValue >= 0 ? '+' : ''}${numValue.toFixed(2)}%`;
}

/**
 * Format percentage without + sign (for detail pages)
 */
function formatPercentageSimple(value) {
  if (!isValidNumber(value)) return 'N/A';
  
  return `${parseFloat(value).toFixed(2)}%`;
}

module.exports = {
  isValidNumber,
  formatCurrency,
  formatLargeNumber,
  formatSupply,
  formatPercentage,
  formatPercentageSimple
};