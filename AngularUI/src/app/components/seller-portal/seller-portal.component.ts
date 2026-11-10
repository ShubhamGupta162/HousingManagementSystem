import { Component, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyService } from '../../services/property.service';
import { State, City, Property } from '../../models/models';

@Component({
  selector: 'app-seller-portal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen()) {
      <div class="modal-backdrop" (click)="onBackdropClick($event)">
        <div class="modal-card">
          <div class="modal-header">
            <div>
              <h2 class="modal-title">Seller Hub</h2>
              <p class="modal-sub">List your verified property or manage your existing listings</p>
            </div>
            <button class="btn-close" (click)="close.emit()">✕</button>
          </div>

          <!-- Tabs: Post Property vs My Listings -->
          <div class="tab-bar">
            <button
              class="tab-btn"
              [class.active]="activeTab === 'post'"
              (click)="activeTab = 'post'"
            >
              + Post New Property
            </button>
            <button
              class="tab-btn"
              [class.active]="activeTab === 'listings'"
              (click)="switchToListings()"
            >
              📋 My Listings ({{ sellerProperties().length }})
            </button>
          </div>

          <!-- Alert feedback -->
          @if (errorMessage()) {
            <div class="alert alert-error">⚠️ {{ errorMessage() }}</div>
          }
          @if (successMessage()) {
            <div class="alert alert-success">✓ {{ successMessage() }}</div>
          }

          <!-- TAB 1: POST PROPERTY -->
          @if (activeTab === 'post') {
            <form (ngSubmit)="handleCreateProperty()" class="post-form">
              <div class="form-grid">
                <div class="form-group full-width">
                  <label>Property Name / Headline *</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="e.g. Luxurious 3BHK Apartment in Whitefield"
                    [(ngModel)]="propertyName"
                    name="propertyName"
                    required
                  />
                </div>

                <div class="form-group">
                  <label>Property Option *</label>
                  <select class="form-control" [(ngModel)]="propertyOption" name="propertyOption">
                    <option value="Sell">For Sale</option>
                    <option value="Rent">For Rent</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Property Type *</label>
                  <select class="form-control" [(ngModel)]="propertyType" name="propertyType">
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Plot">Plot</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>State *</label>
                  <select
                    class="form-control"
                    [(ngModel)]="selectedStateId"
                    name="stateId"
                    (change)="onStateChange()"
                  >
                    <option [ngValue]="null">Select State</option>
                    @for (s of states(); track s.stateId) {
                      <option [ngValue]="s.stateId">{{ s.stateName }}</option>
                    }
                  </select>
                </div>

                <div class="form-group">
                  <label>City *</label>
                  <select class="form-control" [(ngModel)]="selectedCityId" name="cityId">
                    <option [ngValue]="null">Select City</option>
                    @for (c of availableCities; track c.cityId) {
                      <option [ngValue]="c.cityId">{{ c.cityName }}</option>
                    }
                  </select>
                </div>

                <div class="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    class="form-control"
                    placeholder="e.g. 7500000"
                    [(ngModel)]="priceRange"
                    name="priceRange"
                    min="1"
                    required
                  />
                </div>

                <div class="form-group">
                  <label>Initial Deposit (₹)</label>
                  <input
                    type="number"
                    class="form-control"
                    placeholder="Optional deposit"
                    [(ngModel)]="initialDeposit"
                    name="initialDeposit"
                    min="0"
                  />
                </div>

                <div class="form-group full-width">
                  <label>Landmark *</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="e.g. Near Metro Station / Tech Park"
                    [(ngModel)]="landmark"
                    name="landmark"
                    required
                  />
                </div>

                <div class="form-group full-width">
                  <label>Address *</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Complete street address"
                    [(ngModel)]="address"
                    name="address"
                    required
                  />
                </div>

                <div class="form-group full-width">
                  <label>Description</label>
                  <textarea
                    class="form-control"
                    rows="2"
                    placeholder="Brief description of features, amenities, and connectivity"
                    [(ngModel)]="description"
                    name="description"
                  ></textarea>
                </div>
              </div>

              <!-- Image Uploader Section (Max 6 images) -->
              <div class="image-uploader-section">
                <div class="uploader-header">
                  <div>
                    <label class="section-title">Upload Images</label>
                    <span class="sub-hint">Upload up to 6 photos ({{ imagePreviews.length }}/6 selected)</span>
                  </div>
                  @if (imagePreviews.length < 6) {
                    <label class="btn-select-file">
                      + Add Photos
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        (change)="onFileSelected($event)"
                        style="display:none;"
                      />
                    </label>
                  }
                </div>

                @if (imagePreviews.length > 0) {
                  <div class="image-previews-grid">
                    @for (img of imagePreviews; track $index) {
                      <div class="preview-item">
                        <img [src]="img" alt="Preview" />
                        <button
                          type="button"
                          class="btn-remove-img"
                          (click)="removeImage($index)"
                        >
                          ✕
                        </button>
                      </div>
                    }
                  </div>
                }
              </div>

              <div class="form-actions">
                <button type="submit" class="btn-submit-property" [disabled]="loading()">
                  {{ loading() ? 'Submitting Property...' : 'PUBLISH PROPERTY' }}
                </button>
              </div>
            </form>
          }

          <!-- TAB 2: MY LISTINGS -->
          @if (activeTab === 'listings') {
            <div class="listings-hub">
              <div class="filter-pills">
                <button
                  class="pill-btn"
                  [class.active]="listingFilter === 'all'"
                  (click)="fetchSellerProperties('all')"
                >
                  All
                </button>
                <button
                  class="pill-btn"
                  [class.active]="listingFilter === 'verified'"
                  (click)="fetchSellerProperties('verified')"
                >
                  Verified
                </button>
                <button
                  class="pill-btn"
                  [class.active]="listingFilter === 'deactivated'"
                  (click)="fetchSellerProperties('deactivated')"
                >
                  Deactivated
                </button>
              </div>

              @if (sellerProperties().length === 0) {
                <div class="empty-listings">
                  <span class="empty-icon">📂</span>
                  <p>No listings found in this category.</p>
                </div>
              } @else {
                <div class="seller-props-list">
                  @for (prop of sellerProperties(); track prop.propertyId) {
                    <div class="seller-prop-row">
                      <div class="prop-info">
                        <div class="prop-headline">
                          <strong class="prop-name">{{ prop.propertyName }}</strong>
                          <span
                            class="status-tag"
                            [class.active]="prop.isActive"
                            [class.deactivated]="!prop.isActive"
                          >
                            {{ prop.isActive ? '✓ Verified / Active' : '✕ Deactivated' }}
                          </span>
                        </div>
                        <div class="prop-subline">
                          <span>{{ prop.propertyType }}</span> •
                          <span>{{ prop.propertyOption === 'Rent' ? 'Rent' : 'Sell' }}</span> •
                          <span>📍 {{ prop.landmark }}</span> •
                          <strong class="prop-price">₹{{ prop.priceRange | number:'1.0-0' }}</strong>
                        </div>
                        @if (!prop.isActive && prop.deactivationReason) {
                          <div class="deactivation-box">
                            <strong>Reason for deactivation:</strong> {{ prop.deactivationReason }}
                          </div>
                        }
                      </div>
                    </div>
                  }
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
      max-width: 780px;
      border-radius: 16px;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
      padding: 24px;
      max-height: 90vh;
      overflow-y: auto;
      animation: modalFadeIn 0.2s ease-out;
    }
    @keyframes modalFadeIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }
    .modal-title {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 2px 0;
    }
    .modal-sub {
      font-size: 13px;
      color: #64748b;
      margin: 0;
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
    .tab-bar {
      display: flex;
      gap: 10px;
      border-bottom: 2px solid #e2e8f0;
      margin-bottom: 18px;
    }
    .tab-btn {
      background: none;
      border: none;
      padding: 10px 16px;
      font-size: 13px;
      font-weight: 700;
      color: #64748b;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      transition: all 0.15s;
    }
    .tab-btn.active {
      color: #008cff;
      border-bottom-color: #008cff;
    }
    .post-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    @media (max-width: 600px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
    }
    .full-width {
      grid-column: 1 / -1;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .form-group label {
      font-size: 11px;
      font-weight: 700;
      color: #475569;
    }
    .form-control {
      padding: 9px 12px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 13px;
      color: #0f172a;
      outline: none;
      background: #ffffff;
    }
    .form-control:focus {
      border-color: #008cff;
      box-shadow: 0 0 0 3px rgba(0, 140, 255, 0.12);
    }
    .image-uploader-section {
      background: #f8fafc;
      border: 1px dashed #cbd5e1;
      border-radius: 10px;
      padding: 14px;
    }
    .uploader-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    .section-title {
      font-size: 12px;
      font-weight: 800;
      color: #334155;
      display: block;
    }
    .sub-hint {
      font-size: 11px;
      color: #64748b;
    }
    .btn-select-file {
      background: #e6f3ff;
      color: #008cff;
      padding: 6px 14px;
      font-size: 12px;
      font-weight: 700;
      border-radius: 6px;
      cursor: pointer;
      display: inline-block;
    }
    .btn-select-file:hover {
      background: #d4ebff;
    }
    .image-previews-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 10px;
      margin-top: 10px;
    }
    @media (max-width: 600px) {
      .image-previews-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    .preview-item {
      position: relative;
      aspect-ratio: 1;
      border-radius: 6px;
      overflow: hidden;
      border: 1px solid #cbd5e1;
    }
    .preview-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .btn-remove-img {
      position: absolute;
      top: 4px;
      right: 4px;
      background: rgba(0, 0, 0, 0.7);
      color: #ffffff;
      border: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      font-size: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 8px;
    }
    .btn-submit-property {
      background: linear-gradient(90deg, #008cff 0%, #0056b3 100%);
      color: #ffffff;
      border: none;
      padding: 12px 28px;
      font-size: 14px;
      font-weight: 800;
      border-radius: 8px;
      cursor: pointer;
    }
    .btn-submit-property:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .listings-hub {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .filter-pills {
      display: flex;
      gap: 8px;
    }
    .pill-btn {
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      padding: 6px 14px;
      font-size: 12px;
      font-weight: 700;
      color: #475569;
      border-radius: 14px;
      cursor: pointer;
    }
    .pill-btn.active {
      background: #008cff;
      color: #ffffff;
      border-color: #008cff;
    }
    .seller-props-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .seller-prop-row {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px;
      background: #f8fafc;
    }
    .prop-headline {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }
    .prop-name {
      font-size: 14px;
      color: #0f172a;
    }
    .status-tag {
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .status-tag.active {
      background: #ecfdf5;
      color: #059669;
      border: 1px solid #a7f3d0;
    }
    .status-tag.deactivated {
      background: #fef2f2;
      color: #dc2626;
      border: 1px solid #fecaca;
    }
    .prop-subline {
      font-size: 12px;
      color: #64748b;
    }
    .prop-price {
      color: #05203c;
    }
    .deactivation-box {
      margin-top: 8px;
      padding: 6px 10px;
      background: #fee2e2;
      border-radius: 6px;
      font-size: 11px;
      color: #991b1b;
    }
    .empty-listings {
      text-align: center;
      padding: 40px;
      color: #64748b;
    }
    .empty-icon {
      font-size: 40px;
      display: block;
      margin-bottom: 8px;
    }
    .alert {
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 13px;
      margin-bottom: 12px;
    }
    .alert-error {
      background: #fef2f2;
      color: #dc2626;
      border: 1px solid #fecaca;
    }
    .alert-success {
      background: #f0fdf4;
      color: #16a34a;
      border: 1px solid #bbf7d0;
    }
  `]
})
export class SellerPortalComponent {
  readonly isOpen = input<boolean>(false);
  readonly sellerId = input<number>(0);
  readonly states = input<State[]>([]);
  readonly cities = input<City[]>([]);

  readonly close = output<void>();
  readonly propertyCreated = output<void>();

  activeTab: 'post' | 'listings' = 'post';
  listingFilter: 'all' | 'verified' | 'deactivated' = 'all';

  loading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  sellerProperties = signal<Property[]>([]);

  // Post form fields
  propertyName = '';
  propertyOption = 'Sell';
  propertyType = 'Apartment';
  selectedStateId: number | null = null;
  selectedCityId: number | null = null;
  priceRange: number = 0;
  initialDeposit: number = 0;
  landmark = '';
  address = '';
  description = '';
  imagePreviews: string[] = [];

  availableCities: City[] = [];

  constructor(private propertyService: PropertyService) {
    effect(() => {
      if (this.isOpen() && this.sellerId() > 0) {
        this.fetchSellerProperties(this.listingFilter);
      }
    });
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }

  onStateChange(): void {
    if (!this.selectedStateId) {
      this.availableCities = [];
    } else {
      this.availableCities = this.cities().filter(c => c.stateId === Number(this.selectedStateId));
    }
  }

  switchToListings(): void {
    this.activeTab = 'listings';
    this.fetchSellerProperties(this.listingFilter);
  }

  fetchSellerProperties(type: 'all' | 'verified' | 'deactivated'): void {
    this.listingFilter = type;
    if (!this.sellerId()) return;

    this.propertyService.getSellerProperties(this.sellerId(), type).subscribe({
      next: res => {
        if (res.success && res.data) {
          this.sellerProperties.set(res.data);
        }
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const remainingSlots = 6 - this.imagePreviews.length;
    const filesToRead = Array.from(input.files).slice(0, remainingSlots);

    filesToRead.forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        if (e.target?.result && this.imagePreviews.length < 6) {
          this.imagePreviews.push(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    });

    input.value = '';
  }

  removeImage(index: number): void {
    this.imagePreviews.splice(index, 1);
  }

  handleCreateProperty(): void {
    if (!this.selectedCityId) {
      this.errorMessage.set('Please select a City.');
      return;
    }
    if (this.priceRange <= 0) {
      this.errorMessage.set('Price must be greater than 0.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const payload = {
      propertyName: this.propertyName,
      propertyOption: this.propertyOption,
      propertyType: this.propertyType,
      address: this.address,
      landmark: this.landmark,
      priceRange: this.priceRange,
      initialDeposit: this.initialDeposit || 0,
      description: this.description,
      cityId: Number(this.selectedCityId),
      sellerId: this.sellerId()
    };

    this.propertyService.createProperty(payload).subscribe({
      next: res => {
        if (res.success && res.data) {
          const newPropertyId = res.data.propertyId;

          // If images exist, upload them
          if (this.imagePreviews.length > 0) {
            this.propertyService.uploadImages(newPropertyId, this.imagePreviews).subscribe({
              next: () => {
                this.completeSuccess();
              },
              error: () => {
                this.completeSuccess();
              }
            });
          } else {
            this.completeSuccess();
          }
        } else {
          this.loading.set(false);
          this.errorMessage.set(res.message || 'Failed to create property.');
        }
      },
      error: err => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message || 'Failed to submit property.');
      }
    });
  }

  private completeSuccess(): void {
    this.loading.set(false);
    this.successMessage.set('Property listed successfully! Pending admin verification.');
    this.resetForm();
    this.propertyCreated.emit();
  }

  private resetForm(): void {
    this.propertyName = '';
    this.propertyOption = 'Sell';
    this.propertyType = 'Apartment';
    this.priceRange = 0;
    this.initialDeposit = 0;
    this.landmark = '';
    this.address = '';
    this.description = '';
    this.imagePreviews = [];
  }
}
