import { useEffect, useRef } from "react";
import { Search, Loader2, X, Check } from "lucide-react";
import { getAllActiveEmployees, type Employee } from "../../../api/employeeApi";
import type { SelectedEmployeeDetails } from "../../../types/volunteerFormTypes";

interface VolunteerFormEmployeeSearchProps {
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
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => void;
  loadingCurrentUser: boolean;
}

const VolunteerFormEmployeeSearch = ({
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
  errors,
  setErrors,
  loadingCurrentUser
}: VolunteerFormEmployeeSearchProps) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Employee search with debouncing
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        searchEmployees(searchQuery.trim());
      } else {
        setEmployees([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchEmployees = async (hint: string) => {
    try {
      setSearchingEmployees(true);
      const response = await getAllActiveEmployees(hint);
      setEmployees(response.data);
      setShowDropdown(true);
    } catch (error) {
      console.error('Error searching employees:', error);
      setEmployees([]);
    } finally {
      setSearchingEmployees(false);
    }
  };

  // ✅ Simplified selectEmployee - no need to fetch additional details
  const selectEmployee = async (employee: Employee) => {
    try {
      setLoadingEmployeeDetails(true);
      setShowDropdown(false);
      
      
      // ✅ Use employeeId directly from the API response
      const selectedEmployeeWithDetails: SelectedEmployeeDetails = {
        ...employee,
        // employeeId is already available in the employee object from API
      };
      
      setSelectedEmployee(selectedEmployeeWithDetails);
      setSearchQuery(employee.name);
      
      
      // Clear employee error if it exists
      if (errors.employee) {
        setErrors(prev => ({ ...prev, employee: "" }));
      }
      
    } catch (error) {
      console.error('Error selecting employee:', error);
    } finally {
      setLoadingEmployeeDetails(false);
    }
  };

  const clearEmployeeSelection = () => {
    setSelectedEmployee(null);
    setSearchQuery("");
    setEmployees([]);
    setShowDropdown(false);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Search Employee *
      </label>
      <div className="relative" ref={searchInputRef}>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (employees.length > 0) setShowDropdown(true);
            }}
            className={`w-full px-4 py-3 pl-10 pr-10 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors ${
              errors.employee ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Type employee name to search..."
            disabled={loadingCurrentUser || loadingEmployeeDetails}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          
          {(searchingEmployees || loadingEmployeeDetails) && (
            <Loader2 className="absolute right-10 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-yellow-500" />
          )}
          
          {selectedEmployee && !loadingEmployeeDetails && (
            <button
              onClick={clearEmployeeSelection}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={loadingCurrentUser}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Employee Dropdown */}
        {showDropdown && employees.length > 0 && !loadingEmployeeDetails && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {employees.map((employee) => (
              <button
                key={employee.employeeId}
                onClick={() => selectEmployee(employee)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
              >
                <div className="font-medium text-gray-900 dark:text-white">
                  {employee.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {employee.designation} • {employee.department}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  {employee.location} • {employee.emailid} • Employee ID: {employee.employeeId}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Loading Employee Details */}
        {loadingEmployeeDetails && (
          <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Processing selection...
              </span>
            </div>
          </div>
        )}

        {/* Selected Employee Display */}
        {selectedEmployee && !loadingEmployeeDetails && (
          <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                Selected Employee:
              </span>
            </div>
            <div className="mt-1">
              <div className="font-medium text-green-900 dark:text-green-100">
                {selectedEmployee.name}
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">
                {selectedEmployee.designation} • {selectedEmployee.department}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400">
                Location: {selectedEmployee.location} • Employee ID: {selectedEmployee.employeeId}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {errors.employee && (
        <p className="text-red-500 text-sm mt-1">
          {errors.employee}
        </p>
      )}
    </div>
  );
};

export default VolunteerFormEmployeeSearch;