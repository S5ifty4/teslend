import { TeslaModel, AccessoryCategory } from './constants';

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  created_at: string;
}

export interface Listing {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  tesla_model: TeslaModel;
  category: AccessoryCategory;
  daily_price: number;
  condition: 'Like New' | 'Good' | 'Fair';
  city: string;
  zip_code: string;
  images: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
  users?: User;
}

export interface ListingFormData {
  title: string;
  description: string;
  tesla_model: TeslaModel;
  category: AccessoryCategory;
  daily_price: number;
  condition: 'Like New' | 'Good' | 'Fair';
  city: string;
  zip_code: string;
}
