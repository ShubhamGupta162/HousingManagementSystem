import { Component, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyService } from '../../services/property.service';
import { UserService } from '../../services/user.service';
import { CartService } from '../../services/cart.service';
import { Property, City, UserSummary, EnrichedCartItem } from '../../models/models';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen()) {
      <div [class.modal-backdrop]="!isDashboard()" [class.dashboard-page-wrapper]="isDashboard()" (click)="!isDashboard() && onBackdropClick($event)">
        <div [class.modal-card]="!isDashboard()" [class.dashboard-card]="isDashboard()">
          <!-- Header -->
          <div class="modal-header">
            <div>
              <div class="title-with-shield">
                <div class="shield-badge">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                  </svg>
                </div>
                <h2 class="modal-title">{{ isDashboard() ? 'Admin Governance Dashboard' : 'EHS Administration Portal' }}</h2>
              </div>
              <p class="modal-sub">Real estate verification, user directory & platform governance</p>
            </div>
            @if (isDashboard()) {
              <button class="btn-browse-mkt" (click)="switchView.emit()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 3h6v6M10 14L21 3M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                </svg>
                <span>Browse Marketplace</span>
              </button>
            } @else {
              <button class="btn-close" (click)="close.emit()" title="Close admin portal">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            }
          </div>

          <!-- Tab Bar -->
          <div class="admin-tabs">
            <button
              class="tab-btn"
              [class.active]="activeTab === 'properties'"
              (click)="activeTab = 'properties'"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" class="tab-icon">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 2h2v2h-2V5zm0 4h2v2h-2V9zm-4-4h2v2H8V5zm0 4h2v2H8V9zm-4 8v-2h2v2H4zm4 0v-2h2v2H8zm4 0v-2h2v2h-2zm8 0h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2z"/>
              </svg>
              <span>Properties Management ({{ allProperties().length }})</span>
            </button>
            <button
              class="tab-btn"
              [class.active]="activeTab === 'users'"
              (click)="switchToUsers()"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" class="tab-icon">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
              <span>All Registered Users ({{ allUsers().length }})</span>
            </button>
            <button
              class="tab-btn"
              [class.active]="activeTab === 'sales'"
              (click)="switchToSales()"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" class="tab-icon">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/>
              </svg>
              <span>Sales & Financials</span>
            </button>
          </div>

          <!-- Alert Notifications -->
          @if (alertMessage()) {
            <div
              class="alert"
              [class.alert-success]="alertType() === 'success'"
              [class.alert-error]="alertType() === 'error'"
            >
              @if (alertType() === 'success') {
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
              } @else {
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
              }
              <span>{{ alertMessage() }}</span>
            </div>
          }

          <!-- TAB 1: PROPERTIES MANAGEMENT -->
          @if (activeTab === 'properties') {
            <div class="admin-tab-body">
              <div class="toolbar">
                <div class="status-filters">
                  <button
                    class="filter-pill"
                    [class.active]="propFilter === 'all'"
                    (click)="propFilter = 'all'"
                  >
                    All Properties
                  </button>
                  <button
                    class="filter-pill"
                    [class.active]="propFilter === 'pending'"
                    (click)="propFilter = 'pending'"
                  >
                    Pending / Deactivated
                  </button>
                  <button
                    class="filter-pill"
                    [class.active]="propFilter === 'verified'"
                    (click)="propFilter = 'verified'"
                  >
                    Verified
                  </button>
                  <button
                    class="filter-pill"
                    [class.active]="propFilter === 'sold'"
                    (click)="propFilter = 'sold'"
                  >
                    Sold Properties
                  </button>
                </div>
                <button class="btn-refresh" (click)="loadProperties()">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
                  </svg>
                  <span>Refresh</span>
                </button>
              </div>

              <div class="table-container">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Property Name</th>
                      <th>Option & Type</th>
                      <th>Price (₹)</th>
                      <th>Seller ID</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (p of filteredProperties; track p.propertyId) {
                      <tr>
                        <td>#{{ p.propertyId }}</td>
                        <td>
                          <strong>{{ p.propertyName }}</strong>
                          <div class="table-sub">{{ p.landmark }}, {{ p.address }}</div>
                          @if (!p.isActive && p.deactivationReason) {
                            <div class="table-reason">Reason: {{ p.deactivationReason }}</div>
                          }
                        </td>
                        <td>
                          <span class="badge-opt">{{ p.propertyOption }}</span>
                          <span class="badge-type">{{ p.propertyType }}</span>
                        </td>
                        <td><strong>₹{{ p.priceRange | number:'1.0-0' }}</strong></td>
                        <td>Seller #{{ p.sellerId }}</td>
                        <td>
                          <span
                            class="status-chip"
                            [class.active]="p.isActive"
                            [class.sold]="!p.isActive && p.deactivationReason?.startsWith('Sold')"
                            [class.inactive]="!p.isActive && !p.deactivationReason?.startsWith('Sold')"
                          >
                            @if (!p.isActive && p.deactivationReason?.startsWith('Sold')) {
                              <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                              </svg>
                              <span>Sold</span>
                            } @else if (p.isActive) {
                              <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                              </svg>
                              <span>Verified</span>
                            } @else {
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                              <span>Inactive</span>
                            }
                          </span>
                        </td>
                        <td>
                          <div class="action-buttons">
                            @if (!p.isActive && p.deactivationReason?.startsWith('Sold')) {
                              <span class="badge-deal-closed">Deal Closed</span>
                            } @else if (!p.isActive) {
                              <button
                                class="btn-verify"
                                (click)="handleVerify(p.propertyId)"
                              >
                                <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                                </svg>
                                <span>Verify</span>
                              </button>
                            } @else {
                              <button
                                class="btn-deactivate"
                                (click)="openDeactivatePrompt(p.propertyId)"
                              >
                                Deactivate
                              </button>
                            }
                          </div>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>

              <!-- Deactivate Prompt Modal Inside Admin Panel -->
              @if (deactivatingPropertyId !== null) {
                <div class="deactivate-inline-dialog">
                  <div class="dialog-box">
                    <h4>Deactivate Property #{{ deactivatingPropertyId }}</h4>
                    <p>Please state a mandatory reason for deactivating this listing:</p>
                    <textarea
                      class="reason-input"
                      rows="3"
                      placeholder="e.g. Incomplete address, fraudulent documentation, sold out..."
                      [(ngModel)]="deactivateReason"
                    ></textarea>
                    <div class="dialog-actions">
                      <button class="btn-cancel" (click)="deactivatingPropertyId = null">Cancel</button>
                      <button
                        class="btn-confirm-deact"
                        [disabled]="!deactivateReason.trim()"
                        (click)="confirmDeactivate()"
                      >
                        Confirm Deactivation
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
          }

          <!-- TAB 2: REGISTERED USERS (ADMIN VIEW) -->
          @if (activeTab === 'users') {
            <div class="admin-tab-body">
              <div class="toolbar">
                <span class="users-subtitle">Full platform user directory</span>
                <button class="btn-refresh" (click)="loadUsers()">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
                  </svg>
                  <span>Refresh</span>
                </button>
              </div>

              <div class="table-container">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Full Name</th>
                      <th>Email / Username</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Address</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (u of allUsers(); track (u.emailId || u.userName || $index)) {
                      <tr>
                        <td>#{{ u.profileId || u.userId || ($index + 1) }}</td>
                        <td><strong>{{ u.fullName }}</strong></td>
                        <td>{{ u.emailId || u.userName }}</td>
                        <td>{{ u.phoneNo }}</td>
                        <td>
                          <span
                            class="role-badge"
                            [class.role-admin]="u.userType === 'Admin'"
                            [class.role-seller]="u.userType === 'Seller'"
                            [class.role-buyer]="u.userType === 'Buyer'"
                          >
                            {{ u.userType }}
                          </span>
                        </td>
                        <td>
                          <span class="status-badge" [class.badge-active]="u.isActive !== false" [class.badge-inactive]="u.isActive === false">
                            {{ u.isActive !== false ? 'Active' : 'Deactivated' }}
                          </span>
                        </td>
                        <td>{{ u.address || '—' }}</td>
                        <td>
                          <div style="display: flex; gap: 6px; align-items: center;">
                            @if (u.userType !== 'Admin') {
                              @if (u.isActive !== false) {
                                <button
                                  class="btn-toggle-status btn-deact"
                                  (click)="deactivateUser(u)"
                                  title="Deactivate user"
                                >
                                  Deactivate
                                </button>
                              }
                              <button
                                class="btn-toggle-status"
                                (click)="deleteUser(u)"
                                title="Delete user"
                                style="background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5;"
                              >
                                Delete
                              </button>
                            }
                            @if (u.userType === 'Buyer') {
                              <button class="btn-inspect-cart" (click)="inspectBuyerCart(u)" title="Inspect buyer cart (Read-Only)">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                  <circle cx="9" cy="21" r="1"></circle>
                                  <circle cx="20" cy="21" r="1"></circle>
                                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                </svg>
                                <span>Cart</span>
                              </button>
                            }
                          </div>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>

              <!-- Cart Inspection Dialog -->
              @if (inspectingBuyer()) {
                <div class="deactivate-inline-dialog">
                  <div class="dialog-box" style="max-width: 520px; width: 100%;">
                    <h4>Cart Inspection: {{ inspectingBuyer()?.fullName }}</h4>
                    <p>Read-only cart inspection for Buyer #{{ inspectingBuyer()?.profileId }}. (Admin cannot post or purchase)</p>

                    @if (inspectedCart().length === 0) {
                      <div style="padding: 18px; text-align: center; color: #64748b; background: #f8fafc; border-radius: 6px; margin-bottom: 14px; font-size: 13px;">
                        This buyer's cart is currently empty.
                      </div>
                    } @else {
                      <div style="max-height: 220px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px;">
                        @for (item of inspectedCart(); track item.cartId) {
                          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;">
                            <div>
                              <div style="font-weight: 700; font-size: 13px; color: #0f172a;">{{ item.property?.propertyName || ('Property #' + item.propertyId) }}</div>
                              <div style="font-size: 11px; color: #64748b;">{{ item.property?.propertyType }} &bull; {{ item.property?.address }}</div>
                            </div>
                            <div style="font-weight: 700; font-size: 13px; color: #0284c7;">
                              {{ formatPrice(item.property?.priceRange || 0) }}
                            </div>
                          </div>
                        }
                      </div>
                    }

                    <div class="dialog-actions">
                      <button class="btn-cancel" (click)="closeCartInspection()">Close</button>
                    </div>
                  </div>
                </div>
              }
            </div>
          }

          <!-- TAB 3: SALES & FINANCIALS REPORT -->
          @if (activeTab === 'sales') {
            <div class="admin-tab-body">
              <div class="toolbar">
                <span class="users-subtitle">Platform sales performance and closed transaction audit</span>
                <button class="btn-refresh" (click)="loadSalesReport()">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
                  </svg>
                  <span>Refresh Report</span>
                </button>
              </div>

              <!-- Stat Metric Cards -->
              <div class="sales-stats-grid">
                <div class="stat-card stat-sold">
                  <div class="stat-label">TOTAL PROPERTIES SOLD</div>
                  <div class="stat-value">{{ salesReport()?.totalSoldProperties ?? 0 }}</div>
                  <div class="stat-sub">Successfully closed transactions</div>
                </div>
                <div class="stat-card stat-revenue">
                  <div class="stat-label">TOTAL SALES VOLUME</div>
                  <div class="stat-value">{{ formatPrice(salesReport()?.totalSoldValue || 0) }}</div>
                  <div class="stat-sub">Gross closed sales volume</div>
                </div>
                <div class="stat-card stat-active">
                  <div class="stat-label">ACTIVE MARKET LISTINGS</div>
                  <div class="stat-value">{{ salesReport()?.totalActiveProperties ?? 0 }}</div>
                  <div class="stat-sub">Verified properties for sale/rent</div>
                </div>
                <div class="stat-card stat-inventory">
                  <div class="stat-label">ACTIVE INVENTORY VALUE</div>
                  <div class="stat-value">{{ formatPrice(salesReport()?.totalActiveValue || 0) }}</div>
                  <div class="stat-sub">Listed market capital</div>
                </div>
              </div>

              <!-- Sold Properties Details Table -->
              <h4 class="section-title">Itemized Platform Sales Records</h4>
              <div class="table-container">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>Property ID</th>
                      <th>Property Name & Location</th>
                      <th>Type & Option</th>
                      <th>Sale Price (₹)</th>
                      <th>Seller</th>
                      <th>Buyer Details</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    @if (!salesReport()?.soldProperties || salesReport()?.soldProperties.length === 0) {
                      <tr>
                        <td colspan="7" class="empty-table-cell">No properties sold yet. Once a buyer purchases a property, it appears here.</td>
                      </tr>
                    } @else {
                      @for (p of salesReport()?.soldProperties; track p.propertyId) {
                        <tr>
                          <td>#{{ p.propertyId }}</td>
                          <td>
                            <strong>{{ p.propertyName }}</strong>
                            <div class="table-sub">{{ p.landmark }}, {{ p.address }}</div>
                          </td>
                          <td>
                            <span class="badge-opt">{{ p.propertyOption }}</span>
                            <span class="badge-type">{{ p.propertyType }}</span>
                          </td>
                          <td><strong class="sold-price-val">₹{{ p.priceRange | number:'1.0-0' }}</strong></td>
                          <td>Seller #{{ p.sellerId }}</td>
                          <td>
                            <span class="buyer-tag">{{ p.deactivationReason || 'Sold' }}</span>
                          </td>
                          <td>
                            <span class="badge-deal-closed">✓ Deal Closed</span>
                          </td>
                        </tr>
                      }
                    }
                  </tbody>
                </table>
              </div>
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
      background: rgba(5, 32, 60, 0.75);
      backdrop-filter: blur(4px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .dashboard-page-wrapper {
      padding: 24px 20px 48px 20px;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
    }
    .modal-card {
      background: #ffffff;
      width: 100%;
      max-width: 980px;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      padding: 24px;
      max-height: 90vh;
      overflow-y: auto;
      animation: modalFadeIn 0.2s ease-out;
      position: relative;
    }
    .dashboard-card {
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
      padding: 28px;
      position: relative;
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
    .title-with-shield {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .shield-badge {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: #eff6ff;
      color: #0284c7;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal-title {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      margin: 0;
    }
    .modal-sub {
      font-size: 13px;
      color: #64748b;
      margin: 4px 0 0 0;
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
    .admin-tabs {
      display: flex;
      gap: 12px;
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
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .tab-btn.active {
      color: #008cff;
      border-bottom-color: #008cff;
    }
    .tab-icon {
      color: inherit;
    }
    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
    }
    .status-filters {
      display: flex;
      gap: 6px;
    }
    .filter-pill {
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      padding: 5px 12px;
      border-radius: 14px;
      font-size: 12px;
      font-weight: 600;
      color: #475569;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .filter-pill.active {
      background: #008cff;
      color: #ffffff;
      border-color: #008cff;
    }
    .btn-refresh {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      color: #334155;
      transition: background-color 0.15s;
    }
    .btn-refresh:hover {
      background: #f1f5f9;
    }
    .table-container {
      overflow-x: auto;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
    }
    .admin-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      text-align: left;
    }
    .admin-table th {
      background: #f8fafc;
      padding: 10px 12px;
      font-size: 11px;
      font-weight: 800;
      color: #64748b;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #e2e8f0;
    }
    .admin-table td {
      padding: 12px;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: middle;
    }
    .table-sub {
      font-size: 11px;
      color: #64748b;
      margin-top: 2px;
    }
    .table-reason {
      font-size: 11px;
      color: #dc2626;
      background: #fef2f2;
      padding: 2px 6px;
      border-radius: 4px;
      margin-top: 4px;
      display: inline-block;
    }
    .badge-opt, .badge-type {
      font-size: 10px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      margin-right: 4px;
    }
    .badge-opt {
      background: #e0f2fe;
      color: #0284c7;
    }
    .badge-type {
      background: #f1f5f9;
      color: #475569;
    }
    .status-chip {
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .status-chip.active {
      background: #ecfdf5;
      color: #059669;
    }
    .status-chip.sold {
      background: #ecfdf5;
      color: #065f46;
      border: 1px solid #10b981;
    }
    .status-chip.inactive {
      background: #fef2f2;
      color: #dc2626;
    }
    .badge-deal-closed {
      background: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;
      display: inline-block;
    }
    .sales-stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      margin-bottom: 20px;
    }
    @media (max-width: 768px) {
      .sales-stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    .stat-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 14px 16px;
    }
    .stat-card.stat-sold {
      border-left: 4px solid #10b981;
    }
    .stat-card.stat-revenue {
      border-left: 4px solid #008cff;
    }
    .stat-card.stat-active {
      border-left: 4px solid #f59e0b;
    }
    .stat-card.stat-inventory {
      border-left: 4px solid #8b5cf6;
    }
    .stat-label {
      font-size: 10px;
      font-weight: 800;
      color: #64748b;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .stat-value {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.2;
    }
    .stat-sub {
      font-size: 11px;
      color: #94a3b8;
      margin-top: 4px;
    }
    .section-title {
      font-size: 14px;
      font-weight: 800;
      color: #0f172a;
      margin: 16px 0 10px 0;
    }
    .empty-table-cell {
      text-align: center;
      padding: 30px;
      color: #64748b;
      font-style: italic;
    }
    .sold-price-val {
      color: #059669;
    }
    .buyer-tag {
      background: #f1f5f9;
      color: #334155;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
    }
    .action-buttons {
      display: flex;
      gap: 6px;
    }
    .btn-verify {
      background: #10b981;
      color: #ffffff;
      border: none;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: background-color 0.15s;
    }
    .btn-verify:hover {
      background: #059669;
    }
    .btn-deactivate {
      background: #ffffff;
      color: #dc2626;
      border: 1px solid #fca5a5;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: background-color 0.15s;
    }
    .btn-deactivate:hover {
      background: #fef2f2;
    }
    .role-badge {
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .role-admin {
      background: #ede9fe;
      color: #7c3aed;
    }
    .role-seller {
      background: #fef3c7;
      color: #d97706;
    }
    .role-buyer {
      background: #e0f2fe;
      color: #0284c7;
    }
    .alert {
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 13px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .alert-success {
      background: #f0fdf4;
      color: #16a34a;
      border: 1px solid #bbf7d0;
    }
    .alert-error {
      background: #fef2f2;
      color: #dc2626;
      border: 1px solid #fecaca;
    }
    .deactivate-inline-dialog {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(15, 23, 42, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      z-index: 10;
    }
    .dialog-box {
      background: #ffffff;
      border-radius: 10px;
      padding: 20px;
      width: 420px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }
    .dialog-box h4 {
      margin: 0 0 6px 0;
      font-size: 16px;
      color: #0f172a;
    }
    .dialog-box p {
      font-size: 12px;
      color: #64748b;
      margin: 0 0 10px 0;
    }
    .reason-input {
      width: 100%;
      padding: 8px 10px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 13px;
      outline: none;
      box-sizing: border-box;
      margin-bottom: 12px;
    }
    .reason-input:focus {
      border-color: #dc2626;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    .btn-cancel {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
    }
    .btn-confirm-deact {
      background: #dc2626;
      color: #ffffff;
      border: none;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
    }
    .btn-confirm-deact:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .btn-inspect-cart {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 600;
      color: #0369a1;
      background: #e0f2fe;
      border: 1px solid #bae6fd;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .btn-inspect-cart:hover {
      background: #bae6fd;
    }
    .text-muted {
      color: #94a3b8;
    }
    .status-badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
    }
    .badge-active {
      background: #dcfce7;
      color: #15803d;
    }
    .badge-inactive {
      background: #fee2e2;
      color: #b91c1c;
    }
    .btn-toggle-status {
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.15s ease;
    }
    .btn-deact {
      background: #fff1f2;
      color: #e11d48;
      border-color: #fecdd3;
    }
    .btn-deact:hover {
      background: #ffe4e6;
    }
    .btn-act {
      background: #f0fdf4;
      color: #16a34a;
      border-color: #bbf7d0;
    }
    .btn-act:hover {
      background: #dcfce7;
    }
  `]
})
export class AdminPanelComponent {
  readonly isOpen = input<boolean>(true);
  readonly isDashboard = input<boolean>(false);
  readonly cities = input<City[]>([]);

  readonly close = output<void>();
  readonly propertyStatusChanged = output<void>();
  readonly switchView = output<void>();

  activeTab: 'properties' | 'users' | 'sales' = 'properties';
  propFilter: 'all' | 'pending' | 'verified' | 'sold' = 'all';

  allProperties = signal<Property[]>([]);
  allUsers = signal<UserSummary[]>([]);
  salesReport = signal<any | null>(null);

  alertMessage = signal<string | null>(null);
  alertType = signal<'success' | 'error'>('success');

  deactivatingPropertyId: number | null = null;
  deactivateReason: string = '';

  inspectingBuyer = signal<UserSummary | null>(null);
  inspectedCart = signal<EnrichedCartItem[]>([]);

  constructor(
    private propertyService: PropertyService,
    private userService: UserService,
    private cartService: CartService
  ) {
    effect(() => {
      if (this.isOpen()) {
        this.loadProperties();
      }
    });
  }

  inspectBuyerCart(buyer: UserSummary): void {
    this.inspectingBuyer.set(buyer);
    this.inspectedCart.set([]);
    this.cartService.getBuyerCart(buyer.profileId).subscribe({
      next: res => {
        if (res.success && res.data) {
          this.inspectedCart.set(res.data);
        } else {
          this.inspectedCart.set([]);
        }
      },
      error: () => this.inspectedCart.set([])
    });
  }

  closeCartInspection(): void {
    this.inspectingBuyer.set(null);
    this.inspectedCart.set([]);
  }

  deactivateUser(user: UserSummary): void {
    const userId = user.profileId || 1;
    this.userService.deactivateUser(userId, 'Deactivated by administrator').subscribe({
      next: () => {
        user.isActive = false;
        this.alertMessage.set(`User #${userId} deactivated successfully.`);
        this.alertType.set('success');
      },
      error: () => {
        this.alertMessage.set('Could not deactivate user.');
        this.alertType.set('error');
      }
    });
  }

  deleteUser(user: UserSummary): void {
    if (!confirm(`Are you sure you want to permanently delete user ${user.fullName || user.userName}?`)) {
      return;
    }
    const userId = user.profileId || 1;
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.allUsers.set(this.allUsers().filter(u => u !== user));
        this.alertMessage.set(`User #${userId} deleted successfully.`);
        this.alertType.set('success');
      },
      error: () => {
        this.alertMessage.set('Could not delete user.');
        this.alertType.set('error');
      }
    });
  }

  get filteredProperties(): Property[] {
    if (this.propFilter === 'verified') {
      return this.allProperties().filter(p => p.isActive);
    }
    if (this.propFilter === 'sold') {
      return this.allProperties().filter(p => !p.isActive && p.deactivationReason?.startsWith('Sold'));
    }
    if (this.propFilter === 'pending') {
      return this.allProperties().filter(p => !p.isActive && !p.deactivationReason?.startsWith('Sold'));
    }
    return this.allProperties();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }

  switchToUsers(): void {
    this.activeTab = 'users';
    this.loadUsers();
  }

  switchToSales(): void {
    this.activeTab = 'sales';
    this.loadSalesReport();
  }

  loadSalesReport(): void {
    this.propertyService.getAdminSalesReport().subscribe({
      next: res => {
        if (res.success && res.data) {
          this.salesReport.set(res.data);
        }
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

  loadProperties(): void {
    this.propertyService.getAllPropertiesAdmin().subscribe({
      next: res => {
        if (res.success && res.data) {
          this.allProperties.set(res.data);
        }
      }
    });
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: res => {
        if (res.success && res.data) {
          this.allUsers.set(res.data);
        }
      }
    });
  }

  handleVerify(propertyId: number): void {
    this.propertyService.verifyProperty(propertyId).subscribe({
      next: res => {
        if (res.success) {
          this.showAlert(`Property #${propertyId} successfully verified & published!`, 'success');
          this.loadProperties();
          this.propertyStatusChanged.emit();
        } else {
          this.showAlert(res.message || 'Verification failed.', 'error');
        }
      },
      error: err => {
        this.showAlert(err.error?.message || 'Verification failed.', 'error');
      }
    });
  }

  openDeactivatePrompt(propertyId: number): void {
    this.deactivatingPropertyId = propertyId;
    this.deactivateReason = '';
  }

  confirmDeactivate(): void {
    if (!this.deactivatingPropertyId || !this.deactivateReason.trim()) return;

    const pid = this.deactivatingPropertyId;
    this.propertyService.deactivateProperty(pid, this.deactivateReason.trim()).subscribe({
      next: res => {
        this.deactivatingPropertyId = null;
        if (res.success) {
          this.showAlert(`Property #${pid} has been deactivated.`, 'success');
          this.loadProperties();
          this.propertyStatusChanged.emit();
        } else {
          this.showAlert(res.message || 'Failed to deactivate property.', 'error');
        }
      },
      error: err => {
        this.deactivatingPropertyId = null;
        this.showAlert(err.error?.message || 'Failed to deactivate property.', 'error');
      }
    });
  }

  private showAlert(msg: string, type: 'success' | 'error'): void {
    this.alertMessage.set(msg);
    this.alertType.set(type);
    setTimeout(() => {
      this.alertMessage.set(null);
    }, 4000);
  }
}
