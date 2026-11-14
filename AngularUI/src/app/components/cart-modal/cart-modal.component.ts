import { Component, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnrichedCartItem, Property } from '../../models/models';

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
              <h2 class="modal-title">Buyer Hub</h2>
            </div>
            <button class="btn-close" (click)="close.emit()" title="Close saved list">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- Navigation Tabs -->
          <div class="cart-tabs">
            <button
              class="cart-tab-btn"
              [class.active]="activeTab() === 'cart'"
              (click)="activeTab.set('cart')"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zM3 6h18M16 10a4 4 0 01-8 0" />
              </svg>
              <span>Saved Cart ({{ items().length }})</span>
            </button>
            <button
              class="cart-tab-btn"
              [class.active]="activeTab() === 'purchases'"
              (click)="activeTab.set('purchases')"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              <span>My Purchases ({{ purchasedProperties().length }})</span>
            </button>
          </div>

          <!-- TAB 1: SAVED / CART -->
          @if (activeTab() === 'cart') {
            @if (items().length === 0) {
              <div class="empty-cart">
                <div class="empty-glyph-wrap">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zM3 6h18M16 10a4 4 0 01-8 0" />
                  </svg>
                </div>
                <h3>No saved properties yet</h3>
                <p>Browse verified listings and click "Save" on any card to shortlist and compare homes here.</p>
                <button class="btn-browse" (click)="close.emit()">Browse Properties</button>
              </div>
            } @else {
              <div class="cart-items-list">
                @for (item of items(); track item.cartId) {
                  <div class="cart-item-card">
                    <div class="item-img-placeholder">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 10.5L12 3L21 10.5V20C21 20.5523 20.5523 21 20 21H15V14H9V21H4C3.44772 21 3 20.5523 3 20V10.5Z" fill="#ffffff" />
                        <path d="M9 21V14H15V21H9Z" fill="#008cff" />
                      </svg>
                    </div>
                    <div class="item-details">
                      <div class="item-header-row">
                        <h4 class="item-name">
                          {{ item.property?.propertyName || ('Property #' + item.propertyId) }}
                        </h4>
                        <button
                          class="btn-remove"
                          title="Remove from saved"
                          (click)="removeItem.emit(item.cartId)"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                          </svg>
                        </button>
                      </div>

                      @if (item.property) {
                        <div class="item-specs">
                          <span class="spec-pill">{{ item.property.propertyType }}</span>
                          <span class="spec-loc">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="#94a3b8">
                              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                            </svg>
                            {{ item.property.landmark }}, {{ item.property.address }}
                          </span>
                        </div>
                        <div class="item-pricing">
                          <span class="price-val">{{ formatPrice(item.property.priceRange) }}</span>
                          @if (item.property.propertyOption === 'Rent') {
                            <span class="rent-tag">/ mo</span>
                          }
                        </div>
                        <div class="item-actions">
                          <button
                            class="btn-owner-contact"
                            (click)="contactOwner.emit(item.property.sellerId)"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-2.2 2.2a15.053 15.053 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1.01A11.36 11.36 0 018.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/>
                            </svg>
                            Get Owner Contact
                          </button>
                          <button
                            class="btn-buy-property"
                            (click)="buyItem.emit(item)"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                            </svg>
                            Buy Property
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
          }

          <!-- TAB 2: MY PURCHASES -->
          @if (activeTab() === 'purchases') {
            @if (purchasedProperties().length === 0) {
              <div class="empty-cart">
                <div class="empty-glyph-wrap">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="1.5">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3>No purchased properties yet</h3>
                <p>When you purchase a property, it is removed from the active marketplace and permanently recorded here under your profile.</p>
                <button class="btn-browse" (click)="activeTab.set('cart')">View Saved Cart</button>
              </div>
            } @else {
              <div class="cart-items-list">
                @for (prop of purchasedProperties(); track prop.propertyId) {
                  <div class="cart-item-card purchase-card">
                    <div class="item-img-placeholder purchase-img">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <div class="item-details">
                      <div class="item-header-row">
                        <h4 class="item-name">{{ prop.propertyName }}</h4>
                        <span class="badge-purchased">✓ Deal Closed</span>
                      </div>
                      <div class="item-specs">
                        <span class="spec-pill">{{ prop.propertyType }}</span>
                        <span class="spec-opt">{{ prop.propertyOption }}</span>
                        <span class="spec-loc">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="#94a3b8">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                          </svg>
                          {{ prop.landmark }}, {{ prop.address }}
                        </span>
                      </div>
                      <div class="item-pricing">
                        <span class="price-val">{{ formatPrice(prop.priceRange) }}</span>
                        <span class="seller-ref">Seller #{{ prop.sellerId }}</span>
                      </div>
                      <div class="item-actions">
                        <button
                          class="btn-owner-contact"
                          (click)="contactOwner.emit(prop.sellerId)"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-2.2 2.2a15.053 15.053 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1.01A11.36 11.36 0 018.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/>
                          </svg>
                          Contact Seller
                        </button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            }
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
      max-width: 600px;
      border-radius: 12px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
      max-height: 85vh;
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
      padding: 16px 20px 12px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #ffffff;
    }
    .header-text {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .modal-title {
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
      margin: 0;
    }
    .cart-tabs {
      display: flex;
      gap: 8px;
      padding: 0 20px 12px 20px;
      border-bottom: 1px solid #e2e8f0;
      background: #ffffff;
    }
    .cart-tab-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 6px 14px;
      font-size: 12px;
      font-weight: 700;
      color: #475569;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .cart-tab-btn:hover {
      background: #e2e8f0;
    }
    .cart-tab-btn.active {
      background: #008cff;
      border-color: #008cff;
      color: #ffffff;
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
    .cart-items-list {
      padding: 16px 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .cart-item-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 14px;
      display: flex;
      gap: 14px;
      align-items: flex-start;
      transition: border-color 0.15s;
    }
    .cart-item-card:hover {
      border-color: #cbd5e1;
    }
    .purchase-card {
      border-left: 4px solid #10b981;
    }
    .item-img-placeholder {
      width: 50px;
      height: 50px;
      background: #082038;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .purchase-img {
      background: #ecfdf5;
    }
    .item-details {
      flex: 1;
      min-width: 0;
    }
    .item-header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 4px;
    }
    .item-name {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
      line-height: 1.3;
    }
    .btn-remove {
      background: none;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      padding: 2px;
      display: flex;
      align-items: center;
      transition: color 0.15s;
    }
    .btn-remove:hover {
      color: #ef4444;
    }
    .badge-purchased {
      background: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
      font-size: 10px;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 12px;
      white-space: nowrap;
    }
    .item-specs {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      color: #64748b;
      margin-bottom: 4px;
    }
    .spec-pill {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      padding: 1px 6px;
      border-radius: 3px;
      font-weight: 600;
    }
    .spec-opt {
      background: #e0f2fe;
      color: #0369a1;
      padding: 1px 6px;
      border-radius: 3px;
      font-weight: 600;
    }
    .spec-loc {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .item-pricing {
      display: flex;
      align-items: baseline;
      gap: 8px;
      margin-bottom: 8px;
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
    .seller-ref {
      font-size: 11px;
      color: #64748b;
    }
    .item-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .btn-owner-contact {
      background: #ffffff;
      color: #008cff;
      border: 1px solid #008cff;
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      transition: background 0.15s;
    }
    .btn-owner-contact:hover {
      background: #f0f7ff;
    }
    .btn-buy-property {
      background: #10b981;
      color: #ffffff;
      border: 1px solid #059669;
      padding: 6px 14px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      transition: background 0.15s;
    }
    .btn-buy-property:hover {
      background: #059669;
    }
    .empty-cart {
      text-align: center;
      padding: 36px 20px;
    }
    .empty-glyph-wrap {
      margin-bottom: 12px;
    }
    .empty-cart h3 {
      font-size: 16px;
      color: #0f172a;
      margin: 0 0 6px 0;
      font-weight: 700;
    }
    .empty-cart p {
      font-size: 12px;
      color: #64748b;
      margin: 0 0 16px 0;
      line-height: 1.5;
      max-width: 320px;
      margin-left: auto;
      margin-right: auto;
    }
    .btn-browse {
      background: #008cff;
      color: #ffffff;
      border: none;
      padding: 8px 20px;
      font-size: 12px;
      font-weight: 700;
      border-radius: 16px;
      cursor: pointer;
    }
    .loading-hint {
      font-size: 11px;
      color: #94a3b8;
      margin: 0;
    }
  `]
})
export class CartModalComponent {
  readonly isOpen = input<boolean>(false);
  readonly items = input<EnrichedCartItem[]>([]);
  readonly purchasedProperties = input<Property[]>([]);
  readonly initialTab = input<'cart' | 'purchases'>('cart');

  readonly activeTab = signal<'cart' | 'purchases'>('cart');

  readonly close = output<void>();
  readonly removeItem = output<number>();
  readonly contactOwner = output<number>();
  readonly buyItem = output<EnrichedCartItem>();

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.activeTab.set(this.initialTab());
      }
    });
  }

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
