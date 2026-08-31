// Sample data + localStorage persistence for Ale Brokering

const DEFAULT_LISTINGS = [
  {
    id: 1,
    title: "Modern Villa in Bole",
    type: "villa",
    purpose: "sale",
    price: 25000000,
    location: "Bole, Addis Ababa",
    bedrooms: 5,
    bathrooms: 4,
    area: 450,
    description: "Luxurious modern villa with spacious garden, swimming pool, and 24/7 security. Fully furnished with high-end finishes.",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop",
    status: "approved",
    userId: "admin",
    userName: "Admin",
    phone: "+251911000001",
    createdAt: "2026-08-15"
  },
  {
    id: 2,
    title: "Spacious Condominium - CMC",
    type: "condo",
    purpose: "rent",
    price: 45000,
    location: "CMC, Addis Ababa",
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    description: "Bright 3-bedroom condominium with modern kitchen, balcony, and parking. Close to schools and shopping centers.",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
    status: "approved",
    userId: "admin",
    userName: "Admin",
    phone: "+251911000001",
    createdAt: "2026-08-18"
  },
  {
    id: 3,
    title: "Commercial Store - Piazza",
    type: "store",
    purpose: "rent",
    price: 80000,
    location: "Piazza, Addis Ababa",
    bedrooms: 0,
    bathrooms: 1,
    area: 120,
    description: "Prime location commercial store suitable for retail or cafe. High foot traffic area.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop",
    status: "approved",
    userId: "admin",
    userName: "Admin",
    phone: "+251911000001",
    createdAt: "2026-08-20"
  },
  {
    id: 4,
    title: "Residential Land - Lebu",
    type: "land",
    purpose: "sale",
    price: 8500000,
    location: "Lebu, Addis Ababa",
    bedrooms: 0,
    bathrooms: 0,
    area: 500,
    description: "500 sqm residential land with clear title deed. Ready for construction. Quiet neighborhood.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed75088?w=600&h=400&fit=crop",
    status: "approved",
    userId: "admin",
    userName: "Admin",
    phone: "+251911000001",
    createdAt: "2026-08-22"
  },
  {
    id: 5,
    title: "Guest House - Kazanchis",
    type: "guest_house",
    purpose: "sale",
    price: 18000000,
    location: "Kazanchis, Addis Ababa",
    bedrooms: 8,
    bathrooms: 6,
    area: 320,
    description: "Fully operational guest house with 8 rooms, restaurant, and parking. Great investment opportunity.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
    status: "approved",
    userId: "admin",
    userName: "Admin",
    phone: "+251911000001",
    createdAt: "2026-08-25"
  },
  {
    id: 6,
    title: "Office Building - Mexico",
    type: "building",
    purpose: "sale",
    price: 65000000,
    location: "Mexico Square, Addis Ababa",
    bedrooms: 0,
    bathrooms: 10,
    area: 1200,
    description: "6-story commercial building with elevators, parking, and modern facilities. Ideal for offices or mixed use.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
    status: "approved",
    userId: "admin",
    userName: "Admin",
    phone: "+251911000001",
    createdAt: "2026-08-28"
  }
];

const DEFAULT_WANTED = [
  {
    id: 1,
    title: "Looking for 3-bedroom apartment in Bole",
    purpose: "rent",
    type: "condo",
    maxPrice: 50000,
    location: "Bole, Addis Ababa",
    bedrooms: 3,
    description: "Need a clean 3-bedroom apartment near Bole Medhanialem. Prefer furnished. Budget up to 50,000 ETB/month.",
    userId: "user1",
    userName: "Abebe Kebede",
    phone: "+251911111111",
    status: "active",
    createdAt: "2026-08-26"
  },
  {
    id: 2,
    title: "Want to buy land in outskirts",
    purpose: "sale",
    type: "land",
    maxPrice: 5000000,
    location: "Outside Addis Ababa",
    bedrooms: 0,
    description: "Looking for 300-600 sqm land within 30km of Addis for residential construction. Clear title required.",
    userId: "user2",
    userName: "Sara Hailu",
    phone: "+251922222222",
    status: "active",
    createdAt: "2026-08-27"
  }
];

const DEFAULT_PROJECTS = [
  {
    id: 1,
    title: "Bole Skyline Residences",
    description: "Luxury residential complex with 120 units, swimming pool, gym, and shopping arcade. Phase 1 under construction.",
    location: "Bole, Addis Ababa",
    status: "ongoing",
    budget: "850,000,000 ETB",
    startDate: "2025-11",
    expectedEnd: "2027-06",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop",
    neededExperts: ["Civil Engineer", "Architect", "Project Manager"]
  },
  {
    id: 2,
    title: "Lebu Business Park",
    description: "Modern business park with office blocks, conference center, and retail spaces.",
    location: "Lebu, Addis Ababa",
    status: "planning",
    budget: "1,200,000,000 ETB",
    startDate: "2026-09",
    expectedEnd: "2029-12",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
    neededExperts: ["Structural Engineer", "MEP Engineer", "Quantity Surveyor"]
  }
];

const DEFAULT_EXPERTS = [
  {
    id: 1,
    name: "Dr. Tadesse Alemu",
    title: "Senior Civil Engineer",
    experience: "15 years",
    specialties: ["Structural Design", "Project Management"],
    location: "Addis Ababa",
    phone: "+251933333333",
    email: "tadesse@example.com",
    bio: "Experienced civil engineer specializing in high-rise buildings and residential complexes.",
    avatar: "https://ui-avatars.com/api/?name=Tadesse+Alemu&background=0A2540&color=fff"
  },
  {
    id: 2,
    name: "Eng. Meron Bekele",
    title: "Architect",
    experience: "10 years",
    specialties: ["Residential Design", "Interior Architecture"],
    location: "Addis Ababa",
    phone: "+251944444444",
    email: "meron@example.com",
    bio: "Creative architect with award-winning residential and commercial projects.",
    avatar: "https://ui-avatars.com/api/?name=Meron+Bekele&background=0A2540&color=fff"
  }
];

// Storage helpers
function getListings() {
  const data = localStorage.getItem('ale_listings');
  if (!data) {
    localStorage.setItem('ale_listings', JSON.stringify(DEFAULT_LISTINGS));
    return DEFAULT_LISTINGS;
  }
  return JSON.parse(data);
}

function saveListings(listings) {
  localStorage.setItem('ale_listings', JSON.stringify(listings));
}

function getWanted() {
  const data = localStorage.getItem('ale_wanted');
  if (!data) {
    localStorage.setItem('ale_wanted', JSON.stringify(DEFAULT_WANTED));
    return DEFAULT_WANTED;
  }
  return JSON.parse(data);
}

function saveWanted(wanted) {
  localStorage.setItem('ale_wanted', JSON.stringify(wanted));
}

function getProjects() {
  const data = localStorage.getItem('ale_projects');
  if (!data) {
    localStorage.setItem('ale_projects', JSON.stringify(DEFAULT_PROJECTS));
    return DEFAULT_PROJECTS;
  }
  return JSON.parse(data);
}

function getExperts() {
  const data = localStorage.getItem('ale_experts');
  if (!data) {
    localStorage.setItem('ale_experts', JSON.stringify(DEFAULT_EXPERTS));
    return DEFAULT_EXPERTS;
  }
  return JSON.parse(data);
}

function getUsers() {
  const data = localStorage.getItem('ale_users');
  if (!data) {
    const defaultUsers = [
      { id: 'admin', name: 'Admin User', email: 'admin@alebrokering.com', password: 'admin123', role: 'admin', phone: '+251911000000' }
    ];
    localStorage.setItem('ale_users', JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return JSON.parse(data);
}

function saveUsers(users) {
  localStorage.setItem('ale_users', JSON.stringify(users));
}

function getCurrentUser() {
  const data = localStorage.getItem('ale_current_user');
  return data ? JSON.parse(data) : null;
}

function setCurrentUser(user) {
  if (user) localStorage.setItem('ale_current_user', JSON.stringify(user));
  else localStorage.removeItem('ale_current_user');
}

function formatPrice(price) {
  return new Intl.NumberFormat('en-ET').format(price) + ' ETB';
}

function getTypeLabel(type) {
  const labels = {
    property: 'Property',
    villa: 'Villa',
    condo: 'Condominium',
    guest_house: 'Guest House',
    land: 'Land',
    store: 'Store',
    building: 'Building'
  };
  return labels[type] || type;
}
