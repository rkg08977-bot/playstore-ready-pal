export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  category_slug: string;
  price: number;
  unit: string;
  min_order: number;
  image_url: string | null;
  rating: number | null;
  description: string | null;
  specs: { label: string; value: string }[];
  in_stock: boolean;
  active: boolean;
  sort_order: number;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
};

export type Testimonial = {
  id: string;
  author_name: string;
  author_role: string | null;
  content: string;
  rating: number;
  avatar_url: string | null;
  approved: boolean;
  sort_order: number;
};

export type SiteSettings = {
  id: number;
  business_name: string;
  tagline: string | null;
  logo_url: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_image_url: string | null;
  about_text: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  delivery_radius_km: number | null;
  free_delivery_above: number | null;
  delivery_charge: number | null;
  whatsapp: string | null;
  instagram: string | null;
  facebook: string | null;
};

export type OrderStatus = "pending" | "confirmed" | "out_for_delivery" | "delivered" | "cancelled";

export type Order = {
  id: string;
  order_number: string;
  user_id: string;
  status: OrderStatus;
  full_name: string;
  phone: string;
  email: string | null;
  address: string;
  city: string;
  pincode: string;
  landmark: string | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: string;
  notes: string | null;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_image: string | null;
  unit: string | null;
  unit_price: number;
  quantity: number;
  subtotal: number;
};