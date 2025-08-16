// Types for We Care Month events
export interface WeCareEvent {
  date: string;
  endDate?: string;
  title: string;
  locations: string;
  color: string;
  displayDate?: string;
}

export interface WeCareEventDetails {
  objective: string;
  details: string[];
  time: string;
  venue: string;
  faqs: { q: string; a: string; }[];
}

// We Care Month 2025 calendar events
export const weCareEvents: WeCareEvent[] = [
  {
    date: "2025-08-01",
    endDate: "2025-08-30",
    title: "Joy of Giving",
    locations: "Mumbai, Taloja, Sikkim, Baddi, Ankleshwar, Daman",
    color: "orange",
  },
  {
    date: "2025-08-01",
    endDate: "2025-08-30",
    title: "Audio Book Recording",
    locations: "Mumbai",
    color: "purple",
  },
  {
    date: "2025-08-04",
    title: "Rakhi Sale/Exhibition",
    locations: "Mumbai, Taloja",
    color: "orange",
  },
  {
    date: "2025-08-07",
    title: "Blood Donation",
    locations: "All Locations",
    color: "purple",
  },
  {
    date: "2025-08-11",
    endDate: "2025-08-13",
    title: "Food Distribution Drive",
    locations: "Mumbai",
    color: "orange",
  },
  {
    date: "2025-08-18",
    endDate: "2025-08-22",
    title: "Food Distribution Drive",
    locations: "Mumbai",
    color: "orange",
  },
  {
    date: "2025-08-12",
    title: "Cleanliness Drive",
    locations: "Taloja, Sikkim, Baddi, Ankleshwar, Daman",
    color: "purple",
  },
  {
    date: "2025-08-14",
    title: "Organ Donation Awareness Drive",
    locations: "All Locations",
    color: "orange",
  },
  {
    date: "2025-08-19",
    title: "Visit to Old Age Home",
    locations: "Taloja",
    color: "purple",
  },
  {
    date: "2025-08-19",
    title: "Women NGO Exhibition (via SHG)",
    locations: "Ankleshwar",
    color: "orange",
  },
  {
    date: "2025-08-20",
    title: "Visit to Dharavi",
    locations: "Mumbai",
    color: "purple",
  },
  {
    date: "2025-08-21",
    title: "Mass Plantation Drive",
    locations: "Mumbai",
    color: "orange",
  },
  {
    date: "2025-08-22",
    title: "First Aid & Emergency Response Training",
    locations: "Mumbai",
    color: "purple",
  },
  {
    date: "2025-08-30",
    title: "Beach Cleaning Drive",
    locations: "Mumbai",
    color: "orange",
  },
];

// Detailed information for each We Care Month event
export const weCareEventDetails: Record<string, WeCareEventDetails> = {
  "Rakhi Sale/Exhibition": {
    objective: "Support local artisans and celebrate the festival of Rakhi through community engagement.",
    details: [
      "Handmade Rakhis will be exhibited and sold",
      "Proceeds go to community welfare projects",
      "Workshops on Rakhi making and decoration",
      "Cultural activities and traditional celebrations"
    ],
    time: "10:00 AM - 6:00 PM",
    venue: "Community Centers & Office Premises",
    faqs: [
      { q: "Can I participate in Rakhi making?", a: "Yes, workshops will be conducted for interested participants." },
      { q: "Are the Rakhis handmade?", a: "Yes, all Rakhis are crafted by local artisans and community members." }
    ]
  },
  "Blood Donation": {
    objective: "Save lives by donating blood and creating awareness about voluntary blood donation.",
    details: [
      "Medical screening and health checkup",
      "Safe and hygienic blood collection process",
      "Refreshments and certificates for donors",
      "Awareness session on importance of blood donation"
    ],
    time: "9:00 AM - 4:00 PM",
    venue: "Office Premises & Healthcare Centers",
    faqs: [
      { q: "What are the eligibility criteria?", a: "Age 18-65, weight above 50kg, and good health condition." },
      { q: "Is it safe to donate blood?", a: "Yes, sterile equipment and medical supervision ensure complete safety." }
    ]
  },
  "Food Distribution Drive": {
    objective: "Provide nutritious meals to underprivileged communities and reduce food wastage.",
    details: [
      "Distribution of freshly prepared meals",
      "Focus on nutritious and balanced diet",
      "Serving underprivileged families and children",
      "Coordination with local NGOs and communities"
    ],
    time: "12:00 PM - 3:00 PM",
    venue: "Community Areas & Slum Localities",
    faqs: [
      { q: "How can I volunteer?", a: "Register through the volunteer form and join our distribution team." },
      { q: "What type of food is distributed?", a: "Freshly prepared nutritious meals including rice, dal, vegetables, and fruits." }
    ]
  },
  "Cleanliness Drive": {
    objective: "Promote environmental cleanliness and community hygiene through collective action.",
    details: [
      "Cleaning of public spaces and community areas",
      "Waste segregation and proper disposal",
      "Awareness on cleanliness and hygiene",
      "Distribution of cleaning supplies and equipment"
    ],
    time: "7:00 AM - 11:00 AM",
    venue: "Public Spaces & Community Areas",
    faqs: [
      { q: "What should I bring?", a: "Just bring your enthusiasm! All cleaning supplies will be provided." },
      { q: "Is this suitable for families?", a: "Yes, family participation is encouraged for community building." }
    ]
  },
  "Organ Donation Awareness Drive": {
    objective: "Create awareness about organ donation and encourage people to pledge for this noble cause.",
    details: [
      "Educational sessions on organ donation",
      "Myth-busting and awareness campaigns",
      "Organ donation pledge registration",
      "Distribution of informative materials"
    ],
    time: "10:00 AM - 4:00 PM",
    venue: "Public Areas & Healthcare Centers",
    faqs: [
      { q: "How do I pledge for organ donation?", a: "Fill the pledge form and receive your donor card during the drive." },
      { q: "Is there any age limit?", a: "Anyone above 18 years can pledge. Medical suitability is determined at the time of donation." }
    ]
  },
  "Visit to Old Age Home": {
    objective: "Spend quality time with elderly residents and bring joy to their lives.",
    details: [
      "Interactive sessions with elderly residents",
      "Cultural activities and entertainment programs",
      "Distribution of essential items and gifts",
      "Health checkup and basic medical assistance"
    ],
    time: "2:00 PM - 5:00 PM",
    venue: "Local Old Age Homes",
    faqs: [
      { q: "What can I bring for the elderly?", a: "Books, fruits, warm clothes, or just your time and company." },
      { q: "Can children participate?", a: "Yes, children can join for cultural activities and interaction." }
    ]
  },
  "Women NGO Exhibition (via SHG)": {
    objective: "Support women entrepreneurs and showcase products made by Self Help Groups.",
    details: [
      "Exhibition of handmade products by women SHGs",
      "Direct purchase to support women entrepreneurs",
      "Workshops on skill development",
      "Networking opportunities for women"
    ],
    time: "10:00 AM - 6:00 PM",
    venue: "Exhibition Halls & Community Centers",
    faqs: [
      { q: "What products will be available?", a: "Handicrafts, textiles, food items, and various handmade products." },
      { q: "How does purchasing help?", a: "Direct purchase supports women entrepreneurs and their families financially." }
    ]
  },
  "Visit to Dharavi": {
    objective: "Engage with the Dharavi community and support local development initiatives.",
    details: [
      "Community interaction and support programs",
      "Educational activities for children",
      "Distribution of essential supplies",
      "Understanding community needs and challenges"
    ],
    time: "9:00 AM - 2:00 PM",
    venue: "Dharavi Community Areas",
    faqs: [
      { q: "What activities are planned?", a: "Educational support, community interaction, and need assessment programs." },
      { q: "Is it safe to visit?", a: "Yes, organized visits with proper coordination and safety measures." }
    ]
  },
  "Mass Plantation Drive": {
    objective: "Contribute to environmental conservation through large-scale tree plantation.",
    details: [
      "Planting native trees and saplings",
      "Environmental awareness sessions",
      "Adoption of planted trees for care",
      "Creating green spaces in urban areas"
    ],
    time: "6:00 AM - 10:00 AM",
    venue: "Parks, Open Spaces & Hill Areas",
    faqs: [
      { q: "What trees will be planted?", a: "Native species suitable for the local climate and environment." },
      { q: "Can I adopt a tree?", a: "Yes, participants can adopt trees and receive updates on their growth." }
    ]
  },
  "First Aid & Emergency Response Training": {
    objective: "Empower participants with life-saving first aid and emergency response skills.",
    details: [
      "Basic first aid techniques training",
      "CPR and emergency response procedures",
      "Hands-on practice with medical equipment",
      "Certification upon completion"
    ],
    time: "10:00 AM - 4:00 PM",
    venue: "Training Centers & Office Premises",
    faqs: [
      { q: "Will I get a certificate?", a: "Yes, participants receive a first aid certification upon successful completion." },
      { q: "Is prior experience required?", a: "No prior experience needed. Training starts from basic level." }
    ]
  },
  "Beach Cleaning Drive": {
    objective: "Protect marine ecosystems by cleaning beaches and raising environmental awareness.",
    details: [
      "Cleaning beaches and coastal areas",
      "Waste segregation and proper disposal",
      "Marine conservation awareness",
      "Community engagement in environmental protection"
    ],
    time: "6:00 AM - 10:00 AM",
    venue: "Coastal Beaches",
    faqs: [
      { q: "What should I wear?", a: "Comfortable clothes, closed shoes, and sun protection. Gloves will be provided." },
      { q: "Is transportation provided?", a: "Yes, transport arrangements will be made from designated pickup points." }
    ]
  },
  "Joy of Giving": {
    objective: "Spread joy and happiness through various giving initiatives throughout the month.",
    details: [
      "Month-long giving campaign",
      "Distribution of essential items to needy",
      "Community support programs",
      "Donation drives for various causes"
    ],
    time: "Throughout the month",
    venue: "Multiple locations",
    faqs: [
      { q: "How can I contribute?", a: "Multiple ways to contribute including donations, volunteering, and spreading awareness." },
      { q: "What items can be donated?", a: "Clothes, books, toys, food items, and other essential goods." }
    ]
  },
  "Audio Book Recording": {
    objective: "Create audio books for visually impaired individuals to promote inclusive education.",
    details: [
      "Recording of educational and story books",
      "Professional voice training sessions",
      "Collaboration with institutions for the visually impaired",
      "Digital library creation for accessibility"
    ],
    time: "Flexible timings",
    venue: "Recording Studios & Office Premises",
    faqs: [
      { q: "Do I need a good voice?", a: "Clear pronunciation and willingness to help is more important than a 'good' voice." },
      { q: "How long is each recording session?", a: "Sessions typically last 1-2 hours depending on content." }
    ]
  }
};

// Color scheme for calendar display
export const legendColors: string[] = [
  "bg-orange-500",
  "bg-indigo-500",
  "bg-green-500",
  "bg-pink-500",
  "bg-yellow-500",
  "bg-teal-500",
  "bg-red-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-amber-500",
  "bg-cyan-500",
  "bg-lime-500",
  "bg-fuchsia-500",
  "bg-rose-500",
];

// Utility functions for We Care events
export const getFilteredEvents = (): WeCareEvent[] => {
  return weCareEvents.filter(
    (e) => e.title !== "Joy of Giving" && e.title !== "Audio Book Recording"
  );
};

export const getUniqueEvents = (): (WeCareEvent & { displayDate: string })[] => {
  return getFilteredEvents().map((event) => ({
    ...event,
    displayDate: event.endDate
      ? `${parseInt(event.date.slice(8, 10))}${event.endDate ? `–${parseInt(event.endDate.slice(8, 10))}` : ""}`
      : `${parseInt(event.date.slice(8, 10))}`,
  }));
};

export const getEventDetails = (title: string): WeCareEventDetails => {
  return weCareEventDetails[title] || {
    objective: "Join us for this meaningful community activity.",
    details: ["Details will be shared closer to the event date."],
    time: "To be announced",
    venue: "To be announced",
    faqs: []
  };
};

export const getColorForActivity = (() => {
  const colorMap: Record<string, string> = {};
  let colorIdx = 0;
  return (title: string) => {
    if (!colorMap[title]) {
      colorMap[title] = legendColors[colorIdx % legendColors.length];
      colorIdx++;
    }
    return colorMap[title];
  };
})();

export const formatEventDate = (event: WeCareEvent): string => {
  const startDate = new Date(event.date);
  const formattedStart = startDate.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
  
  if (event.endDate) {
    const endDate = new Date(event.endDate);
    const formattedEnd = endDate.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
    return `${formattedStart} - ${formattedEnd}`;
  }
  
  return formattedStart;
};

// Get events by location
export const getEventsByLocation = (location: string): WeCareEvent[] => {
  return weCareEvents.filter(event => 
    event.locations.toLowerCase().includes(location.toLowerCase()) ||
    event.locations.includes("All Locations")
  );
};

// Get events by date range
export const getEventsByDateRange = (startDate: string, endDate: string): WeCareEvent[] => {
  return weCareEvents.filter(event => {
    const eventDate = new Date(event.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return eventDate >= start && eventDate <= end;
  });
};

// Get all unique locations
export const getAllLocations = (): string[] => {
  const locations = new Set<string>();
  weCareEvents.forEach(event => {
    event.locations.split(", ").forEach(location => {
      locations.add(location.trim());
    });
  });
  return Array.from(locations).sort();
};