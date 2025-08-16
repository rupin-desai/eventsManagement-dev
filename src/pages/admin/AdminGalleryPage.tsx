import React, { useEffect, useState, useRef } from "react";
import AdminPageHeader from "../../components/ui/admin/AdminPageHeader";
import AdminNotification from "../../components/ui/admin/AdminNotification";
import { getGallery } from "../../api/galleryApi";
import {
  uploadGalleryImage,
  updateGalleryImage,
} from "../../api/admin/galleryAdminApi";
import { getActivities } from "../../api/activityApi";
import { Image as ImageIcon, UploadCloud, X, Edit2, Video } from "lucide-react";
import { getCurrentUserDetails } from "../../utils/volunteerFormHelpers"; // <-- Import helper

interface GalleryImage {
  id: number;
  imageUrl: string;
  addedBy?: string;
  addedOn?: string;
  status?: string;
  activityId?: string | number;
  description?: string;
  thumbFilePath?: string;
  thumbnail?: string;
  thumbfile?: string;
}

interface Activity {
  activityId: number;
  name: string;
}

const AdminGalleryPage: React.FC = () => {
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [activityId, setActivityId] = useState<string | number>("");
  const [activities, setActivities] = useState<Activity[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editStatus, setEditStatus] = useState<"N" | "D">("N"); // N = Active, D = Deactivated
  const [editImageId, setEditImageId] = useState<number | null>(null);

  // Video upload modal state
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [videoActivityId, setVideoActivityId] = useState<string | number>("");
  const [videoDescription, setVideoDescription] = useState<string>("");
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const thumbFileInputRef = useRef<HTMLInputElement>(null);
  const [playingVideoId, setPlayingVideoId] = useState<number | null>(null);
  // Tab state
  const [tab, setTab] = useState<"photo" | "video">("photo");

  const [currentEmpId, setCurrentEmpId] = useState<string>("48710"); // Default fallback

  // Fetch logged-in user's emp code on mount
  useEffect(() => {
    getCurrentUserDetails()
      .then(user => setCurrentEmpId(user.empcode))
      .catch(() => setCurrentEmpId("48710"));
  }, []);

  // Replace with actual user ID in production
  // const ADDED_BY = "48710";
  const ADDED_BY = currentEmpId;

  // Fetch gallery images
  const fetchGallery = async () => {
    setLoading(true);
    try {
      const response = await getGallery();
      setGallery(
        Array.isArray(response.data)
          ? response.data.map((img, idx) => ({
              id: img.id || idx,
              // Use filePath from API as the image URL
              imageUrl: img.filePath
                ? img.filePath
                : img.imageUrl ||
                  img.url ||
                  img.ImageUrl ||
                  img.ImageURL ||
                  img.path ||
                  img.Path ||
                  "",
              addedBy: img.addedBy || img.AddedBy,
              addedOn: img.addedOn || img.AddedOn,
              status: img.status || img.Status,
              activityId: img.activityId || img.ActivityId,
              description: img.description || img.Description,
              // Add these lines:
              thumbFilePath: img.thumbFilePath || img.thumbfile || img.thumbnail || "",
              thumbfile: img.thumbfile || "",
              thumbnail: img.thumbnail || "",
            }))
          : []
      );
    } catch (error) {
      setNotification({
        type: "error",
        message: "Failed to load gallery images.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch activities for modal dropdown
  const fetchActivities = async () => {
    try {
      const response = await getActivities("A");
      setActivities(
        Array.isArray(response.data)
          ? response.data.map((a: any) => ({
              activityId: a.activityId,
              name: a.name,
            }))
          : []
      );
    } catch {
      setActivities([]);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // Only allow photo upload modal
  const openPhotoModal = () => {
    setSelectedFiles([]);
    setActivityId("");
    fetchActivities();
    setShowUploadModal(true);
  };

  // Handle upload (multiple photos)
  const handleUpload = async () => {
    if (!selectedFiles.length) {
      setNotification({
        type: "error",
        message: "Please select file(s) to upload.",
      });
      return;
    }
    setUploading(true);
    let allSuccess = true;
    for (const file of selectedFiles) {
      try {
        await uploadGalleryImage({
          file,
          addedBy: ADDED_BY,
          activityId: activityId || undefined,
        });
      } catch (error) {
        allSuccess = false;
        setNotification({
          type: "error",
          message: `Failed to upload ${file.name}.`,
        });
      }
    }
    if (allSuccess) {
      setNotification({ type: "success", message: "Upload successful!" });
    }
    setSelectedFiles([]);
    setShowUploadModal(false);
    setActivityId("");
    fetchGallery();
    setUploading(false);
  };

  // Open edit modal for status
  const openEditModal = (img: GalleryImage) => {
    setEditImageId(img.id);
    setEditStatus(img.status === "D" ? "D" : "N");
    setShowEditModal(true);
  };

  // Handle status update (only status, do not update file)
  const handleStatusUpdate = async () => {
    if (!editImageId) return;
    setUploading(true);
    try {
      await updateGalleryImage({
        id: editImageId,
        addedBy: ADDED_BY,
        status: editStatus, // "N" for Active, "D" for Deactivated
        // Do NOT pass file
      });
      setNotification({ type: "success", message: "Status updated!" });
      setShowEditModal(false);
      setEditImageId(null);
      fetchGallery();
    } catch (error) {
      setNotification({ type: "error", message: "Failed to update status." });
    } finally {
      setUploading(false);
    }
  };

  // Video upload handler
  const handleVideoUpload = async () => {
    if (!videoFile) {
      setNotification({
        type: "error",
        message: "Please select a video file to upload.",
      });
      return;
    }
    if (!thumbFile) {
      setNotification({
        type: "error",
        message: "Please select a thumbnail image.",
      });
      return;
    }
    setUploading(true);
    try {
      // Use the same API as photo upload, but pass thumbfile and description
      await uploadGalleryImage({
        file: videoFile,
        thumbfile: thumbFile,
        addedBy: ADDED_BY,
        activityId: videoActivityId || undefined,
        description: videoDescription,
      });

      setNotification({ type: "success", message: "Video uploaded successfully!" });
      setShowVideoModal(false);
      setVideoFile(null);
      setThumbFile(null);
      setVideoActivityId("");
      setVideoDescription("");
      fetchGallery();
    } catch (error) {
      setNotification({
        type: "error",
        message: "Failed to upload video.",
      });
    } finally {
      setUploading(false);
    }
  };

  // Helper to check if a file is a video by extension
  const isVideoFile = (url: string) => {
    if (!url) return false;
    const videoExts = [".mp4", ".mov", ".avi", ".wmv", ".flv", ".webm", ".mkv", ".3gp", ".mpeg"];
    return videoExts.some((ext) => url.toLowerCase().includes(ext));
  };

  // Helper to get thumbnail for a video (always returns a URL if present, never hides the <img>)
  const getVideoThumbnail = (img: GalleryImage) => {
    let thumb =
      img.thumbFilePath ||
      img.thumbfile ||
      img.thumbnail;
    // Force HTTPS if the URL is from a known domain
    if (thumb && thumb.startsWith("http://alkemites.com")) {
      thumb = thumb.replace("http://", "https://");
    }
    return thumb && thumb.trim() !== "" ? thumb : "";
  };

  // Filter gallery by tab and extension
  const filteredGallery = gallery.filter((img) =>
    tab === "photo"
      ? !isVideoFile(img.imageUrl)
      : isVideoFile(img.imageUrl)
  );

  // Group filtered images/videos by activityId
  const galleryByActivity: { [activityId: string]: GalleryImage[] } =
    React.useMemo(() => {
      const grouped: { [activityId: string]: GalleryImage[] } = {};
      filteredGallery.forEach((img) => {
        const key = img.activityId ? String(img.activityId) : "No Activity";
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(img);
      });
      return grouped;
    }, [filteredGallery]);

  //const [brokenThumbs, setBrokenThumbs] = useState<{ [url: string]: boolean }>({});

  return (
    <>
      <title>Admin | Gallery Management - Alkem Smile</title>
      <meta name="description" content="Admin panel for uploading, editing, and managing gallery images for Alkem Smile volunteering events and activities." />
      <meta name="keywords" content="alkem, admin, gallery management, volunteering, images, events, smile" />
      <div
        className="min-h-screen w-full p-2 sm:p-4 md:p-6 max-w-full mx-auto"
        style={{ background: "var(--brand-primary)" }} // Tailwind yellow-200
      >
        <AdminPageHeader
          icon={<ImageIcon className="w-8 h-8 text-red-600" />}
          title="Gallery Management"
          description="View and upload images and videos to the Smile Gallery."
        />

        {/* Notification */}
        <AdminNotification
          notification={notification}
          onClose={() => setNotification(null)}
        />

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            className={`px-4 py-2 rounded cursor-pointer ${tab === "photo"
              ? "bg-white text-red-600 font-bold  border-b-2 border-red-600"
              : "bg-gray-100 text-gray-600"
              }`}
            onClick={() => setTab("photo")}
          >
            <ImageIcon className="w-5 h-5 inline mr-1" />
            Photos
          </button>
          <button
            className={`px-4 py-2 rounded cursor-pointer ${tab === "video"
              ? "bg-white text-red-600 font-bold  border-b-2 border-red-600"
              : "bg-gray-100 text-gray-600"
              }`}
            onClick={() => setTab("video")}
          >
            <Video className="w-5 h-5 inline mr-1" />
            Videos
          </button>
        </div>

        {/* Upload button below header */}
        <div className="flex gap-2 mb-6">
          {tab === "photo" && (
            <button
              className="bg-red-600 cursor-pointer hover:bg-red-700 text-white px-4 py-2 rounded flex items-center transition transform active:scale-95 duration-100"
              onClick={openPhotoModal}
            >
              <UploadCloud className="w-5 h-5 mr-2" />
              Upload Photo
            </button>
          )}
          {tab === "video" && (
            <button
              className="bg-red-600 cursor-pointer hover:bg-red-700 text-white px-4 py-2 rounded flex items-center transition transform active:scale-95 duration-100"
              onClick={() => {
                setVideoFile(null);
                setThumbFile(null);
                setVideoActivityId("");
                setVideoDescription("");
                fetchActivities();
                setShowVideoModal(true);
              }}
            >
              <UploadCloud className="w-5 h-5 mr-2" />
              Upload Video
            </button>
          )}
        </div>

        {/* Upload Modal (Photo) */}
        {showUploadModal && tab === "photo" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 cursor-pointer active:scale-95"
                onClick={() => setShowUploadModal(false)}
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-semibold mb-4">Upload Photo(s)</h3>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  Select Activity (optional):
                </label>
                <select
                  className="w-full border rounded px-2 py-1"
                  value={activityId}
                  onChange={(e) => setActivityId(e.target.value)}
                >
                  <option value="">-- None --</option>
                  {activities.map((a) => (
                    <option key={a.activityId} value={a.activityId}>
                      {a.name} (ID: {a.activityId})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  Photo File(s):
                </label>
                <div className="flex flex-col gap-2">
                  <button
                    className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300 w-fit cursor-pointer active:scale-95"
                    onClick={() => fileInputRef.current?.click()}
                    type="button"
                  >
                    Select File(s)
                  </button>
                  <div className="flex flex-wrap gap-2">
                    {selectedFiles.map((file, idx) => (
                      <span
                        key={idx}
                        className="truncate max-w-[180px] bg-gray-100 px-2 py-1 rounded"
                      >
                        {file.name}
                        <button
                          className="ml-1 text-red-500 hover:text-red-700 cursor-pointer active:scale-95"
                          onClick={() =>
                            setSelectedFiles(
                              selectedFiles.filter((_, i) => i !== idx)
                            )
                          }
                          title="Remove"
                          type="button"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                {/* Hidden file input for modal */}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) {
                      setSelectedFiles(Array.from(e.target.files));
                    }
                  }}
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer active:scale-95"
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Modal (Video) */}
        {showVideoModal && tab === "video" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 cursor-pointer active:scale-95"
                onClick={() => setShowVideoModal(false)}
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-semibold mb-4">Upload Video</h3>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  Select Activity (optional):
                </label>
                <select
                  className="w-full border rounded px-2 py-1"
                  value={videoActivityId}
                  onChange={(e) => setVideoActivityId(e.target.value)}
                >
                  <option value="">-- None --</option>
                  {activities.map((a) => (
                    <option key={a.activityId} value={a.activityId}>
                      {a.name} (ID: {a.activityId})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  Video File:
                </label>
                <div className="flex flex-col gap-2">
                  <button
                    className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300 w-fit cursor-pointer active:scale-95"
                    onClick={() => videoFileInputRef.current?.click()}
                    type="button"
                  >
                    Select Video
                  </button>
                  {videoFile && (
                    <span className="truncate max-w-[180px] bg-gray-100 px-2 py-1 rounded">
                      {videoFile.name}
                      <button
                        className="ml-1 text-red-500 hover:text-red-700 cursor-pointer active:scale-95"
                        onClick={() => setVideoFile(null)}
                        title="Remove"
                        type="button"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
                <input
                  type="file"
                  accept="video/*"
                  ref={videoFileInputRef}
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setVideoFile(e.target.files[0]);
                    }
                  }}
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  Thumbnail Image:
                </label>
                <div className="flex flex-col gap-2">
                  <button
                    className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300 w-fit cursor-pointer active:scale-95"
                    onClick={() => thumbFileInputRef.current?.click()}
                    type="button"
                  >
                    Select Thumbnail
                  </button>
                  {thumbFile && (
                    <span className="truncate max-w-[180px] bg-gray-100 px-2 py-1 rounded">
                      {thumbFile.name}
                      <button
                        className="ml-1 text-red-500 hover:text-red-700 cursor-pointer active:scale-95"
                        onClick={() => setThumbFile(null)}
                        title="Remove"
                        type="button"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={thumbFileInputRef}
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setThumbFile(e.target.files[0]);
                    }
                  }}
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  Description:
                </label>
                <textarea
                  className="w-full border rounded px-2 py-1"
                  value={videoDescription}
                  onChange={(e) => setVideoDescription(e.target.value)}
                  rows={2}
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer active:scale-95"
                  onClick={handleVideoUpload}
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Status Modal */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 cursor-pointer active:scale-95"
                onClick={() => setShowEditModal(false)}
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-semibold mb-4">Edit Status</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Status:</label>
                <select
                  className="w-full border rounded px-2 py-1"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as "N" | "D")}
                >
                  <option value="N">Active</option>
                  <option value="D">Deactivated</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer active:scale-95"
                  onClick={handleStatusUpdate}
                  disabled={uploading}
                >
                  {uploading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Gallery Grid Grouped by Activity */}
        <div>
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              Loading gallery...
            </div>
          ) : gallery.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No images in the gallery yet.
            </div>
          ) : (
            Object.entries(galleryByActivity).map(([activityId, images]) => (
              <div key={activityId} className="mb-10">
                <h2 className="text-lg font-semibold mb-3">
                  {activityId === "No Activity"
                    ? "No Activity"
                    : (() => {
                        const act = activities.find(
                          (a) => String(a.activityId) === activityId
                        );
                        // Show: Activity Name (Activity #ID) — Gallery: N
                        return act
                          ? `${act.name} (Activity #${act.activityId}) — Gallery: ${images.length}`
                          : `Activity #${activityId} — Gallery: ${images.length}`;
                      })()}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {images.map((img) => {
                    // If in video tab, show video card
                    if (tab === "video") {
                      const isPlaying = playingVideoId === img.id;
                      const thumbUrl = getVideoThumbnail(img);
                      return (
                        <div
                          key={img.id}
                          className="rounded-lg overflow-hidden shadow border bg-white flex flex-col relative"
                        >
                          {!isPlaying ? (
                            <div className="relative w-full h-40 bg-black flex items-center justify-center">
                              {/* Always render the <img> if thumbUrl exists, even if broken */}
                              {thumbUrl && (
                                <img
                                  src={thumbUrl}
                                  alt="Video Thumbnail"
                                  className="object-cover w-full h-40"
                                  // Optionally, you can log or visually indicate broken images, but do not hide the <img>
                                  onError={(e) => {
                                    // Optionally add a CSS class or style to indicate broken image
                                    e.currentTarget.style.opacity = "0.3";
                                    e.currentTarget.title = "Thumbnail failed to load";
                                  }}
                                />
                              )}
                              <button
                                className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/60 transition cursor-pointer active:scale-95"
                                onClick={() => setPlayingVideoId(img.id)}
                                title="Play Video"
                                style={{ cursor: "pointer" }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-14 h-14 text-white opacity-90"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <circle cx="12" cy="12" r="10" fill="black" opacity="0.5" />
                                  <polygon points="10,8 16,12 10,16" fill="white" />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <video
                              src={img.imageUrl}
                              controls
                              autoPlay
                              className="object-cover w-full h-40"
                              onEnded={() => setPlayingVideoId(null)}
                            />
                          )}
                          <div className="p-2 text-xs text-gray-500 flex flex-col">
                            {img.description && (
                              <span className="mb-1">{img.description}</span>
                            )}
                            {img.addedBy && <span>By: {img.addedBy}</span>}
                            {img.addedOn && (
                              <span>{new Date(img.addedOn).toLocaleString()}</span>
                            )}
                            <div className="flex items-center mt-1">
                              <span
                                className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                                  img.status === "N"
                                    ? "bg-green-100 text-green-700"
                                    : img.status === "D"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                {img.status === "N"
                                  ? "Active"
                                  : img.status === "D"
                                  ? "Deactivated"
                                  : "Unknown"}
                              </span>
                              <button
                                className="ml-2 text-blue-500 hover:text-blue-700 cursor-pointer active:scale-95"
                                title="Edit Status"
                                onClick={() => openEditModal(img)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    // Default: photo card
                    return (
                      <div
                        key={img.id}
                        className="rounded-lg overflow-hidden shadow border bg-white flex flex-col relative"
                      >
                        <img
                          src={img.imageUrl}
                          alt="Gallery"
                          className="object-cover w-full h-40"
                          onError={(e) =>
                            (e.currentTarget.src =
                              "https://via.placeholder.com/300x200?text=No+Image")
                          }
                        />
                        <div className="p-2 text-xs text-gray-500 flex flex-col">
                          {img.addedBy && <span>By: {img.addedBy}</span>}
                          {img.addedOn && (
                            <span>{new Date(img.addedOn).toLocaleString()}</span>
                          )}
                          <div className="flex items-center mt-1">
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                                img.status === "N"
                                  ? "bg-green-100 text-green-700"
                                  : img.status === "D"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {img.status === "N"
                                ? "Active"
                                : img.status === "D"
                                ? "Deactivated"
                                : "Unknown"}
                            </span>
                            <button
                              className="ml-2 text-blue-500 hover:text-blue-700 cursor-pointer active:scale-95"
                              title="Edit Status"
                              onClick={() => openEditModal(img)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default AdminGalleryPage;
