import { getDB } from "../db/mongo.js";
import { ObjectId } from "mongodb";

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
}
