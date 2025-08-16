// Main navigation links with dropdown support
export const navLinks = [
  {
    name: "Home",
    path: "/home", // <-- updated path
    label: "Home"
  },
  {
    name: "About Us",
    path: "/about",
    label: "About Us"
  },
  {
    name: "Programs",
    path: "/volunteer", // <-- updated path
    label: "Programs",
    hasDropdown: true,
    dropdownItems: [
      {
        name: "Annual Volunteering Calendar",
        path: "/volunteer",
        description: "See all upcoming volunteering events and activities for the year"
      },
      {
        name: "We Care Month",
        path: "/we-care-month",
        description: "A dedicated employee volunteering month – August "
      },
      
    ]
  },
  {
    name: "Gallery",
    path: "#gallery", // <-- made unique
    label: "Media",
    hasDropdown: true,
    dropdownItems: [
      {
        name: "Video Gallery",
        path: "/videos",
        description: "Voices of Change, Stories of Hope"
      },
      {
        name: "Photo Gallery",
        path: "/photos",
        description: "Snapshots of Impact"
      },
      {
        name: "Experience Hub",
        path: "/experience",
        description: "Voices, Visuals & Volunteerism – All in One Place"
      },
    ]
  },
  {
    name: "Achievements",
    path: "/achievements",
    label: "Achievements"
  },
  {
    name: "Guidelines",
    path: "/guidelines",
    label: "Guidelines"
  },
  {
    name: "Contact",
    path: "/contact",
    label: "Contact"
  }
]

// Footer navigation links organized by sections
export const footerLinks = {
  company: [
    { name: "About Us", path: "/about" },
    { name: "Achievements", path: "/achievements" },
    { name: "Guidelines", path: "/guidelines" },
    { name: "Contact", path: "/contact" },
  ],
  programs: [
    { name: "Volunteer Program", path: "/volunteer" },
    { name: "We Care Month", path: "/we-care-month" },
    { name: "Experience Stories", path: "/experience" },
    { name: "Community Outreach", path: "/community-outreach" },
  ],
  media: [
    { name: "Video Library", path: "/videos" },
    { name: "Photo Gallery", path: "/photos" },
    { name: "Health Education", path: "/health-education" },
  ],
}

// Mobile menu specific links (can include additional mobile-only items)
export const mobileMenuLinks = [
  ...navLinks,
  // Additional mobile-specific links if needed
  {
    name: "Emergency",
    path: "/emergency",
    label: "Emergency",
    isEmergency: true
  }
]

// Quick contact information
export const contactInfo = {
  emergency: {
    number: "108",
    label: "Emergency Helpline"
  },
  main: {
    phone: "+919876543210",
    email: "info@alkemsmile.com",
    address: "123 Healthcare Avenue, Medical District, Mumbai, Maharashtra 400058"
  },
  branch: {
    phone: "+919876543212",
    email: "delhi@alkemsmile.com",
    address: "456 Wellness Plaza, Health Care Complex, New Delhi, Delhi 110001"
  }
}

// Social media links
export const socialLinks = [
  {
    name: "Facebook",
    url: "https://www.facebook.com/alkemsmile",
    icon: "Facebook"
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/@alkemsmile",
    icon: "Youtube"
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/alkem-laboratories-ltd/",
    icon: "Linkedin"
  },
  {
    name: "Twitter",
    url: "https://x.com/alkemsmile",
    icon: "Twitter"
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/alkemsmile",
    icon: "Instagram"
  }
]

// Helper function to check if a path is active for dropdown items
export const isActiveDropdownPath = (currentPath: string, parentPath: string, dropdownItems?: { path: string }[]) => {
  if (currentPath === parentPath) return true
  
  if (dropdownItems) {
    return dropdownItems.some(item => currentPath === item.path)
  }
  
  return false
}

// Helper function to get all paths for easier route management
export const getAllPaths = () => {
  const paths = navLinks.map(link => link.path)
  
  navLinks.forEach(link => {
    if (link.hasDropdown && link.dropdownItems) {
      link.dropdownItems.forEach(item => {
        paths.push(item.path)
      })
    }
  })
  
  return [...new Set(paths)] // Remove duplicates
}

// SEO and meta information for each page
export const pageMetaData = {
  "/": {
    title: "Alkem Smile - Healthcare for Everyone",
    description: "Your trusted partner in healthcare, providing compassionate medical solutions and community health services.",
    keywords: "healthcare, medical services, community health, alkem smile"
  },
  "/about": {
    title: "About Us - Alkem Smile",
    description: "Learn about our mission to provide accessible healthcare and our commitment to community wellness.",
    keywords: "about alkem smile, healthcare mission, medical team"
  },
  "/volunteer": {
    title: "Volunteer Program - Alkem Smile",
    description: "Join our volunteer program and make a difference in community healthcare.",
    keywords: "volunteer healthcare, medical volunteering, community service"
  },
  "/we-care-month": {
    title: "We Care Month - Alkem Smile",
    description: "Monthly community health initiatives and medical camps.",
    keywords: "community health, medical camps, health awareness"
  },
  "/videos": {
    title: "Video Library - Alkem Smile",
    description: "Educational videos, patient stories, and health awareness content.",
    keywords: "health education videos, patient stories, medical information"
  },
  "/photos": {
    title: "Photo Gallery - Alkem Smile",
    description: "Visual stories from our healthcare programs and community initiatives.",
    keywords: "healthcare photos, medical programs, community events"
  },
  "/experience": {
    title: "Patient Experience - Alkem Smile",
    description: "Real stories and testimonials from patients and volunteers.",
    keywords: "patient testimonials, healthcare experiences, success stories"
  },
  "/achievements": {
    title: "Our Achievements - Alkem Smile",
    description: "Awards, recognition, and milestones in our healthcare journey.",
    keywords: "healthcare awards, medical achievements, recognition"
  },
  "/guidelines": {
    title: "Guidelines & Standards - Alkem Smile",
    description: "Our healthcare guidelines, standards, and quality protocols.",
    keywords: "healthcare guidelines, medical standards, quality protocols"
  },
  "/contact": {
    title: "Contact Us - Alkem Smile",
    description: "Get in touch with our healthcare team for appointments and inquiries.",
    keywords: "contact healthcare, medical appointments, health inquiries"
  }
}

// TypeScript interfaces for navigation links and contact information
export interface NavLink {
  path: string;
  name: string;
  hasDropdown?: boolean;
  dropdownItems?: {
    path: string;
    name: string;
    description?: string;
  }[];
}

// Removed duplicate declaration of navLinks
// Removed duplicate declaration of contactInfo
// Removed duplicate declaration of isActiveDropdownPath