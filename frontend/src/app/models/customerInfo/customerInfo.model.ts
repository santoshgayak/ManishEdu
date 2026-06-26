import { address } from "./address.model";
import { cardInfo } from "./cardInfo.model";

export interface CustomerInfo{
    firstName:string,
    lastName:string,
    phone:string,
    email:string,
    address:address
}