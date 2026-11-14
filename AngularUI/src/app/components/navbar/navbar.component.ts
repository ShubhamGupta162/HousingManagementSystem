import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="mmt-header">
      <div class="container nav-content">
        <!-- Professional MMT-Style Brand Logo -->
        <div class="brand" (click)="onHomeClick()" title="EasyHousing Solutions - Return to Home">
          <div class="brand-logo-badge">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 10.5L12 3L21 10.5V20C21 20.5523 20.5523 21 20 21H15V14H9V21H4C3.44772 21 3 20.5523 3 20V10.5Z" fill="#ffffff" />
              <path d="M9 21V14H15V21H9Z" fill="#008cff" />
            </svg>
          </div>
          <div class="brand-text">
            <span class="brand-title">easy<span class="brand-highlight">housing</span></span>
            <span class="brand-sub">Real Estate & Homes</span>
          </div>
        </div>

        <nav class="nav-actions">
          <!-- 1. Home Tab: Visible ONLY to guest users (hidden after login) -->
          @if (!authService.isLoggedIn()) {
            <button
              class="btn-nav-link"
              [class.active-nav-link]="currentView() === 'landing'"
              (click)="onHomeClick()"
            >
              Home
            </button>
          }

          <!-- 2. Marketplace Tab: Visible to all users -->
          <button
            class="btn-nav-link"
            [class.active-nav-link]="currentView() === 'marketplace'"
            (click)="viewMarketplace.emit()"
          >
            Marketplace
          </button>

          <!-- 3. Guest Login Button: Visible when not logged in and not on landing page -->
          @if (!authService.isLoggedIn()) {
            @if (currentView() !== 'landing') {
              <button class="btn-login-mmt" (click)="openAuth.emit()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12ZM12 14C7.58172 14 2 16.2386 2 20.5V22H22V20.5C22 16.2386 16.4183 14 12 14Z" />
                </svg>
                <span>Login or Create Account</span>
              </button>
            }
          } @else {
            <div class="user-pill">
              <span class="user-avatar">{{ authService.currentUser()?.fullName?.charAt(0) ?? 'U' }}</span>
              <div class="user-info">
                <span class="user-name">{{ authService.currentUser()?.fullName }}</span>
                <span class="user-role">{{ authService.userRole() }}</span>
              </div>
            </div>

            <!-- BUYER MENU -->
            @if (authService.userRole() === 'Buyer') {
              <button class="btn-cart-mmt" (click)="openCart.emit()">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zM3 6h18M16 10a4 4 0 01-8 0" />
                </svg>
                <span>Saved Properties</span>
                @if (cartService.cartCount() > 0) {
                  <span class="cart-badge">{{ cartService.cartCount() }}</span>
                }
              </button>
              <button class="btn-nav-link" (click)="openPurchases.emit()">
                My Purchases
              </button>
            }

            <!-- SELLER MENU: Visible ONLY when logged in as Seller -->
            @if (authService.userRole() === 'Seller') {
              <button
                class="btn-nav-link"
                [class.active-nav-link]="currentView() === 'seller-dashboard'"
                (click)="viewSellerDashboard.emit()"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                </svg>
                <span>Seller Dashboard</span>
              </button>
              <button
                class="btn-nav-link"
                [class.active-nav-link]="currentView() === 'marketplace'"
                (click)="viewMarketplace.emit()"
              >
                Browse Marketplace
              </button>
              <button class="btn-seller-post" (click)="openPostProperty.emit()">
                <span>+ Post Property</span>
                <span class="free-tag">FREE</span>
              </button>
            }

            <!-- ADMIN MENU: Visible ONLY when logged in as Admin -->
            @if (authService.userRole() === 'Admin') {
              <button
                class="btn-nav-link admin-link"
                [class.active-nav-link]="currentView() === 'admin-dashboard'"
                (click)="viewAdminDashboard.emit()"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
                </svg>
                <span>Admin Dashboard</span>
              </button>
              <button
                class="btn-nav-link"
                [class.active-nav-link]="currentView() === 'marketplace'"
                (click)="viewMarketplace.emit()"
              >
                Browse Marketplace
              </button>
            }

            <button class="btn-logout" (click)="logout()">Sign Out</button>
          }
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .mmt-header {
      background: #05203c;
      color: #ffffff;
      padding: 6px 0;
      border-bottom: none;
      box-shadow: none;
    }
    .nav-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      user-select: none;
    }
    .brand-logo-badge {
      width: 28px;
      height: 28px;
      background: linear-gradient(135deg, #008cff 0%, #0056b3 100%);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .brand-title {
      font-size: 17px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #ffffff;
      display: block;
      line-height: 1.1;
    }
    .brand-highlight {
      color: #008cff;
    }
    .brand-sub {
      font-size: 8px;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      font-weight: 600;
      display: block;
      margin-top: 1px;
    }
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .btn-login-mmt {
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.25);
      color: #ffffff;
      padding: 5px 14px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .btn-login-mmt:hover {
      background: rgba(255, 255, 255, 0.22);
    }
    .user-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.08);
      padding: 2px 10px;
      border-radius: 16px;
    }
    .user-avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #008cff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 11px;
    }
    .user-name {
      font-size: 12px;
      font-weight: 600;
      display: block;
    }
    .user-role {
      font-size: 9px;
      color: #79a6d2;
      text-transform: uppercase;
      display: block;
    }
    .btn-cart-mmt {
      background: #ffffff;
      color: #05203c;
      font-weight: 700;
      font-size: 12px;
      padding: 5px 12px;
      border-radius: 16px;
      position: relative;
    }
    .cart-badge {
      background: #e41d36;
      color: #fff;
      font-size: 9px;
      padding: 1px 5px;
      border-radius: 8px;
      margin-left: 4px;
    }
    .btn-seller-post {
      background: var(--mmt-blue-btn);
      color: #fff;
      font-weight: 700;
      font-size: 12px;
      padding: 5px 12px;
      border-radius: 16px;
    }
    .free-tag {
      background: #ffcc00;
      color: #000;
      font-size: 9px;
      padding: 1px 4px;
      border-radius: 3px;
      font-weight: 800;
      margin-left: 4px;
    }
    .btn-nav-link {
      background: transparent;
      color: #ffffff;
      font-size: 12px;
      font-weight: 600;
      padding: 5px 10px;
      border: 1px solid transparent;
      border-radius: 12px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      transition: all 0.15s ease;
    }
    .btn-nav-link:hover {
      background: rgba(255, 255, 255, 0.12);
    }
    .btn-nav-link.active-nav-link {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.35);
      color: #ffcc00;
      font-weight: 700;
    }
    .admin-link {
      color: #ffcc00;
    }
    .btn-logout {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #ff9999;
      font-size: 11px;
      padding: 4px 10px;
      border-radius: 12px;
    }
    .btn-logout:hover {
      background: rgba(255, 0, 0, 0.2);
    }
  `]
})
export class NavbarComponent {
  readonly currentView = input<'landing' | 'marketplace' | 'admin-dashboard' | 'seller-dashboard'>('landing');

  openAuth = output<void>();
  openCart = output<void>();
  openPurchases = output<void>();
  openPostProperty = output<void>();
  openSellerDashboard = output<void>();
  openAdminPanel = output<void>();
  viewMarketplace = output<void>();
  viewAdminDashboard = output<void>();
  viewSellerDashboard = output<void>();
  resetHome = output<void>();

  constructor(
    public authService: AuthService,
    public cartService: CartService
  ) {}

  logout(): void {
    this.authService.logout();
    this.cartService.clearCart();
    this.resetHome.emit();
  }

  // Handles brand logo and home button clicks
  onHomeClick(): void {
    if (this.authService.isLoggedIn()) {
      // If logged in, navigate to the user's role-specific dashboard
      const role = this.authService.userRole();
      if (role === 'Admin') {
        this.viewAdminDashboard.emit();
      } else if (role === 'Seller') {
        this.viewSellerDashboard.emit();
      } else {
        this.viewMarketplace.emit();
      }
    } else {
      // If guest (not logged in), return to landing login page
      this.resetHome.emit();
    }
  }
}
