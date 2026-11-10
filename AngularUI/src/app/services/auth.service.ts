import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
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
      })
    );
  }

  registerBuyer(payload: { emailId: string; password: string; fullName: string; phoneNo: string }): Observable<ApiResponse<UserSession>> {
    return this.http.post<ApiResponse<UserSession>>(`${this.baseUrl}/register-buyer`, payload).pipe(
      tap(res => {
        if (res.success && res.data) {
          this.setSession(res.data);
        }
      })
    );
  }

  registerSeller(payload: { emailId: string; password: string; fullName: string; phoneNo: string; address: string; stateId: number; cityId: number }): Observable<ApiResponse<UserSession>> {
    return this.http.post<ApiResponse<UserSession>>(`${this.baseUrl}/register-seller`, payload).pipe(
      tap(res => {
        if (res.success && res.data) {
          this.setSession(res.data);
        }
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
