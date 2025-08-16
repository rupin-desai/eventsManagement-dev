import React, { useState, useEffect } from "react";
// Removed API imports
// import {
//   createActivity,
//   updateActivity,
//   createActivityImage,
//   type CreateActivityRequest,
//   type UpdateActivityRequest,
// } from "../../api/admin/activityAdminApi";
// import { getCurrentUserDetails } from "../../utils/volunteerFormHelpers";
// import {
//   getActiveActivities,
//   getDeactivatedActivities,
//   type Activity,
// } from "../../api/activityApi";
// import { AxiosError } from "axios";
import AdminNotification from "../../components/ui/admin/AdminNotification";
import AdminActivitySearch from "../../components/admin/pages/adminActivity/AdminActivitySearch";
import AdminActivityForm from "../../components/admin/pages/adminActivity/AdminActivityForm";
import AdminActivityTable from "../../components/admin/pages/adminActivity/AdminActivityTable";
import AdminPageHeader from "../../components/ui/admin/AdminPageHeader";
import { Plus, Activity as ActivityIcon } from "lucide-react";

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

// Dummy data
const dummyActivities: Activity[] = [
  {
    activityId: 1,
    name: "Tree Plantation Drive",
    subName: "Environmental Initiative",
    type: "Annual",
    description: "<p><strong>Objective:</strong> Engage employees in environmental conservation by planting trees.</p><p><strong>Activity Details:</strong></p><ul><li>• Plant saplings in designated areas</li><li>• Educate about environmental benefits</li></ul><p><strong>FAQ:</strong></p><ul><li>Do I need gardening experience? – No, guidance will be provided</li></ul>",
    status: "A",
    addedBy: 1001,
    addedOn: "2025-01-15",
    certificate: true,
  },
  {
    activityId: 2,
    name: "Blood Donation Camp",
    subName: "Health Initiative",
    type: "Annual",
    description: "<p><strong>Objective:</strong> Save lives through voluntary blood donation.</p><p><strong>Activity Details:</strong></p><ul><li>• Medical screening process</li><li>• Safe blood collection</li></ul><p><strong>FAQ:</strong></p><ul><li>Is it safe? – Yes, all equipment is sterile</li></ul>",
    status: "A",
    addedBy: 1002,
    addedOn: "2025-02-10",
    certificate: true,
  },
  {
    activityId: 3,
    name: "Education Support",
    subName: "Learning Initiative",
    type: "Year-Round",
    description: "<p><strong>Objective:</strong> Support underprivileged children's education.</p><p><strong>Activity Details:</strong></p><ul><li>• Teaching assistance</li><li>• Study material distribution</li></ul><p><strong>FAQ:</strong></p><ul><li>What subjects can I teach? – Any subject you're comfortable with</li></ul>",
    status: "D",
    addedBy: 1003,
    addedOn: "2025-03-05",
    certificate: false,
  },
];

const dummyCurrentUser = {
  employeeId: 1001,
  empcode: "EMP001",
  name: "John Doe",
};

const AdminActivityPage: React.FC = () => {
  // State management
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("A");
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [currentEmpId, setCurrentEmpId] = useState<number | null>(null);

  useEffect(() => {
    // Simulate getting current user details
    setTimeout(() => {
      setCurrentEmpId(dummyCurrentUser.employeeId);
    }, 500);
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
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter dummy data based on status
      const filteredActivities = dummyActivities.filter(activity => 
        statusFilter === "D" ? activity.status === "D" : activity.status === "A"
      );
      
      setActivities(filteredActivities);
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

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newActivity: Activity = {
        activityId: Math.max(...dummyActivities.map(a => a.activityId)) + 1,
        name: formData.name,
        subName: formData.subName,
        type: formData.type ? "Year-Round" : "Annual",
        description: formData.description,
        status: "A",
        addedBy: currentEmpId ?? 1001,
        addedOn: new Date().toISOString(),
        certificate: formData.certificate
      };

      // Add to dummy data
      dummyActivities.push(newActivity);
      
      showNotification("success", "Activity created successfully");

      if (selectedImage) {
        // Simulate image upload
        await new Promise(resolve => setTimeout(resolve, 1000));
        showNotification("success", "Activity image uploaded successfully");
      }

      resetForm();
      loadActivities(); // Reload activities
    } catch (error) {
      console.error("Error creating activity:", error);
      showNotification("error", "Failed to create activity");
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

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update in dummy data
      const index = dummyActivities.findIndex(a => a.activityId === editingActivity.activityId);
      if (index !== -1) {
        dummyActivities[index] = {
          ...dummyActivities[index],
          name: formData.name,
          subName: formData.subName,
          type: formData.type ? "Year-Round" : "Annual",
          description: formData.description,
          certificate: formData.certificate,
        };
      }

      showNotification("success", "Activity updated successfully");

      resetForm();
      loadActivities(); // Reload activities
    } catch (error) {
      console.error("Error updating activity:", error);
      showNotification("error", "Failed to update activity");
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
      certificate: activity.certificate || false,
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

  // Filter activities by search term
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
