import { useState } from "react";
import { Loader2, Download } from "lucide-react";
import { downloadCertificateByVolunteerId } from "../../../api/certificateApi";

interface AchievementsCertificateDownloadProps {
  certificateUrl?: string; // Not used anymore, kept for backward compatibility
  activityName?: string;
  volunteerId?: number;
}

const AchievementsCertificateDownload: React.FC<AchievementsCertificateDownloadProps> = ({
  volunteerId,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!volunteerId) {
      setError("Certificate not available.");
      return;
    }
    setError(null);
    setDownloading(true);
    try {
      // Use the API to get the certificate as a blob
      const response = await downloadCertificateByVolunteerId(String(volunteerId));
      // Detect file type from response headers
      const contentType = response.headers["content-type"] || "application/pdf";
      const extension = contentType === "image/png" ? "png" : "pdf";
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link to trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = `Certificate_${volunteerId}.${extension}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to download certificate.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div>
      <button
        className="flex items-center gap-2 p-2 bg-green-600 hover:bg-green-700 cursor-pointer text-white rounded transition disabled:opacity-60"
        onClick={handleDownload}
        disabled={downloading || !volunteerId}
        title={volunteerId ? "Download Certificate" : "Certificate not available"}
        type="button"
      >
        {downloading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Downloading...
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />  
          </>
        )}
      </button>
      {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
    </div>
  );
};

export default AchievementsCertificateDownload;