import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Search,
  Calendar,
  User,
  Loader2,
  Eye,
  Mail,
  Building,
  Clock,
  Lightbulb,
  Star,
  X,
} from "lucide-react";
import { getSuggestionByEventId } from "../../api/admin/suggestionAdminApi";
import { approveSuggestion } from "../../api/admin/suggestionAdminApi";
import { getEventsByYear, type Event } from "../../api/eventApi";
import { getCurrentUserDetails } from "../../utils/volunteerFormHelpers";
import { suggestionApiClient } from "../../api/suggestionApi";
import AdminPageHeader from "../../components/ui/admin/AdminPageHeader";
import AdminNotification from "../../components/ui/admin/AdminNotification";
import ExcelDownload from "../../components/ui/ExcelDownload";

// Import or define the Suggestion type
import type { Suggestion } from "../../api/admin/suggestionAdminApi";

// Suggestion Type Categories
const SUGGESTION_TYPES = [
  {
    value: "S",
    label: "Suggestion",
    color: "bg-blue-100 text-blue-800",
    icon: Lightbulb,
  },
  {
    value: "F",
    label: "Feedback",
    color: "bg-green-100 text-green-800",
    icon: MessageSquare,
  },
  {
    value: "E",
    label: "Experience",
    color: "bg-purple-100 text-purple-800",
    icon: Star,
  },
];

const AdminSuggestionsPage: React.FC = () => {
  // State management
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<Suggestion | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("ALL");
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // For Experience approval
  const [approvalDescription, setApprovalDescription] = useState("");
  const [approvalLoading, setApprovalLoading] = useState(false);

  // For Experience image in modal
  const [expImageLoading, setExpImageLoading] = useState(false);
  const [expImageUrl, setExpImageUrl] = useState<string | null>(null);
  const [expImageError, setExpImageError] = useState<string | null>(null);

  // For current admin user
  const [adminEmpCode, setAdminEmpCode] = useState<number | null>(null);

  // Stats for events
  const [eventStats, setEventStats] = useState<
    Record<
      number,
      {
        totalSuggestions: number;
        feedbackCount: number;
        approvedExperiences: number;
        unapprovedExperiences: number;
      }
    >
  >({});

  // Fetch current admin emp code on mount
  useEffect(() => {
    const fetchAdminEmpCode = async () => {
      try {
        const user = await getCurrentUserDetails();
        setAdminEmpCode(user.employeeId);
      } catch (e) {
        setAdminEmpCode(null);
      }
    };
    fetchAdminEmpCode();
  }, []);

  // Helper function to determine suggestion type
  const getSuggestionType = (suggestion: Suggestion): string => {
    if (suggestion.type) {
      return suggestion.type;
    }
    if (suggestion.volunteerId && suggestion.volunteerId > 0) {
      return "F";
    } else if (suggestion.employeeId && suggestion.employeeId > 0) {
      return "S";
    }
    return "S";
  };

  // Get type configuration
  const getTypeConfig = (type: string) => {
    return (
      SUGGESTION_TYPES.find((t) => t.value === type) || SUGGESTION_TYPES[0]
    );
  };

  // Get type badge
  const getTypeBadge = (suggestion: Suggestion | null | undefined) => {
    if (!suggestion) return null;
    const type = getSuggestionType(suggestion);
    const config = getTypeConfig(type);
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}
      >
        <IconComponent className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  // Load data on component mount
  useEffect(() => {
    loadEvents();
  }, [selectedYear]);

  // Load suggestions when event is selected
  useEffect(() => {
    if (selectedEvent) {
      loadSuggestions();
    }
  }, [selectedEvent]);

  // Auto-hide notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Fetch experience image file path when modal opens for Experience type
  useEffect(() => {
    const fetchExpImage = async () => {
      setExpImageUrl(null);
      setExpImageError(null);
      if (
        showDetailModal &&
        selectedSuggestion &&
        (selectedSuggestion.type === "E" ||
          getSuggestionType(selectedSuggestion) === "E")
      ) {
        setExpImageLoading(true);
        try {
          // Call the API to get the file path (not blob)
          const res = await suggestionApiClient.get(
            `Suggestion/GetExpImage?suggestionId=${selectedSuggestion.suggestionId}`
          );
          // The response is a file path string
          setExpImageUrl(res.data);
        } catch (e) {
          setExpImageError("Could not load experience image.");
        } finally {
          setExpImageLoading(false);
        }
      }
    };
    fetchExpImage();
    // eslint-disable-next-line
  }, [showDetailModal, selectedSuggestion]);

  // Fetch stats for all events when events change
  useEffect(() => {
    const fetchStatsForEvents = async () => {
      const stats: Record<
        number,
        {
          totalSuggestions: number;
          feedbackCount: number;
          approvedExperiences: number;
          unapprovedExperiences: number;
        }
      > = {};
      await Promise.all(
        events.map(async (event) => {
          try {
            const res = await getSuggestionByEventId(event.eventId);
            const suggestions: Suggestion[] = res.data;
            stats[event.eventId] = {
              totalSuggestions: suggestions.length,
              feedbackCount: suggestions.filter(
                (s) => getSuggestionType(s) === "F"
              ).length,
              approvedExperiences: suggestions.filter(
                (s) => getSuggestionType(s) === "E" && s.status === "A"
              ).length,
              unapprovedExperiences: suggestions.filter(
                (s) => getSuggestionType(s) === "E" && s.status !== "A"
              ).length,
            };
          } catch {
            stats[event.eventId] = {
              totalSuggestions: 0,
              feedbackCount: 0,
              approvedExperiences: 0,
              unapprovedExperiences: 0,
            };
          }
        })
      );
      setEventStats(stats);
    };
    if (events.length > 0) {
      fetchStatsForEvents();
    }
  }, [events]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await getEventsByYear(selectedYear);
      setEvents(response.data);
    } catch (error) {
      setNotification({ type: "error", message: "Failed to load events" });
    } finally {
      setLoading(false);
    }
  };

  const loadSuggestions = async () => {
    if (!selectedEvent) return;

    try {
      setLoading(true);
      const response = await getSuggestionByEventId(selectedEvent.eventId);
      setSuggestions(response.data);
    } catch (error) {
      setNotification({ type: "error", message: "Failed to load suggestions" });
    } finally {
      setLoading(false);
    }
  };

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    setSuggestions([]);
    setSelectedTypeFilter("ALL");
  };

  const handleViewSuggestion = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
    setApprovalDescription(suggestion.description || "");
    setShowDetailModal(true);
  };

  const getStatusBadge = (status: string, type?: string) => {
    if (type === "E") {
      if (status === "A") {
        return (
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Approved
          </span>
        );
      }
      if (status === "N") {
        return (
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
            Not Approved
          </span>
        );
      }
      return (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
          {status}
        </span>
      );
    }
    return (
      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-50 text-gray-400">
        -
      </span>
    );
  };

  const getTypeCounts = () => {
    const counts = suggestions.reduce((acc, suggestion) => {
      const type = getSuggestionType(suggestion);
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return counts;
  };

  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.subName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSuggestions = suggestions.filter((suggestion) => {
    const matchesSearch =
      suggestion.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      suggestion.employeeName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      suggestion.employeeDesig
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesType =
      selectedTypeFilter === "ALL" ||
      getSuggestionType(suggestion) === selectedTypeFilter;

    return matchesSearch && matchesType;
  });

  const typeCounts = getTypeCounts();

  const handleApproveExperience = async (approve: boolean) => {
    if (!selectedSuggestion || !adminEmpCode) return;
    setApprovalLoading(true);
    try {
      await approveSuggestion({
        suggestionId: selectedSuggestion.suggestionId,
        status: approve ? "A" : "N",
        approvedBy: adminEmpCode,
        description: approvalDescription,
      });
      setNotification({
        type: "success",
        message: approve ? "Experience approved." : "Experience unapproved.",
      });
      setShowDetailModal(false);
      loadSuggestions();
    } catch (e) {
      setNotification({
        type: "error",
        message: "Failed to update experience status.",
      });
    } finally {
      setApprovalLoading(false);
    }
  };

  // Disable background scroll when modal is open
  useEffect(() => {
    if (showDetailModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showDetailModal]);

  return (
    <>
      <title>Admin | Suggestion Management - Alkem Smile</title>
      <meta
        name="description"
        content="Admin panel for reviewing and managing suggestions, feedback, and experiences from Alkem Smile volunteers."
      />
      <meta
        name="keywords"
        content="alkem, admin, suggestion management, feedback, experiences, volunteering, events, smile"
      />
      <div
        className="p-6 min-h-screen"
        style={{ background: "var(--brand-primary)" }}
      >
        {/* Header */}
        <AdminPageHeader
          icon={<MessageSquare className="w-8 h-8 text-red-600" />}
          title="Suggestion Management"
          description="View and manage volunteer suggestions, feedback, and experiences for SMILE events"
        />

        {/* Notification */}
        <AdminNotification
          notification={notification}
          onClose={() => setNotification(null)}
        />

        {/* Search and Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex-1 min-w-64 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={
                selectedEvent ? "Search suggestions..." : "Search events..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-black"
            />
          </div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-black"
          >
            {Array.from({ length: 5 }, (_, i) => {
              const year = new Date().getFullYear() + i - 2;
              return (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              );
            })}
          </select>
          {selectedEvent && (
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-black"
            >
              <option value="ALL">All Types</option>
              {SUGGESTION_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Event Selection */}
        {!selectedEvent ? (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Select Event to View Suggestions
            </h3>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                <span className="ml-2 text-gray-600">Loading events...</span>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No events available for {selectedYear}.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEvents.map((event) => {
                  const stats = eventStats[event.eventId] || {
                    totalSuggestions: 0,
                    feedbackCount: 0,
                    approvedExperiences: 0,
                    unapprovedExperiences: 0,
                  };
                  return (
                    <div
                      key={event.eventId}
                      onClick={() => handleEventSelect(event)}
                      className="p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-red-500 hover:bg-red-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900">
                        {event.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {event.subName}
                      </div>
                      <div className="text-xs text-gray-700 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {event.tentativeMonth} {event.tentativeYear}
                      </div>
                      {/* Stats summary */}
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-blue-50 rounded px-2 py-1 text-blue-800 font-semibold flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />{" "}
                          {stats.totalSuggestions} Suggestions
                        </div>
                        <div className="bg-green-50 rounded px-2 py-1 text-green-800 font-semibold flex items-center gap-1">
                          <Star className="w-3 h-3" />{" "}
                          {stats.approvedExperiences} Approved Exp.
                        </div>
                        <div className="bg-yellow-50 rounded px-2 py-1 text-yellow-800 font-semibold flex items-center gap-1">
                          <Lightbulb className="w-3 h-3" />{" "}
                          {stats.feedbackCount} Feedback
                        </div>
                        <div className="bg-red-50 rounded px-2 py-1 text-red-800 font-semibold flex items-center gap-1">
                          <Star className="w-3 h-3" />{" "}
                          {stats.unapprovedExperiences} Unapproved Exp.
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Suggestion Management */
          <div className="space-y-6">
            {/* Selected Event Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedEvent.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedEvent.subName}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {selectedEvent.tentativeMonth}{" "}
                      {selectedEvent.tentativeYear}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {suggestions.length} total entries
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Change Event
                </button>
              </div>
            </div>

            {/* Type Summary */}
            {suggestions.length > 0 && (
              <div className="bg-white rounded-lg shadow p-4">
                <h4 className="font-semibold text-gray-900 mb-3 text-base">
                  Category Summary
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {SUGGESTION_TYPES.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <div
                        key={type.value}
                        className={`flex items-center justify-center gap-2 text-center p-3 rounded-lg ${type.color} bg-opacity-20`}
                      >
                        <IconComponent className="w-5 h-5 flex-shrink-0" />
                        <div>
                          <div className="text-xl font-bold">
                            {typeCounts[type.value] || 0}
                          </div>
                          <div className="text-xs text-gray-700">
                            {type.label}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Suggestions List */}
            <div className="bg-white rounded-lg shadow">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                  <span className="ml-2 text-gray-600">
                    Loading suggestions...
                  </span>
                </div>
              ) : filteredSuggestions.length === 0 ? (
                <div className="text-center p-8 text-gray-500">
                  {searchTerm || selectedTypeFilter !== "ALL"
                    ? "No entries found matching your filters."
                    : "No suggestions found for this event."}
                </div>
              ) : (
                <>
                  {/* Mobile: horizontally scrollable table with sticky header */}
                  <div
                    className="block md:hidden relative"
                    style={{ maxHeight: "100vh" }}
                  >
                    <div className="overflow-x-auto">
                      <div className="min-w-[900px]">
                        <table className="w-full rounded-t-lg overflow-hidden table-fixed">
                          <colgroup>
                            <col className="w-[18%]" />
                            <col className="w-[18%]" />
                            <col className="w-[14%]" />
                            <col className="w-[14%]" />
                            <col className="w-[18%]" />
                            <col className="w-[18%]" />
                          </colgroup>
                          <thead>
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                                Entry Details
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                                Employee Details
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                                Type
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                                Status
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                                Submitted
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {filteredSuggestions.map((suggestion) => (
                              <tr
                                key={suggestion.suggestionId}
                                className="hover:bg-[var(--brand-primary-light)] transition-colors"
                              >
                                <td className="px-4 py-4">
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      ID: {suggestion.suggestionId}
                                    </div>
                                    <div className="text-sm text-gray-500 max-w-xs truncate">
                                      {suggestion.description}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                      Volunteer ID: {suggestion.volunteerId}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <User className="w-4 h-4 text-gray-400 mr-2" />
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">
                                        {suggestion.employeeName || "Unknown"}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        ID: {suggestion.employeeId}
                                      </div>
                                      <div className="text-xs text-gray-400 flex items-center gap-1 break-words max-w-[140px]">
                                        <Building className="w-3 h-3" />
                                        {suggestion.employeeDesig || "N/A"}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  {getTypeBadge(suggestion)}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  {getStatusBadge(
                                    suggestion.status,
                                    suggestion.type
                                  )}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {new Date(
                                      suggestion.addedOn
                                    ).toLocaleDateString()}
                                  </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                  <button
                                    onClick={() =>
                                      handleViewSuggestion(suggestion)
                                    }
                                    className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1 cursor-pointer transition-colors active:scale-95"
                                    type="button"
                                  >
                                    <Eye className="w-4 h-4" />
                                    View Details
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  {/* Desktop: sticky header, vertical scroll only for tbody */}
                  <div
                    className="hidden md:block relative"
                    style={{ maxHeight: "100vh" }}
                  >
                    <table className="w-full rounded-t-lg overflow-hidden table-fixed min-w-full">
                      <colgroup>
                        <col className="w-[18%]" />
                        <col className="w-[18%]" />
                        <col className="w-[14%]" />
                        <col className="w-[14%]" />
                        <col className="w-[18%]" />
                        <col className="w-[18%]" />
                      </colgroup>
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                            Entry Details
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                            Employee Details
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                            Submitted
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                            Actions
                          </th>
                        </tr>
                      </thead>
                    </table>
                    <div
                      className="overflow-y-auto custom-scrollbar rounded-b-lg"
                      style={{ maxHeight: "calc(100vh - 48px)" }}
                    >
                      <table className="w-full table-fixed min-w-full">
                        <colgroup>
                          <col className="w-[18%]" />
                          <col className="w-[18%]" />
                          <col className="w-[14%]" />
                          <col className="w-[14%]" />
                          <col className="w-[18%]" />
                          <col className="w-[18%]" />
                        </colgroup>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredSuggestions.map((suggestion) => (
                            <tr
                              key={suggestion.suggestionId}
                              className="hover:bg-[var(--brand-primary-light)] transition-colors"
                            >
                              <td className="px-6 py-4">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    ID: {suggestion.suggestionId}
                                  </div>
                                  <div className="text-sm text-gray-500 max-w-xs truncate">
                                    {suggestion.description}
                                  </div>
                                  <div className="text-xs text-gray-400 mt-1">
                                    Volunteer ID: {suggestion.volunteerId}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <User className="w-4 h-4 text-gray-400 mr-2" />
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {suggestion.employeeName || "Unknown"}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      ID: {suggestion.employeeId}
                                    </div>
                                    <div className="text-xs text-gray-400 flex items-center gap-1 break-words max-w-[140px]">
                                      <Building className="w-3 h-3" />
                                      {suggestion.employeeDesig || "N/A"}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {getTypeBadge(suggestion)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {getStatusBadge(
                                  suggestion.status,
                                  suggestion.type
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {new Date(
                                    suggestion.addedOn
                                  ).toLocaleDateString()}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                  onClick={() =>
                                    handleViewSuggestion(suggestion)
                                  }
                                  className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1 cursor-pointer transition-colors active:scale-95"
                                  type="button"
                                >
                                  <Eye className="w-4 h-4" />
                                  View Details
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Export to Excel Button */}
            <div className="flex items-center justify-end mb-6">
              <ExcelDownload
                fileName="nominations.xlsx"
                buttonText="Export All"
                columns={[
                  { label: "ID", key: "suggestionId" },
                  { label: "Type", key: "type" },
                  { label: "Status", key: "status" },
                  { label: "Description", key: "description" },
                  { label: "Volunteer ID", key: "volunteerId" },
                  { label: "Employee Name", key: "employeeName" },
                  { label: "Employee ID", key: "employeeId" },
                  { label: "Employee Designation", key: "employeeDesig" },
                  { label: "Employee Email", key: "employeeEmailId" },
                  { label: "Added On", key: "addedOn" },
                ]}
                getData={async () => filteredSuggestions}
              />
            </div>
          </div>
        )}

        {/* Suggestion Detail Modal */}
        {showDetailModal && selectedSuggestion && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] custom-scrollbar overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[var(--brand-secondary)]">
                    {getTypeConfig(getSuggestionType(selectedSuggestion)).label}{" "}
                    Details
                  </h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-[var(--brand-secondary)] cursor-pointer transition-colors"
                    title="Close"
                    type="button"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Entry Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-[var(--brand-secondary)] mb-2">
                      Entry Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Entry ID:</span>
                        <div className="font-medium">
                          {selectedSuggestion.suggestionId}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Type:</span>
                        <div className="mt-1">
                          {getTypeBadge(selectedSuggestion)}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Volunteer ID:</span>
                        <div className="font-medium">
                          {selectedSuggestion.volunteerId}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Status:</span>
                        <div className="mt-1">
                          {getStatusBadge(
                            selectedSuggestion.status,
                            selectedSuggestion.type
                          )}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500">Submitted On:</span>
                        <div className="font-medium">
                          {new Date(
                            selectedSuggestion.addedOn
                          ).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Employee Info */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-medium text-[var(--brand-secondary)] mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Employee Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Name:</span>
                        <div className="font-medium">
                          {selectedSuggestion.employeeName || "Not available"}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Employee ID:</span>
                        <div className="font-medium">
                          {selectedSuggestion.employeeId}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Designation:</span>
                        <div className="font-medium">
                          {selectedSuggestion.employeeDesig || "Not available"}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <div className="font-medium flex items-center gap-1">
                          {selectedSuggestion.employeeEmailId ? (
                            <>
                              <Mail className="w-3 h-3" />
                              <a
                                href={`mailto:${selectedSuggestion.employeeEmailId}`}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                {selectedSuggestion.employeeEmailId}
                              </a>
                            </>
                          ) : (
                            "Not available"
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Description */}
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h3 className="font-medium text-[var(--brand-secondary)] mb-2 flex items-center gap-2">
                      {(() => {
                        const IconComponent = getTypeConfig(
                          getSuggestionType(selectedSuggestion)
                        ).icon;
                        return <IconComponent className="w-4 h-4" />;
                      })()}
                      {
                        getTypeConfig(getSuggestionType(selectedSuggestion))
                          .label
                      }{" "}
                      Content
                    </h3>
                    {/* For Experience, show editable textarea for approval */}
                    {getSuggestionType(selectedSuggestion) === "E" ? (
                      <>
                        <textarea
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 min-h-[120px] md:min-h-[180px] text-base"
                          rows={6}
                          value={approvalDescription}
                          onChange={(e) => setApprovalDescription(e.target.value)}
                          disabled={approvalLoading}
                          style={{ resize: "vertical" }}
                        />
                        {/* Experience Image */}
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Experience Image
                          </label>
                          {expImageLoading ? (
                            <div className="text-gray-400 text-sm">Loading image...</div>
                          ) : expImageError ? (
                            <div className="text-red-500 text-sm">{expImageError}</div>
                          ) : expImageUrl ? (
                            <img
                              src={expImageUrl}
                              alt="Experience"
                              className="w-full max-w-full max-h-80 rounded border object-contain"
                              style={{ margin: "0 auto", display: "block" }}
                            />
                          ) : (
                            <div className="text-gray-400 text-sm">No image uploaded.</div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-gray-700 whitespace-pre-wrap">
                        {selectedSuggestion.description}
                      </div>
                    )}
                  </div>

                  {/* Event Context */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-medium text-[var(--brand-secondary)] mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Event Context
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Event:</span>
                        <div className="font-medium">{selectedEvent?.name}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Sub Event:</span>
                        <div className="font-medium">
                          {selectedEvent?.subName}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Schedule:</span>
                        <div className="font-medium">
                          {selectedEvent?.tentativeMonth}{" "}
                          {selectedEvent?.tentativeYear}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Approve/Unapprove for Experience */}
                {getSuggestionType(selectedSuggestion) === "E" && (
                  <div className="mt-6 pt-6 flex gap-3 justify-end">
                    <button
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 cursor-pointer transition-all"
                      disabled={approvalLoading}
                      onClick={() => handleApproveExperience(true)}
                    >
                      {approvalLoading ? "Processing..." : "Approve"}
                    </button>
                    <button
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 cursor-pointer transition-all"
                      disabled={approvalLoading}
                      onClick={() => handleApproveExperience(false)}
                    >
                      {approvalLoading ? "Processing..." : "Unapprove"}
                    </button>
                  </div>
                )}

                {/* Close Button */}
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-4 py-2 bg-[var(--brand-secondary)] hover:bg-[var(--brand-secondary-dark)] text-white rounded-lg transition-colors cursor-pointer"
                    type="button"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Summary Statistics */}
        {selectedEvent && (
          <motion.div
            className="mt-8 bg-white rounded-lg shadow-sm p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-semibold text-gray-900 mb-4">
              Entry Analytics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {typeCounts["S"] || 0}
                </div>
                <div className="text-sm text-gray-500">Suggestions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {typeCounts["F"] || 0}
                </div>
                <div className="text-sm text-gray-500">Feedback</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {typeCounts["E"] || 0}
                </div>
                <div className="text-sm text-gray-500">Experiences</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {
                    suggestions.filter(
                      (s) => s.volunteerId && s.volunteerId > 0
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-500">From Volunteers</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default AdminSuggestionsPage;
