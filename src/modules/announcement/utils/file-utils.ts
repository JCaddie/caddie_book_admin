/**
 * 파일 크기를 읽기 쉬운 형태로 포맷팅
 * @param bytes - 바이트 크기
 * @returns 포맷된 파일 크기 문자열
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * 파일 확장자 추출
 * @param filename - 파일명
 * @returns 파일 확장자 (소문자)
 */
export const getFileExtension = (filename: string): string => {
  return filename.split(".").pop()?.toLowerCase() || "";
};

/**
 * 파일 타입이 허용된 타입인지 확인
 * @param file - 확인할 파일
 * @param allowedTypes - 허용된 확장자 배열
 * @returns 허용 여부
 */
export const isAllowedFileType = (
  file: File,
  allowedTypes: string[]
): boolean => {
  const extension = getFileExtension(file.name);
  return allowedTypes.some(
    (type) => type.replace(".", "").toLowerCase() === extension
  );
};

/**
 * 파일명에서 안전하지 않은 문자 제거
 * @param filename - 원본 파일명
 * @returns 정제된 파일명
 */
export const sanitizeFilename = (filename: string): string => {
  return filename.replace(/[^a-zA-Z0-9가-힣._-]/g, "_");
};

/**
 * 중복 파일명 처리 (숫자 접미사 추가)
 * @param filename - 원본 파일명
 * @param existingFilenames - 기존 파일명 목록
 * @returns 중복되지 않는 파일명
 */
export const generateUniqueFilename = (
  filename: string,
  existingFilenames: string[]
): string => {
  const extension = getFileExtension(filename);
  const baseName = filename.replace(`.${extension}`, "");

  let counter = 1;
  let newFilename = filename;

  while (existingFilenames.includes(newFilename)) {
    newFilename = `${baseName}_${counter}.${extension}`;
    counter++;
  }

  return newFilename;
};

/**
 * 파일 목록에서 총 크기 계산
 * @param files - 파일 목록
 * @returns 총 크기 (바이트)
 */
export const calculateTotalFileSize = (files: File[]): number => {
  return files.reduce((total, file) => total + file.size, 0);
};

/**
 * 파일을 base64로 변환
 * @param file - 변환할 파일
 * @returns Promise<string> base64 문자열
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};
