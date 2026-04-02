/**
 * QR Code generation helper
 * For now, returns a simple placeholder
 * In production, use a library like 'qrcode' npm package
 */

export async function generateQRCode(data: string): Promise<string> {
  // Placeholder implementation
  // In production, use: npm install qrcode
  // import QRCode from 'qrcode';
  // return QRCode.toDataURL(data);

  // For now, return a simple data URL or placeholder
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='white'/%3E%3C/svg%3E`;
}
