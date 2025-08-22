export interface Coach {
  _id?: string;
  id?: string;
  name: string;
  bio?: string;
  avatar?: string;
  specialty?: string;
  title?: string;
  // ...other properties...
  experience: number;
  rating: number;
  clientCount: number;
  topPercentage?: number;
  specializations: string[];
  tags: string[];
  imageUrl?: string;
  startingPrice: number;
  pricingModel: 'hourly' | 'monthly' | 'package';
  matchPercentage?: number;
  isActive?: boolean;
  linkedinUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CoachResponse {
  success: boolean;
  data: Coach | Coach[];
  count?: number;
  totalCount?: number;
  page?: number;
  totalPages?: number;
  hasMore?: boolean;
  mock?: boolean;
  error?: string;
}
