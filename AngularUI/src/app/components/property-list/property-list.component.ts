import { Component, input, output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Property, City } from '../../models/models';
import { PropertyCardComponent } from '../property-card/property-card.component';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PropertyCardComponent],
  template: `
    <section class="prop-listing-section">
      <div class="container listing-layout">
        <!-- Left Filter Sidebar (MMT Styled) -->
        <aside class="filter-sidebar">
          <div class="sidebar-header">
            <h2 class="filter-title">Filters</h2>
            <button class="btn-reset" (click)="resetFilters()">Clear All</button>
          </div>

          <!-- Purpose (Buy / Rent) Filter -->
          <div class="filter-group">
            <label class="group-label">PURPOSE</label>
            <div class="chips-wrap">
              <button
                type="button"
                class="filter-chip"
                [class.active]="selectedOption === ''"
                (click)="setOption('')"
              >
                All
              </button>
              <button
                type="button"
                class="filter-chip"
                [class.active]="selectedOption === 'Sell'"
                (click)="setOption('Sell')"
              >
                Buy (Sale)
              </button>
              <button
                type="button"
                class="filter-chip"
                [class.active]="selectedOption === 'Rent'"
                (click)="setOption('Rent')"
              >
                Rent
              </button>
            </div>
          </div>

          <!-- City Filter -->
          <div class="filter-group">
            <label class="group-label">CITY</label>
            <select class="filter-select" [(ngModel)]="selectedCityId" (change)="onFilterChange()">
              <option [ngValue]="null">All Cities</option>
              @for (c of cities(); track c.cityId) {
                <option [ngValue]="c.cityId">{{ c.cityName }}</option>
              }
            </select>
          </div>

          <!-- Type Filter -->
          <div class="filter-group">
            <label class="group-label">PROPERTY TYPE</label>
            <div class="chips-wrap">
              @for (t of propertyTypes; track t) {
                <button
                  type="button"
                  class="filter-chip"
                  [class.active]="selectedType === t"
                  (click)="setType(t)"
                >
                  {{ t || 'All' }}
                  @if (t && getTypeCount(t) !== null) {
                    <span class="chip-count">({{ getTypeCount(t) }})</span>
                  }
                </button>
              }
            </div>
          </div>

          <!-- Price Sort -->
          <div class="filter-group">
            <label class="group-label">SORT BY PRICE</label>
            <div class="sort-options">
              <label class="radio-label">
                <input type="radio" name="sortPrice" [(ngModel)]="sortBy" value="" (change)="onFilterChange()" />
                <span>Featured / Default</span>
              </label>
              <label class="radio-label">
                <input type="radio" name="sortPrice" [(ngModel)]="sortBy" value="price_asc" (change)="onFilterChange()" />
                <span>Price: Low to High</span>
              </label>
              <label class="radio-label">
                <input type="radio" name="sortPrice" [(ngModel)]="sortBy" value="price_desc" (change)="onFilterChange()" />
                <span>Price: High to Low</span>
              </label>
            </div>
          </div>

          <!-- MMT Trust Box -->
          <div class="trust-box">
            <svg class="trust-shield-svg" width="20" height="20" viewBox="0 0 24 24" fill="#108a00">
              <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
            </svg>
            <div>
              <strong class="trust-title">Buyer Protection</strong>
              <p class="trust-desc">100% verified listings with direct owner contact.</p>
            </div>
          </div>
        </aside>

        <!-- Right Properties Feed -->
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
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 28px;
      align-items: start;
    }
    @media (max-width: 900px) {
      .listing-layout {
        grid-template-columns: 1fr;
      }
    }
    .filter-sidebar {
      background: #ffffff;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
      border: 1px solid #e3eaf3;
      position: sticky;
      top: 20px;
    }
    .sidebar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 1px solid #edf2f7;
    }
    .filter-title {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      margin: 0;
      letter-spacing: -0.3px;
    }
    .btn-reset {
      background: none;
      border: none;
      color: #008cff;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
    }
    .btn-reset:hover {
      text-decoration: underline;
    }
    .filter-group {
      margin-bottom: 22px;
    }
    .group-label {
      display: block;
      font-size: 11px;
      font-weight: 800;
      color: #64748b;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }
    .filter-select {
      width: 100%;
      padding: 9px 12px;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      font-size: 13px;
      color: #1e293b;
      outline: none;
      background: #f8fafc;
    }
    .filter-select:focus {
      border-color: #008cff;
      background: #ffffff;
    }
    .chips-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .filter-chip {
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 600;
      color: #475569;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .filter-chip:hover {
      background: #e2e8f0;
    }
    .filter-chip.active {
      background: #008cff;
      color: #ffffff;
      border-color: #008cff;
    }
    .sort-options {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .radio-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #334155;
      cursor: pointer;
    }
    .trust-box {
      margin-top: 10px;
      padding: 12px;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      display: flex;
      gap: 10px;
    }
    .trust-shield {
      font-size: 20px;
    }
    .trust-title {
      display: block;
      font-size: 12px;
      color: #166534;
    }
    .trust-desc {
      font-size: 11px;
      color: #15803d;
      margin: 2px 0 0 0;
    }
    .properties-feed {
      min-width: 0;
    }
    .feed-header {
      margin-bottom: 20px;
    }
    .feed-title {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 4px 0;
      letter-spacing: -0.5px;
    }
    .badge-count {
      color: #008cff;
      font-size: 18px;
    }
    .feed-sub {
      font-size: 13px;
      color: #64748b;
      margin: 0;
    }
    .property-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
      gap: 20px;
    }
    .loading-state, .empty-state {
      background: #ffffff;
      border-radius: 12px;
      padding: 60px 20px;
      text-align: center;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
    }
    .empty-icon {
      font-size: 54px;
      display: block;
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
    .scope-pin {
      font-size: 16px;
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
    .chip-count {
      font-size: 10px;
      opacity: 0.8;
      margin-left: 2px;
    }
  `]
})
export class PropertyListComponent {
  readonly properties = input<Property[]>([]);
  readonly cities = input<City[]>([]);
  readonly activeCityId = input<number | null>(null);
  readonly activeOption = input<string>('');
  readonly activeType = input<string>('');
  readonly activeSort = input<string>('');
  readonly activeCity = input<City | null>(null);
  readonly allVerifiedProperties = input<Property[]>([]);
  readonly isBuyer = input<boolean>(false);
  readonly cartPropertyIds = input<number[]>([]);
  readonly isLoading = input<boolean>(false);

  readonly filterChange = output<{ cityId?: number; propertyType?: string; propertyOption?: string; sortBy?: string }>();
  readonly clearCity = output<void>();
  readonly openContact = output<number>();
  readonly toggleCart = output<number>();
  readonly viewDetails = output<Property>();

  selectedOption: string = '';
  selectedCityId: number | null = null;
  selectedType: string = '';
  sortBy: string = '';

  propertyTypes = ['', 'Apartment', 'Villa', 'Plot', 'Commercial'];

  constructor() {
    effect(() => {
      this.selectedCityId = this.activeCityId() ?? null;
      this.selectedOption = this.activeOption() || '';
      this.selectedType = this.activeType() || '';
      this.sortBy = this.activeSort() || '';
    });
  }

  isCartItem(propertyId: number): boolean {
    return this.cartPropertyIds().includes(propertyId);
  }

  setOption(option: string): void {
    this.selectedOption = option;
    this.onFilterChange();
  }

  setType(type: string): void {
    this.selectedType = type;
    this.onFilterChange();
  }

  getTypeCount(type: string): number | null {
    if (!type) return null;
    let list = this.allVerifiedProperties();
    if (this.selectedCityId) {
      list = list.filter(p => p.cityId === Number(this.selectedCityId));
    }
    if (this.selectedOption) {
      list = list.filter(p => p.propertyOption.toLowerCase() === this.selectedOption.toLowerCase());
    }
    return list.filter(p => p.propertyType.toLowerCase() === type.toLowerCase()).length;
  }

  onFilterChange(): void {
    this.filterChange.emit({
      cityId: this.selectedCityId ? Number(this.selectedCityId) : undefined,
      propertyType: this.selectedType || undefined,
      propertyOption: this.selectedOption || undefined,
      sortBy: this.sortBy || undefined
    });
  }

  onClearLocation(): void {
    this.selectedCityId = null;
    this.clearCity.emit();
    this.onFilterChange();
  }

  resetFilters(): void {
    this.selectedOption = '';
    this.selectedCityId = null;
    this.selectedType = '';
    this.sortBy = '';
    this.onFilterChange();
  }
}
