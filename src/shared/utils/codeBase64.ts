export function encodeToBase64(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeFromBase64(base64: string): string {
  const base64Str = base64
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');

  const binary = atob(base64Str);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
