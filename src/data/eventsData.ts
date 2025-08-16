// Types for events data
export interface Event {
  id: number;
  title: string;
  objective: string;
  details: string[];
  date: string;
  time: string;
  venue: string;
  locations: string[];
  faqs: { q: string; a: string; }[];
  specialNote?: string;
}

export interface MonthData {
  year: string;
  events: Event[];
  isSpecial?: boolean;
}

// Events data organized by month
export const eventsByMonth: Record<string, MonthData> = {
  "April": {
    year: "2025",
    events: [
      {
        id: 1,
        title: "Bake and Bond – Cake Baking Workshop & Distribution at Orphanage",
        objective: "Engage employees in baking activity to bring joy to underprivileged children.",
        details: [
          "Employees participate in a cake-making workshop led by professional bakers.",
          "Cakes are decorated with positive messages and themes.",
          "Post-workshop, cakes to be distributed to underprivileged children.",
        ],
        date: "To be shared",
        time: "To be shared",
        venue: "To be shared",
        locations: ["Mumbai", "Taloja"],
        faqs: [
          { q: "Do I need prior baking experience?", a: "No, professionals will guide the session." },
          { q: "Do I get the certificate?", a: "Yes" },
        ],
      },
      {
        id: 11,
        title: "Earth Day Celebration – Community Garden Setup",
        objective: "Create sustainable community gardens to promote environmental awareness.",
        details: [
          "Set up small community gardens in local areas.",
          "Plant vegetables and herbs for community use.",
          "Educational session on sustainable gardening practices.",
        ],
        date: "22nd April 2025",
        time: "8:00 AM - 12:00 PM",
        venue: "Local Community Centers",
        locations: ["Mumbai", "Baddi", "Ankleshwar"],
        faqs: [
          { q: "Do I need gardening tools?", a: "No, all tools and materials will be provided." },
          { q: "Is this suitable for beginners?", a: "Yes, experts will guide throughout the activity." },
        ],
      }
    ]
  },
  "May": {
    year: "2025",
    events: [
      {
        id: 2,
        title: "Go Green – Seed Ball Making",
        objective: "Promote environmental awareness and encourage employees to contribute to a greener planet.",
        details: [
          "Employees will learn to make seed balls using eco-friendly materials.",
          "Seed balls will be distributed for plantation in various locations.",
          "Awareness session on the importance of native plants.",
        ],
        date: "To be shared",
        time: "To be shared",
        venue: "To be shared",
        locations: ["Baddi", "Ankleshwar", "Daman"],
        faqs: [
          { q: "Do I need prior experience?", a: "No, all instructions and materials will be provided." },
          { q: "Can I bring family members?", a: "Yes, family participation is encouraged." },
        ],
      }
    ]
  },
  "June": {
    year: "2025",
    events: [
      {
        id: 3,
        title: "Sign for Change – Anti-Child Labour Pledge (12th June)",
        objective: "Raise awareness about child labour and encourage employees to take a stand.",
        details: [
          "Employees sign a pledge against child labour.",
          "Awareness session on child rights and laws.",
          "Distribution of informative materials.",
        ],
        date: "12th June 2025",
        time: "To be shared",
        venue: "To be shared",
        locations: ["Mumbai", "Other"],
        faqs: [
          { q: "Is this an online or offline event?", a: "Both options will be available." },
          { q: "Will I receive a participation certificate?", a: "Yes." },
        ],
      },
      {
        id: 12,
        title: "World Environment Day – Beach Clean-up Drive",
        objective: "Protect marine life and raise awareness about ocean pollution.",
        details: [
          "Clean up beaches and coastal areas.",
          "Segregate collected waste for proper disposal.",
          "Awareness session on marine conservation.",
        ],
        date: "5th June 2025",
        time: "6:00 AM - 10:00 AM",
        venue: "Coastal Areas",
        locations: ["Mumbai", "Daman"],
        faqs: [
          { q: "Will safety equipment be provided?", a: "Yes, gloves and safety gear will be provided." },
          { q: "Is transportation arranged?", a: "Yes, transport from office to beach will be provided." },
        ],
      }
    ]
  },
  "July": {
    year: "2025",
    events: []
  },
  "August": {
    year: "2025",
    isSpecial: true,
    events: [
      {
        id: 4,
        title: "We Care Month – Multiple Activities",
        objective: "A month-long celebration of care and compassion through various volunteering activities.",
        details: ["Multiple activities scheduled throughout the month."],
        date: "All of August 2025",
        time: "Various times",
        venue: "Multiple venues",
        locations: ["All locations"],
        faqs: [],
        specialNote: "View detailed activities in 'We Care Month' section"
      }
    ]
  },
  "September": {
    year: "2025",
    events: [
      {
        id: 5,
        title: "Awarathon – Walk for Alzheimer's Awareness",
        objective: "Raise awareness and support for Alzheimer's disease through a community walk.",
        details: [
          "Participate in a walkathon to support Alzheimer's awareness.",
          "Information booths and support resources available.",
          "Family and friends are welcome.",
        ],
        date: "To be shared",
        time: "To be shared",
        venue: "To be shared",
        locations: ["Mumbai"],
        faqs: [
          { q: "Is there a registration fee?", a: "No, participation is free." },
        ],
      },
      {
        id: 13,
        title: "Digital Literacy for Elderly – Teaching Session",
        objective: "Help elderly people learn basic digital skills and technology usage.",
        details: [
          "Teach basic smartphone and computer usage.",
          "Help with internet banking and online services.",
          "One-on-one guidance sessions.",
        ],
        date: "To be shared",
        time: "2:00 PM - 5:00 PM",
        venue: "Community Centers",
        locations: ["Mumbai", "Baddi"],
        faqs: [
          { q: "Do I need teaching experience?", a: "No, patience and willingness to help is enough." },
          { q: "What devices are needed?", a: "Devices will be provided by the organization." },
        ],
      }
    ]
  },
  "October": {
    year: "2025",
    events: [
      {
        id: 6,
        title: "Diya Sale/Exhibition",
        objective: "Support local artisans and promote traditional crafts.",
        details: [
          "Handmade diyas will be exhibited and sold.",
          "Proceeds go to community welfare projects.",
          "Workshops on diya painting and decoration.",
        ],
        date: "To be shared",
        time: "To be shared",
        venue: "To be shared",
        locations: ["Mumbai", "Other"],
        faqs: [
          {
            q: "Can I buy diyas online?",
            a: "Yes, online purchase options will be available.",
          },
        ],
      }
    ]
  },
  "November": {
    year: "2025",
    events: []
  },
  "December": {
    year: "2025",
    events: [
      {
        id: 7,
        title: "Voices Against AIDS – Signature Campaign",
        objective: "Raise awareness about AIDS and promote prevention through a signature campaign.",
        details: [
          "Employees sign a pledge to support AIDS awareness.",
          "Distribution of educational materials.",
          "Interactive sessions with health experts.",
        ],
        date: "To be shared",
        time: "To be shared",
        venue: "To be shared",
        locations: ["Mumbai", "Baddi"],
        faqs: [
          {
            q: "Is this event open to family?",
            a: "Yes, family and friends can join.",
          },
        ],
      },
      {
        id: 14,
        title: "Winter Warmth Drive – Blanket Distribution",
        objective: "Provide warmth and comfort to underprivileged communities during winter.",
        details: [
          "Distribute blankets to homeless and needy people.",
          "Organize warm food distribution.",
          "Community outreach and support programs.",
        ],
        date: "To be shared",
        time: "10:00 AM - 4:00 PM",
        venue: "Various Locations",
        locations: ["Mumbai", "Baddi", "Other"],
        faqs: [
          {
            q: "Can I donate my own blankets?",
            a: "Yes, personal donations are welcome and appreciated.",
          },
          {
            q: "Is there a minimum time commitment?",
            a: "No, you can participate for any duration that suits you.",
          },
        ],
      }
    ]
  },
  "January": {
    year: "2026",
    events: [
      {
        id: 8,
        title: "Beyond Boundaries – Sports Day with the Differently Abled",
        objective: "Promote inclusivity and celebrate abilities through sports.",
        details: [
          "Sports events with differently abled participants.",
          "Volunteers assist and cheer participants.",
          "Medals and certificates for all.",
        ],
        date: "To be shared",
        time: "To be shared",
        venue: "To be shared",
        locations: ["Mumbai"],
        faqs: [
          {
            q: "Do I need sports experience?",
            a: "No, just enthusiasm and willingness to help.",
          },
        ],
      }
    ]
  },
  "February": {
    year: "2026",
    events: [
      {
        id: 9,
        title: "Blue Planet Warriors – Mangrove Cleanup Drive",
        objective: "Protect the environment by cleaning and restoring mangrove areas.",
        details: [
          "Volunteers participate in cleaning mangrove sites.",
          "Awareness session on importance of mangroves.",
          "Protective gear will be provided.",
        ],
        date: "To be shared",
        time: "To be shared",
        venue: "To be shared",
        locations: ["Mumbai", "Daman"],
        faqs: [
          {
            q: "Is transport provided?",
            a: "Yes, transport from office to site will be arranged.",
          },
        ],
      }
    ]
  },
  "March": {
    year: "2026",
    events: [
      {
        id: 10,
        title: "Brush for a Cause – Wall Painting for Social Awareness",
        objective: "Spread social messages through creative wall painting.",
        details: [
          "Volunteers paint walls with social awareness themes.",
          "Guidance from professional artists.",
          "All materials provided.",
        ],
        date: "To be shared",
        time: "To be shared",
        venue: "To be shared",
        locations: ["Mumbai", "Taloja"],
        faqs: [
          {
            q: "Do I need to know painting?",
            a: "No, all skill levels are welcome.",
          },
        ],
      }
    ]
  },
};

// Utility functions for events data
export const getAllEvents = (): Event[] => {
  const allEvents: Event[] = [];
  Object.values(eventsByMonth).forEach(monthData => {
    allEvents.push(...monthData.events);
  });
  return allEvents;
};

export const getEventById = (id: number): Event | undefined => {
  return getAllEvents().find(event => event.id === id);
};

export const getEventsByLocation = (location: string): Event[] => {
  return getAllEvents().filter(event => 
    event.locations.includes(location)
  );
};

export const getEventsByYear = (year: string): Event[] => {
  const events: Event[] = [];
  Object.values(eventsByMonth).forEach(monthData => {
    if (monthData.year === year) {
      events.push(...monthData.events);
    }
  });
  return events;
};

export const getUpcomingEvents = (limit?: number): Event[] => {
  const upcoming = getAllEvents().filter(event => {
    // For now, return all events since most have "To be shared" dates
    // In future, you can implement proper date comparison
    return event.date !== "To be shared" || true;
  });
  
  return limit ? upcoming.slice(0, limit) : upcoming;
};

export const getMonthsWithEvents = (): string[] => {
  return Object.keys(eventsByMonth).filter(month => 
    eventsByMonth[month].events.length > 0
  );
};

export const getEventCount = (): number => {
  return getAllEvents().length;
};

export const getLocations = (): string[] => {
  const locations = new Set<string>();
  getAllEvents().forEach(event => {
    event.locations.forEach(location => locations.add(location));
  });
  return Array.from(locations).sort();
};