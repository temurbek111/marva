export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
};

export type Product = {
  id: string;
  slug: string;
  categoryId: string;
  name: string;
  price: number;
  oldPrice?: number;
  currency?: string;
  image: string;
  badge?: string;
  shortDescription: string;
  description: string;
  stock: number;
  featured?: boolean;
};

export type CartItem = {
  product: Product;
  quantity: number;
};
