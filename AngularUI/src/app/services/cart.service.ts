import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiResponse, EnrichedCartItem } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly baseUrl = 'http://localhost:5000/api/cart';

  readonly cartItems = signal<EnrichedCartItem[]>([]);
  readonly cartCount = signal<number>(0);

  constructor(private http: HttpClient) {}

  getBuyerCart(buyerId: number): Observable<ApiResponse<EnrichedCartItem[]>> {
    return this.http.get<ApiResponse<EnrichedCartItem[]>>(`${this.baseUrl}/buyer/${buyerId}`).pipe(
      tap(res => {
        if (res.success && res.data) {
          this.cartItems.set(res.data);
          this.cartCount.set(res.data.length);
        }
      })
    );
  }

  addToCart(buyerId: number, propertyId: number): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.baseUrl, { buyerId, propertyId }).pipe(
      tap(() => this.getBuyerCart(buyerId).subscribe())
    );
  }

  removeFromCart(cartId: number, buyerId: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/${cartId}`).pipe(
      tap(() => this.getBuyerCart(buyerId).subscribe())
    );
  }

  clearCart(): void {
    this.cartItems.set([]);
    this.cartCount.set(0);
  }
}
