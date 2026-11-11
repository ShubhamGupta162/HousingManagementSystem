import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Property } from '../../models/models';

@Component({
  selector: 'app-property-detail-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen() && property()) {
      <div class="modal-backdrop" (click)="onBackdropClick($event)">
        <div class="modal-card">
          <!-- Modal Header -->
          <div class="modal-header">
            <div class="header-titles">
              <div class="badge-row">
                <span class="badge-opt" [class.rent]="property()?.propertyOption === 'Rent'">
                  {{ property()?.propertyOption === 'Rent' ? 'FOR RENT' : 'FOR SALE' }}
                </span>
                <span class="badge-type">{{ property()?.propertyType }}</span>
                @if (property()?.isActive) {
                  <span class="badge-verified">✓ Verified by EHS</span>
                }
              </div>
              <h2 class="property-title">{{ property()?.propertyName }}</h2>
              <span class="property-location">📍 {{ property()?.landmark }}, {{ property()?.address }}</span>
            </div>
            <button class="btn-close" (click)="close.emit()">✕</button>
          </div>

          <!-- Modal Body -->
          <div class="modal-body">
            <!-- Big Photo Banner -->
            <div class="photo-banner">
              <span class="banner-glyph">🏡</span>
              <div class="photo-overlay">
                <span class="photo-tag">📸 Verified Real Estate Listing</span>
              </div>
            </div>

            <!-- Price & Highlights Grid -->
            <div class="pricing-card">
              <div class="price-section">
                <span class="price-label">LISTING PRICE</span>
                <div class="price-val-wrap">
                  <span class="price-val">₹{{ property()?.priceRange | number:'1.0-0' }}</span>
                  @if (property()?.propertyOption === 'Rent') {
                    <span class="rent-period">/ month</span>
                  }
                </div>
              </div>
              @if (property()?.initialDeposit && property()!.initialDeposit > 0) {
                <div class="deposit-section">
                  <span class="deposit-label">SECURITY DEPOSIT</span>
                  <strong class="deposit-val">₹{{ property()?.initialDeposit | number:'1.0-0' }}</strong>
                </div>
              }
              <div class="cta-actions">
                <button class="btn-contact-now" (click)="contactOwner.emit(property()!.sellerId)">
                  📞 Get Owner Contact
                </button>
                @if (isBuyer()) {
                  <button
                    class="btn-cart-toggle"
                    [class.in-cart]="isInCart()"
                    (click)="toggleCart.emit(property()!.propertyId)"
                  >
                    {{ isInCart() ? '✓ In Your Cart' : '🛒 Add to Cart' }}
                  </button>
                }
              </div>
            </div>

            <!-- Property Description -->
            <div class="info-section">
              <h3 class="section-heading">About This Property</h3>
              <p class="description-text">
                {{ property()?.description || 'No detailed description provided for this listing.' }}
              </p>
            </div>

            <!-- Amenities & Features (MMT style) -->
            <div class="info-section">
              <h3 class="section-heading">Key Amenities & Features</h3>
              <div class="amenities-grid">
                <div class="amenity-item">
                  <span class="amenity-icon">🛡️</span>
                  <span>24x7 Security & CCTV</span>
                </div>
                <div class="amenity-item">
                  <span class="amenity-icon">⚡</span>
                  <span>100% Power Backup</span>
                </div>
                <div class="amenity-item">
                  <span class="amenity-icon">🚗</span>
                  <span>Reserved Covered Parking</span>
                </div>
                <div class="amenity-item">
                  <span class="amenity-icon">🏊</span>
                  <span>Clubhouse & Swimming Pool</span>
                </div>
                <div class="amenity-item">
                  <span class="amenity-icon">🏋️</span>
                  <span>Equipped Fitness Gym</span>
                </div>
                <div class="amenity-item">
                  <span class="amenity-icon">🌳</span>
                  <span>Landscaped Garden Park</span>
                </div>
              </div>
            </div>

            <!-- Trust Banner -->
            <div class="trust-banner">
              <span class="trust-shield">🛡️</span>
              <div>
                <strong>EasyHousing Assurance</strong>
                <p>All listings are vetted with confirmed owner ownership and verified contact credentials.</p>
              </div>
            </div>
          </div>
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
      background: rgba(5, 32, 60, 0.75);
      backdrop-filter: blur(4px);
      z-index: 1050;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .modal-card {
      background: #ffffff;
      width: 100%;
      max-width: 720px;
      border-radius: 16px;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      animation: modalFadeIn 0.2s ease-out;
      overflow: hidden;
    }
    @keyframes modalFadeIn {
      from { transform: scale(0.96); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 20px 24px;
      border-bottom: 1px solid #edf2f7;
      background: #fafcfe;
    }
    .badge-row {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-bottom: 6px;
    }
    .badge-opt {
      background: #008cff;
      color: #ffffff;
      font-size: 11px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 4px;
      letter-spacing: 0.5px;
    }
    .badge-opt.rent {
      background: #ff5722;
    }
    .badge-type {
      background: #e2e8f0;
      color: #334155;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;
    }
    .badge-verified {
      background: #ecfdf5;
      color: #059669;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;
      border: 1px solid #a7f3d0;
    }
    .property-title {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 4px 0;
    }
    .property-location {
      font-size: 13px;
      color: #64748b;
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
    .modal-body {
      padding: 24px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .photo-banner {
      position: relative;
      height: 220px;
      background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .banner-glyph {
      font-size: 64px;
    }
    .photo-overlay {
      position: absolute;
      bottom: 12px;
      left: 12px;
      background: rgba(0, 0, 0, 0.6);
      color: #ffffff;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
    }
    .pricing-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }
    .price-label, .deposit-label {
      display: block;
      font-size: 10px;
      font-weight: 800;
      color: #64748b;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }
    .price-val {
      font-size: 24px;
      font-weight: 800;
      color: #05203c;
    }
    .rent-period {
      font-size: 13px;
      color: #64748b;
      margin-left: 4px;
    }
    .deposit-val {
      font-size: 15px;
      color: #1e293b;
    }
    .cta-actions {
      display: flex;
      gap: 10px;
    }
    .btn-contact-now {
      background: #ffffff;
      color: #008cff;
      border: 1px solid #008cff;
      padding: 10px 18px;
      font-size: 13px;
      font-weight: 700;
      border-radius: 8px;
      cursor: pointer;
    }
    .btn-contact-now:hover {
      background: #f0f7ff;
    }
    .btn-cart-toggle {
      background: #008cff;
      color: #ffffff;
      border: none;
      padding: 10px 20px;
      font-size: 13px;
      font-weight: 700;
      border-radius: 8px;
      cursor: pointer;
    }
    .btn-cart-toggle:hover {
      background: #0070cc;
    }
    .btn-cart-toggle.in-cart {
      background: #10b981;
    }
    .info-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .section-heading {
      font-size: 15px;
      font-weight: 800;
      color: #0f172a;
      margin: 0;
    }
    .description-text {
      font-size: 13px;
      color: #475569;
      line-height: 1.6;
      margin: 0;
    }
    .amenities-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
    @media (max-width: 600px) {
      .amenities-grid {
        grid-template-columns: 1fr;
      }
    }
    .amenity-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #334155;
      background: #f8fafc;
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid #edf2f7;
    }
    .amenity-icon {
      font-size: 16px;
    }
    .trust-banner {
      display: flex;
      gap: 12px;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 12px;
      color: #166534;
    }
    .trust-shield {
      font-size: 22px;
    }
    .trust-banner p {
      margin: 2px 0 0 0;
      color: #15803d;
    }
  `]
})
export class PropertyDetailModalComponent {
  readonly isOpen = input<boolean>(false);
  readonly property = input<Property | null>(null);
  readonly isBuyer = input<boolean>(false);
  readonly isInCart = input<boolean>(false);

  readonly close = output<void>();
  readonly contactOwner = output<number>();
  readonly toggleCart = output<number>();

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }
}
