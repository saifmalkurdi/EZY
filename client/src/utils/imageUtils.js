/**
 * Get the full URL for an image, handling relative paths correctly
 * @param {string} url - The image URL (can be relative or absolute)
 * @returns {string|null} - The full image URL or null if no URL provided
 */
export const getImageUrl = (url) => {
  if (!url) return null;

  // If it's already a full URL, return as-is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // If it's a relative path, prepend the server base URL (not API URL)
  if (url.startsWith("/uploads/")) {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
    const serverUrl = apiUrl.replace("/api", ""); // Remove /api to get base server URL
    return `${serverUrl}${url}`;
  }

  return url;
};
