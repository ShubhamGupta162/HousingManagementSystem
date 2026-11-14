import { Component, input, output, signal, effect, computed } from '@angular/core';
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
      <div [class.modal-backdrop]="!isDashboard()" [class.dashboard-page-wrapper]="isDashboard()" (click)="!isDashboard() && onBackdropClick($event)">
        <div [class.modal-card]="!isDashboard()" [class.dashboard-card]="isDashboard()">
          <div class="modal-header">
            <div>
              <div class="dashboard-badge-row">
                <span class="role-seller-badge">Seller Portal</span>
              </div>
              <h2 class="modal-title">{{ isDashboard() ? 'Seller Dashboard' : 'Seller Hub' }}</h2>
              <p class="modal-sub">List your verified property, track buyers & manage your sales history</p>
            </div>
            @if (isDashboard()) {
              <button class="btn-browse-mkt" (click)="switchView.emit()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 3h6v6M10 14L21 3M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                </svg>
                <span>Browse Marketplace</span>
              </button>
            } @else {
              <button class="btn-close" (click)="close.emit()" title="Close seller hub">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            }
          </div>

          <!-- Quick Seller KPI Metric Cards -->
          @if (isDashboard()) {
            <div class="seller-kpi-grid">
              <div class="kpi-card">
                <div class="kpi-title">TOTAL LISTINGS</div>
                <div class="kpi-val">{{ sellerProperties().length }}</div>
                <div class="kpi-sub">Portfolio size</div>
              </div>
              <div class="kpi-card active-kpi">
                <div class="kpi-title">ACTIVE LISTINGS</div>
                <div class="kpi-val">{{ activeCount() }}</div>
                <div class="kpi-sub">Verified & live on market</div>
              </div>
              <div class="kpi-card sold-kpi">
                <div class="kpi-title">PROPERTIES SOLD</div>
                <div class="kpi-val">{{ soldCount() }}</div>
                <div class="kpi-sub">Successfully closed deals</div>
              </div>
              <div class="kpi-card rev-kpi">
                <div class="kpi-title">TOTAL SALES VALUE</div>
                <div class="kpi-val">{{ formatPrice(soldRevenue()) }}</div>
                <div class="kpi-sub">Gross realized revenue</div>
              </div>
            </div>
          }

          <!-- Tabs: Post Property vs My Listings -->
          <div class="tab-bar">
            <button
              class="tab-btn"
              [class.active]="activeTab() === 'post'"
              (click)="activeTab.set('post')"
            >
              + Post New Property
            </button>
            <button
              class="tab-btn"
              [class.active]="activeTab() === 'listings'"
              (click)="switchToListings()"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" class="tab-icon">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
              <span>My Listings ({{ sellerProperties().length }})</span>
            </button>
          </div>

          <!-- Alert feedback -->
          @if (errorMessage()) {
            <div class="alert alert-error">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
              <span>{{ errorMessage() }}</span>
            </div>
          }
          @if (successMessage()) {
            <div class="alert alert-success">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <span>{{ successMessage() }}</span>
            </div>
          }

          <!-- TAB 1: POST PROPERTY -->
          @if (activeTab() === 'post') {
            <form (ngSubmit)="handleCreateProperty()" class="post-form" novalidate>
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
                    <span class="sub-hint">Upload up to 6 photos ({{ imagePreviews().length }}/6 selected)</span>
                  </div>
                  @if (imagePreviews().length < 6) {
                    <input
                      #fileInput
                      type="file"
                      accept="image/*"
                      multiple
                      (change)="onFileSelected($event)"
                      style="display:none;"
                    />
                    <button
                      type="button"
                      class="btn-select-file"
                      (click)="fileInput.click()"
                    >
                      + Add Photos
                    </button>
                  }
                </div>

                @if (imagePreviews().length > 0) {
                  <div class="image-previews-grid">
                    @for (img of imagePreviews(); track $index) {
                      <div class="preview-item">
                        <img [src]="img" alt="Preview" />
                        <button
                          type="button"
                          class="btn-remove-img"
                          (click)="removeImage($index)"
                          title="Remove image"
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    }
                  </div>
                }
              </div>

              <!-- In-place alert feedback right above the publish action -->
              @if (errorMessage()) {
                <div class="alert alert-error">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                  </svg>
                  <span>{{ errorMessage() }}</span>
                </div>
              }
              @if (successMessage()) {
                <div class="alert alert-success">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  <span>{{ successMessage() }}</span>
                </div>
              }

              <div class="form-actions">
                <button
                  type="button"
                  class="btn-submit-property"
                  (click)="handleCreateProperty()"
                  [disabled]="loading()"
                >
                  {{ loading() ? 'Submitting Property...' : 'PUBLISH PROPERTY' }}
                </button>
              </div>
            </form>
          }

          <!-- TAB 2: MY LISTINGS -->
          @if (activeTab() === 'listings') {
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
                <button
                  class="pill-btn"
                  [class.active]="listingFilter === 'sold'"
                  (click)="fetchSellerProperties('sold')"
                >
                  Sold Properties
                </button>
              </div>

              @if (sellerProperties().length === 0) {
                <div class="empty-listings">
                  <div class="empty-icon-wrap">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
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
                            [class.sold]="!prop.isActive && prop.deactivationReason?.startsWith('Sold')"
                            [class.deactivated]="!prop.isActive && !prop.deactivationReason?.startsWith('Sold')"
                          >
                            @if (!prop.isActive && prop.deactivationReason?.startsWith('Sold')) {
                              <svg width="11" height="11" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                              </svg>
                              <span>Sold</span>
                            } @else if (prop.isActive) {
                              <svg width="11" height="11" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                              </svg>
                              <span>Verified / Active</span>
                            } @else {
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                              <span>Deactivated</span>
                            }
                          </span>
                        </div>
                        <div class="prop-subline">
                          <span>{{ prop.propertyType }}</span> •
                          <span>{{ prop.propertyOption === 'Rent' ? 'Rent' : 'Sell' }}</span> •
                          <span class="landmark-wrap">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                            </svg>
                            {{ prop.landmark }}
                          </span> •
                          <strong class="prop-price">₹{{ prop.priceRange | number:'1.0-0' }}</strong>
                        </div>
                        @if (!prop.isActive && prop.deactivationReason?.startsWith('Sold')) {
                          <div class="sold-box">
                            <strong>Deal Status:</strong> {{ prop.deactivationReason }}
                          </div>
                        } @else if (!prop.isActive && prop.deactivationReason) {
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
    .dashboard-page-wrapper {
      padding: 24px 20px 48px 20px;
      max-width: 1100px;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
    }
    .modal-card {
      background: #ffffff;
      width: 100%;
      max-width: 780px;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      padding: 24px;
      max-height: 90vh;
      overflow-y: auto;
      animation: modalFadeIn 0.2s ease-out;
    }
    .dashboard-card {
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
      padding: 28px;
    }
    .dashboard-badge-row {
      margin-bottom: 4px;
    }
    .role-seller-badge {
      background: #fef3c7;
      color: #b45309;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .btn-browse-mkt {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      color: #334155;
      padding: 7px 14px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
    }
    .btn-browse-mkt:hover {
      background: #e2e8f0;
      color: #0f172a;
    }
    .seller-kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 20px;
    }
    @media (max-width: 768px) {
      .seller-kpi-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    .kpi-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 16px;
    }
    .kpi-card.active-kpi {
      border-left: 4px solid #008cff;
    }
    .kpi-card.sold-kpi {
      border-left: 4px solid #10b981;
    }
    .kpi-card.rev-kpi {
      border-left: 4px solid #8b5cf6;
    }
    .kpi-title {
      font-size: 10px;
      font-weight: 800;
      color: #64748b;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .kpi-val {
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
    }
    .kpi-sub {
      font-size: 11px;
      color: #94a3b8;
      margin-top: 2px;
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
      border: 1px solid #bae0ff;
      outline: none;
      font-family: inherit;
      padding: 6px 14px;
      font-size: 12px;
      font-weight: 700;
      border-radius: 6px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
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
      padding: 3px 8px;
      border-radius: 4px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .status-tag.active {
      background: #ecfdf5;
      color: #059669;
      border: 1px solid #a7f3d0;
    }
    .status-tag.sold {
      background: #ecfdf5;
      color: #065f46;
      border: 1px solid #10b981;
      font-weight: 700;
    }
    .status-tag.deactivated {
      background: #fef2f2;
      color: #dc2626;
      border: 1px solid #fecaca;
    }
    .prop-subline {
      font-size: 12px;
      color: #64748b;
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .landmark-wrap {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: #475569;
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
    .sold-box {
      margin-top: 8px;
      padding: 6px 10px;
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      border-radius: 6px;
      font-size: 11px;
      color: #065f46;
    }
    .empty-listings {
      text-align: center;
      padding: 40px;
      color: #64748b;
    }
    .empty-icon-wrap {
      margin-bottom: 10px;
    }
    .alert {
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 13px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
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
  readonly isOpen = input<boolean>(true);
  readonly isDashboard = input<boolean>(false);
  readonly initialTab = input<'post' | 'listings'>('listings');
  readonly sellerId = input<number>(0);
  readonly states = input<State[]>([]);
  readonly cities = input<City[]>([]);

  readonly close = output<void>();
  readonly propertyCreated = output<void>();
  readonly switchView = output<void>();

  readonly activeTab = signal<'post' | 'listings'>('listings');
  listingFilter: 'all' | 'verified' | 'deactivated' | 'sold' = 'all';

  loading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  sellerProperties = signal<Property[]>([]);

  readonly activeCount = computed(() => this.sellerProperties().filter(p => p.isActive).length);
  readonly soldCount = computed(() => this.sellerProperties().filter(p => !p.isActive && p.deactivationReason?.startsWith('Sold')).length);
  readonly soldRevenue = computed(() => this.sellerProperties().filter(p => !p.isActive && p.deactivationReason?.startsWith('Sold')).reduce((acc, p) => acc + (p.priceRange || 0), 0));

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
  readonly imagePreviews = signal<string[]>([]);

  availableCities: City[] = [];

  constructor(private propertyService: PropertyService) {
    effect(() => {
      this.activeTab.set(this.initialTab());
    });

    effect(() => {
      const allCities = this.cities();
      if (this.selectedStateId && allCities.length > 0) {
        this.availableCities = allCities.filter(c => c.stateId === Number(this.selectedStateId));
      }
    });

    effect(() => {
      if (this.isOpen()) {
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
      this.selectedCityId = null;
    } else {
      this.availableCities = this.cities().filter(c => c.stateId === Number(this.selectedStateId));
      if (!this.availableCities.some(c => c.cityId === Number(this.selectedCityId))) {
        this.selectedCityId = null;
      }
    }
  }

  switchToListings(): void {
    this.activeTab.set('listings');
    this.fetchSellerProperties(this.listingFilter);
  }

  fetchSellerProperties(type: 'all' | 'verified' | 'deactivated' | 'sold'): void {
    this.listingFilter = type;
    const effectiveSellerId = this.sellerId() > 0 ? this.sellerId() : 0;

    if (type === 'sold') {
      this.propertyService.getSellerSoldProperties(effectiveSellerId).subscribe({
        next: res => {
          if (res.success && res.data) {
            this.sellerProperties.set(res.data);
          }
        }
      });
      return;
    }

    this.propertyService.getSellerProperties(effectiveSellerId, type).subscribe({
      next: res => {
        if (res.success && res.data) {
          this.sellerProperties.set(res.data);
        }
      }
    });
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const currentPreviews = this.imagePreviews();
    const remainingSlots = 6 - currentPreviews.length;
    const filesToRead = Array.from(input.files).slice(0, remainingSlots);

    const readPromises = filesToRead.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target?.result as string);
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
      });
    });

    const results = await Promise.all(readPromises);
    const valid = results.filter(r => !!r);
    this.imagePreviews.update(prev => [...prev, ...valid].slice(0, 6));
    input.value = '';
  }

  removeImage(index: number): void {
    this.imagePreviews.update(prev => prev.filter((_, i) => i !== index));
  }

  handleCreateProperty(): void {
    if (!this.propertyName || !this.propertyName.trim()) {
      this.errorMessage.set('Property name / headline is required.');
      return;
    }
    if (!this.selectedCityId) {
      this.errorMessage.set('Please select a City.');
      return;
    }
    if (!this.priceRange || this.priceRange <= 0) {
      this.errorMessage.set('Price must be greater than 0.');
      return;
    }
    if (!this.address || !this.address.trim()) {
      this.errorMessage.set('Address is required.');
      return;
    }
    if (!this.landmark || !this.landmark.trim()) {
      this.errorMessage.set('Landmark is required.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const effectiveSellerId = this.sellerId() > 0 ? this.sellerId() : 0;

    const payload = {
      propertyName: this.propertyName.trim(),
      propertyOption: this.propertyOption,
      propertyType: this.propertyType,
      address: this.address.trim(),
      landmark: this.landmark.trim(),
      priceRange: Number(this.priceRange),
      initialDeposit: Number(this.initialDeposit || 0),
      description: this.description ? this.description.trim() : '',
      cityId: Number(this.selectedCityId),
      sellerId: effectiveSellerId
    };

    console.log('[SellerPortal] Submitting property payload:', payload);

    this.propertyService.createProperty(payload).subscribe({
      next: (res: any) => {
        console.log('[SellerPortal] Create property response:', res);
        const property = (res && res.data) ? res.data : (res && res.propertyId ? res : null);

        if (property && property.propertyId) {
          const newPropertyId = property.propertyId;

          // If images exist, upload them
          if (this.imagePreviews().length > 0) {
            this.propertyService.uploadImages(newPropertyId, this.imagePreviews()).subscribe({
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
          this.errorMessage.set(res?.message || 'Failed to create property.');
        }
      },
      error: err => {
        console.error('[SellerPortal] Error submitting property:', err);
        this.loading.set(false);
        this.errorMessage.set(err.error?.message || err.error || err.message || 'Failed to submit property.');
      }
    });
  }

  private completeSuccess(): void {
    this.loading.set(false);
    this.successMessage.set('🎉 Property listed successfully! Pending admin verification.');
    this.errorMessage.set(null);
    this.resetForm();
    this.propertyCreated.emit();

    // Auto-switch to My Listings tab so the seller immediately sees their newly posted property!
    setTimeout(() => {
      this.activeTab.set('listings');
      this.fetchSellerProperties(this.listingFilter);
    }, 1200);
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
    this.imagePreviews.set([]);
  }
}
