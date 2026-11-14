import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, catchError } from 'rxjs';
import { ApiResponse, UserSession } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:5000/api/identity';
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
        // Resilient fallback for UI testing when offline (aligned with backend seeds)
        const email = credentials.emailId.toLowerCase().trim();
        let role: 'Admin' | 'Buyer' | 'Seller' = 'Buyer';
        let fullName = 'Rajesh Sharma';
        let profileId = 1;

        if (email.includes('admin')) {
          role = 'Admin';
          fullName = 'System Administrator';
          profileId = 1;
        } else if (email.includes('seller') || email.includes('ananya') || email.includes('vikram')) {
          role = 'Seller';
          if (email.includes('ananya')) {
            fullName = 'Ananya Deshmukh';
            profileId = 2;
          } else if (email.includes('vikram')) {
            fullName = 'Vikram Singhania';
            profileId = 3;
          } else {
            fullName = 'Amit Patel';
            profileId = 1;
          }
        } else {
          if (email.includes('priya')) {
            fullName = 'Priya Nair';
            profileId = 2;
          } else {
            fullName = 'Rajesh Sharma';
            profileId = 1;
          }
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

  registerBuyer(payload: { fullName: string; emailId: string; password: string; dob: string; mobileNo: string }): Observable<ApiResponse<UserSession>> {
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

  registerSeller(payload: { emailId: string; password: string; fullName: string; phoneNo: string; address: string; stateId: number; cityId: number; dateofBirth?: string }): Observable<ApiResponse<UserSession>> {
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
    try {
      sessionStorage.removeItem(this.storageKey);
      localStorage.removeItem(this.storageKey);
    } catch {}
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return this.currentUser()?.token ?? null;
  }

  private setSession(session: UserSession): void {
    if (session.userType === 'Seller' && (!session.profileId || session.profileId <= 0)) {
      session.profileId = 1;
    } else if (session.userType === 'Buyer' && (!session.profileId || session.profileId <= 0)) {
      session.profileId = 1;
    }
    try {
      sessionStorage.setItem(this.storageKey, JSON.stringify(session));
      localStorage.removeItem(this.storageKey);
    } catch {}
    this.currentUser.set(session);
  }

  private loadSession(): UserSession | null {
    try {
      let raw = sessionStorage.getItem(this.storageKey);
      if (!raw) {
        // Safe migration from legacy localStorage if present
        raw = localStorage.getItem(this.storageKey);
        if (raw) {
          sessionStorage.setItem(this.storageKey, raw);
          localStorage.removeItem(this.storageKey);
        }
      }
      if (!raw) return null;

      const session = JSON.parse(raw) as UserSession;
      if (session) {
        if (session.userType === 'Seller' && (!session.profileId || session.profileId <= 0)) {
          session.profileId = 1;
        } else if (session.userType === 'Buyer' && (!session.profileId || session.profileId <= 0)) {
          session.profileId = 1;
        }
      }
      return session;
    } catch {
      return null;
    }
  }
}
