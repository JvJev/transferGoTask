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

/**
 * Format date with consistent locale to prevent hydration mismatches
 * @param {string} dateString - ISO date string or timestamp
 * @returns {string} Formatted date string
 */
function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) return 'Invalid Date';
  
  // Use consistent format that won't change between server and client
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZoneName: 'short'
  });
}

/**
 * Format date as relative time (e.g., "2 days ago", "Yesterday")
 * @param {string} dateString - ISO date string or timestamp
 * @returns {string} Relative time string
 */
function formatTimeAgo(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  
  // Check if date is valid
  if (isNaN(date.getTime())) return 'Invalid Date';
  
  const diffInMs = now - date;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays < 0) return 'In the future';
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  
  return `${Math.floor(diffInDays / 365)} years ago`;
}

module.exports = {
  isValidNumber,
  formatCurrency,
  formatLargeNumber,
  formatSupply,
  formatPercentage,
  formatPercentageSimple,
  formatDate,
  formatTimeAgo
};