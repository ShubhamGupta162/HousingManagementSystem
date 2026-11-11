export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

export interface UserSession {
  token: string;
  emailId: string;
  userType: 'Admin' | 'Buyer' | 'Seller';
  fullName: string;
  profileId?: number;
}

export interface Property {
  propertyId: number;
  propertyName: string;
  propertyType: string;
  propertyOption: string; // Sell or Rent
  description?: string;
  address: string;
  priceRange: number;
  initialDeposit: number;
  landmark: string;
  isActive: boolean;
  deactivationReason?: string;
  sellerId: number;
  cityId: number;
}

export interface PropertyImage {
  imageId: number;
  propertyId: number;
  imageData: string;
}

export interface City {
  cityId: number;
  cityName: string;
  stateId: number;
}

export interface State {
  stateId: number;
  stateName: string;
}

export interface EnrichedCartItem {
  cartId: number;
  buyerId: number;
  propertyId: number;
  property?: Property;
}

export interface PropertyFilterCriteria {
  cityId?: number | null;
  propertyType?: string;
  propertyOption?: string; // Sell, Rent, or empty
  sortBy?: string;
}

export interface SellerContact {
  sellerId: number;
  fullName: string;
  emailId: string;
  phoneNo: string;
}

export interface UserSummary {
  userId?: number;
  profileId?: number;
  emailId: string;
  userName?: string;
  fullName: string;
  phoneNo: string;
  userType: string;
  address?: string;
}

