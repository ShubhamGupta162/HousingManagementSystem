import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { State, City, UserSession } from '../../models/models';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="landing-auth-wrapper">
      <div class="auth-card">
        <!-- Brand Header -->
        <div class="auth-header">
          <div class="brand-logo-badge">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 10.5L12 3L21 10.5V20C21 20.5523 20.5523 21 20 21H15V14H9V21H4C3.44772 21 3 20.5523 3 20V10.5Z" fill="#ffffff" />
              <path d="M9 21V14H15V21H9Z" fill="#008cff" />
            </svg>
          </div>
          <h1 class="brand-title">easy<span class="highlight">housing</span></h1>
          <p class="brand-subtitle">
            {{ activeTab === 'login' ? 'Sign in to access your dashboard' : (activeTab === 'buyer' ? 'Create your buyer account' : 'Register as an authorized seller') }}
          </p>
        </div>

        <!-- Tab Selector: Login vs Register Buyer vs Register Seller -->
        <div class="auth-tabs">
          <button
            type="button"
            class="tab-btn"
            [class.active]="activeTab === 'login'"
            (click)="setTab('login')"
          >
            Login
          </button>
          <button
            type="button"
            class="tab-btn"
            [class.active]="activeTab === 'buyer'"
            (click)="setTab('buyer')"
          >
            Register Buyer
          </button>
          <button
            type="button"
            class="tab-btn"
            [class.active]="activeTab === 'seller'"
            (click)="setTab('seller')"
          >
            Register Seller
          </button>
        </div>

        <!-- Alert Banners -->
        @if (errorMessage()) {
          <div class="alert alert-error">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            <span>{{ errorMessage() }}</span>
          </div>
        }
        @if (successMessage()) {
          <div class="alert alert-success">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <span>{{ successMessage() }}</span>
          </div>
        }

        <!-- 1. LOGIN FORM -->
        @if (activeTab === 'login') {
          <form (ngSubmit)="handleLogin()" class="form-body">
            <div class="form-group">
              <label>Email Address</label>
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
                placeholder="Enter password"
                [(ngModel)]="loginPassword"
                name="password"
                required
              />
            </div>

            <button type="submit" class="btn-submit" [disabled]="loading()">
              {{ loading() ? 'Signing In...' : 'LOGIN' }}
            </button>

            <!-- Quick Demo Credentials Chips for Effortless Testing -->
            <div class="demo-helpers">
              <span class="demo-label">Quick fill:</span>
              <button type="button" class="demo-chip admin" (click)="fillDemo('admin')">Admin</button>
              <button type="button" class="demo-chip seller" (click)="fillDemo('seller')">Seller</button>
              <button type="button" class="demo-chip buyer" (click)="fillDemo('buyer')">Buyer</button>
            </div>
          </form>
        }

        <!-- 2. REGISTER BUYER FORM -->
        @if (activeTab === 'buyer') {
          <form (ngSubmit)="handleRegisterBuyer()" class="form-body">
            <div class="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                class="form-control"
                placeholder="e.g. Rahul Sharma"
                [(ngModel)]="buyerName"
                name="buyerName"
                required
              />
            </div>

            <div class="form-group">
              <label>Email ID *</label>
              <input
                type="email"
                class="form-control"
                placeholder="rahul@example.com"
                [(ngModel)]="buyerEmail"
                name="buyerEmail"
                required
              />
            </div>

            <div class="form-row">
              <div class="form-group half">
                <label>Mobile Number *</label>
                <input
                  type="tel"
                  class="form-control"
                  placeholder="10 digits (6-9)"
                  [(ngModel)]="buyerPhone"
                  name="buyerPhone"
                  maxlength="10"
                  required
                />
              </div>

              <div class="form-group half">
                <label>Date of Birth *</label>
                <input
                  type="date"
                  class="form-control"
                  [(ngModel)]="buyerDob"
                  name="buyerDob"
                  [max]="maxDobDate"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label>Create Password *</label>
              <input
                type="password"
                class="form-control"
                placeholder="Minimum 8 characters"
                [(ngModel)]="buyerPassword"
                name="buyerPassword"
                required
              />
            </div>

            <button type="submit" class="btn-submit" [disabled]="loading()">
              {{ loading() ? 'Creating Buyer Account...' : 'CREATE BUYER ACCOUNT' }}
            </button>
          </form>
        }

        <!-- 3. REGISTER SELLER FORM -->
        @if (activeTab === 'seller') {
          <form (ngSubmit)="handleRegisterSeller()" class="form-body">
            <div class="form-group">
              <label>Seller / Company Name *</label>
              <input
                type="text"
                class="form-control"
                placeholder="e.g. Ramesh Kulkarni"
                [(ngModel)]="sellerName"
                name="sellerName"
                required
              />
            </div>

            <div class="form-row">
              <div class="form-group half">
                <label>Email ID *</label>
                <input
                  type="email"
                  class="form-control"
                  placeholder="ramesh@example.com"
                  [(ngModel)]="sellerEmail"
                  name="sellerEmail"
                  required
                />
              </div>

              <div class="form-group half">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  class="form-control"
                  placeholder="10 digits (6-9)"
                  [(ngModel)]="sellerPhone"
                  name="sellerPhone"
                  maxlength="10"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label>Street Address *</label>
              <input
                type="text"
                class="form-control"
                placeholder="Complete office or property address"
                [(ngModel)]="sellerAddress"
                name="sellerAddress"
                required
              />
            </div>

            <div class="form-row">
              <div class="form-group half">
                <label>State *</label>
                <select
                  class="form-control"
                  [(ngModel)]="sellerStateId"
                  name="sellerState"
                  (change)="onSellerStateChange()"
                  required
                >
                  <option [ngValue]="null">Select State</option>
                  @for (s of states(); track s.stateId) {
                    <option [ngValue]="s.stateId">{{ s.stateName }}</option>
                  }
                </select>
              </div>

              <div class="form-group half">
                <label>City *</label>
                <select
                  class="form-control"
                  [(ngModel)]="sellerCityId"
                  name="sellerCity"
                  [disabled]="!sellerStateId"
                  required
                >
                  <option [ngValue]="null">Select City</option>
                  @for (c of filteredSellerCities; track c.cityId) {
                    <option [ngValue]="c.cityId">{{ c.cityName }}</option>
                  }
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group half">
                <label>Date of Birth *</label>
                <input
                  type="date"
                  class="form-control"
                  [(ngModel)]="sellerDob"
                  name="sellerDob"
                  [max]="maxDobDate"
                  required
                />
              </div>

              <div class="form-group half">
                <label>Password *</label>
                <input
                  type="password"
                  class="form-control"
                  placeholder="Minimum 8 characters"
                  [(ngModel)]="sellerPassword"
                  name="sellerPassword"
                  required
                />
              </div>
            </div>

            <button type="submit" class="btn-submit" [disabled]="loading()">
              {{ loading() ? 'Registering Seller...' : 'CREATE SELLER ACCOUNT' }}
            </button>
          </form>
        }

        <!-- Subtle Guest Link at Bottom -->
        <div class="guest-footer">
          <span>Just browsing?</span>
          <button type="button" class="btn-guest-link" (click)="browseMarketplace.emit()">
            Explore marketplace as guest &rarr;
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .landing-auth-wrapper {
      min-height: calc(100vh - 58px);
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0a192f 0%, #0f2744 50%, #1e3a5f 100%);
      padding: 32px 16px;
      box-sizing: border-box;
    }

    .auth-card {
      background: #ffffff;
      width: 100%;
      max-width: 480px;
      border-radius: 14px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25), 0 1px 3px rgba(0, 0, 0, 0.1);
      padding: 32px 28px;
      box-sizing: border-box;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 22px;
    }

    .brand-logo-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 46px;
      height: 46px;
      background: #008cff;
      border-radius: 12px;
      margin-bottom: 10px;
      box-shadow: 0 6px 14px rgba(0, 140, 255, 0.35);
    }

    .brand-title {
      font-size: 24px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
      margin: 0 0 6px 0;
    }

    .brand-title .highlight {
      color: #008cff;
    }

    .brand-subtitle {
      font-size: 13px;
      color: #64748b;
      margin: 0;
    }

    /* Tabs */
    .auth-tabs {
      display: flex;
      background: #f1f5f9;
      padding: 4px;
      border-radius: 8px;
      margin-bottom: 20px;
      gap: 4px;
    }

    .tab-btn {
      flex: 1;
      background: transparent;
      border: none;
      padding: 9px 8px;
      font-size: 13px;
      font-weight: 600;
      color: #64748b;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .tab-btn:hover {
      color: #0f172a;
    }

    .tab-btn.active {
      background: #ffffff;
      color: #008cff;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    }

    /* Alerts */
    .alert {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 13px;
      margin-bottom: 16px;
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

    /* Form */
    .form-body {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .form-group label {
      font-size: 12px;
      font-weight: 600;
      color: #334155;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }

    .form-control {
      padding: 10px 12px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 14px;
      color: #0f172a;
      background: #ffffff;
      outline: none;
      transition: border-color 0.2s;
    }

    .form-control:focus {
      border-color: #008cff;
      box-shadow: 0 0 0 3px rgba(0, 140, 255, 0.15);
    }

    .form-control:disabled {
      background: #f8fafc;
      cursor: not-allowed;
    }

    .form-row {
      display: flex;
      gap: 12px;
    }

    .form-row .half {
      flex: 1;
    }

    .btn-submit {
      width: 100%;
      background: #008cff;
      color: #ffffff;
      border: none;
      padding: 12px;
      font-size: 14px;
      font-weight: 700;
      border-radius: 6px;
      cursor: pointer;
      margin-top: 6px;
      letter-spacing: 0.5px;
      transition: background 0.2s, transform 0.1s;
    }

    .btn-submit:hover:not(:disabled) {
      background: #0077db;
    }

    .btn-submit:active:not(:disabled) {
      transform: scale(0.99);
    }

    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* Demo helpers */
    .demo-helpers {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 14px;
      padding-top: 14px;
      border-top: 1px solid #e2e8f0;
      font-size: 12px;
    }

    .demo-label {
      color: #64748b;
      font-weight: 500;
    }

    .demo-chip {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .demo-chip.admin:hover {
      background: #fef2f2;
      border-color: #ef4444;
      color: #dc2626;
    }

    .demo-chip.seller:hover {
      background: #eff6ff;
      border-color: #3b82f6;
      color: #1d4ed8;
    }

    .demo-chip.buyer:hover {
      background: #ecfdf5;
      border-color: #10b981;
      color: #047857;
    }

    /* Guest footer */
    .guest-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid #f1f5f9;
      font-size: 13px;
      color: #64748b;
    }

    .btn-guest-link {
      background: transparent;
      border: none;
      color: #008cff;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      padding: 0;
      transition: text-decoration 0.2s;
    }

    .btn-guest-link:hover {
      text-decoration: underline;
    }
  `]
})
export class LandingPageComponent {
  readonly states = input<State[]>([]);
  readonly cities = input<City[]>([]);

  readonly authSuccess = output<UserSession>();
  readonly browseMarketplace = output<void>();

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
  buyerDob = '';

  // Seller form
  sellerName = '';
  sellerEmail = '';
  sellerPhone = '';
  sellerPassword = '';
  sellerDob = '';
  sellerAddress = '';
  sellerStateId: number | null = null;
  sellerCityId: number | null = null;

  readonly maxDobDate: string = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    return d.toISOString().split('T')[0];
  })();

  filteredSellerCities: City[] = [];

  constructor(private authService: AuthService) {}

  setTab(tab: 'login' | 'buyer' | 'seller'): void {
    this.activeTab = tab;
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  onSellerStateChange(): void {
    if (!this.sellerStateId) {
      this.filteredSellerCities = [];
    } else {
      this.filteredSellerCities = this.cities().filter(c => c.stateId === Number(this.sellerStateId));
    }
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
    if (!this.loginEmail.trim() || !this.loginPassword.trim()) {
      this.errorMessage.set('Please enter both email and password.');
      return;
    }
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
    if (!this.buyerName.trim()) {
      this.errorMessage.set('Full name is required.');
      return;
    }
    if (!this.buyerEmail.trim()) {
      this.errorMessage.set('Email address is required.');
      return;
    }
    if (!this.buyerDob) {
      this.errorMessage.set('Date of birth is required.');
      return;
    }
    const buyerBirth = new Date(this.buyerDob);
    const today = new Date();
    if (buyerBirth > today) {
      this.errorMessage.set('Date of birth cannot be in the future.');
      return;
    }
    const bAgeDiff = today.getFullYear() - buyerBirth.getFullYear();
    const bMonthDiff = today.getMonth() - buyerBirth.getMonth();
    const bDayDiff = today.getDate() - buyerBirth.getDate();
    const buyerAge = (bMonthDiff < 0 || (bMonthDiff === 0 && bDayDiff < 0)) ? bAgeDiff - 1 : bAgeDiff;
    if (buyerAge < 18) {
      this.errorMessage.set('Buyer must be at least 18 years old to register.');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(this.buyerPhone.trim())) {
      this.errorMessage.set('Mobile number must be exactly 10 digits starting with 6, 7, 8, or 9.');
      return;
    }

    if (!this.buyerPassword || this.buyerPassword.length < 6) {
      this.errorMessage.set('Password must be at least 6 characters.');
      return;
    }

    this.errorMessage.set(null);
    this.loading.set(true);

    this.authService.registerBuyer({
      fullName: this.buyerName,
      emailId: this.buyerEmail,
      password: this.buyerPassword,
      dob: this.buyerDob,
      mobileNo: this.buyerPhone
    }).subscribe({
      next: res => {
        this.loading.set(false);
        if (res.success && res.data) {
          this.authSuccess.emit(res.data);
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
    if (!this.sellerName.trim()) {
      this.errorMessage.set('Seller / Company name is required.');
      return;
    }
    if (!this.sellerEmail.trim()) {
      this.errorMessage.set('Email address is required.');
      return;
    }
    if (!this.sellerDob) {
      this.errorMessage.set('Date of birth is required for seller registration.');
      return;
    }
    const sellerBirth = new Date(this.sellerDob);
    const today = new Date();
    if (sellerBirth > today) {
      this.errorMessage.set('Date of birth cannot be in the future.');
      return;
    }
    const sAgeDiff = today.getFullYear() - sellerBirth.getFullYear();
    const sMonthDiff = today.getMonth() - sellerBirth.getMonth();
    const sDayDiff = today.getDate() - sellerBirth.getDate();
    const sellerAge = (sMonthDiff < 0 || (sMonthDiff === 0 && sDayDiff < 0)) ? sAgeDiff - 1 : sAgeDiff;
    if (sellerAge < 18) {
      this.errorMessage.set('Seller must be at least 18 years old to register.');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(this.sellerPhone.trim())) {
      this.errorMessage.set('Mobile number must be exactly 10 digits starting with 6, 7, 8, or 9.');
      return;
    }

    if (!this.sellerStateId || !this.sellerCityId) {
      this.errorMessage.set('Please select both State and City.');
      return;
    }

    if (!this.sellerAddress.trim()) {
      this.errorMessage.set('Address is required.');
      return;
    }

    if (!this.sellerPassword || this.sellerPassword.length < 6) {
      this.errorMessage.set('Password must be at least 6 characters.');
      return;
    }

    this.errorMessage.set(null);
    this.loading.set(true);

    this.authService.registerSeller({
      fullName: this.sellerName,
      emailId: this.sellerEmail,
      password: this.sellerPassword,
      phoneNo: this.sellerPhone,
      address: this.sellerAddress,
      stateId: Number(this.sellerStateId),
      cityId: Number(this.sellerCityId),
      dateofBirth: this.sellerDob
    }).subscribe({
      next: res => {
        this.loading.set(false);
        if (res.success && res.data) {
          this.authSuccess.emit(res.data);
        } else {
          this.errorMessage.set(res.message || 'Seller registration failed.');
        }
      },
      error: err => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message || 'Failed to register seller.');
      }
    });
  }
}
