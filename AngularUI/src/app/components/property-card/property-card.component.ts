import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Property } from '../../models/models';

@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="mmt-prop-card">
      <!-- Architectural Thumbnail Area -->
      <div class="card-image-wrap" (click)="onViewDetails()">
        <div class="blueprint-bg">
          <svg class="blueprint-svg" viewBox="0 0 300 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="160" fill="#082038" />
            <path d="M0 40H300M0 80H300M0 120H300" stroke="#123557" stroke-width="0.8" />
            <path d="M50 0V160M100 0V160M150 0V160M200 0V160M250 0V160" stroke="#123557" stroke-width="0.8" />
            <path d="M30 160V65L90 35V160" fill="#0d2e4f" opacity="0.8"/>
            <path d="M90 160V22L170 22V160" fill="#14426f" opacity="0.9"/>
            <path d="M170 160V50L240 50V160" fill="#0e345b" opacity="0.8"/>
            <rect x="105" y="38" width="12" height="16" rx="1" fill="#60a5fa" opacity="0.7"/>
            <rect x="135" y="38" width="12" height="16" rx="1" fill="#60a5fa" opacity="0.7"/>
            <rect x="105" y="66" width="12" height="16" rx="1" fill="#93c5fd" opacity="0.85"/>
            <rect x="135" y="66" width="12" height="16" rx="1" fill="#93c5fd" opacity="0.85"/>
            <rect x="105" y="94" width="12" height="16" rx="1" fill="#60a5fa" opacity="0.7"/>
            <rect x="135" y="94" width="12" height="16" rx="1" fill="#93c5fd" opacity="0.85"/>
          </svg>
          <span class="prop-type-badge">{{ property().propertyType }}</span>
        </div>

        <div class="option-tag" [class.rent-tag]="property().propertyOption === 'Rent'">
          {{ property().propertyOption === 'Rent' ? 'FOR RENT' : 'FOR SALE' }}
        </div>

        @if (property().isActive) {
          <div class="verified-badge">
            <svg width="11" height="11" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            Verified
          </div>
        }
        <span class="view-overlay-hint">View Details</span>
      </div>

      <!-- Card Body Content -->
      <div class="card-content">
        <div class="card-top-row" (click)="onViewDetails()" style="cursor: pointer;">
          <h3 class="prop-name">{{ property().propertyName }}</h3>
        </div>

        <div class="prop-location">
          <svg class="loc-icon" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <span class="loc-text">{{ property().landmark }}, {{ property().address }}</span>
        </div>

        @if (property().description) {
          <p class="prop-desc">{{ property().description }}</p>
        }

        <!-- Price & Deposit Section -->
        <div class="card-pricing">
          <div class="price-block">
            <span class="price-val">{{ formatPrice(property().priceRange) }}</span>
            @if (property().propertyOption === 'Rent') {
              <span class="rent-period">/ mo</span>
            }
          </div>
          @if (property().initialDeposit > 0) {
            <div class="deposit-block">
              <span class="dep-label">Deposit:</span>
              <span class="dep-val">{{ formatPrice(property().initialDeposit) }}</span>
            </div>
          }
        </div>

        <!-- Action Footer -->
        <div class="card-actions">
          <button class="btn-contact-owner" (click)="onContactClick()">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-2.2 2.2a15.053 15.053 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1.01A11.36 11.36 0 018.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/>
            </svg>
            Contact Owner
          </button>

          @if (isBuyer()) {
            <button
              class="btn-cart-action"
              [class.in-cart]="isInCart()"
              (click)="onCartClick()"
            >
              @if (isInCart()) {
                <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                Saved
              } @else {
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zM3 6h18M16 10a4 4 0 01-8 0" />
                </svg>
                Save
              }
            </button>
          }
        </div>
      </div>
    </article>
  `,
  styles: [`
    .mmt-prop-card {
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
      border: 1px solid #e5edf5;
      display: flex;
      flex-direction: column;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .mmt-prop-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
    }
    .card-image-wrap {
      position: relative;
      height: 155px;
      background: #082038;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      overflow: hidden;
    }
    .blueprint-bg {
      width: 100%;
      height: 100%;
      position: relative;
    }
    .blueprint-svg {
      width: 100%;
      height: 100%;
      display: block;
    }
    .card-image-wrap:hover .view-overlay-hint {
      opacity: 1;
    }
    .view-overlay-hint {
      position: absolute;
      background: rgba(5, 32, 60, 0.85);
      color: #ffffff;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 700;
      opacity: 0;
      transition: opacity 0.2s ease;
      letter-spacing: 0.3px;
    }
    .prop-type-badge {
      position: absolute;
      bottom: 8px;
      left: 10px;
      background: rgba(5, 32, 60, 0.88);
      color: #ffffff;
      font-size: 10px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 3px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }
    .option-tag {
      position: absolute;
      top: 8px;
      left: 10px;
      background: #008cff;
      color: #ffffff;
      font-size: 10px;
      font-weight: 800;
      padding: 2px 7px;
      border-radius: 3px;
      letter-spacing: 0.5px;
    }
    .option-tag.rent-tag {
      background: #e41d36;
    }
    .verified-badge {
      position: absolute;
      top: 8px;
      right: 10px;
      background: #e6f9ed;
      color: #108a00;
      font-size: 10px;
      font-weight: 800;
      padding: 2px 7px;
      border-radius: 3px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      border: 1px solid #b7ebd0;
    }
    .card-content {
      padding: 12px 14px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .card-top-row {
      margin-bottom: 3px;
    }
    .prop-name {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.3;
      margin: 0;
      transition: color 0.15s;
    }
    .card-top-row:hover .prop-name {
      color: #008cff;
    }
    .prop-location {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      color: #64748b;
      margin-bottom: 6px;
    }
    .loc-icon {
      color: #94a3b8;
      flex-shrink: 0;
    }
    .loc-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .prop-desc {
      font-size: 11px;
      color: #475569;
      line-height: 1.4;
      margin: 0 0 10px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .card-pricing {
      margin-top: auto;
      padding-top: 8px;
      border-top: 1px solid #f1f5f9;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 10px;
    }
    .price-val {
      font-size: 17px;
      font-weight: 800;
      color: #05203c;
    }
    .rent-period {
      font-size: 11px;
      color: #64748b;
      font-weight: 500;
      margin-left: 2px;
    }
    .deposit-block {
      font-size: 11px;
      color: #64748b;
    }
    .dep-val {
      font-weight: 700;
      color: #334155;
    }
    .card-actions {
      display: flex;
      gap: 6px;
    }
    .btn-contact-owner {
      flex: 1;
      background: #ffffff;
      border: 1px solid #008cff;
      color: #008cff;
      font-size: 11px;
      font-weight: 700;
      padding: 7px 10px;
      border-radius: 4px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      transition: all 0.15s ease;
    }
    .btn-contact-owner:hover {
      background: #f0f7ff;
    }
    .btn-cart-action {
      background: #008cff;
      color: #ffffff;
      border: none;
      padding: 7px 12px;
      font-size: 11px;
      font-weight: 700;
      border-radius: 4px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: background 0.15s ease;
    }
    .btn-cart-action:hover {
      background: #0076db;
    }
    .btn-cart-action.in-cart {
      background: #108a00;
    }
  `]
})
export class PropertyCardComponent {
  readonly property = input.required<Property>();
  readonly isBuyer = input<boolean>(false);
  readonly isInCart = input<boolean>(false);

  readonly getContact = output<number>();
  readonly toggleCart = output<number>();
  readonly viewDetails = output<Property>();

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

  onContactClick(): void {
    this.getContact.emit(this.property().sellerId);
  }

  onCartClick(): void {
    this.toggleCart.emit(this.property().propertyId);
  }

  onViewDetails(): void {
    this.viewDetails.emit(this.property());
  }
}
