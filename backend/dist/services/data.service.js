import { getDB } from "../db/mongo.js";
export class DataService {
    async getAll(collection) {
        const db = getDB();
        return await db.collection(collection).find().toArray();
    }
    async getbyId(collection, id) {
        const db = getDB();
        return await db.collection(collection).findOne({ id });
    }
}
//# sourceMappingURL=data.service.js.map