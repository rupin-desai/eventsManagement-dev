import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import FormLayout from './layouts/FormLayout'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import AnnualVolunteerPage from './pages/AnnualVolunteerPage'
import WeCareMonthPage from './pages/WeCareMonthPage'
import AchievementsPage from './pages/AchievementsPage'
import ExperiencePage from './pages/ExperiencePage'
import GuidelinesPage from './pages/GuidelinesPage'
import VideosPage from './pages/VideosPage'
import PhotosPage from './pages/PhotosPage'
import VolunteerForm from './pages/forms/VolunteerForm'
import LoginPage from './pages/loginPage'
import AdminActivityPage from './pages/admin/AdminActivityPage'
import AdminEventsPage from './pages/admin/AdminEventsPage'
import AdminLocationsPage from './pages/admin/AdminLocationsPage'
import AdminVolunteerPage from './pages/admin/AdminVolunteerPage'
import AdminSuggestionsPage from './pages/admin/AdminSuggestionsPage'
import AdminGalleryPage from './pages/admin/AdminGalleryPage'
import FeedbackForm from './pages/forms/FeedbackForm'
import ExperienceForm from './pages/forms/ExperienceForm'
import NotFoundPage from './pages/404Page'

// Dynamically fetch base name from Vite config
const basename = import.meta.env.BASE_URL || '/'

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter basename={basename}>
        <AuthProvider>
          <Routes>
            {/* Redirect root to /home */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminActivityPage />} />
              <Route path="activities" element={<AdminActivityPage />} />
              <Route path="events" element={<AdminEventsPage />} />
              <Route path="locations" element={<AdminLocationsPage />} />
              <Route path="volunteers" element={<AdminVolunteerPage />} />
              <Route path="suggestions" element={<AdminSuggestionsPage />} />
              <Route path="gallery" element={<AdminGalleryPage />} />
            </Route>
            
            {/* Main Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route path="home" element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="volunteer" element={<AnnualVolunteerPage />} />
              <Route path="we-care-month" element={<WeCareMonthPage />} />
              <Route path="achievements" element={<AchievementsPage />} />
              <Route path="experience" element={<ExperiencePage />} />
              <Route path="guidelines" element={<GuidelinesPage />} />
              <Route path="videos" element={<VideosPage />} />
              <Route path="photos" element={<PhotosPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="volunteer-form" element={<VolunteerForm />} />
            </Route>

            {/* Forms use FormLayout */}
            <Route element={<FormLayout />}>
              <Route path="/feedback-form" element={<FeedbackForm />} />
              <Route path="/experience-form" element={<ExperienceForm />} />
            </Route>

            {/* 404 Not Found Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App