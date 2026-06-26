export class SaveCustomerInfoService {
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
//# sourceMappingURL=save-customer-info.service.js.map