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
                <span class="shield-glyph">🛡️</span>
                <h2 class="modal-title">EHS Administration Portal</h2>
              </div>
              <p class="modal-sub">Real estate verification & platform governance</p>
            </div>
            <button class="btn-close" (click)="close.emit()">✕</button>
          </div>

          <!-- Tab Bar -->
          <div class="admin-tabs">
            <button
              class="tab-btn"
              [class.active]="activeTab === 'properties'"
              (click)="activeTab = 'properties'"
            >
              🏢 Properties Management ({{ allProperties().length }})
            </button>
            <button
              class="tab-btn"
              [class.active]="activeTab === 'users'"
              (click)="switchToUsers()"
            >
              👥 All Registered Users ({{ allUsers().length }})
            </button>
          </div>

          <!-- Alert Notifications -->
          @if (alertMessage()) {
            <div
              class="alert"
              [class.alert-success]="alertType() === 'success'"
              [class.alert-error]="alertType() === 'error'"
            >
              {{ alertMessage() }}
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
                <button class="btn-refresh" (click)="loadProperties()">↻ Refresh</button>
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
                            {{ p.isActive ? '✓ Verified' : '✕ Inactive' }}
                          </span>
                        </td>
                        <td>
                          <div class="action-buttons">
                            @if (!p.isActive) {
                              <button
                                class="btn-verify"
                                (click)="handleVerify(p.propertyId)"
                              >
                                ✓ Verify
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
                <button class="btn-refresh" (click)="loadUsers()">↻ Refresh</button>
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
                    @for (u of allUsers(); track u.userId) {
                      <tr>
                        <td>#{{ u.userId }}</td>
                        <td><strong>{{ u.fullName }}</strong></td>
                        <td>{{ u.emailId }}</td>
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
      border-radius: 16px;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
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
      gap: 8px;
    }
    .shield-glyph {
      font-size: 22px;
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
    }
    .tab-btn.active {
      color: #008cff;
      border-bottom-color: #008cff;
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
      border-radius: 16px;
      z-index: 10;
    }
    .dialog-box {
      background: #ffffff;
      border-radius: 12px;
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
