// src/common/utils/sku.util.ts
export class SkuUtil {
  static generate(storeId: string): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const storePrefix = storeId.substring(0, 4).toUpperCase();

    return `${storePrefix}-${timestamp}-${random}`;
  }

  static generateWithPattern(prefix: string, length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let sku = prefix + '-';
    for (let i = 0; i < length; i++) {
      sku += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return sku;
  }
}
