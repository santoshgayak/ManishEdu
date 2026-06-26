// db/mongo.ts
import { MongoClient, Db } from "mongodb";
import "dotenv/config";
import { error } from "node:console";
 

const client = new MongoClient(process.env.MONGODB_URI!);

let db: Db;

export const connectDB = async () => {
  await client.connect();
  db = client.db(process.env.DB_NAME);
  console.log("MongoDB connected");
};

export const getDB = () =>{
    if(!db){
        throw new Error("DB not initialized. connect first.")
    }
    return db;
};