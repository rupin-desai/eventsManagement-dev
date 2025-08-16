import { useState } from "react";
import { Loader2, Download } from "lucide-react";

interface AchievementsCertificateDownloadProps {
  certificateUrl?: string; // Not used anymore, kept for backward compatibility
  activityName?: string;
  volunteerId?: number;
}

const AchievementsCertificateDownload: React.FC<AchievementsCertificateDownloadProps> = ({
  volunteerId,
  activityName = "Event"
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
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a dummy PDF content for demonstration
      const dummyPdfContent = `
        Certificate of Participation
        
        This is to certify that
        
        JOHN DOE
        
        has successfully participated in
        
        ${activityName.toUpperCase()}
        
        Date: ${new Date().toLocaleDateString()}
        
        Thank you for your dedication to community service!
      `;
      
      // Create a simple text file as demonstration (in real app this would be a PDF)
      const blob = new Blob([dummyPdfContent], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link to trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = `Certificate_${volunteerId}_${activityName.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error('Error downloading certificate:', err);
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