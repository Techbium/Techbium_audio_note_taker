export function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const raw = reader.result as string;
      const comma = raw.indexOf(',');
      const base64 = comma >= 0 ? raw.slice(comma + 1) : raw;
      if (!base64) {
        reject(new Error('Could not read file data.'));
        return;
      }
      resolve(base64);
    };
    reader.onerror = () => {
      reject(reader.error ?? new Error('Failed to read file.'));
    };
    reader.readAsDataURL(file);
  });
}
