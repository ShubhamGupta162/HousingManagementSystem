import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { City } from '../../models/models';

@Component({
  selector: 'app-hero-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="mmt-hero">
      <div class="hero-bg-overlay"></div>
      <div class="container hero-content">
        <div class="hero-title-area">
          <h1 class="hero-title">Find Your Perfect Dream Home</h1>
          <p class="hero-subtitle">India's most trusted, verified real estate platform powered by EasyHousing</p>
        </div>

        <!-- MMT Floating Super Search Card -->
        <div class="mmt-search-card">
          <!-- Buy / Rent Tab Switcher -->
          <div class="tab-header">
            <button
              class="tab-btn"
              [class.active]="selectedOption() === 'Sell'"
              (click)="setOption('Sell')"
              type="button"
            >
              <span class="tab-icon">🏢</span>
              <span class="tab-text">BUY PROPERTY</span>
            </button>
            <button
              class="tab-btn"
              [class.active]="selectedOption() === 'Rent'"
              (click)="setOption('Rent')"
              type="button"
            >
              <span class="tab-icon">🔑</span>
              <span class="tab-text">RENT PROPERTY</span>
            </button>
          </div>

          <!-- Search Widget Form -->
          <div class="search-fields-grid">
            <!-- City Selection Box -->
            <div class="field-box">
              <label class="field-label">CITY / LOCATION</label>
              <select class="field-select" [(ngModel)]="selectedCityId">
                <option [ngValue]="null">All Cities</option>
                @for (c of cities(); track c.cityId) {
                  <option [ngValue]="c.cityId">{{ c.cityName }}</option>
                }
              </select>
              <span class="field-hint">Select your preferred city</span>
            </div>

            <!-- Property Type Box -->
            <div class="field-box">
              <label class="field-label">PROPERTY TYPE</label>
              <select class="field-select" [(ngModel)]="selectedType">
                <option value="">All Types</option>
                <option value="Apartment">Apartment / Flat</option>
                <option value="Villa">Independent Villa</option>
                <option value="Plot">Residential Plot</option>
                <option value="Commercial">Commercial Space</option>
              </select>
              <span class="field-hint">Apartment, Villa, Plot...</span>
            </div>

            <!-- Sort By Box -->
            <div class="field-box">
              <label class="field-label">BUDGET & SORT</label>
              <select class="field-select" [(ngModel)]="selectedSort">
                <option value="">Recommended</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
              <span class="field-hint">Sort properties by price</span>
            </div>
          </div>

          <!-- Bottom Action Area -->
          <div class="search-action-bar">
            <div class="quick-highlights">
              <span class="highlight-item"><span class="check">✓</span> 100% Verified Sellers</span>
              <span class="highlight-item"><span class="check">✓</span> Direct Owner Contact</span>
              <span class="highlight-item"><span class="check">✓</span> Zero Hidden Charges</span>
            </div>
            <button class="btn-search-mmt" (click)="onSearch()">
              SEARCH PROPERTIES
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .mmt-hero {
      position: relative;
      background: linear-gradient(180deg, #05203c 0%, #0a3d62 85%, #e9f0f8 100%);
      padding: 40px 0 70px 0;
      color: #ffffff;
      overflow: visible;
    }
    .hero-content {
      position: relative;
      z-index: 2;
    }
    .hero-title-area {
      text-align: center;
      margin-bottom: 28px;
    }
    .hero-title {
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin: 0 0 8px 0;
      color: #ffffff;
    }
    .hero-subtitle {
      font-size: 15px;
      color: #b0c9e6;
      margin: 0;
    }
    .mmt-search-card {
      background: #ffffff;
      color: #1a1a1a;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
      padding: 24px;
      max-width: 1040px;
      margin: 0 auto;
      border: 1px solid rgba(255, 255, 255, 0.8);
    }
    .tab-header {
      display: flex;
      gap: 12px;
      border-bottom: 2px solid #eef2f7;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    .tab-btn {
      background: none;
      border: none;
      padding: 8px 20px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 700;
      color: #556987;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
    }
    .tab-btn:hover {
      background: #f1f5f9;
      color: #008cff;
    }
    .tab-btn.active {
      background: #e6f3ff;
      color: #008cff;
      box-shadow: 0 2px 6px rgba(0, 140, 255, 0.2);
    }
    .tab-icon {
      font-size: 16px;
    }
    .search-fields-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 22px;
    }
    @media (max-width: 768px) {
      .search-fields-grid {
        grid-template-columns: 1fr;
      }
    }
    .field-box {
      border: 1px solid #dbe2ea;
      border-radius: 10px;
      padding: 12px 14px;
      background: #fbfcfe;
      transition: border-color 0.2s;
    }
    .field-box:focus-within {
      border-color: #008cff;
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(0, 140, 255, 0.12);
    }
    .field-label {
      display: block;
      font-size: 11px;
      font-weight: 800;
      color: #64748b;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .field-select {
      width: 100%;
      border: none;
      background: transparent;
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
      outline: none;
      cursor: pointer;
      padding: 2px 0;
    }
    .field-hint {
      display: block;
      font-size: 11px;
      color: #94a3b8;
      margin-top: 4px;
    }
    .search-action-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 14px;
      border-top: 1px solid #edf2f7;
      flex-wrap: wrap;
      gap: 16px;
    }
    .quick-highlights {
      display: flex;
      gap: 16px;
      font-size: 12px;
      color: #475569;
      font-weight: 600;
    }
    .highlight-item .check {
      color: #10b981;
      font-weight: 800;
    }
    .btn-search-mmt {
      background: linear-gradient(90deg, #008cff 0%, #0056b3 100%);
      color: #ffffff;
      border: none;
      padding: 14px 40px;
      font-size: 15px;
      font-weight: 800;
      letter-spacing: 0.5px;
      border-radius: 30px;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(0, 140, 255, 0.35);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .btn-search-mmt:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(0, 140, 255, 0.45);
    }
  `]
})
export class HeroSearchComponent {
  readonly cities = input<City[]>([]);
  readonly searchTriggered = output<{
    cityId?: number;
    propertyType?: string;
    propertyOption?: string;
    sortBy?: string;
  }>();

  selectedOption = signal<'Sell' | 'Rent'>('Sell');
  selectedCityId: number | null = null;
  selectedType: string = '';
  selectedSort: string = '';

  setOption(opt: 'Sell' | 'Rent'): void {
    this.selectedOption.set(opt);
    this.onSearch();
  }

  onSearch(): void {
    this.searchTriggered.emit({
      cityId: this.selectedCityId ? Number(this.selectedCityId) : undefined,
      propertyType: this.selectedType || undefined,
      propertyOption: this.selectedOption(),
      sortBy: this.selectedSort || undefined
    });
  }
}
