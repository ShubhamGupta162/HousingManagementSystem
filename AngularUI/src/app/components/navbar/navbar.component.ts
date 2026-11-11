import { Component, output } from '@angular/core';
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
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          @if (!authService.isLoggedIn()) {
            <button class="btn-login-mmt" (click)="openAuth.emit()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12ZM12 14C7.58172 14 2 16.2386 2 20.5V22H22V20.5C22 16.2386 16.4183 14 12 14Z" />
              </svg>
              <span>Login or Create Account</span>
            </button>
          } @else {
            <div class="user-pill">
              <span class="user-avatar">{{ authService.currentUser()?.fullName?.charAt(0) ?? 'U' }}</span>
              <div class="user-info">
                <span class="user-name">{{ authService.currentUser()?.fullName }}</span>
                <span class="user-role">{{ authService.userRole() }}</span>
              </div>
            </div>

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
            }

            @if (authService.userRole() === 'Seller') {
              <button class="btn-seller-post" (click)="openPostProperty.emit()">
                <span>+ Post Property</span>
                <span class="free-tag">FREE</span>
              </button>
              <button class="btn-nav-link" (click)="openSellerDashboard.emit()">
                My Listings
              </button>
            }

            @if (authService.userRole() === 'Admin') {
              <button class="btn-nav-link admin-link" (click)="openAdminPanel.emit()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
                </svg>
                Admin Panel
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
      padding: 14px 0;
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
      gap: 12px;
      cursor: pointer;
      user-select: none;
    }
    .brand-logo-badge {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #008cff 0%, #0056b3 100%);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .brand-title {
      font-size: 21px;
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
      font-size: 10px;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
      display: block;
      margin-top: 2px;
    }
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .btn-login-mmt {
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.25);
      color: #ffffff;
      padding: 8px 18px;
      border-radius: 20px;
      font-size: 13px;
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
      gap: 8px;
      background: rgba(255, 255, 255, 0.08);
      padding: 4px 12px;
      border-radius: 20px;
    }
    .user-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #008cff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 13px;
    }
    .user-name {
      font-size: 13px;
      font-weight: 600;
      display: block;
    }
    .user-role {
      font-size: 10px;
      color: #79a6d2;
      text-transform: uppercase;
      display: block;
    }
    .btn-cart-mmt {
      background: #ffffff;
      color: #05203c;
      font-weight: 700;
      font-size: 13px;
      padding: 8px 16px;
      border-radius: 20px;
      position: relative;
    }
    .cart-badge {
      background: #e41d36;
      color: #fff;
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 10px;
      margin-left: 4px;
    }
    .btn-seller-post {
      background: var(--mmt-blue-btn);
      color: #fff;
      font-weight: 700;
      font-size: 13px;
      padding: 8px 16px;
      border-radius: 20px;
    }
    .free-tag {
      background: #ffcc00;
      color: #000;
      font-size: 9px;
      padding: 2px 4px;
      border-radius: 3px;
      font-weight: 800;
      margin-left: 4px;
    }
    .btn-nav-link {
      background: transparent;
      color: #ffffff;
      font-size: 13px;
      font-weight: 600;
      padding: 8px 12px;
    }
    .admin-link {
      color: #ffcc00;
    }
    .btn-logout {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #ff9999;
      font-size: 12px;
      padding: 6px 12px;
      border-radius: 14px;
    }
    .btn-logout:hover {
      background: rgba(255, 0, 0, 0.2);
    }
  `]
})
export class NavbarComponent {
  openAuth = output<void>();
  openCart = output<void>();
  openPostProperty = output<void>();
  openSellerDashboard = output<void>();
  openAdminPanel = output<void>();
  resetHome = output<void>();

  constructor(
    public authService: AuthService,
    public cartService: CartService
  ) {}

  logout(): void {
    this.authService.logout();
    this.cartService.clearCart();
  }

  onHomeClick(): void {
    this.resetHome.emit();
  }
}
