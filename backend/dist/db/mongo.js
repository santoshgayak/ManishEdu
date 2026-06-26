// db/mongo.ts
import { MongoClient } from "mongodb";
import "dotenv/config";
const client = new MongoClient(process.env.MONGODB_URI);
let db;
export const connectDB = async () => {
    await client.connect();
    db = client.db(process.env.DB_NAME);
    console.log("MongoDB connected");
};
export const getDB = () => {
    if (!db) {
        throw new Error("DB not initialized. connect first.");
    }
    return db;
};
//# sourceMappingURL=mongo.js.map