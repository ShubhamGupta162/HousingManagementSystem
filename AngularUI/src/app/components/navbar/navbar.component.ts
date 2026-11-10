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
        <div class="brand" (click)="onHomeClick()">
          <span class="brand-icon">🏠</span>
          <div class="brand-text">
            <span class="brand-title">EasyHousing</span>
            <span class="brand-sub">Make India Home</span>
          </div>
        </div>

        <nav class="nav-actions">
          @if (!authService.isLoggedIn()) {
            <button class="btn-login-mmt" (click)="openAuth.emit()">
              <span class="user-icon">👤</span> Login / Register
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
                🛒 Cart
                @if (cartService.cartCount() > 0) {
                  <span class="cart-badge">{{ cartService.cartCount() }}</span>
                }
              </button>
            }

            @if (authService.userRole() === 'Seller') {
              <button class="btn-seller-post" (click)="openPostProperty.emit()">
                + Post Property <span class="free-tag">FREE</span>
              </button>
              <button class="btn-nav-link" (click)="openSellerDashboard.emit()">
                My Listings
              </button>
            }

            @if (authService.userRole() === 'Admin') {
              <button class="btn-nav-link admin-link" (click)="openAdminPanel.emit()">
                🛡️ Admin Panel
              </button>
            }

            <button class="btn-logout" (click)="logout()">Logout</button>
          }
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .mmt-header {
      background: var(--mmt-header-grad);
      color: #ffffff;
      padding: 12px 0;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }
    .nav-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
    }
    .brand-icon {
      font-size: 26px;
    }
    .brand-title {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #ffffff;
      display: block;
    }
    .brand-sub {
      font-size: 11px;
      color: #9bb7d4;
      text-transform: uppercase;
      letter-spacing: 1px;
      display: block;
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
