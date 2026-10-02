export const convertImageToWebP = (file: File, quality: number = 0.85): Promise<File> => {
  return new Promise((resolve) => {
    if (!file || !(file instanceof File)) {
      resolve(file);
      return;
    }

    if (file.type === "image/webp" || !file.type.startsWith("image/")) {
      resolve(file);
      return;
    }

    if (file.type === "image/svg+xml") {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(file);
            return;
          }
          ctx.drawImage(img, 0, 0);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                resolve(file);
                return;
              }
              const fileNameWithoutExt =
                file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
              const webpFileName = `${fileNameWithoutExt}.webp`;
              const webpFile = new File([blob], webpFileName, {
                type: "image/webp",
                lastModified: Date.now(),
              });
              resolve(webpFile);
            },
            "image/webp",
            quality
          );
        } catch (err) {
          console.error("Failed to convert image to WebP:", err);
          resolve(file);
        }
      };
      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
};
