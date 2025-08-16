import React from 'react';
import { motion } from 'framer-motion';
import { Save, X, Loader2 } from 'lucide-react';

interface AdminVolunteerBulkUpdateModalProps {
  isOpen: boolean;
  selectedCount: number;
  bulkStatus: string;
  setBulkStatus: (status: string) => void;
  statusOptions: Array<{ value: string; label: string; color: string }>;
  formLoading: boolean;
  onSubmit: () => void;
  onClose: () => void;
}

const AdminVolunteerBulkUpdateModal: React.FC<AdminVolunteerBulkUpdateModalProps> = ({
  isOpen,
  selectedCount,
  bulkStatus,
  setBulkStatus,
  statusOptions,
  formLoading,
  onSubmit,
  onClose
}) => {
  if (!isOpen) return null;

  // Add a default option at the top
  const optionsWithDefault = [
    { value: '', label: '-', color: '' },
    ...statusOptions,
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Bulk Status Update
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <strong>Selected Volunteers:</strong> {selectedCount}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Status
              </label>
              <select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {optionsWithDefault.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={formLoading || !bulkStatus}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors"
            >
              {formLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {formLoading ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminVolunteerBulkUpdateModal;