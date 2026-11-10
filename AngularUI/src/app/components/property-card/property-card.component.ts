import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Property } from '../../models/models';

@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="mmt-prop-card">
      <!-- Image Thumbnail Area -->
      <div class="card-image-wrap">
        <div class="image-placeholder">
          <span class="house-glyph">🏡</span>
          <span class="prop-type-badge">{{ property().propertyType }}</span>
        </div>
        <div class="option-tag" [class.rent-tag]="property().propertyOption === 'Rent'">
          {{ property().propertyOption === 'Rent' ? 'FOR RENT' : 'FOR SALE' }}
        </div>
        @if (property().isActive) {
          <div class="verified-badge">
            <span class="v-check">✓</span> Verified by EHS
          </div>
        }
      </div>

      <!-- Card Body Content -->
      <div class="card-content">
        <div class="card-top-row">
          <h3 class="prop-name">{{ property().propertyName }}</h3>
        </div>

        <div class="prop-location">
          <span class="loc-pin">📍</span>
          <span class="loc-text">{{ property().landmark }}, {{ property().address }}</span>
        </div>

        @if (property().description) {
          <p class="prop-desc">{{ property().description }}</p>
        }

        <!-- Price & Deposit Section -->
        <div class="card-pricing">
          <div class="price-block">
            <span class="price-val">₹{{ property().priceRange | number:'1.0-0' }}</span>
            @if (property().propertyOption === 'Rent') {
              <span class="rent-period">/ month</span>
            }
          </div>
          @if (property().initialDeposit > 0) {
            <div class="deposit-block">
              <span class="dep-label">Deposit:</span>
              <span class="dep-val">₹{{ property().initialDeposit | number:'1.0-0' }}</span>
            </div>
          }
        </div>

        <!-- Action Footer -->
        <div class="card-actions">
          <button class="btn-contact-owner" (click)="onContactClick()">
            📞 Contact Owner
          </button>

          @if (isBuyer()) {
            <button
              class="btn-cart-action"
              [class.in-cart]="isInCart()"
              (click)="onCartClick()"
            >
              @if (isInCart()) {
                ✓ In Cart
              } @else {
                🛒 Add to Cart
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
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
      border: 1px solid #e5edf5;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .mmt-prop-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
    }
    .card-image-wrap {
      position: relative;
      height: 170px;
      background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .image-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }
    .house-glyph {
      font-size: 48px;
    }
    .prop-type-badge {
      background: rgba(5, 32, 60, 0.85);
      color: #ffffff;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 12px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .option-tag {
      position: absolute;
      top: 12px;
      left: 12px;
      background: #008cff;
      color: #ffffff;
      font-size: 11px;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 4px;
      letter-spacing: 0.5px;
    }
    .option-tag.rent-tag {
      background: #ff5722;
    }
    .verified-badge {
      position: absolute;
      bottom: 10px;
      right: 12px;
      background: #ecfdf5;
      color: #059669;
      border: 1px solid #a7f3d0;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .v-check {
      font-weight: 900;
    }
    .card-content {
      padding: 16px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .card-top-row {
      margin-bottom: 6px;
    }
    .prop-name {
      font-size: 17px;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .prop-location {
      font-size: 12px;
      color: #64748b;
      display: flex;
      align-items: center;
      gap: 4px;
      margin-bottom: 8px;
    }
    .loc-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .prop-desc {
      font-size: 12px;
      color: #475569;
      line-height: 1.4;
      margin: 0 0 12px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .card-pricing {
      margin-top: auto;
      padding: 10px 0;
      border-top: 1px dashed #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .price-val {
      font-size: 20px;
      font-weight: 800;
      color: #05203c;
    }
    .rent-period {
      font-size: 12px;
      color: #64748b;
      margin-left: 4px;
    }
    .deposit-block {
      font-size: 12px;
      color: #64748b;
    }
    .dep-val {
      font-weight: 700;
      color: #334155;
      margin-left: 3px;
    }
    .card-actions {
      display: flex;
      gap: 8px;
      margin-top: 10px;
    }
    .btn-contact-owner {
      flex: 1;
      background: #ffffff;
      color: #008cff;
      border: 1px solid #008cff;
      padding: 8px 12px;
      font-size: 13px;
      font-weight: 700;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .btn-contact-owner:hover {
      background: #f0f7ff;
    }
    .btn-cart-action {
      background: #008cff;
      color: #ffffff;
      border: none;
      padding: 8px 14px;
      font-size: 13px;
      font-weight: 700;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.15s ease;
    }
    .btn-cart-action:hover {
      background: #0070cc;
    }
    .btn-cart-action.in-cart {
      background: #10b981;
    }
  `]
})
export class PropertyCardComponent {
  readonly property = input.required<Property>();
  readonly isBuyer = input<boolean>(false);
  readonly isInCart = input<boolean>(false);

  readonly getContact = output<number>();
  readonly toggleCart = output<number>();

  onContactClick(): void {
    this.getContact.emit(this.property().sellerId);
  }

  onCartClick(): void {
    this.toggleCart.emit(this.property().propertyId);
  }
}
