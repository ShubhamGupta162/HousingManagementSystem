import { Component, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyService } from '../../services/property.service';
import { UserService } from '../../services/user.service';
import { Property, City, UserSummary } from '../../models/models';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen()) {
      <div class="modal-backdrop" (click)="onBackdropClick($event)">
        <div class="modal-card">
          <!-- Header -->
          <div class="modal-header">
            <div>
              <div class="title-with-shield">
                <div class="shield-badge">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                  </svg>
                </div>
                <h2 class="modal-title">EHS Administration Portal</h2>
              </div>
              <p class="modal-sub">Real estate verification & platform governance</p>
            </div>
            <button class="btn-close" (click)="close.emit()" title="Close admin portal">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
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
                            [class.inactive]="!p.isActive"
                          >
                            @if (p.isActive) {
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
                            @if (!p.isActive) {
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
                      <th>Address</th>
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
                        <td>{{ u.address || '—' }}</td>
                      </tr>
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
    .status-chip.inactive {
      background: #fef2f2;
      color: #dc2626;
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
  `]
})
export class AdminPanelComponent {
  readonly isOpen = input<boolean>(false);
  readonly cities = input<City[]>([]);

  readonly close = output<void>();
  readonly propertyStatusChanged = output<void>();

  activeTab: 'properties' | 'users' = 'properties';
  propFilter: 'all' | 'pending' | 'verified' = 'all';

  allProperties = signal<Property[]>([]);
  allUsers = signal<UserSummary[]>([]);

  alertMessage = signal<string | null>(null);
  alertType = signal<'success' | 'error'>('success');

  deactivatingPropertyId: number | null = null;
  deactivateReason: string = '';

  constructor(
    private propertyService: PropertyService,
    private userService: UserService
  ) {
    effect(() => {
      if (this.isOpen()) {
        this.loadProperties();
      }
    });
  }

  get filteredProperties(): Property[] {
    if (this.propFilter === 'verified') {
      return this.allProperties().filter(p => p.isActive);
    }
    if (this.propFilter === 'pending') {
      return this.allProperties().filter(p => !p.isActive);
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
