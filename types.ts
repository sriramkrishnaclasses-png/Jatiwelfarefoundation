export type ProgramCategory = 'Education' | 'Health' | 'Women Empowerment' | 'Disaster Relief' | 'General';

export interface Program {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: ProgramCategory;
  beneficiaries: string;
  location: string;
  image: string;
  active: boolean;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  shortDescription: string;
  fullDescription: string;
  image?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  author: string;
  excerpt: string;
  content: string;
  image?: string;
  imageAlt?: string;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  category: string;
}

export interface Report {
  id: string;
  title: string;
  year: string;
  description: string;
  fileUrl: string;
}

export interface Volunteer {
  id: string;
  name: string;
  age: number;
  phone: string;
  email: string;
  city: string;
  interest: string;
  availability: string;
  status: 'New' | 'Contacted' | 'Active' | 'Rejected';
  submittedAt: string;
}

export interface Donation {
  id: string;
  donorName: string;
  email: string;
  phone: string;
  amount: number;
  purpose: string;
  date: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'Pending' | 'Resolved';
  date: string;
}

export interface SiteSettings {
  mission: string;
  vision: string;
  heroText: string;
  stats: {
    beneficiaries: number;
    villages: number;
    volunteers: number;
    meals: number;
  };
}

export interface StoreData {
  programs: Program[];
  events: Event[];
  blogPosts: BlogPost[];
  gallery: GalleryItem[];
  reports: Report[];
  volunteers: Volunteer[];
  donations: Donation[];
  inquiries: ContactInquiry[];
  settings: SiteSettings;
}