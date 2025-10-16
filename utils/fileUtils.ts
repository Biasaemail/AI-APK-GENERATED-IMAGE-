
export const fileToBase64 = (file: File): Promise<{ data: string; mimeType: string; previewUrl: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const [header, data] = result.split(',');
      if (!header || !data) {
        reject(new Error("Invalid file format. Could not split data URL."));
        return;
      }
      const mimeTypeMatch = header.match(/:(.*?);/);
      if (!mimeTypeMatch || !mimeTypeMatch[1]) {
        reject(new Error("Could not determine MIME type from data URL header."));
        return;
      }
      const mimeType = mimeTypeMatch[1];
      resolve({ data, mimeType, previewUrl: result });
    };
    reader.onerror = (error) => reject(error);
  });
};
