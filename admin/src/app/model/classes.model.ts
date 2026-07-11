export interface ClassPlan {
  _id:string,
  id:string,
  title: string;
  price: number;
  duration: string;
  features: string[];
  description: string;
  level: string;
  image:string;
  status:string;
    createdAt:Date,
    updatedAt:Date
}