export function validateFile(file: File): string | null {
  if (!file) return "No file provided.";

  const allowedTypes = [
    "application/pdf",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  ];

  if (!allowedTypes.includes(file.type)) {
    return "File type not supported. Only PDF, XLS, XLSX are allowed.";
  }

  const maxSize = 50 * 1024 * 1024; // 50 MB
  if (file.size > maxSize) {
    return "File too large. Max 50MB allowed.";
  }

  return null;
}
