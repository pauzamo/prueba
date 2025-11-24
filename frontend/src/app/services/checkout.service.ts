import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Payment } from '../models/payment.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private apiUrl = 'http://localhost:3000/api/checkout';

  constructor(private http: HttpClient) { }

  processPayment(paymentData: Payment): Observable<any> {
    return this.http.post(`${this.apiUrl}`, paymentData);
  }

  deleteCard(cardId: number, userId: number) {
  return this.http.delete(`${this.apiUrl}/${cardId}?idUsuario=${userId}`);
}

  getCardByUserId(userId: number) {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }


}
