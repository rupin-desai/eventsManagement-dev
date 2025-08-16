import React, { useState, useEffect } from "react";
import {
  createEvent,
  deleteEvent,
  type CreateEventRequest,
  type DeleteEventRequest,
  type EventLocationRequest,
} from "../../api/admin/eventAdminApi";
import { getCurrentUserDetails } from "../../utils/volunteerFormHelpers";
import { getEventsByYear, type Event } from "../../api/eventApi";
import { getActiveActivities, type Activity } from "../../api/activityApi";
import { getLocations, type Location } from "../../api/locationApi";
import { AxiosError } from "axios";
import EventDetailModal from "../../components/admin/modal/EventDetailModal";
import AdminNotification from "../../components/ui/admin/AdminNotification";
import AdminEventsFilters from "../../components/admin/pages/adminEvents/AdminEventsFilters";
import AdminEventsCreateForm from "../../components/admin/pages/adminEvents/AdminEventsCreateForm";
import AdminEventsTable from "../../components/admin/pages/adminEvents/AdminEventsTable";
import AdminPageHeader from "../../components/ui/admin/AdminPageHeader";
import { Plus, Calendar } from "lucide-react";

interface EventFormData {
  activityId: number;
  tentativeMonth: string;
  tentativeYear: string;
  selectedLocations: string[];
}

const AdminEventsPage: React.FC = () => {
  // State management
  const [events, setEvents] = useState<Event[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("");

  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Form state
  const [formData, setFormData] = useState<EventFormData>({
    activityId: 0,
    tentativeMonth: "",
    tentativeYear: new Date().getFullYear().toString(),
    selectedLocations: [],
  });

  const [formLoading, setFormLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventDetailModal, setShowEventDetailModal] = useState(false);
  const [currentEmpId, setCurrentEmpId] = useState<number | null>(null);

  // Load initial data on component mount
  useEffect(() => {
    loadInitialData();
  }, []);

  // ✅ Load events when year changes (with proper logging)
  useEffect(() => {
    if (selectedYear) {
      loadEvents();
    } else {
      setEvents([]);
    }
  }, [selectedYear]);

  // Auto-hide notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    getCurrentUserDetails()
      .then(user => setCurrentEmpId(user.employeeId))
      .catch(() => setCurrentEmpId(null));
  }, []);

  const loadInitialData = async () => {
    try {
      await Promise.all([loadActivities(), loadLocations()]);
    } catch (error) {
      showNotification("error", "Failed to load initial data");
    }
  };

  const loadEvents = async () => {
    if (!selectedYear) return;
    try {
      setLoading(true);
      const response = await getEventsByYear(selectedYear);
      setEvents(response.data);
    } catch (error) {
      showNotification("error", "Failed to load events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const loadActivities = async () => {
    try {
      const response = await getActiveActivities();
      setActivities(response.data);
    } catch (error) {
      showNotification("error", "Failed to load activities");
    }
  };

  const loadLocations = async () => {
    try {
      const response = await getLocations();
      setLocations(response.data);
    } catch (error) {
      showNotification("error", "Failed to load locations");
    }
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
  };

  const resetForm = () => {
    setFormData({
      activityId: 0,
      tentativeMonth: "",
      tentativeYear: new Date().getFullYear().toString(),
      selectedLocations: [],
    });
    setShowCreateForm(false);
  };

  const handleCreateEvent = async () => {
    if (
      !formData.activityId ||
      !formData.tentativeMonth ||
      !formData.tentativeYear ||
      formData.selectedLocations.length === 0
    ) {
      showNotification(
        "error",
        "Please fill in all required fields and select at least one location"
      );
      return;
    }

    try {
      setFormLoading(true);

      const eventLocations: EventLocationRequest[] =
        formData.selectedLocations.map((locationId) => ({
          locationId,
        }));

      const createData: CreateEventRequest = {
        activityId: formData.activityId,
        tentativeMonth: formData.tentativeMonth,
        tentativeYear: formData.tentativeYear,
        addedBy: currentEmpId ?? 48710, // Use logged-in user's empId, fallback to 48710
        eventLocations,
      };

      const response = await createEvent(createData);

      if (response.status === 200 || response.status === 201) {
        showNotification("success", "Event created successfully");
        resetForm();

        if (formData.tentativeYear === selectedYear) {
          loadEvents();
        }
      }
    } catch (error) {
      let errorMessage = "Failed to create event";

      if (error instanceof AxiosError) {
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.response?.data) {
          errorMessage = typeof error.response.data === 'string' 
            ? error.response.data 
            : JSON.stringify(error.response.data);
        } else if (error.message) {
          errorMessage = error.message;
        }

        if (error.response?.status) {
          errorMessage += ` (Status: ${error.response.status})`;
        }
      }

      showNotification("error", errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteEvent = async (event: Event) => {
    if (
      !confirm(
        `Are you sure you want to delete the event "${event.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const deleteData: DeleteEventRequest = {
        eventId: event.eventId,
      };

      await deleteEvent(deleteData);
      showNotification("success", "Event deleted successfully");
      loadEvents();
    } catch (error) {
      let errorMessage = "Failed to delete event";

      if (error instanceof AxiosError) {
        errorMessage =
          error.response?.data?.message || error.message || errorMessage;
      }

      showNotification("error", errorMessage);
    }
  };

  const handleLocationToggle = (locationId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedLocations: prev.selectedLocations.includes(locationId)
        ? prev.selectedLocations.filter((id) => id !== locationId)
        : [...prev.selectedLocations, locationId],
    }));
  };

  const handleViewEventDetails = (event: Event) => {
    setSelectedEvent(event);
    setShowEventDetailModal(true);
  };

  const handleCloseEventDetailModal = () => {
    setSelectedEvent(null);
    setShowEventDetailModal(false);
  };

  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.subName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.tentativeMonth.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <title>Admin | Event Management - Alkem Smile</title>
      <meta name="description" content="Admin panel for creating, editing, and managing volunteering events for Alkem Smile." />
      <meta name="keywords" content="alkem, admin, event management, volunteering, events, smile" />
      <div
        className="p-6 min-h-screen"
        style={{ background: "var(--brand-primary)" }}
      >
        {/* Header */}
        <AdminPageHeader
          icon={<Calendar className="w-8 h-8 text-red-600" />}
          title="Event Management"
          description="Create, edit, and manage SMILE events"
          buttonLabel="Create Event"
          buttonIcon={<Plus className="w-5 h-5" />}
          onButtonClick={() => setShowCreateForm(true)}
          buttonStyle={{
            background: 'var(--brand-secondary)',
            color: 'var(--neutral-white)',
          }}
        />

        {/* Notification */}
        <AdminNotification notification={notification} onClose={() => setNotification(null)} />

        {/* Search and Filters */}
        {/* @ts-ignore */}
        <AdminEventsFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
        />

        {/* Create Event Form */}
        <AdminEventsCreateForm
          isOpen={showCreateForm}
          formData={formData}
          setFormData={setFormData}
          activities={activities}
          locations={locations}
          formLoading={formLoading}
          onSubmit={handleCreateEvent}
          onClose={resetForm}
          onLocationToggle={handleLocationToggle}
        />

        {/* Event Detail Modal */}
        {selectedEvent && (
          <EventDetailModal
            event={selectedEvent}
            isOpen={showEventDetailModal}
            onClose={handleCloseEventDetailModal}
            onEventUpdated={() => {
              loadEvents();
              handleCloseEventDetailModal();
            }}
          />
        )}

        {/* Events Table */}
        <AdminEventsTable
          events={filteredEvents}
          loading={loading}
          searchTerm={searchTerm}
          selectedYear={selectedYear}
          onViewDetails={handleViewEventDetails}
          onDelete={handleDeleteEvent}
        />
      </div>
    </>
  );
};

export default AdminEventsPage;