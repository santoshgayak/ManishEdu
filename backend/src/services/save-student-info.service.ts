export class SaveStudentInfoService {

  constructor() {};

  savedToDb(data: any) {
  console.log("Now saving to db (mock):", data);

  return {
    id: Date.now(),
    ...data
  };
}
}


