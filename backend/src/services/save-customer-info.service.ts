import { getDB } from "../db/mongo.js";

interface Address {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

interface CustomerData {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: Address;
}
export class SaveCustomerInfoService {
  constructor() {}

  async savedToDb(data: CustomerData) {
    console.log("Now saving to db (mock):", data);
    const db = getDB();

    const customer = await db
      .collection("customers")
      .findOne({ email: data.email });

    if (customer) {
      return {
        success: true,
        alreadyExists: true,
        customer,
      };
    }

    const result = await db.collection("customers").insertOne(data);
    return {
      success: true,
      alreadyExists: false,
      insertedId: result.insertedId,
    };
  }
}
