import { StoreData, Program, Event, BlogPost, GalleryItem, Report, SiteSettings, Volunteer, Donation, ContactInquiry } from '../types';

const STORAGE_KEY = 'jati_foundation_db';

const SEED_DATA: StoreData = {
  settings: {
    mission: "To empower the underprivileged through education, healthcare, and sustainable livelihood opportunities.",
    vision: "A society where every individual has the opportunity to live with dignity and hope.",
    heroText: "Empowering Communities, Transforming Lives in Odisha.",
    stats: {
      beneficiaries: 12500,
      villages: 45,
      volunteers: 320,
      meals: 50000
    }
  },
  programs: [
    {
      id: 'p1',
      title: 'Education for All',
      category: 'Education',
      shortDescription: 'Providing study materials and tuition to underprivileged children.',
      fullDescription: 'Our Education for All initiative focuses on bridging the gap for children in rural Salipur. We provide free textbooks, uniforms, and after-school tuition centers to ensure no child drops out due to financial constraints.',
      beneficiaries: 'Children aged 5-15',
      location: 'Salipur & surrounding villages',
      image: 'https://picsum.photos/800/600?random=1',
      active: true
    },
    {
      id: 'p2',
      title: 'Rural Health Camps',
      category: 'Health',
      shortDescription: 'Free medical checkups and medicine distribution in remote areas.',
      fullDescription: 'We organize monthly health camps bringing doctors from Cuttack to remote villages. Services include general checkups, eye exams, and free distribution of essential medicines.',
      beneficiaries: 'Elderly and Low-income families',
      location: 'Cuttack District',
      image: 'https://picsum.photos/800/600?random=2',
      active: true
    },
    {
      id: 'p3',
      title: 'Women Empowerment',
      category: 'Women Empowerment',
      shortDescription: 'Skill development and self-help group formation for women.',
      fullDescription: 'Training women in stitching, handicraft, and food processing to help them achieve financial independence. We also assist in forming Self Help Groups (SHGs).',
      beneficiaries: 'Rural Women',
      location: 'Sapanpur',
      image: 'https://picsum.photos/800/600?random=3',
      active: true
    },
    {
      id: 'p4',
      title: 'Disaster Relief',
      category: 'Disaster Relief',
      shortDescription: 'Emergency food and shelter support during cyclones and floods.',
      fullDescription: 'Odisha is prone to natural calamities. We maintain a reserve of dry food, tarpaulins, and medicines to deploy immediately when disaster strikes.',
      beneficiaries: 'Disaster Victims',
      location: 'Coastal Odisha',
      image: 'https://picsum.photos/800/600?random=4',
      active: true
    }
  ],
  events: [
    {
      id: 'e1',
      title: 'Annual Charity Gala',
      date: '2023-12-15',
      location: 'Community Hall, Salipur',
      shortDescription: 'Celebrating our yearly achievements and fundraising.',
      fullDescription: 'A night of culture and giving. Join us as we celebrate the milestones achieved this year and pledge support for the next.',
      image: 'https://picsum.photos/800/600?random=5'
    },
    {
      id: 'e2',
      title: 'Mega Health Camp',
      date: '2024-01-20',
      location: 'St. Xavier School Grounds',
      shortDescription: 'Free eye and dental checkup for 500+ villagers.',
      fullDescription: 'Partnering with local hospitals to provide comprehensive care.',
      image: 'https://picsum.photos/800/600?random=6'
    }
  ],
  blogPosts: [
    {
      id: 'b1',
      title: 'The Joy of Giving: Winter Drive 2023',
      slug: 'winter-drive-2023',
      date: '2023-11-01',
      author: 'Admin',
      excerpt: 'How we distributed 500 blankets to the homeless in Cuttack.',
      content: 'This winter, the Jati Welfare Foundation team took to the streets...',
      image: 'https://picsum.photos/800/600?random=7',
      imageAlt: 'Volunteers distributing blankets to the homeless'
    },
    {
      id: 'b2',
      title: 'Educating the Future',
      slug: 'educating-future',
      date: '2023-10-15',
      author: 'Ramesh Das',
      excerpt: 'Success stories from our evening tuition centers.',
      content: 'Meet Priya, a bright student from Sapanpur who recently topped her class...',
      image: 'https://picsum.photos/800/600?random=8',
      imageAlt: 'Students studying in a tuition center'
    }
  ],
  gallery: [
    { id: 'g1', imageUrl: 'https://picsum.photos/400/300?random=9', caption: 'Food Distribution', category: 'Relief' },
    { id: 'g2', imageUrl: 'https://picsum.photos/400/300?random=10', caption: 'Classroom Session', category: 'Education' },
    { id: 'g3', imageUrl: 'https://picsum.photos/400/300?random=11', caption: 'Medical Checkup', category: 'Health' },
  ],
  reports: [
    { id: 'r1', title: 'Annual Report 2022-23', year: '2023', description: 'Financials and Impact assessment.', fileUrl: '#' },
    { id: 'r2', title: 'Audit Statement 2022', year: '2022', description: 'Audited financial accounts.', fileUrl: '#' }
  ],
  volunteers: [],
  donations: [],
  inquiries: []
};

// Initialize Storage
const initStorage = () => {
  if (typeof window === 'undefined') return;
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
  }
};

initStorage();

// Generic Getter/Setter
export const getStore = (): StoreData => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : SEED_DATA;
};

export const setStore = (data: StoreData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  // Dispatch event for reactive updates across components if needed, 
  // though simple React state reload on focus/mount is often enough for this scale.
  window.dispatchEvent(new Event('storage-update'));
};

// Helpers
export const getSettings = () => getStore().settings;
export const updateSettings = (settings: SiteSettings) => {
  const store = getStore();
  store.settings = settings;
  setStore(store);
};

export const addDonation = (donation: Omit<Donation, 'id' | 'date'>) => {
  const store = getStore();
  const newDonation: Donation = {
    ...donation,
    id: Date.now().toString(),
    date: new Date().toISOString()
  };
  store.donations.unshift(newDonation);
  setStore(store);
};

export const addVolunteer = (volunteer: Omit<Volunteer, 'id' | 'submittedAt' | 'status'>) => {
  const store = getStore();
  const newVol: Volunteer = {
    ...volunteer,
    id: Date.now().toString(),
    submittedAt: new Date().toISOString(),
    status: 'New'
  };
  store.volunteers.unshift(newVol);
  setStore(store);
};

export const addInquiry = (inquiry: Omit<ContactInquiry, 'id' | 'date' | 'status'>) => {
  const store = getStore();
  const newInq: ContactInquiry = {
    ...inquiry,
    id: Date.now().toString(),
    date: new Date().toISOString(),
    status: 'Pending'
  };
  store.inquiries.unshift(newInq);
  setStore(store);
};

// Generic CRUD Helper
export const createItem = <T>(key: keyof StoreData, item: T) => {
  const store = getStore();
  (store[key] as any[]).unshift(item);
  setStore(store);
};

export const updateItem = <T extends { id: string }>(key: keyof StoreData, item: T) => {
  const store = getStore();
  const list = store[key] as any[];
  const index = list.findIndex(i => i.id === item.id);
  if (index !== -1) {
    list[index] = item;
    setStore(store);
  }
};

export const deleteItem = (key: keyof StoreData, id: string) => {
  const store = getStore();
  const list = store[key] as any[];
  const filtered = list.filter(i => i.id !== id);
  (store as any)[key] = filtered;
  setStore(store);
};