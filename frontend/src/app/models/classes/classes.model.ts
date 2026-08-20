export interface ClassPlan {
  // Optional MongoDB BSON Identifier
  _id?: string;

  // Public identifier (e.g., Stripe Price API ID)
  id: string;

  title: string;
  description: string; // Added description field
  price: number;
  duration: string;
  features: string[];
  level: 'basic' | 'intermediate' | 'advanced';
  image?: string;
  status?: 'active' | 'inactive';
}
