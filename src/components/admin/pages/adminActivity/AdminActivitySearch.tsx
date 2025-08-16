import React from 'react';
import { Search } from 'lucide-react';

interface AdminActivitySearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

const AdminActivitySearch: React.FC<AdminActivitySearchProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search activities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-black"
        />
      </div>
      <div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-black"
        >
          <option value="A">Active</option>
          <option value="D">Deactivated</option>
        </select>
      </div>
    </div>
  );
};

export default AdminActivitySearch;