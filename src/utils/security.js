// Input sanitization utilities
export function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers
}

export function sanitizeForUrl(input) {
  return encodeURIComponent(sanitizeInput(input));
}

export function validateTextLength(text, maxLength) {
  return text && text.length <= maxLength;
}

export function validateImageFile(file) {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 2 * 1024 * 1024; // 2MB
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, and WebP images are allowed.' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'Image must be smaller than 2MB.' };
  }
  
  return { valid: true };
}