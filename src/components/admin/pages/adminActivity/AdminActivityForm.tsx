import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Save,
  X,
  Upload,
  Loader2,
  FileText,
  Code,
  Wand2,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Image as ImageIcon,
  RefreshCcw,
} from "lucide-react";
// Removed API imports
// import type { Activity as BaseActivity } from "../../../../api/activityApi";
// import {
//   getActivityImage,
//   convertToDataUrl,
// } from "../../../../api/activityApi";
// import { createActivityImage, updateActivityStatus } from "../../../../api/admin/activityAdminApi";
// import { getCurrentUserDetails } from "../../../../utils/volunteerFormHelpers";
// import { getActivities } from "../../../../api/activityApi";
import AdminNotification from "../../../ui/admin/AdminNotification";

// Dummy Activity type (replaces API type)
interface Activity {
  activityId: number;
  name: string;
  subName: string;
  type: string;
  description: string;
  status: string;
  addedBy: number;
  addedOn: string;
  certificate?: boolean;
}

interface ActivityFormData {
  name: string;
  subName: string;
  type: boolean;
  description: string;
  certificate: boolean;
}

interface AdminActivityFormProps {
  isOpen: boolean;
  editingActivity: Activity | null;
  formData: ActivityFormData;
  setFormData: React.Dispatch<React.SetStateAction<ActivityFormData>>;
  selectedImage: File | null;
  formLoading: boolean;
  onSubmit: () => void;
  onClose: () => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface FAQ {
  question: string;
  answer: string;
}

// Dummy user details
const dummyUserDetails = {
  employeeId: 1001,
  empcode: "EMP001",
  name: "John Doe"
};

// ✅ Helper function to generate direct HTML description
const generateDirectDescription = (): string => {
  return `<p><strong>Objective:</strong> Engage employees in a hands-on cake making activity and bring joy to children in orphanages. Fosters emotional connections, and supports child well-being.</p><p><strong>Activity Details:</strong></p><ul><li>• Employees participate in a cake-making workshop led by professional bakers.</li><li>• Cakes are decorated with positive messages and themes.</li><li>• Post-workshop, cakes to be distributed to underprivileged children.</li></ul><p><strong>FAQ:</strong></p><ul><li>Do I need prior baking experience? – No, professionals will guide.</li><li>Do I get the certificate? – Yes</li></ul>`;
};

// ✅ Helper function to parse HTML description back into template fields
const parseHtmlToTemplate = (html: string) => {
  if (!html) {
    return {
      objective: "",
      activityDetails: [""],
      faqs: [{ question: "", answer: "" }],
    };
  }

  let objective = "";
  let activityDetails: string[] = [];
  let faqs: FAQ[] = [];

  try {
    // ✅ Parse Objective
    const objectiveMatch = html.match(
      /<p><strong>Objective:<\/strong>\s*(.*?)<\/p>/i
    );
    if (objectiveMatch) {
      objective = objectiveMatch[1].trim();
    }

    // ✅ Parse Activity Details
    const detailsMatch = html.match(
      /<p><strong>Activity Details:<\/strong><\/p><ul>(.*?)<\/ul>/is
    );
    if (detailsMatch) {
      const detailsHtml = detailsMatch[1];
      const detailMatches = detailsHtml.match(/<li>(.*?)<\/li>/gs);
      if (detailMatches) {
        activityDetails = detailMatches
          .map((match) => {
            let detail = match.replace(/<\/?li>/g, "").trim();
            // Remove leading bullet if present
            detail = detail.replace(/^•\s*/, "");
            return detail;
          })
          .filter((detail) => detail.length > 0);
      }
    }

    // ✅ Parse FAQs
    const faqMatch = html.match(
      /<p><strong>FAQ:<\/strong><\/p><ul>(.*?)<\/ul>/is
    );
    if (faqMatch) {
      const faqHtml = faqMatch[1];
      const faqMatches = faqHtml.match(/<li>(.*?)<\/li>/gs);
      if (faqMatches) {
        faqs = faqMatches
          .map((match) => {
            const faqText = match.replace(/<\/?li>/g, "").trim();
            // Split on " – " (em dash) or " - " (regular dash)
            const parts = faqText.split(/\s*[–-]\s*/);
            if (parts.length >= 2) {
              return {
                question: parts[0].trim(),
                answer: parts.slice(1).join(" – ").trim(),
              };
            }
            return { question: faqText, answer: "" };
          })
          .filter((faq) => faq.question.length > 0);
      }
    }

    // ✅ Ensure we have at least one item in each array
    if (activityDetails.length === 0) {
      activityDetails = [""];
    }
    if (faqs.length === 0) {
      faqs = [{ question: "", answer: "" }];
    }
  } catch (error) {
    // Return default structure on error
    return {
      objective: "",
      activityDetails: [""],
      faqs: [{ question: "", answer: "" }],
    };
  }

  return { objective, activityDetails, faqs };
};

const AdminActivityForm: React.FC<AdminActivityFormProps> = ({
  isOpen,
  editingActivity,
  formData,
  setFormData,
  formLoading,
  onSubmit,
  onClose,
}) => {
  const [showDescriptionHelper, setShowDescriptionHelper] = useState(false);
  const [helperMode, setHelperMode] = useState<"template" | "direct">(
    "template"
  );
  const [previewMode, setPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState<"objective" | "details" | "faq">(
    "objective"
  );

  // Template form fields
  const [templateFields, setTemplateFields] = useState({
    objective: "",
    activityDetails: ["• "],
    faqs: [{ question: "• ", answer: "" }] as FAQ[],
  });

  // Notification state
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Certificate API value state
  const [certificateApiValue, setCertificateApiValue] = useState<boolean | null>(null);

  // ✅ Parse existing description when editing activity
  useEffect(() => {
    if (editingActivity && formData.description) {
      const parsed = parseHtmlToTemplate(formData.description);
      setTemplateFields(parsed);
    } else if (!editingActivity) {
      // Reset template fields for new activity
      setTemplateFields({
        objective: "",
        activityDetails: ["• "],
        faqs: [{ question: "• ", answer: "" }],
      });
    }
  }, [editingActivity, formData.description, isOpen]);

  // Simulate fetching certificate status (no actual API call)
  useEffect(() => {
    const fetchCertificateStatus = async () => {
      if (editingActivity && editingActivity.activityId) {
        try {
          // Simulate API call with timeout
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Use dummy data or existing activity data
          const certificateValue = editingActivity.certificate ?? false;
          setCertificateApiValue(certificateValue);
          setFormData((prev) => ({
            ...prev,
            certificate: certificateValue,
          }));
        } catch {
          setCertificateApiValue(null);
        }
      }
    };
    fetchCertificateStatus();
    // eslint-disable-next-line
  }, [editingActivity]);

  // ✅ Handle template field changes
  const handleObjectiveChange = (value: string) => {
    setTemplateFields((prev) => ({ ...prev, objective: value }));
  };

  const handleActivityDetailChange = (index: number, value: string) => {
    setTemplateFields((prev) => ({
      ...prev,
      activityDetails: prev.activityDetails.map((detail, i) =>
        i === index ? value : detail
      ),
    }));
  };

  const addActivityDetail = () => {
    setTemplateFields((prev) => ({
      ...prev,
      activityDetails: [...prev.activityDetails, "• "],
    }));
  };

  const removeActivityDetail = (index: number) => {
    setTemplateFields((prev) => ({
      ...prev,
      activityDetails: prev.activityDetails.filter((_, i) => i !== index),
    }));
  };

  const handleFaqChange = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    setTemplateFields((prev) => ({
      ...prev,
      faqs: prev.faqs.map((faq, i) =>
        i === index ? { ...faq, [field]: value } : faq
      ),
    }));
  };

  const addFaq = () => {
    setTemplateFields((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: "• ", answer: "" }],
    }));
  };

  const removeFaq = (index: number) => {
    setTemplateFields((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  // ✅ Generate description from template
  const applyTemplate = () => {
    const { objective, activityDetails, faqs } = templateFields;

    const objectiveHtml = objective
      ? `<p><strong>Objective:</strong> ${objective}</p>`
      : "";

    // Remove leading bullet if present, then add one in the template
    const detailsHtml =
      activityDetails.filter((detail) => detail.trim()).length > 0
        ? `<p><strong>Activity Details:</strong></p><ul>${activityDetails
            .filter((detail) => detail.trim())
            .map((detail) => {
              const cleanDetail = detail.replace(/^•\s*/, "");
              return `<li>• ${cleanDetail}</li>`;
            })
            .join("")}</ul>`
        : "";

    const faqsHtml =
      faqs.filter((faq) => faq.question.trim() || faq.answer.trim()).length > 0
        ? `<p><strong>FAQ:</strong></p><ul>${faqs
            .filter((faq) => faq.question.trim() || faq.answer.trim())
            .map((faq) => `<li>${faq.question} – ${faq.answer}</li>`)
            .join("")}</ul>`
        : "";

    const description = [objectiveHtml, detailsHtml, faqsHtml]
      .filter(Boolean)
      .join("");
    setFormData({ ...formData, description });
    setShowDescriptionHelper(false);
  };

  // ✅ Apply direct description
  const applyDirectDescription = () => {
    const description = generateDirectDescription();
    setFormData({ ...formData, description });
    setShowDescriptionHelper(false);
  };

  // ✅ Reset template fields
  const resetTemplateFields = () => {
    setTemplateFields({
      objective: "",
      activityDetails: ["• "],
      faqs: [{ question: "• ", answer: "" }],
    });
  };

  // --- Disable background scroll when modal is open ---
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // --- Load and display activity image if editing (simulate) ---
  const [activityImage, setActivityImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  // For updating image
  const [updateImageFile, setUpdateImageFile] = useState<File | null>(null);
  const [updateImagePreview, setUpdateImagePreview] = useState<string | null>(null);
  const [updateImageLoading, setUpdateImageLoading] = useState(false);

  const updateImageInputRef = useRef<HTMLInputElement>(null);

  // Simulate loading activity image
  useEffect(() => {
    let ignore = false;
    const fetchImage = async () => {
      if (editingActivity && editingActivity.activityId) {
        setImageLoading(true);
        try {
          // Simulate API call with timeout
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Set dummy image based on activity ID
          const dummyImages = [
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1464207687429-7505649dae38?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80"
          ];
          
          if (!ignore) {
            const imageIndex = editingActivity.activityId % dummyImages.length;
            setActivityImage(dummyImages[imageIndex]);
          }
        } catch {
          if (!ignore) setActivityImage(null);
        } finally {
          if (!ignore) setImageLoading(false);
        }
      } else {
        setActivityImage(null);
      }
    };
    fetchImage();
    return () => {
      ignore = true;
    };
  }, [editingActivity]);

  // Handle update image file change
  const handleUpdateImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUpdateImageFile(file || null);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUpdateImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setUpdateImagePreview(null);
    }
  };

  // Simulate updating activity image
  const handleUpdateImageUpload = async () => {
    if (!editingActivity?.activityId || !updateImageFile) return;
    setUpdateImageLoading(true);
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUpdateImageFile(null);
      setUpdateImagePreview(null);
      
      // Set the preview image as the new activity image
      if (updateImagePreview) {
        setActivityImage(updateImagePreview);
      }
      
      setNotification({
        type: "success",
        message: "Activity image updated successfully!"
      });
    } catch (err) {
      setNotification({
        type: "error",
        message: "Failed to update activity image."
      });
    } finally {
      setUpdateImageLoading(false);
    }
  };

  // Status management states
  const [statusValue, setStatusValue] = useState<"A" | "D">("A");
  const [statusLoading, setStatusLoading] = useState(false);
  const [currentEmpId, setCurrentEmpId] = useState<number | null>(null);

  // Simulate fetching current user details
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 500));
        setCurrentEmpId(dummyUserDetails.employeeId);
      } catch {
        setCurrentEmpId(null);
      }
    };
    getCurrentUser();
  }, []);

  // Set initial status when editing activity changes
  useEffect(() => {
    if (editingActivity && (editingActivity as any).status) {
      setStatusValue((editingActivity as any).status === "D" ? "D" : "A");
    }
  }, [editingActivity]);

  // Simulate status update
  const handleStatusUpdate = async (newStatus: "A" | "D") => {
    if (!editingActivity || !currentEmpId) return;
    setStatusLoading(true);
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStatusValue(newStatus);
      setNotification({
        type: "success",
        message: `Status updated to ${newStatus === "A" ? "Active" : "Deactivated"}.`,
      });
    } catch {
      setNotification({
        type: "error",
        message: "Failed to update status.",
      });
    } finally {
      setStatusLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4"
      style={{ overscrollBehavior: "none" }}
    >
      {/* Notification */}
      <AdminNotification notification={notification} onClose={() => setNotification(null)} />
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col"
        style={{
          background: "var(--neutral-white)",
        }}
      >
        <div
          className="p-4 sm:p-6 border-b"
          style={{ borderColor: "var(--brand-primary)" }}
        >
          <div className="flex items-center justify-between">
            <h2
              className="text-lg sm:text-xl font-bold"
              style={{ color: "var(--brand-secondary)" }}
            >
              {editingActivity ? "Edit Activity" : "Create New Activity"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 cursor-pointer hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Left Column - Basic Fields */}
            <div className="space-y-4">
              {/* Status Dropdown at the top */}
              {editingActivity && (
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "var(--brand-secondary-dark)" }}>
                    Status
                  </label>
                  <select
                    className="border rounded px-2 py-1 text-sm"
                    value={statusValue}
                    onChange={async e => {
                      const newStatus = e.target.value as "A" | "D";
                      await handleStatusUpdate(newStatus);
                    }}
                    disabled={statusLoading}
                  >
                    <option value="A">Active</option>
                    <option value="D">Deactivated</option>
                  </select>
                </div>
              )}

              {/* Activity Name */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--brand-secondary-dark)" }}
                >
                  Activity Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--brand-secondary)] focus:border-transparent"
                  style={{
                    borderColor: "var(--brand-primary)",
                    background: "var(--neutral-white)",
                    color: "var(--brand-secondary-dark)",
                  }}
                  placeholder="Enter activity name"
                />
              </div>

              {/* Sub Name */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--brand-secondary-dark)" }}
                >
                  Sub Name
                </label>
                <input
                  type="text"
                  value={formData.subName}
                  onChange={(e) =>
                    setFormData({ ...formData, subName: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--brand-secondary)] focus:border-transparent"
                  style={{
                    borderColor: "var(--brand-primary)",
                    background: "var(--neutral-white)",
                    color: "var(--brand-secondary-dark)",
                  }}
                  placeholder="Enter sub name"
                />
              </div>

              {/* Type */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--brand-secondary-dark)" }}
                >
                  Activity Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={formData.type === true}
                      onChange={() => setFormData({ ...formData, type: true })}
                      className="mr-2 accent-[var(--brand-primary)]"
                    />
                    <span style={{ color: "var(--brand-primary-dark)" }}>
                      Year-Round
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={formData.type === false}
                      onChange={() => setFormData({ ...formData, type: false })}
                      className="mr-2 accent-[var(--brand-secondary)]"
                    />
                    <span style={{ color: "var(--brand-secondary-dark)" }}>
                      Annual
                    </span>
                  </label>
                </div>
              </div>

              {/* Certificate checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="certificate"
                  checked={formData.certificate}
                  onChange={e => {
                    setFormData({ ...formData, certificate: e.target.checked });
                    setCertificateApiValue(null); // Allow manual override, remove API sync indicator
                  }}
                  className="mr-2 accent-[var(--brand-primary)]"
                />
                <label
                  htmlFor="certificate"
                  className="text-sm font-medium"
                  style={{ color: "var(--brand-secondary-dark)" }}
                >
                  Enable Certificate
                </label>
                {certificateApiValue !== null && (
                  <span className="ml-2 text-xs text-gray-500">
                    (Synced)
                  </span>
                )}
              </div>

              {/* Image Upload (only for editing, not for new activities) */}
              {editingActivity && (
                <div>
                  <label
                    className=" text-sm font-medium mb-2 flex items-center gap-2"
                    style={{ color: "var(--brand-secondary-dark)" }}
                  >
                    <ImageIcon className="w-4 h-4" />
                    Activity Image
                  </label>
                  <div
                    className="border rounded-lg p-3 bg-[var(--neutral-gray-50)] flex flex-col items-center justify-center min-h-[120px]"
                    style={{ borderColor: "var(--brand-primary-light)" }}
                  >
                    {imageLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-[var(--brand-primary)]" />
                    ) : activityImage ? (
                      <img
                        src={activityImage}
                        alt="Activity"
                        className="max-h-32 max-w-full rounded shadow mb-2"
                        style={{ objectFit: "contain" }}
                      />
                    ) : (
                      <span className="text-gray-400 text-sm mb-2">
                        No image available
                      </span>
                    )}

                    {/* Update Image Option */}
                    <div className="flex flex-col items-center gap-2 w-full">
                      <input
                        type="file"
                        accept="image/*"
                        ref={updateImageInputRef}
                        className="hidden"
                        onChange={handleUpdateImageChange}
                        disabled={updateImageLoading}
                      />
                      <button
                        type="button"
                        className="flex items-center gap-2 px-3 py-1 rounded bg-yellow-100 border border-yellow-300 text-yellow-700 hover:bg-yellow-400 hover:text-white hover:shadow-lg transition cursor-pointer"
                        onClick={() => updateImageInputRef.current?.click()}
                        disabled={updateImageLoading}
                      >
                        <Upload className="w-4 h-4" />
                        {updateImageLoading ? "Uploading..." : "Update Image"}
                      </button>
                      {updateImagePreview && (
                        <div className="flex flex-col items-center gap-2 w-full">
                          <img
                            src={updateImagePreview}
                            alt="Preview"
                            className="max-h-24 rounded shadow"
                          />
                          <button
                            type="button"
                            className="flex items-center gap-2 px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 transition cursor-pointer"
                            onClick={handleUpdateImageUpload}
                            disabled={updateImageLoading}
                          >
                            <RefreshCcw className="w-4 h-4" />
                            Save New Image
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Description */}
            <div className="space-y-4">
              {/* Description Header with Helper */}
              <div className="flex items-center justify-between">
                <label
                  className="block text-sm font-medium"
                  style={{ color: "var(--brand-secondary-dark)" }}
                >
                  Description *
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewMode(!previewMode)}
                    className="flex cursor-pointer items-center gap-1 px-2 py-1 text-xs border rounded"
                    style={{
                      color: "var(--brand-secondary-dark)",
                      borderColor: "var(--brand-primary-light)",
                      background: previewMode
                        ? "var(--brand-primary-light)"
                        : "var(--neutral-white)",
                    }}
                  >
                    {previewMode ? (
                      <EyeOff className="w-3 h-3" />
                    ) : (
                      <Eye className="w-3 h-3" />
                    )}
                    {previewMode ? "Code" : "Preview"}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setShowDescriptionHelper(!showDescriptionHelper)
                    }
                    className={`flex items-center gap-1 px-2 py-1 text-xs border rounded cursor-pointer transition-colors ${
                      showDescriptionHelper
                        ? "bg-[var(--brand-secondary-light)] text-white"
                        : "bg-[var(--neutral-white)] text-[var(--brand-secondary)]"
                    }`}
                    style={{
                      borderColor: "var(--brand-secondary-light)",
                    }}
                  >
                    <Wand2 className="w-3 h-3" />
                    Helper
                  </button>
                </div>
              </div>

              {/* Description Helper */}
              {showDescriptionHelper && (
                <div
                  className="border rounded-lg p-4 mb-4"
                  style={{
                    borderColor: "var(--brand-secondary)",
                    background: "var(--brand-secondary-light)",
                  }}
                >
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => setHelperMode("template")}
                      className={`flex items-center justify-center gap-1 px-3 py-1 text-xs rounded transition-colors cursor-pointer ${
                        helperMode === "template"
                          ? "bg-white text-[var(--brand-secondary)] border border-[var(--brand-secondary)] "
                          : "bg-[var(--brand-secondary)] text-white"
                      }`}
                    >
                      <FileText className="w-3 h-3" />
                      <span>Template Builder</span>
                    </button>
                    <button
                      onClick={() => setHelperMode("direct")}
                      className={`flex items-center justify-center gap-1 px-3 py-1 text-xs rounded transition-colors cursor-pointer ${
                        helperMode === "direct"
                          ? "bg-white text-[var(--brand-secondary)] border border-[var(--brand-secondary)] "
                          : "bg-[var(--brand-secondary)] text-white"
                      }`}
                    >
                      <Code className="w-3 h-3" />
                      <span>Sample</span>
                    </button>
                  </div>

                  {/* Template Mode */}
                  {helperMode === "template" && (
                    <div className="space-y-4 text-white">
                      {/* ✅ Template Actions Header */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Template Builder
                        </span>
                        {formData.description && (
                          <span className="text-xs italic text-white ml-2">
                            *loaded from description
                          </span>
                        )}
                      </div>

                      {/* Tab Navigation */}
                      <div className="flex gap-1 p-1 bg-[var(--brand-secondary)] rounded-lg">
                        <button
                          onClick={() => setActiveTab("objective")}
                          className={`px-3 cursor-pointer py-1 text-sm rounded transition-colors ${
                            activeTab === "objective"
                              ? "bg-white text-[var(--brand-secondary)] shadow-sm"
                              : "text-white hover:bg-[var(--brand-secondary-dark)]"
                          }`}
                        >
                          Objective
                        </button>
                        <button
                          onClick={() => setActiveTab("details")}
                          className={`px-3 cursor-pointer py-1 text-sm rounded transition-colors ${
                            activeTab === "details"
                              ? "bg-white text-[var(--brand-secondary)] shadow-sm"
                              : "text-white hover:bg-[var(--brand-secondary-dark)]"
                          }`}
                        >
                          Activity Details
                        </button>
                        <button
                          onClick={() => setActiveTab("faq")}
                          className={`px-3 cursor-pointer py-1 text-sm rounded transition-colors ${
                            activeTab === "faq"
                              ? "bg-white text-[var(--brand-secondary)] shadow-sm"
                              : "text-white hover:bg-[var(--brand-secondary-dark)]"
                          }`}
                        >
                          FAQ
                        </button>
                      </div>

                      {/* Tab Content */}
                      <div className="min-h-[200px]">
                        {/* Objective Tab */}
                        {activeTab === "objective" && (
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Objective
                            </label>
                            <textarea
                              value={templateFields.objective}
                              onChange={(e) =>
                                handleObjectiveChange(e.target.value)
                              }
                              placeholder="Enter the main objective of this activity..."
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--brand-secondary)] focus:border-transparent text-black bg-white"
                              rows={4}
                            />
                          </div>
                        )}

                        {/* Activity Details Tab */}
                        {activeTab === "details" && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-sm font-medium">
                                Activity Details
                              </label>
                              <button
                                type="button"
                                onClick={addActivityDetail}
                                className="flex items-center gap-1 px-2 py-1 text-xs text-white rounded bg-green-600 hover:bg-green-700 cursor-pointer transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                                Add Line
                              </button>
                            </div>
                            <div className="space-y-2">
                              {templateFields.activityDetails.map(
                                (detail, index) => (
                                  <div key={index} className="flex gap-2">
                                    <input
                                      type="text"
                                      value={detail}
                                      onChange={(e) =>
                                        handleActivityDetailChange(
                                          index,
                                          e.target.value
                                        )
                                      }
                                      placeholder={`Activity detail ${
                                        index + 1
                                      }...`}
                                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--brand-secondary)] focus:border-transparent text-black bg-white"
                                    />
                                    {templateFields.activityDetails.length >
                                      1 && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          removeActivityDetail(index)
                                        }
                                        className="p-2 text-red-200 hover:text-red-400"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}

                        {/* FAQ Tab */}
                        {activeTab === "faq" && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-sm font-medium">
                                Frequently Asked Questions
                              </label>
                              <button
                                type="button"
                                onClick={addFaq}
                                className="flex items-center gap-1 px-2 py-1 text-xs text-white rounded bg-green-600 hover:bg-green-700 cursor-pointer transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                                Add FAQ
                              </button>
                            </div>
                            <div className="space-y-3">
                              {templateFields.faqs.map((faq, index) => (
                                <div
                                  key={index}
                                  className="border border-gray-200 rounded-lg p-3 bg-white"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-600">
                                      FAQ {index + 1}
                                    </span>
                                    {templateFields.faqs.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => removeFaq(index)}
                                        className="text-red-600 hover:text-red-800"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                  <div className="space-y-2">
                                    <input
                                      type="text"
                                      value={faq.question}
                                      onChange={(e) =>
                                        handleFaqChange(
                                          index,
                                          "question",
                                          e.target.value
                                        )
                                      }
                                      placeholder="Question..."
                                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--brand-secondary)] focus:border-transparent text-black bg-white"
                                    />
                                    <input
                                      type="text"
                                      value={faq.answer}
                                      onChange={(e) =>
                                        handleFaqChange(
                                          index,
                                          "answer",
                                          e.target.value
                                        )
                                      }
                                      placeholder="Answer..."
                                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--brand-secondary)] focus:border-transparent text-black bg-white"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Template Actions */}
                      <div className="flex gap-2 pt-3 border-t border-[var(--brand-secondary)]">
                        <button
                          type="button"
                          onClick={applyTemplate}
                          className="px-4 cursor-pointer py-2 bg-[var(--brand-secondary)] text-white text-sm rounded hover:bg-[var(--brand-secondary-dark)]"
                        >
                          Apply Template
                        </button>
                        <button
                          type="button"
                          onClick={resetTemplateFields}
                          className="px-4 cursor-pointer py-2 bg-white text-[var(--brand-secondary)] text-sm rounded hover:bg-[var(--brand-primary-light)]"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Direct Mode */}
                  {helperMode === "direct" && (
                    <div className="text-white">
                      <p className="text-sm mb-3">
                        Apply the sample cake making activity description
                        directly:
                      </p>
                      <button
                        type="button"
                        onClick={applyDirectDescription}
                        className="px-4 py-2 cursor-pointer bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        Apply Sample Description
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Description Field */}
              <div>
                {previewMode ? (
                  <div
                    className="w-full min-h-[300px] px-3 py-2 border rounded-lg bg-[var(--neutral-gray-50)] overflow-y-auto"
                    style={{ borderColor: "var(--brand-primary-light)" }}
                    dangerouslySetInnerHTML={{
                      __html:
                        formData.description ||
                        '<em class="text-gray-400">No description entered</em>',
                    }}
                  />
                ) : (
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={12}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--brand-secondary)] focus:border-transparent font-mono text-sm"
                    style={{
                      borderColor: "var(--brand-primary-light)",
                      background: "var(--neutral-white)",
                      color: "var(--brand-secondary-dark)",
                    }}
                    placeholder="Enter activity description with HTML formatting..."
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div
          className="p-4 sm:p-6 border-t"
          style={{
            background: "var(--brand-primary-light)",
            borderColor: "var(--brand-primary)",
          }}
        >
          <div className="flex flex-row justify-end gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none min-w-0 px-3 py-2 sm:px-4 sm:py-2 cursor-pointer text-[var(--brand-secondary-dark)] border rounded-lg hover:bg-[var(--brand-primary)] transition-colors text-center text-base sm:text-left"
              style={{ borderColor: "var(--brand-primary)", fontSize: "1rem" }}
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={formLoading}
              className="flex-1 sm:flex-none min-w-0 flex items-center justify-center cursor-pointer gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-colors text-center text-base sm:text-left"
              style={{
                background: "var(--brand-secondary)",
                color: "var(--neutral-white)",
                opacity: formLoading ? 0.7 : 1,
                fontSize: "1rem",
              }}
            >
              {formLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {formLoading
                ? "Saving..."
                : editingActivity
                ? "Update"
                : "Create"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminActivityForm;
