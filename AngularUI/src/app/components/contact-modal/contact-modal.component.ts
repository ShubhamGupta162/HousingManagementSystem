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
              <span class="verified-tag">
                <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                Verified by EHS
              </span>
            </div>
            <button class="btn-close" (click)="close.emit()" title="Close contact dialog">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
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
                  <div class="tile-icon phone-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#0284c7">
                      <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-2.2 2.2a15.053 15.053 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1.01A11.36 11.36 0 018.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/>
                    </svg>
                  </div>
                  <div class="tile-info">
                    <span class="tile-label">PHONE NUMBER</span>
                    <strong class="tile-val">{{ contact()?.phoneNo }}</strong>
                  </div>
                  <span class="tile-action">Call Now ›</span>
                </a>

                <a class="contact-tile" [href]="'mailto:' + contact()?.emailId">
                  <div class="tile-icon mail-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#d97706">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </div>
                  <div class="tile-info">
                    <span class="tile-label">EMAIL ADDRESS</span>
                    <strong class="tile-val">{{ contact()?.emailId }}</strong>
                  </div>
                  <span class="tile-action">Email ›</span>
                </a>
              </div>

              <div class="safety-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" style="flex-shrink: 0; margin-top: 1px;">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
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
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
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
      padding: 3px 8px;
      border-radius: 4px;
      border: 1px solid #a7f3d0;
      display: inline-flex;
      align-items: center;
      gap: 4px;
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
    .seller-profile-banner {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: #f8fafc;
      border-radius: 10px;
      margin-bottom: 16px;
      border: 1px solid #f1f5f9;
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
      align-items: flex-start;
      gap: 8px;
      background: #fffbeb;
      border: 1px solid #fef3c7;
      border-radius: 8px;
      padding: 10px 12px;
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
