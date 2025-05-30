export interface Hotel {
  id: string;
  name: string;
  location: string;
  image: string;
  prices: {
    website: string;
    price: number;
    seasonalPrice?: number;
    seasonalDiscount?: number;
  }[];
  rating: number;
  amenities: string[];
  description?: string;
  petFriendly: boolean;
  petFee?: number;
  seasonalNotes?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface SortedHotel extends Hotel {
  bestPrice: number;
  bestWebsite: string;
  comparisonSteps?: ComparisonStep[];
  seasonalDiscount?: number;
}

export interface ComparisonStep {
  website: string;
  price: number;
  isBest: boolean;
  seasonalPrice?: number;
}

export interface SearchLocation {
  id: string;
  name: string;
  type: 'city' | 'hotel';
}

export interface GuestInfo {
  adults: number;
  children: Child[];
  pets: Pet[];
}

export interface Child {
  id: string;
  age: number;
}

export interface Pet {
  id: string;
  type: 'dog' | 'cat' | 'other';
  count: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bookings: Booking[];
}

export interface Booking {
  id: string;
  hotelId: string;
  hotelName: string;
  checkIn: Date;
  checkOut: Date;
  guests: GuestInfo;
  totalPrice: number;
  status: 'confirmed' | 'completed' | 'cancelled';
  bookingDate: Date;
  seasonalDiscount?: number;
  petFee?: number;
}