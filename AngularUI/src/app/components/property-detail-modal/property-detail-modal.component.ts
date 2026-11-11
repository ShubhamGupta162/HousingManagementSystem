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
                  <span class="badge-verified">
                    <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    Verified Listing
                  </span>
                }
              </div>
              <h2 class="property-title">{{ property()?.propertyName }}</h2>
              <span class="property-location">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="#94a3b8">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                {{ property()?.landmark }}, {{ property()?.address }}
              </span>
            </div>
            <button class="btn-close" (click)="close.emit()" title="Close details">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="modal-body">
            <!-- Architectural Banner -->
            <div class="photo-banner">
              <svg class="banner-svg" viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="600" height="200" fill="#082038" />
                <path d="M0 50H600M0 100H600M0 150H600" stroke="#103254" stroke-width="0.8" />
                <path d="M75 0V200M150 0V200M225 0V200M300 0V200M375 0V200M450 0V200M525 0V200" stroke="#103254" stroke-width="0.8" />
                <path d="M50 200V80L140 40V200" fill="#0e3153" opacity="0.8"/>
                <path d="M140 200V20L320 20V200" fill="#144372" opacity="0.9"/>
                <path d="M320 200V60L460 60V200" fill="#103961" opacity="0.8"/>
                <!-- Windows -->
                <rect x="170" y="45" width="24" height="28" rx="2" fill="#60a5fa" opacity="0.7"/>
                <rect x="220" y="45" width="24" height="28" rx="2" fill="#93c5fd" opacity="0.8"/>
                <rect x="270" y="45" width="24" height="28" rx="2" fill="#60a5fa" opacity="0.7"/>
                <rect x="170" y="90" width="24" height="28" rx="2" fill="#93c5fd" opacity="0.8"/>
                <rect x="220" y="90" width="24" height="28" rx="2" fill="#60a5fa" opacity="0.7"/>
                <rect x="270" y="90" width="24" height="28" rx="2" fill="#93c5fd" opacity="0.8"/>
              </svg>
              <div class="photo-overlay">
                <span>Verified Architectural Listing</span>
              </div>
            </div>

            <!-- Price & Highlights Grid -->
            <div class="pricing-card">
              <div class="price-section">
                <span class="price-label">LISTING PRICE</span>
                <div class="price-val-wrap">
                  <span class="price-val">{{ formatPrice(property()?.priceRange || 0) }}</span>
                  @if (property()?.propertyOption === 'Rent') {
                    <span class="rent-period">/ month</span>
                  }
                </div>
              </div>
              @if (property()?.initialDeposit && property()!.initialDeposit > 0) {
                <div class="deposit-section">
                  <span class="deposit-label">SECURITY DEPOSIT</span>
                  <strong class="deposit-val">{{ formatPrice(property()!.initialDeposit) }}</strong>
                </div>
              }
              <div class="cta-actions">
                <button class="btn-contact-now" (click)="contactOwner.emit(property()!.sellerId)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-2.2 2.2a15.053 15.053 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1.01A11.36 11.36 0 018.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/>
                  </svg>
                  Get Owner Contact
                </button>
                @if (isBuyer()) {
                  <button
                    class="btn-cart-toggle"
                    [class.in-cart]="isInCart()"
                    (click)="toggleCart.emit(property()!.propertyId)"
                  >
                    @if (isInCart()) {
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      </svg>
                      In Your Cart
                    } @else {
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zM3 6h18M16 10a4 4 0 01-8 0" />
                      </svg>
                      Save to Cart
                    }
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

            <!-- Amenities & Features (MMT clean style) -->
            <div class="info-section">
              <h3 class="section-heading">Key Amenities & Specifications</h3>
              <div class="amenities-grid">
                <div class="amenity-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#008cff">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                  </svg>
                  <span>24x7 Security & CCTV</span>
                </div>
                <div class="amenity-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#008cff">
                    <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
                  </svg>
                  <span>100% Power Backup</span>
                </div>
                <div class="amenity-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#008cff">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4.66l.12-.34h13.77l.11.34V17z"/>
                  </svg>
                  <span>Reserved Covered Parking</span>
                </div>
                <div class="amenity-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#008cff">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                  </svg>
                  <span>Clubhouse & Gymnasium</span>
                </div>
              </div>
            </div>

            <!-- EHS Trust Banner -->
            <div class="trust-banner">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#108a00">
                <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
              </svg>
              <div>
                <strong>Direct Owner Verification Guarantee</strong>
                <p>All contact details are checked against land registration records. Never pay token amounts before inspection.</p>
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
      background: rgba(5, 32, 60, 0.7);
      backdrop-filter: blur(2px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .modal-card {
      background: #ffffff;
      width: 100%;
      max-width: 720px;
      border-radius: 10px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: modalFadeIn 0.2s ease-out;
    }
    @keyframes modalFadeIn {
      from { transform: scale(0.97); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .modal-header {
      padding: 16px 20px;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      background: #ffffff;
    }
    .badge-row {
      display: flex;
      gap: 8px;
      margin-bottom: 6px;
      align-items: center;
    }
    .badge-opt {
      background: #008cff;
      color: #ffffff;
      font-size: 10px;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 4px;
      letter-spacing: 0.5px;
    }
    .badge-opt.rent {
      background: #e41d36;
    }
    .badge-type {
      background: #f1f5f9;
      color: #334155;
      font-size: 10px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid #cbd5e1;
    }
    .badge-verified {
      background: #e6f9ed;
      color: #108a00;
      font-size: 10px;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 4px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      border: 1px solid #b7ebd0;
    }
    .property-title {
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 4px 0;
    }
    .property-location {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #64748b;
    }
    .btn-close {
      background: none;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      padding: 6px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.15s, color 0.15s;
    }
    .btn-close:hover {
      background: #f1f5f9;
      color: #0f172a;
    }
    .modal-body {
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .photo-banner {
      position: relative;
      height: 180px;
      background: #082038;
      border-radius: 8px;
      overflow: hidden;
    }
    .banner-svg {
      width: 100%;
      height: 100%;
      display: block;
    }
    .photo-overlay {
      position: absolute;
      bottom: 10px;
      left: 10px;
      background: rgba(5, 32, 60, 0.85);
      color: #ffffff;
      padding: 3px 10px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }
    .pricing-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 14px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 14px;
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
      font-size: 22px;
      font-weight: 800;
      color: #05203c;
    }
    .rent-period {
      font-size: 12px;
      color: #64748b;
      font-weight: 500;
      margin-left: 2px;
    }
    .deposit-val {
      font-size: 14px;
      color: #1e293b;
      font-weight: 700;
    }
    .cta-actions {
      display: flex;
      gap: 8px;
    }
    .btn-contact-now {
      background: #ffffff;
      color: #008cff;
      border: 1px solid #008cff;
      padding: 9px 16px;
      font-size: 12px;
      font-weight: 700;
      border-radius: 6px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: background 0.15s ease;
    }
    .btn-contact-now:hover {
      background: #f0f7ff;
    }
    .btn-cart-toggle {
      background: #008cff;
      color: #ffffff;
      border: none;
      padding: 9px 16px;
      font-size: 12px;
      font-weight: 700;
      border-radius: 6px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: background 0.15s ease;
    }
    .btn-cart-toggle:hover {
      background: #0076db;
    }
    .btn-cart-toggle.in-cart {
      background: #108a00;
    }
    .info-section {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .section-heading {
      font-size: 14px;
      font-weight: 800;
      color: #0f172a;
      margin: 0;
    }
    .description-text {
      font-size: 13px;
      color: #475569;
      line-height: 1.5;
      margin: 0;
    }
    .amenities-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
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
      font-size: 12px;
      color: #334155;
      background: #f8fafc;
      padding: 8px 10px;
      border-radius: 6px;
      border: 1px solid #edf2f7;
    }
    .trust-banner {
      display: flex;
      gap: 10px;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 11px;
      color: #166534;
      align-items: center;
    }
    .trust-banner strong {
      display: block;
      font-size: 12px;
      color: #166534;
    }
    .trust-banner p {
      margin: 2px 0 0 0;
      color: #15803d;
      font-size: 11px;
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

  formatPrice(price: number): string {
    if (!price || price <= 0) return '₹0';
    if (price >= 10000000) {
      const cr = price / 10000000;
      return `₹${cr.toFixed(2).replace(/\.00$/, '')} Cr`;
    }
    if (price >= 100000) {
      const lk = price / 100000;
      return `₹${lk.toFixed(1).replace(/\.0$/, '')} Lakh`;
    }
    return `₹${price.toLocaleString('en-IN')}`;
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }
}
