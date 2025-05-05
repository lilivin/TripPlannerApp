/**
 * Validates image URLs to ensure they come from allowed domains
 * and have proper image extensions
 */

// List of allowed image hosting domains
const ALLOWED_IMAGE_DOMAINS = [
  "images.unsplash.com",
  "cloudinary.com",
  "res.cloudinary.com",
  "githubusercontent.com",
  "example-cdn.com", // Add your project's CDN domains
];

// List of allowed image extensions
const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"];

/**
 * Validates that an image URL comes from an allowed domain and has a valid extension
 * @param url - The image URL to validate
 * @returns An object with validation result and error message if invalid
 */
export const validateImageUrl = (url: string): { isValid: boolean; error?: string } => {
  try {
    const parsedUrl = new URL(url);

    // Check if the domain is allowed
    const domainValid = ALLOWED_IMAGE_DOMAINS.some((domain) => parsedUrl.hostname.includes(domain));
    if (!domainValid) {
      return {
        isValid: false,
        error: "URL obrazu musi pochodzić z dozwolonej domeny hostującej obrazy.",
      };
    }

    // Check if the file extension is allowed
    const path = parsedUrl.pathname.toLowerCase();
    const hasValidExtension = ALLOWED_IMAGE_EXTENSIONS.some((ext) => path.endsWith(ext));
    if (!hasValidExtension) {
      return {
        isValid: false,
        error: "URL obrazu musi kończyć się prawidłowym rozszerzeniem pliku obrazu.",
      };
    }

    return { isValid: true };
  } catch {
    return { isValid: false, error: "Nieprawidłowy format URL obrazu." };
  }
};

/**
 * Validates an array of image URLs
 * @param urls - Array of image URLs to validate
 * @returns An object with validation result and error messages for invalid URLs
 */
export const validateImageUrls = (
  urls: string[]
): {
  allValid: boolean;
  errors: { url: string; error: string }[];
} => {
  const errors: { url: string; error: string }[] = [];

  for (const url of urls) {
    const result = validateImageUrl(url);
    if (!result.isValid && result.error) {
      errors.push({ url, error: result.error });
    }
  }

  return {
    allValid: errors.length === 0,
    errors,
  };
};
