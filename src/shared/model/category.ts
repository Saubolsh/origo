export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  slugPath: string[];
  children: Category[];
}
