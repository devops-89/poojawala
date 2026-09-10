export type ServiceCategoryType = 'PUJA' | 'ASTROLOGY' | 'RITUAL' | 'OTHER' | string;

export interface IPurohit {
  id: number;
  name: string;
  experience: string;
  rating: number;
  image: string;
  verified: boolean;
  rituals: string;
  experienceYears: number;
  specializedRituals: string[];
  languages: string[];
  location: string;
  onlineAvailable: boolean;
  price: number;
  categories: string[];
}

export interface IPujaPackage {
  id: number;
  title: string;
  duration: string;
  price: string;
  numericPrice: number;
  image: string;
  categories: string[];
  onlineAvailable: boolean;
  location: string;
}

export interface ITestimonial {
  id: number;
  name: string;
  text: string;
  rating: number;
}

export interface ICategory {
  title: string;
  icon: string;
  type?: ServiceCategoryType;
}

export interface IFestival {
  id: number;
  title: string;
  description: string;
  date: string;
  image: string;
}
