import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellerContact } from '../../models/models';

@Component({
  selector: 'app-contact-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <div class="modal-backdrop" (click)="onBackdropClick($event)">
        <div class="modal-card">
          <div class="modal-header">
            <div>
              <h2 class="modal-title">Verified Owner Contact</h2>
              <span class="verified-tag">✓ Verified by EHS</span>
            </div>
            <button class="btn-close" (click)="close.emit()">✕</button>
          </div>

          @if (loading()) {
            <div class="loading-state">
              <div class="spinner"></div>
              <p>Fetching owner contact details...</p>
            </div>
          } @else if (contact()) {
            <div class="contact-body">
              <div class="seller-profile-banner">
                <div class="avatar">{{ contact()?.fullName?.charAt(0) || 'S' }}</div>
                <div>
                  <h3 class="seller-name">{{ contact()?.fullName }}</h3>
                  <span class="seller-sub">Property Owner / Seller</span>
                </div>
              </div>

              <div class="contact-methods">
                <a class="contact-tile" [href]="'tel:' + contact()?.phoneNo">
                  <div class="tile-icon phone-icon">📞</div>
                  <div class="tile-info">
                    <span class="tile-label">PHONE NUMBER</span>
                    <strong class="tile-val">{{ contact()?.phoneNo }}</strong>
                  </div>
                  <span class="tile-action">Call Now ›</span>
                </a>

                <a class="contact-tile" [href]="'mailto:' + contact()?.emailId">
                  <div class="tile-icon mail-icon">✉️</div>
                  <div class="tile-info">
                    <span class="tile-label">EMAIL ADDRESS</span>
                    <strong class="tile-val">{{ contact()?.emailId }}</strong>
                  </div>
                  <span class="tile-action">Email ›</span>
                </a>
              </div>

              <div class="safety-box">
                <span class="safety-icon">💡</span>
                <p>Never transfer booking amount or deposit before physically verifying the property documents.</p>
              </div>
            </div>
          } @else {
            <div class="error-state">
              <p>Unable to retrieve seller contact details.</p>
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
      max-width: 440px;
      border-radius: 16px;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
      padding: 24px;
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
      padding-bottom: 12px;
      border-bottom: 1px solid #edf2f7;
    }
    .modal-title {
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 4px 0;
    }
    .verified-tag {
      background: #ecfdf5;
      color: #059669;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid #a7f3d0;
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
    .seller-profile-banner {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: #f8fafc;
      border-radius: 10px;
      margin-bottom: 16px;
    }
    .avatar {
      width: 46px;
      height: 46px;
      background: #008cff;
      color: #ffffff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 800;
    }
    .seller-name {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 2px 0;
    }
    .seller-sub {
      font-size: 12px;
      color: #64748b;
    }
    .contact-methods {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 16px;
    }
    .contact-tile {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      text-decoration: none;
      color: inherit;
      transition: all 0.15s ease;
      background: #ffffff;
    }
    .contact-tile:hover {
      border-color: #008cff;
      background: #f0f7ff;
    }
    .tile-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }
    .phone-icon {
      background: #e0f2fe;
    }
    .mail-icon {
      background: #fef3c7;
    }
    .tile-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .tile-label {
      font-size: 10px;
      font-weight: 800;
      color: #64748b;
      letter-spacing: 0.5px;
    }
    .tile-val {
      font-size: 14px;
      color: #0f172a;
    }
    .tile-action {
      font-size: 12px;
      font-weight: 700;
      color: #008cff;
    }
    .safety-box {
      display: flex;
      gap: 8px;
      background: #fffbeb;
      border: 1px solid #fef3c7;
      border-radius: 8px;
      padding: 10px;
      font-size: 11px;
      color: #b45309;
      line-height: 1.4;
    }
    .safety-box p {
      margin: 0;
    }
    .loading-state, .error-state {
      padding: 30px;
      text-align: center;
      color: #64748b;
    }
    .spinner {
      width: 32px;
      height: 32px;
      border: 3px solid #e2e8f0;
      border-top-color: #008cff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 10px auto;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class ContactModalComponent {
  readonly isOpen = input<boolean>(false);
  readonly contact = input<SellerContact | null>(null);
  readonly loading = input<boolean>(false);

  readonly close = output<void>();

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }
}
