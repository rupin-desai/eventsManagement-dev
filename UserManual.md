# Alkem Smile User & Admin Functionalities

## Table of Contents
1. [User Functionalities](#user-functionalities)
    - [Event Calendar & Registration](#event-calendar--registration)
    - [Volunteer Dashboard](#volunteer-dashboard)
    - [Achievements & Certificates](#achievements--certificates)
    - [Experience Sharing Hub](#experience-sharing-hub)
    - [Guidelines & Information Pages](#guidelines--information-pages)
2. [Admin Functionalities](#admin-functionalities)
    - [Activity Management](#activity-management)
    - [Event Management](#event-management)
    - [Volunteer Management](#volunteer-management)
    - [Experience Moderation](#experience-moderation)
    - [Event Location Management](#event-location-management)
    - [Gallery & Suggestions Management](#gallery--suggestions-management)

---

## User Functionalities

### 1. Event Calendar & Registration
- **Browse Events:** Users can view all upcoming and past events in a calendar or list format.
- **Event Details:** Click on an event to see its description, objectives, location, and FAQs.
- **Register for Events:** Users can register for available events directly from the event page.
- **Registration Status:** See registration status (registered, waitlisted, attended, etc.).
- **Family/Friend Participation:** Option to add relations for group participation.

**Flow:**
1. Login with employee code.
2. Navigate to "Events" or "Volunteer" page.
3. Browse events and select one.
4. Click "Register" and fill required details.
5. Receive confirmation and see status in dashboard.

---

### 2. Volunteer Dashboard
- **My Events:** View all events the user has registered for or attended.
- **Attendance & Rating:** Mark attendance and rate completed events.
- **Download Certificates:** Download certificates for eligible events.
- **Status Tracking:** See event status (upcoming, attended, certificate available).

**Flow:**
1. Go to "Volunteer Dashboard".
2. See list of registered/attended events.
3. For attended events, rate and download certificate if enabled.

---

### 3. Achievements & Certificates
- **Achievements Page:** Displays badges, certificates, and milestones.
- **Certificate Download:** Download PDF certificates for completed events.

---

### 4. Experience Sharing Hub
- **Share Experience:** Submit text and images about volunteering experiences.
- **View Gallery:** Browse approved experiences in a masonry grid.
- **Moderation:** Only approved experiences are visible to all users.

**Flow:**
1. Go to "Experience" page.
2. Click "Share Experience", fill form, and upload images.
3. Submit for admin approval.
4. Once approved, experience appears in gallery.

---

### 5. Guidelines & Information Pages
- **Guidelines:** Access volunteering guidelines, FAQs, and instructions.
- **Contact:** View contact information for support.

---

## Admin Functionalities

### 1. Activity Management
- **Create/Edit/Delete Activities:** Manage volunteering activities with rich descriptions, objectives, details, and FAQs.
- **Template Builder:** Use template or direct HTML for activity descriptions.
- **Image Upload:** Upload and manage activity images.
- **Status Management:** Activate/deactivate activities.

**Flow:**
1. Login as admin and go to "Activities".
2. Click "Create Activity" or edit existing.
3. Fill details, use template builder for description.
4. Save, upload image if needed.
5. Manage activity status from table.

---

### 2. Event Management
- **Create/Edit/Delete Events:** Manage events, assign activities, locations, and tentative dates.
- **Assign Locations:** Select from existing or add new event locations.
- **Status Management:** Activate/deactivate or delete events.
- **Event Details Modal:** View and edit event details in a modal.

**Flow:**
1. Go to "Events" in admin panel.
2. Click "Create Event", select activity, locations, and date.
3. Save event.
4. Edit or delete from events table.

---

### 3. Volunteer Management
- **View Volunteers:** See list of volunteers per event.
- **Approve/Reject Volunteers:** Update volunteer status individually or in bulk.
- **Export Data:** Export volunteer lists as CSV.
- **Status Summary:** View summary of volunteer statuses for each event.

**Flow:**
1. Go to "Volunteers".
2. Select event/year to view volunteers.
3. Approve/reject or bulk update statuses.
4. Export data if needed.

---

### 4. Experience Moderation
- **Approve/Reject Experiences:** Review user-submitted experiences and approve or reject them.
- **Gallery Management:** Manage images and content in the experience gallery.

**Flow:**
1. Go to "Suggestions" in admin panel.
2. Select event and review pending experiences.
3. Approve or reject submissions.
4. Approved experiences appear in gallery.

---

### 5. Event Location Management
- **CRUD Locations:** Create, update, or delete event locations.
- **Assign Locations:** Assign locations to events during event creation/editing.

---

### 6. Gallery & Suggestions Management
- **Gallery:** Manage event and experience images.
- **Suggestions:** Review and manage user feedback and suggestions.

---

## Notes

- **Authentication:** All admin features require admin login.
- **API Integration:** All data is fetched and updated via RESTful API endpoints.
- **Responsive Design:** All functionalities are available on desktop and mobile.

