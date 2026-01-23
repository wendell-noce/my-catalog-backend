// src/common/utils/slug.util.ts
export class SlugUtil {
  static generate(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  static generateUnique(text: string, suffix?: string): string {
    const baseSlug = this.generate(text);
    if (!suffix) return baseSlug;
    return `${baseSlug}-${suffix}`;
  }
}
