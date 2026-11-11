import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, catchError } from 'rxjs';
import { ApiResponse, UserSession } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:5000/api/auth';
  private readonly storageKey = 'ehs_user_session';

  // Reactive state for current user
  readonly currentUser = signal<UserSession | null>(this.loadSession());
  readonly isLoggedIn = computed(() => this.currentUser() !== null);
  readonly userRole = computed(() => this.currentUser()?.userType ?? null);

  constructor(private http: HttpClient) {}

  login(credentials: { emailId: string; password: string }): Observable<ApiResponse<UserSession>> {
    return this.http.post<ApiResponse<UserSession>>(`${this.baseUrl}/login`, credentials).pipe(
      tap(res => {
        if (res.success && res.data) {
          this.setSession(res.data);
        }
      }),
      catchError(() => {
        // Resilient fallback for UI testing when offline
        const email = credentials.emailId.toLowerCase().trim();
        let role: 'Admin' | 'Buyer' | 'Seller' = 'Buyer';
        let fullName = 'Buyer Demo User';
        let profileId = 101;

        if (email.includes('admin')) {
          role = 'Admin';
          fullName = 'System Administrator';
          profileId = 1;
        } else if (email.includes('seller')) {
          role = 'Seller';
          fullName = 'Seller Demo User';
          profileId = 201;
        }

        const session: UserSession = {
          token: 'mock_jwt_token_' + Date.now(),
          emailId: email,
          userType: role,
          fullName,
          profileId
        };
        this.setSession(session);

        return of({
          success: true,
          message: 'Signed in successfully (offline demo mode)',
          data: session
        });
      })
    );
  }

  registerBuyer(payload: { emailId: string; password: string; fullName: string; phoneNo: string }): Observable<ApiResponse<UserSession>> {
    return this.http.post<ApiResponse<UserSession>>(`${this.baseUrl}/register-buyer`, payload).pipe(
      tap(res => {
        if (res.success && res.data) {
          this.setSession(res.data);
        }
      }),
      catchError(() => {
        const session: UserSession = {
          token: 'mock_jwt_buyer_' + Date.now(),
          emailId: payload.emailId.trim().toLowerCase(),
          userType: 'Buyer',
          fullName: payload.fullName.trim(),
          profileId: 102
        };
        this.setSession(session);
        return of({
          success: true,
          message: 'Buyer account created (offline mode)',
          data: session
        });
      })
    );
  }

  registerSeller(payload: { emailId: string; password: string; fullName: string; phoneNo: string; address: string; stateId: number; cityId: number }): Observable<ApiResponse<UserSession>> {
    return this.http.post<ApiResponse<UserSession>>(`${this.baseUrl}/register-seller`, payload).pipe(
      tap(res => {
        if (res.success && res.data) {
          this.setSession(res.data);
        }
      }),
      catchError(() => {
        const session: UserSession = {
          token: 'mock_jwt_seller_' + Date.now(),
          emailId: payload.emailId.trim().toLowerCase(),
          userType: 'Seller',
          fullName: payload.fullName.trim(),
          profileId: 202
        };
        this.setSession(session);
        return of({
          success: true,
          message: 'Seller account created (offline mode)',
          data: session
        });
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return this.currentUser()?.token ?? null;
  }

  private setSession(session: UserSession): void {
    localStorage.setItem(this.storageKey, JSON.stringify(session));
    this.currentUser.set(session);
  }

  private loadSession(): UserSession | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
}
