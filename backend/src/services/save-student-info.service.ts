import { getDB } from "../db/mongo.js";

export class SaveStudentInfoService {
  constructor() {}

  async savedToDb(data: any) {
    const db = getDB();

    const student = await db
      .collection("students")
      .findOne({ email: data.email });

    if (student) {
      // Update existing student
      const result = await db
        .collection("students")
        .replaceOne({ _id: student._id }, data);

      return {
        success: true,
        alreadyExists: true,
        data: {
          _id: student._id,
        },
      };
    }

    // Insert new student
    const result = await db.collection("students").insertOne(data);

    return {
      success: true,
      alreadyExists: false,
      data: {
        _id: result.insertedId,
      },
    };
  }
}
