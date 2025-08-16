interface AchievementsSectionHeaderProps {
  title: string;
  sectionType: 'upcoming' | 'past' | 'events' | 'suggestions' | 'achievements' ; // ✅ Add 'suggestions' type
}

const AchievementsSectionHeader: React.FC<AchievementsSectionHeaderProps> = ({ 
  title, 
  sectionType 
}) => {
  // ✅ Handle the new 'suggestions' type
  const getSectionLabel = (type: string) => {
    switch(type) {
      case 'upcoming':
        return 'Upcoming';
      case 'past':
        return 'Past Events';
      case 'events':
        return 'My Events';
      case 'suggestions':
        return 'Your Suggestions';
      case 'achievements':
        return 'Welcome to Your Achievements Page';
      default:
        return 'Events';
    }
  };
  
  const sectionLabel = getSectionLabel(sectionType);
  
  return (
    <>
      {/* Section dash and label */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-0.5 bg-yellow-400" />
        <span className="text-xs font-semibold text-yellow-700 uppercase tracking-wider">
          {sectionLabel}
        </span>
      </div>
      <h2 className="text-xl font-bold text-yellow-800 mb-4">
        {title}
      </h2>
    </>
  );
};

export default AchievementsSectionHeader;