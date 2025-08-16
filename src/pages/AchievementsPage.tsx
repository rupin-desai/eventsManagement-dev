import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { sectionVariants } from "../utils/animationVariants";
import {
  AchievementsHeader,
  AchievementsEvents,
  AchievementsSuggestions,
} from "../components/pages/achievements";
import { getCurrentUserDetails } from "../utils/volunteerFormHelpers";
import type { CurrentUserDetails } from "../types/volunteerFormTypes";
import NotificationToast from "../components/ui/NotificationToast"; // Add this import

const AchievementsPage = () => {
  const [currentUser, setCurrentUser] = useState<CurrentUserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userDetails = await getCurrentUserDetails();
      
      setCurrentUser(userDetails);
    } catch (error) {
      console.error('❌ Error loading current user details:', error);
      setError('Failed to load user details');
      setNotification({ type: "error", message: "Failed to load user details" }); // Set notification on error
      
      // Fallback to default values
      setCurrentUser({
        employeeId: 78074,
        empcode: "78074",
        name: "Test User",
        emailId: "test@alkem.com",
        mobileNo: "",
        location: "",
        department: "",
        designation: "",
        reportingManager: "",
        dateOfJoining: "",
        grade: "",
        businessUnit: "",
        status: "Active"
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while fetching user details
  if (loading) {
    return (
      <div className="min-h-screen bg-white py-10 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your achievements...</p>
        </div>
      </div>
    );
  }

  // Show error state if user details couldn't be loaded
  if (error && !currentUser) {
    return (
      <div className="min-h-screen bg-white py-10 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Profile</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button 
              onClick={loadCurrentUser}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <title>Achievements | Your Events Activiy</title>
      <meta name="description" content="Celebrate the achievements and impact of Alkem Smile volunteers. See how our employees are making a difference in the community." />
      <meta name="keywords" content="alkem, achievements, volunteers, awards, recognition, community, impact, smile" />
      <NotificationToast notification={notification} onClose={() => setNotification(null)} />
      <motion.div
        className="min-h-screen bg-white py-10 px-4"
        variants={sectionVariants}
        initial="initial"
        animate="animate"
      >
        <div className="max-w-5xl mx-auto">
          {/* ✅ Pass all required props to header */}
          <AchievementsHeader 
            userName={currentUser?.name || "User"}
            empCode={currentUser?.empcode || ""}
            userDetails={currentUser}
          />
          
          {/* ✅ My Events Section */}
          <AchievementsEvents />
          
          {/* ✅ Suggestions Section */}
          <AchievementsSuggestions />
          
          {/* Example usage of BASE_URL for a public asset */}
          {/* <img src={`${BASE_URL}graphics/smile_underline.svg`} alt="underline" /> */}
        </div>
      </motion.div>
    </>
  );
};

export default AchievementsPage;