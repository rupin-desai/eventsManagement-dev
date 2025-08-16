import React from 'react';
import { Search } from 'lucide-react';

interface AdminVolunteerFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedYear: string;
  setSelectedYear: (value: string) => void;
  selectedEvent: any;
}

const AdminVolunteerFilters: React.FC<AdminVolunteerFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedYear,
  setSelectedYear,
  selectedEvent
}) => {
  return (
    <div className="mb-6 flex gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder={selectedEvent ? 'Search volunteers...' : 'Search events...'}
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
    </div>
  );
};

export default AdminVolunteerFilters;