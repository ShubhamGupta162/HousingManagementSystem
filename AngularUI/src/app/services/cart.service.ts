import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, catchError } from 'rxjs';
import { ApiResponse, EnrichedCartItem, Property } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly baseUrl = 'http://localhost:5000/api/cart';
  private readonly storageKey = 'ehs_local_cart';

  readonly cartItems = signal<EnrichedCartItem[]>(this.loadLocalCart());
  readonly cartCount = signal<number>(this.loadLocalCart().length);

  constructor(private http: HttpClient) {}

  getBuyerCart(buyerId: number): Observable<ApiResponse<EnrichedCartItem[]>> {
    return this.http.get<ApiResponse<EnrichedCartItem[]>>(`${this.baseUrl}/buyer/${buyerId}`).pipe(
      tap(res => {
        if (res.success && res.data) {
          this.cartItems.set(res.data);
          this.cartCount.set(res.data.length);
          this.saveLocalCart(res.data);
        }
      }),
      catchError(() => {
        const local = this.loadLocalCart().filter(i => i.buyerId === buyerId);
        this.cartItems.set(local);
        this.cartCount.set(local.length);
        return of({
          success: true,
          message: 'Loaded cart from local cache',
          data: local
        });
      })
    );
  }

  addToCart(buyerId: number, propertyId: number, propertyData?: Property): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.baseUrl, { buyerId, propertyId }).pipe(
      tap(() => this.getBuyerCart(buyerId).subscribe()),
      catchError(() => {
        const current = this.loadLocalCart();
        const existing = current.find(i => i.propertyId === propertyId && i.buyerId === buyerId);
        if (!existing) {
          const newItem: EnrichedCartItem = {
            cartId: Date.now(),
            buyerId,
            propertyId,
            property: propertyData
          };
          current.push(newItem);
          this.saveLocalCart(current);
          this.cartItems.set(current);
          this.cartCount.set(current.length);
        }
        return of({
          success: true,
          message: 'Item added to cart',
          data: { buyerId, propertyId }
        });
      })
    );
  }

  removeFromCart(cartId: number, buyerId: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/${cartId}`).pipe(
      tap(() => this.getBuyerCart(buyerId).subscribe()),
      catchError(() => {
        const filtered = this.loadLocalCart().filter(i => i.cartId !== cartId);
        this.saveLocalCart(filtered);
        this.cartItems.set(filtered);
        this.cartCount.set(filtered.length);
        return of({
          success: true,
          message: 'Item removed from cart',
          data: true
        });
      })
    );
  }

  clearCart(): void {
    localStorage.removeItem(this.storageKey);
    this.cartItems.set([]);
    this.cartCount.set(0);
  }

  private loadLocalCart(): EnrichedCartItem[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveLocalCart(items: EnrichedCartItem[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    } catch {}
  }
}
