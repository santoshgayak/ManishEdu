export interface Product{
    _id:string,
    id:string,
    category:string,
    name:string,
    price:number,
    description:string,
    image?:string,
    stock:number,
    createdAt:Date,
    updatedAt:Date
}