import { AccessoryCategory } from './constants';

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  phone: string | null;
  tesla_model: string | null;
  tesla_year: number | null;
  profile_completed: boolean;
  created_at: string;
}

export interface Listing {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  tesla_model: string;
  category: AccessoryCategory;
  daily_price: number;
  condition: 'Like New' | 'Good' | 'Fair';
  city: string;
  zip_code: string;
  images: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
  master_accessory_id?: string | null;
  master_accessory?: Partial<MasterAccessory>;
  users?: Partial<User>;
}

export interface Inquiry {
  id: string;
  listing_id: string;
  requester_id: string;
  start_date: string;
  end_date: string;
  tesla_model: string;
  tesla_year: number | null;
  phone: string;
  note: string | null;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
}

export interface MasterAccessory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  tesla_price: number | null;
  tesla_url: string | null;
  image_url: string | null;
  compatibility: string[];
  category: string | null;
  active: boolean;
  created_at: string;
  listing_count?: number;
}

export interface ListingFormData {
  title: string;
  description: string;
  tesla_model: string;
  category: AccessoryCategory;
  daily_price: number;
  condition: 'Like New' | 'Good' | 'Fair';
  city: string;
  zip_code: string;
  master_accessory_id?: string | null;
}
