import React from "react";

// ==========================================
// 1. COMMON & UTILITY TYPES
// ==========================================

export type ServiceCategoryType = 'PUJA' | 'ASTROLOGY' | 'RITUAL' | 'OTHER' | string;

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface EmptyStateCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export interface StatusOption {
  value: string | boolean;
  label: string;
}

export interface AdminStatusSelectProps {
  value: string;
  options?: StatusOption[];
  onChange?: (newValue: string) => void;
  readOnly?: boolean;
}

export interface Column<T = any> {
  id: string;
  label: string;
  minWidth?: number | string;
  width?: number | string;
  align?: 'right' | 'left' | 'center';
  format?: (value: any, row: T) => React.ReactNode;
  render?: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
}

export interface TabOption {
  id: string;
  label: string;
}

export interface AdminDataTableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  loading?: boolean;
  totalCount?: number;
  page?: number;
  rowsPerPage?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  tabs?: TabOption[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  minWidth?: number | string;
  emptyMessage?: string;
  keyExtractor?: (item: T, index?: number) => string | number;
  [key: string]: any;
}

export interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  actionButtonText?: string;
  actionButtonHref?: string;
  actionButtonIcon?: React.ReactNode;
  onActionButtonClick?: () => void;
}

export interface AdminDetailsHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  backHref?: string;
  onBack?: () => void;
  actionButton?: React.ReactNode;
  children?: React.ReactNode;
}

// ==========================================
// 2. TEMPLE INTERFACES
// ==========================================

export interface ITemple {
  id: number | string;
  name: string;
  description?: string;
  imageUrl?: string;
  downloadUrl?: string;
  city?: string;
  state?: string;
  address?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  services?: any[];
}

export type TempleItem = ITemple;

export interface TempleOption {
  id: string | number;
  name: string;
}

export interface TempleFormValues {
  name: string;
  description: string;
  city: string;
  state?: string;
  address: string;
  imageUrl?: string;
  isActive?: boolean;
}

export interface TempleFormProps {
  isEdit?: boolean;
  id?: string | number;
}

// ==========================================
// 3. CATEGORY INTERFACES
// ==========================================

export interface ICategory {
  title: string;
  icon: string;
  type?: ServiceCategoryType;
}

export interface IServiceCategory {
  id: number | string;
  name: string;
  title?: string;
  description?: string;
  iconUrl?: string;
  iconDownloadurl?: string;
  totalServices?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CategoryItem = IServiceCategory;

export interface CategoryOption {
  id: string | number;
  name: string;
}

// ==========================================
// 4. SERVICE & PUJA INTERFACES
// ==========================================

export interface IServicePlan {
  id?: number | string;
  name?: string;
  title?: string;
  price?: number;
  description?: string;
  features?: string[];
  [key: string]: any;
}

export interface IService {
  id: number | string;
  name: string;
  slug?: string;
  description?: string;
  price?: number | string;
  basePrice?: number;
  minPrice?: number | null;
  maxPrice?: number | null;
  priceWithSamagri?: number;
  priceWithoutSamagri?: number;
  durationMinutes?: number;
  duration?: string;
  iconUrl?: string;
  iconDownloadurl?: string;
  imageUrl?: string;
  isActive?: boolean;
  categoryId?: number | string;
  category?: IServiceCategory | string;
  templeId?: number | string | null;
  temple?: ITemple | null;
  cities?: Array<{ name: string; state: string }>;
  plans?: IServicePlan[] | Record<string, any>;
  [key: string]: any;
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

export interface ServiceCardProps {
  id?: number | string;
  title: string;
  image: string;
  description?: string;
  price?: string;
  duration?: string;
  category?: string;
  language?: string;
  experience?: string;
  rating?: string;
  availability?: string;
}

export interface ServiceGridProps {
  activeCategory: string;
  selectedCategoryId?: string | number;
  selectedTempleId?: string | number;
  selectedTempleName?: string;
  activeFilters?: any;
  searchQuery?: string;
  selectedState?: string;
  selectedCity?: string;
}

export interface ServiceFiltersProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  filters?: any;
  onFilterChange?: (filters: any) => void;
  onResetFilters?: () => void;
}

export interface ServiceBasicFieldsProps {
  values: {
    name: string;
    description: string;
    categoryId?: string | number;
    templeId?: string | number;
    [key: string]: any;
  };
  errors: Record<string, any>;
  touched: Record<string, any>;
  handleChange: any;
  handleBlur: any;
  setFieldValue?: (field: string, value: any, shouldValidate?: boolean) => void;
}

// ==========================================
// 5. PUROHIT INTERFACES
// ==========================================

export interface IPurohit {
  id: number | string;
  name: string;
  experience?: string;
  rating?: number;
  image?: string;
  verified?: boolean;
  rituals?: string;
  experienceYears?: number;
  specializedRituals?: string[];
  languages?: string[];
  location?: string;
  onlineAvailable?: boolean;
  price?: number;
  categories?: string[];
  [key: string]: any;
}

export interface PurohitCardProps {
  id: number | string;
  name?: string;
  title?: string;
  experience?: string;
  rating?: number | string;
  image: string;
  verified?: boolean;
  rituals?: string;
  languages?: string[];
  language?: string;
  location?: string;
  price?: number | string;
  duration?: string;
  category?: string;
  availability?: string;
  bio?: string;
  specialization?: string;
  [key: string]: any;
}

export interface PurohitFiltersProps {
  languages: string[];
  rituals: string[];
  filters: any;
  onFilterChange: (filters: any) => void;
  onResetFilters: () => void;
}

// ==========================================
// 6. CART, ORDERS & ADDRESS INTERFACES
// ==========================================

export interface CartItem {
  id: string | number;
  productId?: string | number;
  serviceId?: string | number;
  title?: string;
  name?: string;
  price: number;
  image?: string;
  quantity: number;
  unitString?: string;
  pricingUnit?: string;
  unitQuantity?: number;
  packQuantity?: number;
  description?: string;
  subtotal?: number;
  type?: string;
  [key: string]: any;
}

export interface CustomerAddress {
  id: number | string;
  name?: string;
  addressLabel?: string;
  fullAddress?: string;
  addressLine?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  phone?: string;
  venueType?: string;
  latitude?: string | number;
  longitude?: string | number;
  isDefault?: boolean;
  [key: string]: any;
}

export interface AddressFormData {
  id?: string | number;
  fullName?: string;
  phone?: string;
  houseNo?: string;
  area?: string;
  landmark?: string;
  venueType?: string;
  fullAddress?: string;
  addressLabel?: string;
  streetName?: string;
  city: string;
  state: string;
  pincode: string;
  addressType?: 'HOME' | 'OFFICE' | 'OTHER' | string;
  isDefault?: boolean;
  latitude?: string | number;
  longitude?: string | number;
  [key: string]: any;
}

export interface StatusMessage {
  text: string;
  type: "info" | "error" | "success" | "";
}

export interface AddAddressModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (savedAddress?: any) => void;
  initialData?: any | null;
}

export interface OrderItem {
  id: number | string;
  productId?: string | number;
  name?: string;
  title?: string;
  price: number;
  quantity: number;
  image?: string;
  [key: string]: any;
}

export interface CustomerOrder {
  id: number | string;
  rawId?: string | number;
  orderNumber?: string;
  orderDate?: string;
  categoryTag?: string;
  status: string;
  orderStatus?: string;
  paymentStatus?: string;
  items: OrderItem[];
  totalAmount: number;
  deliveredDate?: string;
  deliveryAddress?: string;
  paymentMethod?: string;
  createdAt?: string;
  [key: string]: any;
}

// ==========================================
// 7. FESTIVALS, TESTIMONIALS & NOTIFICATIONS
// ==========================================

export interface IFestival {
  id: number;
  title: string;
  description: string;
  date: string;
  image: string;
}

export interface ITestimonial {
  id: number;
  name: string;
  text: string;
  rating: number;
}

export interface NotificationItem {
  id: string | number;
  title?: string;
  message: string;
  time?: string;
  read?: boolean;
  createdAt?: string;
  type?: string;
  [key: string]: any;
}
