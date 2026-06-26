export class SaveStudentInfoService {
    constructor() { }
    ;
    savedToDb(data) {
        console.log("Now saving to db (mock):", data);
        return {
            id: Date.now(),
            ...data
        };
    }
}
//# sourceMappingURL=save-student-info.service.js.map