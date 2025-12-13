/**
 * Convert text to URL-friendly slug
 * @param text - Text to convert to slug
 * @returns URL-friendly slug
 */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')  // Remove special characters
        .replace(/\s+/g, '-')       // Replace spaces with hyphens
        .replace(/-+/g, '-')        // Replace multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, '');   // Remove leading/trailing hyphens
}

/**
 * Generate SKU from product code, color, and size
 * @param productCode - Product code
 * @param color - Variant color
 * @param size - Variant size
 * @returns Generated SKU
 */
export function generateSKU(productCode: string, color: string, size: string): string {
    const colorCode = color.substring(0, 3).toUpperCase();
    const sizeCode = size.toUpperCase();
    return `${productCode}-${colorCode}-${sizeCode}`;
}
