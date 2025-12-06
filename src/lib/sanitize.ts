// src/lib/sanitize.ts
import DOMPurify from 'dompurify';

/**
 * Sanitize user-generated content to prevent XSS attacks
 * Removes all potentially dangerous HTML/JavaScript while preserving safe formatting
 */

// Configure DOMPurify with safe defaults
const sanitizeConfig = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'blockquote'],
  ALLOWED_ATTR: ['href', 'target', 'rel'],
  ALLOW_DATA_ATTR: false,
  ALLOW_UNKNOWN_PROTOCOLS: false,
};

/**
 * Sanitize HTML content
 * Use this when you need to render user content that may contain HTML
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, sanitizeConfig);
}

/**
 * Sanitize plain text (escape all HTML)
 * Use this for most user content (titles, descriptions, comments)
 */
export function sanitizeText(dirty: string): string {
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

/**
 * Sanitize and validate URL
 * Returns the URL if safe, empty string if dangerous
 */
export function sanitizeUrl(dirty: string): string {
  if (!dirty) return '';

  try {
    const url = new URL(dirty);

    // Only allow http, https protocols
    if (!['http:', 'https:'].includes(url.protocol)) {
      return '';
    }

    return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  } catch {
    return ''; // Invalid URL
  }
}

/**
 * Validate and sanitize input before sending to database
 */
export interface ValidationResult {
  isValid: boolean;
  sanitized: string;
  error?: string;
}

export function validateTitle(title: string): ValidationResult {
  const trimmed = title.trim();

  if (!trimmed) {
    return { isValid: false, sanitized: '', error: 'Title is required' };
  }

  if (trimmed.length > 300) {
    return { isValid: false, sanitized: '', error: 'Title must be 300 characters or less' };
  }

  const sanitized = sanitizeText(trimmed);
  return { isValid: true, sanitized };
}

export function validateContent(content: string, maxLength: number = 10000): ValidationResult {
  const trimmed = content.trim();

  if (!trimmed) {
    return { isValid: false, sanitized: '', error: 'Content is required' };
  }

  if (trimmed.length > maxLength) {
    return { isValid: false, sanitized: '', error: `Content must be ${maxLength} characters or less` };
  }

  const sanitized = sanitizeText(trimmed);
  return { isValid: true, sanitized };
}

export function validateVideoUrl(url: string): ValidationResult {
  if (!url) {
    return { isValid: true, sanitized: '' }; // Optional field
  }

  const trimmed = url.trim();

  if (trimmed.length > 2048) {
    return { isValid: false, sanitized: '', error: 'URL is too long' };
  }

  const sanitized = sanitizeUrl(trimmed);

  if (!sanitized) {
    return { isValid: false, sanitized: '', error: 'Invalid or unsafe URL' };
  }

  return { isValid: true, sanitized };
}

export function validateImageFile(file: File): ValidationResult {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      isValid: false,
      sanitized: '',
      error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'
    };
  }

  if (file.size > MAX_SIZE) {
    return {
      isValid: false,
      sanitized: '',
      error: 'File is too large. Maximum size is 5MB.'
    };
  }

  return { isValid: true, sanitized: file.name };
}

/**
 * Sanitize array of tags
 */
export function sanitizeTags(tags: string[]): string[] {
  return tags
    .map(tag => sanitizeText(tag.trim()))
    .filter(tag => tag.length > 0 && tag.length <= 50)
    .slice(0, 10); // Max 10 tags
}

/**
 * React component wrapper for sanitized HTML
 * Usage: <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(userContent) }} />
 */
export function createSafeHtml(dirty: string): { __html: string } {
  return { __html: sanitizeHtml(dirty) };
}
