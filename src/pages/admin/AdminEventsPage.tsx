import React, { useState, useEffect } from "react";
// Removed API imports
// import {
//   createEvent,
//   deleteEvent,
//   type CreateEventRequest,
//   type DeleteEventRequest,
//   type EventLocationRequest,
// } from "../../api/admin/eventAdminApi";
// import { getCurrentUserDetails } from "../../utils/volunteerFormHelpers";
// import { getEventsByYear, type Event } from "../../api/eventApi";
// import { getActiveActivities, type Activity } from "../../api/activityApi";
// import { getLocations, type Location } from "../../api/locationApi";
// import { AxiosError } from "axios";
import EventDetailModal from "../../components/admin/modal/EventDetailModal";
import AdminEventsFilters from "../../components/admin/pages/adminEvents/AdminEventsFilters";
import AdminEventsCreateForm from "../../components/admin/pages/adminEvents/AdminEventsCreateForm";
import AdminEventsTable from "../../components/admin/pages/adminEvents/AdminEventsTable";
import AdminPageHeader from "../../components/ui/admin/AdminPageHeader";
import { Plus, Calendar } from "lucide-react";

// Dummy types to replace API types
interface Event {
  eventId: number;
  name: string;
  subName: string;
  description: string;
  tentativeMonth: string;
  tentativeYear: string;
  type: string;
  enableCert: string;
  enableComp: string;
  enableConf: string;
  addedBy: number;
  addedOn: string;
}

interface Activity {
  activityId: number;
  name: string;
  subName: string;
  type: string;
  description: string;
  status: string;
}

interface Location {
  locationId: number;
  locationName: string;
  status: string;
}

interface EventFormData {
  activityId: number;
  tentativeMonth: string;
  tentativeYear: string;
  selectedLocations: string[];
}

// Dummy data
const dummyEvents: Event[] = [
  {
    eventId: 1,
    name: "Tree Plantation Drive",
    subName: "Environmental Initiative",
    description: "Join us in making our environment greener by planting trees.",
    tentativeMonth: "8",
    tentativeYear: "2025",
    type: "Annual",
    enableCert: "true",
    enableComp: "false",
    enableConf: "true",
    addedBy: 1001,
    addedOn: "2025-01-15"
  },
  {
    eventId: 2,
    name: "Blood Donation Camp",
    subName: "Health Initiative",
    description: "Save lives by donating blood at our annual camp.",
    tentativeMonth: "9",
    tentativeYear: "2025",
    type: "Annual",
    enableCert: "true",
    enableComp: "false",
    enableConf: "true",
    addedBy: 1001,
    addedOn: "2025-02-10"
  }
];

const dummyActivities: Activity[] = [
  {
    activityId: 1,
    name: "Tree Plantation",
    subName: "Environmental Activity",
    type: "Annual",
    description: "Plant trees to help the environment",
    status: "Active"
  },
  {
    activityId: 2,
    name: "Blood Donation",
    subName: "Health Activity",
    type: "Annual",
    description: "Donate blood to save lives",
    status: "Active"
  }
];

const dummyLocations: Location[] = [
  { locationId: 1, locationName: "Mumbai", status: "Active" },
  { locationId: 2, locationName: "Delhi", status: "Active" },
  { locationId: 3, locationName: "Bangalore", status: "Active" },
  { locationId: 4, locationName: "Chennai", status: "Active" },
  { locationId: 5, locationName: "Pune", status: "Active" }
];

const dummyUserDetails = {
  employeeId: 1001,
  empcode: "EMP001",
  name: "John Doe"
};

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

  // Add eventType state for filters
  const [eventType, setEventType] = useState<string>("");

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
    // Simulate getting current user details
    setTimeout(() => {
      setCurrentEmpId(dummyUserDetails.employeeId);
    }, 500);
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
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter events by selected year
      const filteredEvents = dummyEvents.filter(event => event.tentativeYear === selectedYear);
      setEvents(filteredEvents);
      
    } catch (error) {
      showNotification("error", "Failed to load events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const loadActivities = async () => {
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 800));
      setActivities(dummyActivities);
    } catch (error) {
      showNotification("error", "Failed to load activities");
    }
  };

  const loadLocations = async () => {
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 600));
      setLocations(dummyLocations);
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

      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Find selected activity for creating new event
      const selectedActivity = activities.find(a => a.activityId === formData.activityId);
      
      // Create new event object
      const newEvent: Event = {
        eventId: Date.now(), // Use timestamp as dummy ID
        name: selectedActivity?.name || "New Event",
        subName: selectedActivity?.subName || "Event Subtitle",
        description: selectedActivity?.description || "Event description",
        tentativeMonth: formData.tentativeMonth,
        tentativeYear: formData.tentativeYear,
        type: selectedActivity?.type || "Annual",
        enableCert: "true",
        enableComp: "false",
        enableConf: "true",
        addedBy: currentEmpId ?? 1001,
        addedOn: new Date().toISOString()
      };

      // Add to events if it matches selected year
      if (formData.tentativeYear === selectedYear) {
        setEvents(prev => [...prev, newEvent]);
      }

      showNotification("success", "Event created successfully");
      resetForm();

    } catch (error) {
      showNotification("error", "Failed to create event");
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
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Remove event from state
      setEvents(prev => prev.filter(e => e.eventId !== event.eventId));
      
      showNotification("success", "Event deleted successfully");
    } catch (error) {
      showNotification("error", "Failed to delete event");
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
        <AdminEventsFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          eventType={eventType}
          setEventType={setEventType}
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