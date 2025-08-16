import { useState } from "react";
import { motion } from "framer-motion";
import { fadeInVariants } from "../../../utils/animationVariants";
import { UserPlus, Plus, Loader2 } from "lucide-react";
import type { EventLocation } from "../../../api/locationApi";
import type { Employee } from "../../../api/employeeApi";
import { checkVolunteerExists } from "../../../api/volunteerApi";
import type {
  Nomination,
  CurrentUserDetails,
  SelectedEmployeeDetails,
} from "../../../types/volunteerFormTypes";
import VolunteerFormEmployeeSearch from "./VolunteerFormEmployeeSearch";
import VolunteerFormLocationSelection from "./VolunteerFormLocationSelection";

const RELATION_OPTIONS = [
  { label: "Mother", value: 1 },
  { label: "Father", value: 2 },
  { label: "Spouse", value: 3 },
  { label: "Sibling", value: 4 },
  { label: "Child", value: 5 },
  { label: "Friend", value: 6 },
];

interface VolunteerFormNominationFormProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
  searchingEmployees: boolean;
  setSearchingEmployees: (loading: boolean) => void;
  showDropdown: boolean;
  setShowDropdown: (show: boolean) => void;
  selectedEmployee: SelectedEmployeeDetails | null;
  setSelectedEmployee: (employee: SelectedEmployeeDetails | null) => void;
  loadingEmployeeDetails: boolean;
  setLoadingEmployeeDetails: (loading: boolean) => void;
  currentNomination: { eventLocationId: string };
  setCurrentNomination: (
    nomination:
      | { eventLocationId: string }
      | ((prev: { eventLocationId: string }) => { eventLocationId: string })
  ) => void;
  errors: Record<string, string>;
  setErrors: (
    errors:
      | Record<string, string>
      | ((prev: Record<string, string>) => Record<string, string>)
  ) => void;
  eventLocations: EventLocation[];
  loadingLocations: boolean;
  loadingCurrentUser: boolean;
  currentUser: CurrentUserDetails | null;
  nominations: Nomination[];
  setNominations: (nominations: Nomination[]) => void;
  eventId: number; // <-- Add this line
}

const VolunteerFormNominationForm = ({
  searchQuery,
  setSearchQuery,
  employees,
  setEmployees,
  searchingEmployees,
  setSearchingEmployees,
  showDropdown,
  setShowDropdown,
  selectedEmployee,
  setSelectedEmployee,
  loadingEmployeeDetails,
  setLoadingEmployeeDetails,
  currentNomination,
  setCurrentNomination,
  errors,
  setErrors,
  eventLocations,
  loadingLocations,
  loadingCurrentUser,
  currentUser,
  nominations,
  setNominations,
}: VolunteerFormNominationFormProps) => {
  // Tab state: "alkemite" or "relation"
  const [tab, setTab] = useState<"alkemite" | "relation">("alkemite");

  // Family/Friends form state
  const [relationForm, setRelationForm] = useState({
    relationId: "",
    relationName: "",
    relationContact: "",
    eventLocationId: "",
  });
  const [relationErrors, setRelationErrors] = useState<Record<string, string>>(
    {}
  );
  const [relationSubmitting] = useState(false);

  // Existing logic for checking volunteer existence
  const [checkingVolunteerExists, setCheckingVolunteerExists] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedEmployee) {
      newErrors.employee = "Please select an employee";
    }
    if (!currentNomination.eventLocationId) {
      newErrors.eventLocationId = "Please select a location";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkIfVolunteerExists = async (
    eventLocationId: number,
    employeeId: number
  ): Promise<boolean> => {
    try {
      setCheckingVolunteerExists(true);
      const response = await checkVolunteerExists(
        eventLocationId,
        employeeId.toString()
      );
      if (typeof response.data === "boolean") {
        return response.data;
      } else if (response.data && typeof response.data.exists === "boolean") {
        return response.data.exists;
      } else if (response.data && response.data.message) {
        return true;
      }
      return false;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return false;
      }
      return false;
    } finally {
      setCheckingVolunteerExists(false);
    }
  };

  // --- Family/Friends form validation ---
  const validateRelationForm = () => {
    const newErrors: Record<string, string> = {};
    if (!relationForm.relationId) newErrors.relationId = "Select relation";
    if (!relationForm.relationName.trim())
      newErrors.relationName = "Enter name";
    if (!relationForm.relationContact.trim())
      newErrors.relationContact = "Enter contact number";
    if (!relationForm.eventLocationId)
      newErrors.eventLocationId = "Select location";
    setRelationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Add Family/Friends relation ---
  const handleAddRelation = () => {
    if (!currentUser) return;
    if (!validateRelationForm()) return;

    const selectedLocation = eventLocations.find(
      (loc) => loc.eventLocationId === Number(relationForm.eventLocationId)
    );
    const newNomination: Nomination = {
      id: Date.now().toString() + "-relation",
      type: "relation",
      relationId: Number(relationForm.relationId),
      relationName: relationForm.relationName,
      relationContact: Number(relationForm.relationContact),
      eventLocationId: Number(relationForm.eventLocationId),
      locationName: selectedLocation?.locationName || "Unknown Location",
      addedAt: new Date(),
    };
    setNominations([...nominations, newNomination]);
    setRelationForm({
      relationId: "",
      relationName: "",
      relationContact: "",
      eventLocationId: "",
    });
    setRelationErrors({});
  };

  // --- Add Alkemite nomination ---
  const addNomination = async () => {
    if (!validateForm() || !selectedEmployee) return;
    if (
      nominations.some(
        (nom) =>
          nom.employeeId === selectedEmployee.employeeId &&
          nom.eventLocationId === Number(currentNomination.eventLocationId)
      )
    ) {
      setErrors({
        employee:
          "This employee is already nominated for this location in your current nominations",
      });
      return;
    }
    const volunteerExists = await checkIfVolunteerExists(
      Number(currentNomination.eventLocationId),
      selectedEmployee.employeeId
    );
    if (volunteerExists) {
      setErrors({
        employee:
          "This employee is already registered as a volunteer for this location",
      });
      return;
    }
    const selectedLocation = eventLocations.find(
      (loc) =>
        loc.eventLocationId === Number(currentNomination.eventLocationId)
    );
    const newNomination: Nomination = {
      id: Date.now().toString(),
      type: "alkemite",
      empcode: selectedEmployee.employeeId.toString(),
      employeeId: selectedEmployee.employeeId,
      employeeName: selectedEmployee.name,
      employeeEmail: selectedEmployee.emailid,
      eventLocationId: Number(currentNomination.eventLocationId),
      locationName: selectedLocation?.locationName || "Unknown Location",
      addedAt: new Date(),
    };
    setNominations([...nominations, newNomination]);
    setCurrentNomination({
      eventLocationId: "",
    });
    setSelectedEmployee(null);
    setSearchQuery("");
    setEmployees([]);
    setShowDropdown(false);
    setErrors({});
  };

  const handleLocationChange = (value: string) => {
    if (tab === "alkemite") {
      setCurrentNomination((prev: { eventLocationId: string }) => ({
        ...prev,
        eventLocationId: value,
      }));
      if (errors.eventLocationId) {
        setErrors((prev: Record<string, string>) => ({
          ...prev,
          eventLocationId: "",
        }));
      }
    } else {
      setRelationForm((prev) => ({
        ...prev,
        eventLocationId: value,
      }));
      if (relationErrors.eventLocationId) {
        setRelationErrors((prev) => ({
          ...prev,
          eventLocationId: "",
        }));
      }
    }
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      variants={fadeInVariants("left", 0.2)}
    >
      <div className="flex items-center gap-2 mb-6">
        <UserPlus className="w-10 h-10 text-yellow-600" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Add New Participation / Nomination
        </h2>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 mb-6">
        <button
          className={`px-4 py-1 rounded-full text-sm font-semibold transition cursor-pointer active:scale-95 ${
            tab === "alkemite"
              ? "bg-yellow-500 text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
          }`}
          onClick={() => setTab("alkemite")}
          type="button"
        >
          Alkemite
        </button>
        <button
          className={`px-4 py-1 rounded-full text-sm font-semibold transition cursor-pointer active:scale-95 ${
            tab === "relation"
              ? "bg-yellow-500 text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
          }`}
          onClick={() => setTab("relation")}
          type="button"
        >
          Family/Friends
        </button>
      </div>

      {/* Alkemite Tab */}
      {tab === "alkemite" && (
        <div className="space-y-6">
          <VolunteerFormEmployeeSearch
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
            errors={errors}
            setErrors={setErrors}
            loadingCurrentUser={loadingCurrentUser}
          />

          <VolunteerFormLocationSelection
            currentNomination={currentNomination}
            eventLocations={eventLocations}
            loadingLocations={loadingLocations}
            errors={errors}
            loadingCurrentUser={loadingCurrentUser}
            loadingEmployeeDetails={loadingEmployeeDetails}
            onLocationChange={handleLocationChange}
          />

          {checkingVolunteerExists && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  Checking if volunteer already exists for this location...
                </span>
              </div>
            </div>
          )}

          <motion.button
            className="w-full cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            whileTap={{ scale: 0.95 }}
            onClick={addNomination}
            disabled={
              loadingLocations ||
              eventLocations.length === 0 ||
              loadingCurrentUser ||
              !currentUser ||
              loadingEmployeeDetails ||
              checkingVolunteerExists
            }
          >
            {checkingVolunteerExists ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <Plus className="w-6 h-6" />
                Add Participation / Nomination
              </>
            )}
          </motion.button>
        </div>
      )}

      {/* Family/Friends Tab */}
      {tab === "relation" && (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Your Employee ID
            </label>
            <input
              type="text"
              value={currentUser?.employeeId ?? ""}
              disabled
              className="block w-full bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Relation
            </label>
            <select
              value={relationForm.relationId}
              onChange={(e) =>
                setRelationForm((prev) => ({
                  ...prev,
                  relationId: e.target.value,
                }))
              }
              className="block w-full bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Select Relation</option>
              {RELATION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {relationErrors.relationId && (
              <span className="text-xs text-red-600">{relationErrors.relationId}</span>
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Name of Relation
            </label>
            <input
              type="text"
              value={relationForm.relationName}
              onChange={(e) =>
                setRelationForm((prev) => ({
                  ...prev,
                  relationName: e.target.value,
                }))
              }
              className="block w-full bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter name"
            />
            {relationErrors.relationName && (
              <span className="text-xs text-red-600">{relationErrors.relationName}</span>
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Contact Number
            </label>
            <input
              type="number"
              value={relationForm.relationContact}
              onChange={(e) =>
                setRelationForm((prev) => ({
                  ...prev,
                  relationContact: e.target.value,
                }))
              }
              className="block w-full bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter contact number"
            />
            {relationErrors.relationContact && (
              <span className="text-xs text-red-600">{relationErrors.relationContact}</span>
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Location
            </label>
            <select
              value={relationForm.eventLocationId}
              onChange={(e) =>
                setRelationForm((prev) => ({
                  ...prev,
                  eventLocationId: e.target.value,
                }))
              }
              className="block w-full bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Select Location</option>
              {eventLocations.map((loc) => (
                <option key={loc.eventLocationId} value={loc.eventLocationId}>
                  {loc.locationName}
                </option>
              ))}
            </select>
            {relationErrors.eventLocationId && (
              <span className="text-xs text-red-600">{relationErrors.eventLocationId}</span>
            )}
          </div>
          {relationErrors.api && (
            <div className="text-xs text-red-600">{relationErrors.api}</div>
          )}
          <motion.button
            className="w-full bg-yellow-500 cursor-pointer hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            whileTap={{ scale: 0.95 }}
            onClick={handleAddRelation}
            disabled={relationSubmitting}
          >
            {relationSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="w-6 h-6" />
                Add Family/Friend
              </>
            )}
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default VolunteerFormNominationForm;