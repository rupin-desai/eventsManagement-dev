import React from "react";
import { FileSpreadsheet } from "lucide-react";

interface ExcelDownloadProps {
  fileName: string;
  getData: () => Promise<any[]>;
  columns: { label: string; key: string }[];
  buttonText?: string;
  extension?: "xlsx" | "xls" | "csv";
  disabled?: boolean;
}

const ExcelDownload: React.FC<ExcelDownloadProps> = ({
  fileName,
  getData,
  columns,
  buttonText = "Export to Excel",
  extension = "xlsx",
  disabled = false,
}) => {
  const handleDownload = async () => {
    if (disabled) return;
    const data = await getData();

    if (extension === "csv") {
      const csvRows = [
        columns.map((col) => `"${col.label}"`).join(","),
        ...data.map((row) =>
          columns
            .map(
              (col) =>
                `"${(row[col.key] ?? "").toString().replace(/"/g, '""')}""`
            )
            .join(",")
        ),
      ];
      const csvContent = csvRows.join("\r\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName.endsWith(".csv")
        ? fileName
        : `${fileName.replace(/\.\w+$/, "")}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    const [xlsx, saveAs] = await Promise.all([
      import("xlsx"),
      import("file-saver"),
    ]);
    const worksheet = xlsx.utils.json_to_sheet(
      data.map((row) => {
        const filtered: Record<string, any> = {};
        columns.forEach((col) => {
          filtered[col.label] = row[col.key];
        });
        return filtered;
      })
    );
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const wbout = xlsx.write(workbook, { bookType: extension, type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs.saveAs(
      blob,
      fileName.endsWith(`.${extension}`)
        ? fileName
        : `${fileName.replace(/\.\w+$/, "")}.${extension}`
    );
  };

  return (
    <button
      onClick={handleDownload}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 active:scale-95 transition-all duration-150 text-white font-semibold cursor-pointer ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      type="button"
      disabled={disabled}
      title={disabled ? "Select an event to export nominations" : buttonText}
    >
      <FileSpreadsheet className="w-5 h-5" />
      {buttonText}
    </button>
  );
};

export default ExcelDownload;