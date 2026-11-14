import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Property, City } from '../../models/models';
import { PropertyCardComponent } from '../property-card/property-card.component';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [CommonModule, PropertyCardComponent],
  template: `
    <section class="prop-listing-section">
      <div class="container listing-layout">
        <main class="properties-feed">
          <div class="feed-header">
            <div>
              <h2 class="feed-title">
                Verified Properties
                <span class="badge-count">({{ properties().length }})</span>
              </h2>
              <p class="feed-sub">
                @if (activeCity()) {
                  Showing verified listings in <strong>{{ activeCity()?.cityName }}</strong>
                } @else {
                  Showing active and verified real estate listings across India
                }
              </p>
            </div>
          </div>

          <!-- Active Location Scope Pill -->
          @if (activeCity()) {
            <div class="active-scope-banner">
              <div class="scope-info">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#2563eb">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span class="scope-text">Location locked to <strong>{{ activeCity()?.cityName }}</strong></span>
                <span class="scope-badge">{{ properties().length }} available</span>
              </div>
              <button class="btn-clear-scope" (click)="onClearLocation()" title="Remove location filter">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                <span>View All Cities</span>
              </button>
            </div>
          }

          @if (isLoading()) {
            <div class="loading-state">
              <div class="spinner"></div>
              <p>Loading properties...</p>
            </div>
          } @else if (properties().length === 0) {
            <div class="empty-state">
              <div class="empty-icon-wrap">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                  <path d="M9 22V12h6v10"/>
                </svg>
              </div>
              <h3>No Properties Found</h3>
              <p>We couldn't find any properties matching your current filter selection.</p>
              <button class="btn-reset-large" (click)="resetFilters()">Reset All Filters</button>
            </div>
          } @else {
            <div class="property-grid">
              @for (prop of properties(); track prop.propertyId) {
                <app-property-card
                  [property]="prop"
                  [isBuyer]="isBuyer()"
                  [isInCart]="isCartItem(prop.propertyId)"
                  (getContact)="openContact.emit($event)"
                  (toggleCart)="toggleCart.emit($event)"
                  (viewDetails)="viewDetails.emit($event)"
                />
              }
            </div>
          }
        </main>
      </div>
    </section>
  `,
  styles: [`
    .prop-listing-section {
      padding: 40px 0 80px 0;
      background: #f4f7fb;
    }
    .listing-layout {
      width: 100%;
    }
    .properties-feed {
      width: 100%;
      min-width: 0;
    }
    .feed-header {
      margin-bottom: 24px;
    }
    .feed-title {
      font-size: 24px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 6px 0;
      letter-spacing: -0.5px;
    }
    .badge-count {
      color: #008cff;
      font-size: 20px;
    }
    .feed-sub {
      font-size: 14px;
      color: #64748b;
      margin: 0;
    }
    .property-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
    }
    .loading-state, .empty-state {
      background: #ffffff;
      border-radius: 12px;
      padding: 60px 20px;
      text-align: center;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
    }
    .empty-icon-wrap {
      display: flex;
      justify-content: center;
      margin-bottom: 12px;
    }
    .empty-state h3 {
      font-size: 18px;
      color: #0f172a;
      margin: 0 0 6px 0;
    }
    .empty-state p {
      font-size: 13px;
      color: #64748b;
      margin: 0 0 16px 0;
    }
    .btn-reset-large {
      background: #008cff;
      color: #ffffff;
      border: none;
      padding: 10px 24px;
      font-size: 13px;
      font-weight: 700;
      border-radius: 20px;
      cursor: pointer;
      transition: background 0.15s ease;
    }
    .btn-reset-large:hover {
      background: #0076db;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e2e8f0;
      border-top-color: #008cff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 12px auto;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .active-scope-banner {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 10px;
      padding: 10px 16px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
    .scope-info {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #1e40af;
    }
    .scope-badge {
      background: #dbeafe;
      color: #1e3a8a;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 10px;
    }
    .btn-clear-scope {
      background: #ffffff;
      border: 1px solid #93c5fd;
      color: #2563eb;
      font-size: 12px;
      font-weight: 700;
      padding: 5px 12px;
      border-radius: 14px;
      cursor: pointer;
      transition: all 0.15s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn-clear-scope:hover {
      background: #2563eb;
      color: #ffffff;
      border-color: #2563eb;
    }
  `]
})
export class PropertyListComponent {
  // --- Data received from Parent (app.ts) ---
  readonly properties = input<Property[]>([]);       // List of verified properties to display
  readonly activeCity = input<City | null>(null);     // Currently filtered city (or null if all cities)
  readonly isBuyer = input<boolean>(false);           // True if current user is logged in as Buyer
  readonly cartPropertyIds = input<number[]>([]);     // IDs of properties currently saved in user's cart
  readonly isLoading = input<boolean>(false);         // Shows loading spinner while data is fetching

  // --- Events sent to Parent (app.ts) ---
  readonly clearCity = output<void>();                // Emits when user clicks "View All Cities"
  readonly resetAll = output<void>();                 // Emits when user clicks "Reset All Filters"
  readonly openContact = output<number>();            // Emits propertyId to view seller phone/email
  readonly toggleCart = output<number>();             // Emits propertyId to save/unsave to cart
  readonly viewDetails = output<Property>();          // Emits property object to open full details modal

  // Checks whether a given property is already saved in the buyer's cart
  isCartItem(propertyId: number): boolean {
    return this.cartPropertyIds().includes(propertyId);
  }

  // Clears the city location filter
  onClearLocation(): void {
    this.clearCity.emit();
  }

  // Resets all filters back to default
  resetFilters(): void {
    this.resetAll.emit();
  }
}
