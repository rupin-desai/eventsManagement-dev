import React, { useState, useEffect } from "react";
import {
  createActivity,
  updateActivity,
  createActivityImage,
  type CreateActivityRequest,
  type UpdateActivityRequest,
} from "../../api/admin/activityAdminApi";
import { getCurrentUserDetails } from "../../utils/volunteerFormHelpers";
import {
  getActiveActivities,
  getDeactivatedActivities,
  type Activity,
} from "../../api/activityApi";
import { AxiosError } from "axios";
import AdminNotification from "../../components/ui/admin/AdminNotification";
import AdminActivitySearch from "../../components/admin/pages/adminActivity/AdminActivitySearch";
import AdminActivityForm from "../../components/admin/pages/adminActivity/AdminActivityForm";
import AdminActivityTable from "../../components/admin/pages/adminActivity/AdminActivityTable";
import AdminPageHeader from "../../components/ui/admin/AdminPageHeader";
import { Plus, Activity as ActivityIcon } from "lucide-react";

interface ActivityFormData {
  name: string;
  subName: string;
  type: boolean;
  description: string;
  certificate: boolean;
}

const AdminActivityPage: React.FC = () => {
  // State management
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [currentEmpId, setCurrentEmpId] = useState<number | null>(null);

  useEffect(() => {
    getCurrentUserDetails()
      .then((user) => setCurrentEmpId(user.employeeId))
      .catch(() => setCurrentEmpId(null));
  }, []);

  // Form state
  const [formData, setFormData] = useState<ActivityFormData>({
    name: "",
    subName: "",
    type: true, // true = Year-Round, false = Annual
    description: "",
    certificate: false,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // Load activities on component mount and when statusFilter changes
  useEffect(() => {
    loadActivities();
    // eslint-disable-next-line
  }, [statusFilter]);

  // Auto-hide notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      let response;
      if (statusFilter === "D") {
        response = await getDeactivatedActivities();
      } else {
        response = await getActiveActivities();
      }
      setActivities(response.data);
    } catch (error) {
      console.error("Error loading activities:", error);
      showNotification("error", "Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      subName: "",
      type: true,
      description: "",
      certificate: false,
    });
    setSelectedImage(null);
    setEditingActivity(null);
    setShowCreateForm(false);
  };

  const handleCreateActivity = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      showNotification('error', 'Please fill in all required fields');
      return;
    }

    try {
      setFormLoading(true);

      const createData: CreateActivityRequest = {
        name: formData.name,
        subName: formData.subName,
        type: formData.type,
        description: formData.description,
        addedBy: currentEmpId ?? 48710, // Use logged-in user's empId, fallback to 48710
        certificate: formData.certificate
      };

      const response = await createActivity(createData);

      if (response.status === 200) {
        showNotification("success", "Activity created successfully");

        // If there's an image, upload it
        if (selectedImage && response.data?.activityId) {
          try {
            await createActivityImage(selectedImage, response.data.activityId);
            showNotification("success", "Activity image uploaded successfully");
          } catch (imageError) {
            console.error("Error uploading image:", imageError);
            showNotification(
              "error",
              "Activity created but image upload failed"
            );
          }
        }

        resetForm();
        loadActivities(); // Reload activities
      }
    } catch (error) {
      console.error("Error creating activity:", error);
      let errorMessage = "Failed to create activity";

      if (error instanceof AxiosError) {
        errorMessage =
          error.response?.data?.message || error.message || errorMessage;
      }

      showNotification("error", errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateActivity = async () => {
    if (
      !editingActivity ||
      !formData.name.trim() ||
      !formData.description.trim()
    ) {
      showNotification("error", "Please fill in all required fields");
      return;
    }

    try {
      setFormLoading(true);

      const updateData: UpdateActivityRequest = {
        activityId: editingActivity.activityId,
        name: formData.name,
        subName: formData.subName,
        type: formData.type ? "Year-Round" : "Annual",
        description: formData.description,
        certificate: formData.certificate,
      };

      await updateActivity(updateData);
      showNotification("success", "Activity updated successfully");

      resetForm();
      loadActivities(); // Reload activities
    } catch (error) {
      console.error("Error updating activity:", error);
      let errorMessage = "Failed to update activity";

      if (error instanceof AxiosError) {
        errorMessage =
          error.response?.data?.message || error.message || errorMessage;
      }

      showNotification("error", errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setFormData({
      name: activity.name,
      subName: activity.subName,
      type: activity.type === "Year-Round",
      description: activity.description,
      certificate: false, // This might need to come from API
    });
    setShowCreateForm(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSubmitForm = () => {
    if (editingActivity) {
      handleUpdateActivity();
    } else {
      handleCreateActivity();
    }
  };

  // No need to filter by status here, as API already filters by status
  const filteredActivities = activities.filter(
    (activity) =>
      activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.subName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <title>Admin | Activity Management - Alkem Smile</title>
      <meta
        name="description"
        content="Admin panel for creating, editing, and managing volunteering activities for Alkem Smile events."
      />
      <meta
        name="keywords"
        content="alkem, admin, activity management, volunteering, events, smile"
      />
      <div
        className="p-2 min-h-screen sm:p-4 md:p-6 max-w-full w-full mx-auto"
        style={{ background: "var(--brand-primary)" }}
      >
        {/* Header */}
        <div className="mb-4">
          <AdminPageHeader
            icon={<ActivityIcon className="w-8 h-8 text-red-600" />}
            title="Activity Management"
            description="Create, edit, and manage SMILE activities"
            buttonLabel="Create Activity"
            buttonIcon={<Plus className="w-5 h-5" />}
            onButtonClick={() => setShowCreateForm(true)}
            buttonStyle={{
              background: "var(--brand-secondary)",
              color: "var(--neutral-white)",
            }}
          />
        </div>

        {/* Notification */}
        <AdminNotification
          notification={notification}
          onClose={() => setNotification(null)}
        />

        {/* Search */}
        <div className="mb-4">
          <AdminActivitySearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        </div>

        {/* Create/Edit Form */}
        <AdminActivityForm
          isOpen={showCreateForm}
          editingActivity={editingActivity}
          formData={formData}
          setFormData={setFormData}
          selectedImage={selectedImage}
          formLoading={formLoading}
          onSubmit={handleSubmitForm}
          onClose={resetForm}
          onImageChange={handleImageChange}
        />

        {/* Activities Table */}
        <div className="overflow-x-auto">
          <AdminActivityTable
            activities={filteredActivities}
            loading={loading}
            searchTerm={searchTerm}
            onEditActivity={handleEditActivity}
          />
        </div>
      </div>
    </>
  );
};

export default AdminActivityPage;
