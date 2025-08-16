import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { getDistinctEventYears } from '../../../../api/eventApi';

interface AdminEventsFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedYear: string;
  setSelectedYear: (value: string) => void;
  eventType: string;
  setEventType: (value: string) => void;
}

const AdminEventsFilters: React.FC<AdminEventsFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedYear,
  setSelectedYear,
}) => {
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [yearsLoading, setYearsLoading] = useState(true);

  // ✅ Load distinct years from API on component mount
  useEffect(() => {
    loadDistinctYears();
    // eslint-disable-next-line
  }, []);

  const loadDistinctYears = async () => {
    try {
      setYearsLoading(true);
      const response = await getDistinctEventYears();
      const sortedYears = response.data.sort(
        (a, b) => parseInt(b) - parseInt(a)
      );
      setAvailableYears(sortedYears);
      if (sortedYears.length > 0 && !selectedYear) {
        const currentYear = new Date().getFullYear().toString();
        const defaultYear = sortedYears.includes(currentYear)
          ? currentYear
          : sortedYears[0];
        setSelectedYear(defaultYear);
      }
    } catch (error) {
      const currentYear = new Date().getFullYear().toString();
      setAvailableYears([currentYear]);
      if (!selectedYear) {
        setSelectedYear(currentYear);
      }
    } finally {
      setYearsLoading(false);
    }
  };

  return (
    <div className="mb-6 flex gap-4 flex-wrap">
      <div className="flex-1 relative min-w-[180px]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-black"
        />
      </div>

      {/* Year filter */}
      <div className="relative min-w-[120px]">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          disabled={yearsLoading}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed bg-white text-black"
        >
          {yearsLoading ? (
            <option value="">Loading...</option>
          ) : (
            <>
              {availableYears.length === 0 ? (
                <option value="">No years available</option>
              ) : (
                availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))
              )}
            </>
          )}
        </select>
        {yearsLoading && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
          </div>
        )}
      </div>

      
    </div>
  );
};

export default AdminEventsFilters;