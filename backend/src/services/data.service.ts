import { getDB } from "../db/mongo.js"; 

export class DataService{
     async getAll(collection: string){
        const db = getDB();
        return await db.collection(collection).find().toArray();
    }
       async getbyId(collection: string, id:string){
        const db = getDB();
        return await db.collection(collection).findOne({id});
    }
}