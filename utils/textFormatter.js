/**
 * Trims and capitalizes the first letter of an ingredient string.
 * Example: "khoai lang" -> "Khoai lang", "thịt bò" -> "Thịt bò"
 * @param {string} str
 * @returns {string}
 */
function capitalizeIngredient(str) {
  if (!str || typeof str !== 'string') return '';
  const trimmed = str.trim();
  if (!trimmed) return '';
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

module.exports = {
  capitalizeIngredient
};
