import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnrichedCartItem } from '../../models/models';

@Component({
  selector: 'app-cart-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <div class="modal-backdrop" (click)="onBackdropClick($event)">
        <div class="modal-card">
          <div class="modal-header">
            <div class="header-text">
              <h2 class="modal-title">My Saved Properties</h2>
              <span class="badge-count">{{ items().length }} items</span>
            </div>
            <button class="btn-close" (click)="close.emit()">✕</button>
          </div>

          @if (items().length === 0) {
            <div class="empty-cart">
              <span class="empty-glyph">🛒</span>
              <h3>Your cart is empty</h3>
              <p>You haven't bookmarked any properties yet. Browse our verified listings and click "Add to Cart" to compare properties here!</p>
              <button class="btn-browse" (click)="close.emit()">Browse Properties</button>
            </div>
          } @else {
            <div class="cart-items-list">
              @for (item of items(); track item.cartId) {
                <div class="cart-item-card">
                  <div class="item-img-placeholder">
                    🏡
                  </div>
                  <div class="item-details">
                    <div class="item-header-row">
                      <h4 class="item-name">
                        {{ item.property?.propertyName || ('Property #' + item.propertyId) }}
                      </h4>
                      <button
                        class="btn-remove"
                        title="Remove from cart"
                        (click)="removeItem.emit(item.cartId)"
                      >
                        🗑️
                      </button>
                    </div>

                    @if (item.property) {
                      <div class="item-specs">
                        <span class="spec-pill">{{ item.property.propertyType }}</span>
                        <span class="spec-loc">📍 {{ item.property.landmark }}, {{ item.property.address }}</span>
                      </div>
                      <div class="item-pricing">
                        <span class="price-val">₹{{ item.property.priceRange | number:'1.0-0' }}</span>
                        @if (item.property.propertyOption === 'Rent') {
                          <span class="rent-tag">/ month</span>
                        }
                      </div>
                      <div class="item-actions">
                        <button
                          class="btn-owner-contact"
                          (click)="contactOwner.emit(item.property.sellerId)"
                        >
                          📞 Get Owner Contact
                        </button>
                      </div>
                    } @else {
                      <p class="loading-hint">Loading property details (ID: {{ item.propertyId }})...</p>
                    }
                  </div>
                </div>
              }
            </div>
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
      max-width: 620px;
      border-radius: 16px;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
      padding: 24px;
      max-height: 85vh;
      display: flex;
      flex-direction: column;
      animation: modalFadeIn 0.2s ease-out;
    }
    @keyframes modalFadeIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 16px;
      border-bottom: 1px solid #edf2f7;
    }
    .header-text {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .modal-title {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      margin: 0;
    }
    .badge-count {
      background: #e6f3ff;
      color: #008cff;
      font-size: 12px;
      font-weight: 800;
      padding: 3px 10px;
      border-radius: 12px;
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
    .cart-items-list {
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 16px 0;
    }
    .cart-item-card {
      display: flex;
      gap: 14px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 12px;
    }
    .item-img-placeholder {
      width: 80px;
      height: 80px;
      background: #e2e8f0;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      flex-shrink: 0;
    }
    .item-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }
    .item-header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .item-name {
      font-size: 15px;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .btn-remove {
      background: none;
      border: none;
      font-size: 16px;
      cursor: pointer;
      padding: 2px 6px;
      border-radius: 4px;
      opacity: 0.6;
      transition: opacity 0.15s;
    }
    .btn-remove:hover {
      opacity: 1;
      background: #fee2e2;
    }
    .item-specs {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #64748b;
    }
    .spec-pill {
      background: #e2e8f0;
      color: #334155;
      padding: 1px 6px;
      border-radius: 4px;
      font-weight: 600;
      font-size: 10px;
    }
    .spec-loc {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .item-pricing {
      display: flex;
      align-items: baseline;
      gap: 4px;
      margin-top: 4px;
    }
    .price-val {
      font-size: 16px;
      font-weight: 800;
      color: #05203c;
    }
    .rent-tag {
      font-size: 11px;
      color: #64748b;
    }
    .item-actions {
      margin-top: 6px;
    }
    .btn-owner-contact {
      background: #ffffff;
      color: #008cff;
      border: 1px solid #008cff;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
    }
    .btn-owner-contact:hover {
      background: #f0f7ff;
    }
    .empty-cart {
      text-align: center;
      padding: 40px 20px;
    }
    .empty-glyph {
      font-size: 54px;
      display: block;
      margin-bottom: 10px;
    }
    .empty-cart h3 {
      font-size: 18px;
      color: #0f172a;
      margin: 0 0 6px 0;
    }
    .empty-cart p {
      font-size: 13px;
      color: #64748b;
      margin: 0 0 16px 0;
      line-height: 1.5;
    }
    .btn-browse {
      background: #008cff;
      color: #ffffff;
      border: none;
      padding: 10px 24px;
      font-size: 13px;
      font-weight: 700;
      border-radius: 20px;
      cursor: pointer;
    }
    .loading-hint {
      font-size: 12px;
      color: #94a3b8;
      margin: 0;
    }
  `]
})
export class CartModalComponent {
  readonly isOpen = input<boolean>(false);
  readonly items = input<EnrichedCartItem[]>([]);

  readonly close = output<void>();
  readonly removeItem = output<number>();
  readonly contactOwner = output<number>();

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }
}
