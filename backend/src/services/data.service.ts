import { getDB } from "../db/mongo.js";
import { ObjectId } from "mongodb";
import { Document } from "mongodb";
import { Admin } from "../model/admin.model.js";

interface UpdateAdminResponse {
  message: string;
  admin: Admin;
}
export class DataService {
  constructor() {
    console.log("DataService from data.service.ts loaded");
  }
  async getAll(collection: string) {
    const db = getDB();
    return await db.collection(collection).find().toArray();
  }
  async getbyId(collection: string, id: string) {
    const db = getDB();
    return await db.collection(collection).findOne({ id });
  }
  async getOne(collection: string, filter: object) {
    const db = getDB();
    return await db.collection(collection).findOne(filter);
  }
  async getLastOrder(collection: string) {
    const db = getDB();
    return await db.collection(collection).findOne(
      {},
      {
        sort: { createdAt: -1 },
      },
    );
  }
  async updateOne(collection: string, filter: object, update: object) {
    const db = getDB();
    return await db.collection(collection).updateOne(filter, {
      $set: update,
    });
  }
  async saveData(collection: string, updatedData: any) {
    const db = getDB();
    const { _id, ...payload } = updatedData;

    // CREATE
    if (!_id || _id.trim() === "") {
      return await db.collection(collection).insertOne(payload);
    }
    return await db
      .collection(collection)
      .replaceOne({ _id: new ObjectId(_id) }, payload, { upsert: true });
  }
  async deleteClass(collection: string, id: string) {
    const db = getDB();
    return db.collection(collection).deleteOne({
      _id: new ObjectId(id),
    });
  }
  async deleteProduct(collection: string, id: string) {
    const db = getDB();
    console.log("Database:", db.databaseName);
    console.log("Collection:", collection);
    console.log("Delete ID received:", id);
    const before = await db.collection(collection).findOne({
      _id: new ObjectId(id),
    });
    console.log("Document found before delete:", before);
    const result = await db.collection(collection).deleteOne({
      _id: new ObjectId(id),
    });
    console.log("Delete result:", result);
    return result;
  }

  async deleteOrder(collection: string, stripeSessionId: string) {
    const db = getDB();
    const result = await db.collection(collection).deleteOne({
      stripeSessionId: stripeSessionId,
    });
    console.log("Deleted order result:", result);
    return result;
  }

  async getNextOrderId() {
    const db = getDB();
    const counters = db.collection<{ _id: string; sequence: number }>(
      "counters",
    );

    const result = await counters.findOneAndUpdate(
      { _id: "orders" },
      { $inc: { sequence: 1 } },
      {
        upsert: true,
        returnDocument: "after",
      },
    );

    if (!result) {
      throw new Error("Could not generate order ID");
    }

    return `ORD-${result.sequence}`;
  }
  async updateFields(
    collection: string,
    id: string,
    updatedFields: Partial<Admin>,
  ) {
    console.log("Updated Filed :", collection, updatedFields, id);
    console.log("Converted id to ObjectId", new ObjectId(id));
    const db = getDB();
    const result = await db
      .collection(collection)
      .updateOne({ _id: id as any }, { $set: updatedFields });
    if (result) {
      const admin = await this.getOne("admins", { _id: id });
      console.log("Admin : ", admin);
      return admin;
    }

    return result;
  }
}
