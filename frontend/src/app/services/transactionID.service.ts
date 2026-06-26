import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TransactionIDService{
    generateTransactionId(): string {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TXN-${ts}-${rand}`;
    }
}