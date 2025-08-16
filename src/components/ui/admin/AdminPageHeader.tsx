import React from 'react';

interface AdminPageHeaderProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
  buttonIcon?: React.ReactNode;
  buttonClassName?: string;
  buttonStyle?: React.CSSProperties;
}

const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  icon,
  title,
  description,
  buttonLabel,
  onButtonClick,
  buttonIcon,
  buttonClassName = '',
  buttonStyle = {},
}) => {
  return (
    <div className="mb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Title and description */}
        <div className="flex items-start gap-3">
          {/* Hamburger placeholder for mobile */}
          <div className="block sm:hidden w-10 h-10 mr-1" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              {icon}
              {title}
            </h1>
            {description && (
              <p className="text-gray-600 mt-1">{description}</p>
            )}
          </div>
        </div>
        {/* Action Button */}
        {buttonLabel && onButtonClick && (
          <button
            onClick={onButtonClick}
            className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg transition-colors transition-transform duration-150 active:scale-95 mt-2 sm:mt-0 w-full sm:w-auto justify-center ${buttonClassName}`}
            style={buttonStyle}
          >
            {buttonIcon}
            <span className="text-base">{buttonLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminPageHeader;