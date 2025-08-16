import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { sectionVariants } from "../../utils/animationVariants";
import { getEventLocationsByEventId, type EventLocation } from "../../api/locationApi";
import { type Employee } from "../../api/employeeApi";
import { createVolunteer, type CreateVolunteerRequest } from "../../api/volunteerApi";
import { createVolRelations } from "../../api/relationApi"; // <-- import
import VolunteerFormHeader from "../../components/pages/volunteerForm/VolunteerFormHeader";
import VolunteerFormNominationForm from "../../components/pages/volunteerForm/VolunteerFormNominationForm";
import VolunteerFormNominationsList from "../../components/pages/volunteerForm/VolunteerFormNominationsList";
import VolunteerFormExistingNominations from "../../components/pages/volunteerForm/VolunteerFormExistingNominations";
import { getCurrentUserDetails } from "../../utils/volunteerFormHelpers";
import type { 
  Nomination, 
  EventDetails, 
  CurrentUserDetails, 
  SelectedEmployeeDetails 
} from "../../types/volunteerFormTypes";
import NotificationToast from "../../components/ui/NotificationToast"; // <-- import

const VolunteerForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get event details from navigation state
  const eventId = location.state?.eventId;
  const eventName = location.state?.eventName;
  const eventDetails = location.state?.eventDetails as EventDetails;

  // Form state
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventLocations, setEventLocations] = useState<EventLocation[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  // Current user state
  const [currentUser, setCurrentUser] = useState<CurrentUserDetails | null>(null);
  const [loadingCurrentUser, setLoadingCurrentUser] = useState(false);

  // Employee search state
  const [searchQuery, setSearchQuery] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchingEmployees, setSearchingEmployees] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<SelectedEmployeeDetails | null>(null);
  const [loadingEmployeeDetails, setLoadingEmployeeDetails] = useState(false);

  // Current nomination form state
  const [currentNomination, setCurrentNomination] = useState({
    eventLocationId: "",
  });

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Refresh trigger for existing nominations
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Notification state
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Function to get current user ID from auth and employee APIs
  const getCurrentUserId = async (): Promise<number> => {
    if (currentUser) {
      return currentUser.employeeId;
    }

    try {
      setLoadingCurrentUser(true);
      const userDetails = await getCurrentUserDetails();
      setCurrentUser(userDetails);
      return userDetails.employeeId;
    } catch (error: any) {
      setNotification({
        type: "error",
        message: error.response?.status === 401
          ? "Authentication failed. Please log in again."
          : "Unable to fetch current user information. Please try again."
      });
      throw new Error('Unable to fetch current user information');
    } finally {
      setLoadingCurrentUser(false);
    }
  };

  // Redirect if no event details
  useEffect(() => {
    if (!eventId || !eventName) {
      navigate("/events");
    }
  }, [eventId, eventName, navigate]);

  // Load current user and event locations
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await getCurrentUserId();
        if (eventId) {
          await loadEventLocations();
        }
      } catch (error) {
        // error handled in getCurrentUserId
      }
    };
    loadInitialData();
  }, [eventId]);

  const loadEventLocations = async () => {
    try {
      setLoadingLocations(true);
      const response = await getEventLocationsByEventId(Number(eventId));
      setEventLocations(response.data);
    } catch (error) {
      setNotification({
        type: "error",
        message: "Error loading event locations."
      });
    } finally {
      setLoadingLocations(false);
    }
  };

  const handleSubmit = async () => {
    if (nominations.length === 0) {
      setNotification({
        type: "error",
        message: "Please add at least one nomination before submitting."
      });
      return;
    }

    if (!currentUser) {
      setNotification({
        type: "error",
        message: "Current user information not available. Please refresh the page."
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Split nominations
      const alkemiteNoms = nominations.filter(n => n.type !== "relation");
      const relationNoms = nominations.filter(n => n.type === "relation");

      // Send Alkemites
      if (alkemiteNoms.length > 0) {
        const volunteerData: CreateVolunteerRequest = {
          eventId: Number(eventId),
          addedBy: currentUser.employeeId,
          volunteers: alkemiteNoms
            .filter(nomination => nomination.employeeId !== undefined)
            .map(nomination => ({
              eventlocationId: nomination.eventLocationId,
              employeeId: nomination.employeeId as number
            }))
        };
        await createVolunteer(volunteerData);
      }

      // Send Family/Friends
      if (relationNoms.length > 0) {
        // Group by location for API
        const grouped = relationNoms.reduce((acc, curr) => {
          const key = curr.eventLocationId;
          if (!acc[key]) acc[key] = [];
          acc[key].push({
            relationId: curr.relationId!,
            relationName: curr.relationName!,
            relationContact: curr.relationContact!
          });
          return acc;
        }, {} as Record<number, { relationId: number; relationName: string; relationContact: number }[]>);

        for (const [eventLocationId, createVolRelation] of Object.entries(grouped)) {
          await createVolRelations({
            eventId: Number(eventId),
            eventLocationId: Number(eventLocationId),
            addedBy: currentUser.employeeId,
            createVolRelation
          });
        }
      }

      setNotification({
        type: "success",
        message: `Successfully submitted ${nominations.length} nomination${nominations.length > 1 ? 's' : ''} for ${eventName}!`
      });
      setRefreshTrigger(prev => prev + 1);
      setNominations([]);
      setCurrentNomination({
        eventLocationId: "",
      });
      setSelectedEmployee(null);
      setSearchQuery("");
      setEmployees([]);
      setShowDropdown(false);
      setErrors({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      let errorMessage = "Failed to submit nominations. Please try again.";
      if (error.response) {
        const statusCode = error.response.status;
        const responseData = error.response.data;
        if (statusCode === 400) {
          errorMessage = "Invalid nomination data. Please check your selections.";
        } else if (statusCode === 401) {
          errorMessage = "Authentication failed. Please log in again.";
        } else if (statusCode === 403) {
          errorMessage = "You don't have permission to submit nominations.";
        } else if (statusCode === 409) {
          errorMessage = "Some volunteers are already registered for this event.";
        } else if (responseData && responseData.message) {
          errorMessage = responseData.message;
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (error.message === 'Unable to fetch current user information') {
        errorMessage = "Unable to identify current user. Please log in again.";
      }
      setNotification({
        type: "error",
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Meta tags for SEO */}
      <title>Participation/Nomination Form | Alkem Smile Volunteering</title>
      <meta
        name="description"
        content="Participate or nominate for Alkem Smile volunteering events. Employees can join or add family and friends for community service activities."
      />
      <meta
        name="keywords"
        content="alkem, volunteer, nomination, participation, community service, smile, family, friends, event"
      />
      <NotificationToast
        notification={notification}
        onClose={() => setNotification(null)}
      />
      <motion.div
        className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4"
        initial="initial"
        animate="animate"
        variants={sectionVariants}
      >
        <div className="max-w-6xl mx-auto">
          <VolunteerFormHeader 
            eventName={eventName}
            eventDetails={eventDetails}
            currentUser={currentUser}
            loadingCurrentUser={loadingCurrentUser}
            title="Participation/Nomination Form"
            subtitle="Employees can search for themselves by email to participate, and may also nominate other Alkemites for this event."
          />

          {/* 3-column layout */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Nomination Form */}
            <div className="lg:col-span-1">
              <VolunteerFormNominationForm
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                employees={employees}
                setEmployees={setEmployees}
                searchingEmployees={searchingEmployees}
                setSearchingEmployees={setSearchingEmployees}
                showDropdown={showDropdown}
                setShowDropdown={setShowDropdown}
                selectedEmployee={selectedEmployee}
                setSelectedEmployee={setSelectedEmployee}
                loadingEmployeeDetails={loadingEmployeeDetails}
                setLoadingEmployeeDetails={setLoadingEmployeeDetails}
                currentNomination={currentNomination}
                setCurrentNomination={setCurrentNomination}
                errors={errors}
                setErrors={setErrors}
                eventLocations={eventLocations}
                loadingLocations={loadingLocations}
                loadingCurrentUser={loadingCurrentUser}
                currentUser={currentUser}
                nominations={nominations}
                setNominations={setNominations}
                eventId={eventId} // <-- Add this line
              />
            </div>

            {/* Middle Column - New Nominations List */}
            <div className="lg:col-span-1">
              <VolunteerFormNominationsList
                nominations={nominations}
                setNominations={setNominations}
                isSubmitting={isSubmitting}
                currentUser={currentUser}
                eventId={eventId}
                onSubmit={handleSubmit}
              />
            </div>

            {/* Right Column - Existing Nominations */}
            <div className="lg:col-span-1">
              <VolunteerFormExistingNominations
                eventId={Number(eventId)}
                currentUser={currentUser}
                refreshTrigger={refreshTrigger}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default VolunteerForm;