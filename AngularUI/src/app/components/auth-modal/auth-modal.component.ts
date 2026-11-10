import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { State, City, UserSession } from '../../models/models';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen()) {
      <div class="modal-backdrop" (click)="onBackdropClick($event)">
        <div class="modal-card">
          <!-- Modal Header -->
          <div class="modal-header">
            <div>
              <h2 class="modal-title">Welcome to EasyHousing</h2>
              <p class="modal-sub">Login or create your account to continue</p>
            </div>
            <button class="btn-close" (click)="closeModal()">✕</button>
          </div>

          <!-- Tabs: Login / Register Buyer / Register Seller -->
          <div class="modal-tabs">
            <button
              class="tab-link"
              [class.active]="activeTab === 'login'"
              (click)="activeTab = 'login'"
            >
              Login
            </button>
            <button
              class="tab-link"
              [class.active]="activeTab === 'buyer'"
              (click)="activeTab = 'buyer'"
            >
              Register Buyer
            </button>
            <button
              class="tab-link"
              [class.active]="activeTab === 'seller'"
              (click)="activeTab = 'seller'"
            >
              Register Seller
            </button>
          </div>

          <!-- Notification Banner -->
          @if (errorMessage()) {
            <div class="alert alert-error">
              <span>⚠️ {{ errorMessage() }}</span>
            </div>
          }
          @if (successMessage()) {
            <div class="alert alert-success">
              <span>✓ {{ successMessage() }}</span>
            </div>
          }

          <!-- TAB 1: LOGIN -->
          @if (activeTab === 'login') {
            <form (ngSubmit)="handleLogin()" class="form-body">
              <div class="form-group">
                <label>Email ID / Username</label>
                <input
                  type="email"
                  class="form-control"
                  placeholder="name@example.com"
                  [(ngModel)]="loginEmail"
                  name="email"
                  required
                />
              </div>

              <div class="form-group">
                <label>Password</label>
                <input
                  type="password"
                  class="form-control"
                  placeholder="Enter your password"
                  [(ngModel)]="loginPassword"
                  name="password"
                  required
                />
              </div>

              <button type="submit" class="btn-submit-mmt" [disabled]="loading()">
                {{ loading() ? 'Signing In...' : 'LOGIN' }}
              </button>

              <!-- Quick Demo Fill Buttons -->
              <div class="demo-helpers">
                <span class="demo-label">Quick Sign-in:</span>
                <div class="demo-chips">
                  <button type="button" class="btn-demo" (click)="fillDemo('admin')">
                    Admin
                  </button>
                  <button type="button" class="btn-demo" (click)="fillDemo('buyer')">
                    Buyer
                  </button>
                  <button type="button" class="btn-demo" (click)="fillDemo('seller')">
                    Seller
                  </button>
                </div>
              </div>
            </form>
          }

          <!-- TAB 2: REGISTER BUYER -->
          @if (activeTab === 'buyer') {
            <form (ngSubmit)="handleRegisterBuyer()" class="form-body">
              <div class="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="e.g. John Doe"
                  [(ngModel)]="buyerName"
                  name="buyerName"
                  required
                />
              </div>

              <div class="form-group">
                <label>Email ID (will be your username)</label>
                <input
                  type="email"
                  class="form-control"
                  placeholder="buyer@example.com"
                  [(ngModel)]="buyerEmail"
                  name="buyerEmail"
                  required
                />
              </div>

              <div class="form-group">
                <label>Phone Number (10 digits)</label>
                <input
                  type="tel"
                  class="form-control"
                  placeholder="9876543210"
                  [(ngModel)]="buyerPhone"
                  name="buyerPhone"
                  required
                />
              </div>

              <div class="form-group">
                <label>Password</label>
                <input
                  type="password"
                  class="form-control"
                  placeholder="Min 6 characters"
                  [(ngModel)]="buyerPassword"
                  name="buyerPassword"
                  required
                />
              </div>

              <button type="submit" class="btn-submit-mmt" [disabled]="loading()">
                {{ loading() ? 'Registering...' : 'CREATE BUYER ACCOUNT' }}
              </button>
            </form>
          }

          <!-- TAB 3: REGISTER SELLER -->
          @if (activeTab === 'seller') {
            <form (ngSubmit)="handleRegisterSeller()" class="form-body">
              <div class="form-row">
                <div class="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="e.g. Rajesh Sharma"
                    [(ngModel)]="sellerName"
                    name="sellerName"
                    required
                  />
                </div>
                <div class="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    class="form-control"
                    placeholder="9876543210"
                    [(ngModel)]="sellerPhone"
                    name="sellerPhone"
                    required
                  />
                </div>
              </div>

              <div class="form-group">
                <label>Email ID (Username)</label>
                <input
                  type="email"
                  class="form-control"
                  placeholder="seller@example.com"
                  [(ngModel)]="sellerEmail"
                  name="sellerEmail"
                  required
                />
              </div>

              <div class="form-group">
                <label>Password</label>
                <input
                  type="password"
                  class="form-control"
                  placeholder="Min 6 characters"
                  [(ngModel)]="sellerPassword"
                  name="sellerPassword"
                  required
                />
              </div>

              <div class="form-group">
                <label>Registered Address</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Flat/House no, Street area"
                  [(ngModel)]="sellerAddress"
                  name="sellerAddress"
                  required
                />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>State</label>
                  <select
                    class="form-control"
                    [(ngModel)]="sellerStateId"
                    name="sellerState"
                    (change)="onSellerStateChange()"
                  >
                    <option [ngValue]="null">Select State</option>
                    @for (s of states(); track s.stateId) {
                      <option [ngValue]="s.stateId">{{ s.stateName }}</option>
                    }
                  </select>
                </div>

                <div class="form-group">
                  <label>City</label>
                  <select
                    class="form-control"
                    [(ngModel)]="sellerCityId"
                    name="sellerCity"
                  >
                    <option [ngValue]="null">Select City</option>
                    @for (c of filteredSellerCities; track c.cityId) {
                      <option [ngValue]="c.cityId">{{ c.cityName }}</option>
                    }
                  </select>
                </div>
              </div>

              <button type="submit" class="btn-submit-mmt" [disabled]="loading()">
                {{ loading() ? 'Registering...' : 'CREATE SELLER ACCOUNT' }}
              </button>
            </form>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(5, 32, 60, 0.7);
      backdrop-filter: blur(4px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .modal-card {
      background: #ffffff;
      width: 100%;
      max-width: 480px;
      border-radius: 16px;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
      padding: 24px;
      max-height: 90vh;
      overflow-y: auto;
      animation: modalFadeIn 0.2s ease-out;
    }
    @keyframes modalFadeIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }
    .modal-title {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 4px 0;
    }
    .modal-sub {
      font-size: 13px;
      color: #64748b;
      margin: 0;
    }
    .btn-close {
      background: none;
      border: none;
      font-size: 18px;
      color: #94a3b8;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 6px;
    }
    .btn-close:hover {
      background: #f1f5f9;
      color: #0f172a;
    }
    .modal-tabs {
      display: flex;
      border-bottom: 2px solid #e2e8f0;
      margin-bottom: 18px;
    }
    .tab-link {
      flex: 1;
      background: none;
      border: none;
      padding: 10px 8px;
      font-size: 13px;
      font-weight: 700;
      color: #64748b;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      transition: all 0.15s ease;
    }
    .tab-link.active {
      color: #008cff;
      border-bottom-color: #008cff;
    }
    .form-body {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .form-group label {
      font-size: 11px;
      font-weight: 700;
      color: #475569;
      letter-spacing: 0.3px;
    }
    .form-control {
      padding: 10px 12px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 14px;
      color: #0f172a;
      outline: none;
    }
    .form-control:focus {
      border-color: #008cff;
    }
    .btn-submit-mmt {
      background: linear-gradient(90deg, #008cff 0%, #0056b3 100%);
      color: #ffffff;
      border: none;
      padding: 12px;
      font-size: 14px;
      font-weight: 800;
      border-radius: 8px;
      cursor: pointer;
      letter-spacing: 0.5px;
      margin-top: 6px;
      transition: transform 0.1s ease;
    }
    .btn-submit-mmt:hover:not(:disabled) {
      transform: translateY(-1px);
    }
    .btn-submit-mmt:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .alert {
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 13px;
      margin-bottom: 12px;
    }
    .alert-error {
      background: #fef2f2;
      color: #dc2626;
      border: 1px solid #fecaca;
    }
    .alert-success {
      background: #f0fdf4;
      color: #16a34a;
      border: 1px solid #bbf7d0;
    }
    .demo-helpers {
      margin-top: 14px;
      padding-top: 14px;
      border-top: 1px dashed #e2e8f0;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .demo-label {
      font-size: 11px;
      font-weight: 700;
      color: #64748b;
    }
    .demo-chips {
      display: flex;
      gap: 6px;
    }
    .btn-demo {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 700;
      color: #334155;
      cursor: pointer;
    }
    .btn-demo:hover {
      background: #e2e8f0;
    }
  `]
})
export class AuthModalComponent {
  readonly isOpen = input<boolean>(false);
  readonly states = input<State[]>([]);
  readonly cities = input<City[]>([]);

  readonly close = output<void>();
  readonly authSuccess = output<UserSession>();

  activeTab: 'login' | 'buyer' | 'seller' = 'login';
  loading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // Login form
  loginEmail = '';
  loginPassword = '';

  // Buyer form
  buyerName = '';
  buyerEmail = '';
  buyerPhone = '';
  buyerPassword = '';

  // Seller form
  sellerName = '';
  sellerEmail = '';
  sellerPhone = '';
  sellerPassword = '';
  sellerAddress = '';
  sellerStateId: number | null = null;
  sellerCityId: number | null = null;

  filteredSellerCities: City[] = [];

  constructor(private authService: AuthService) {}

  onSellerStateChange(): void {
    if (!this.sellerStateId) {
      this.filteredSellerCities = [];
    } else {
      this.filteredSellerCities = this.cities().filter(c => c.stateId === Number(this.sellerStateId));
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.closeModal();
    }
  }

  closeModal(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.close.emit();
  }

  fillDemo(role: 'admin' | 'buyer' | 'seller'): void {
    if (role === 'admin') {
      this.loginEmail = 'admin@easysolution.com';
      this.loginPassword = 'AdminPassword123!';
    } else if (role === 'buyer') {
      this.loginEmail = 'buyer@demo.com';
      this.loginPassword = 'BuyerPassword123!';
    } else if (role === 'seller') {
      this.loginEmail = 'seller@demo.com';
      this.loginPassword = 'SellerPassword123!';
    }
  }

  handleLogin(): void {
    this.errorMessage.set(null);
    this.loading.set(true);

    this.authService.login({
      emailId: this.loginEmail,
      password: this.loginPassword
    }).subscribe({
      next: res => {
        this.loading.set(false);
        if (res.success && res.data) {
          this.authSuccess.emit(res.data);
          this.closeModal();
        } else {
          this.errorMessage.set(res.message || 'Login failed. Please check your credentials.');
        }
      },
      error: err => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message || 'Login failed. Please verify email and password.');
      }
    });
  }

  handleRegisterBuyer(): void {
    this.errorMessage.set(null);
    this.loading.set(true);

    this.authService.registerBuyer({
      fullName: this.buyerName,
      emailId: this.buyerEmail,
      phoneNo: this.buyerPhone,
      password: this.buyerPassword
    }).subscribe({
      next: res => {
        this.loading.set(false);
        if (res.success && res.data) {
          this.authSuccess.emit(res.data);
          this.closeModal();
        } else {
          this.errorMessage.set(res.message || 'Registration failed.');
        }
      },
      error: err => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message || 'Failed to register buyer.');
      }
    });
  }

  handleRegisterSeller(): void {
    if (!this.sellerStateId || !this.sellerCityId) {
      this.errorMessage.set('Please select both State and City.');
      return;
    }

    this.errorMessage.set(null);
    this.loading.set(true);

    this.authService.registerSeller({
      fullName: this.sellerName,
      emailId: this.sellerEmail,
      phoneNo: this.sellerPhone,
      password: this.sellerPassword,
      address: this.sellerAddress,
      stateId: Number(this.sellerStateId),
      cityId: Number(this.sellerCityId)
    }).subscribe({
      next: res => {
        this.loading.set(false);
        if (res.success && res.data) {
          this.authSuccess.emit(res.data);
          this.closeModal();
        } else {
          this.errorMessage.set(res.message || 'Registration failed.');
        }
      },
      error: err => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message || 'Failed to register seller.');
      }
    });
  }
}
