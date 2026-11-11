import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (message()) {
      <div class="toast-wrapper" [class.toast-error]="type() === 'error'" [class.toast-success]="type() === 'success'">
        <span class="toast-icon">
          {{ type() === 'error' ? '⚠️' : '✓' }}
        </span>
        <span class="toast-text">{{ message() }}</span>
      </div>
    }
  `,
  styles: [`
    .toast-wrapper {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #0f172a;
      color: #ffffff;
      padding: 12px 20px;
      border-radius: 10px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      font-weight: 600;
      z-index: 2000;
      animation: toastSlideUp 0.25s ease-out;
    }
    @keyframes toastSlideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .toast-success {
      background: #064e3b;
      border: 1px solid #059669;
    }
    .toast-error {
      background: #7f1d1d;
      border: 1px solid #dc2626;
    }
    .toast-icon {
      font-size: 16px;
    }
  `]
})
export class ToastComponent {
  readonly message = input<string | null>(null);
  readonly type = input<'success' | 'error' | 'info'>('success');
}
