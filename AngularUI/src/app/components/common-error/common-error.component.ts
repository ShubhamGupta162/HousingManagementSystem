import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorService } from '../../services/error.service';

@Component({
  selector: 'app-common-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './common-error.component.html',
  styleUrl: './common-error.component.css'
})
export class CommonErrorComponent {
  readonly showDetails = signal<boolean>(false);

  constructor(public errorService: ErrorService) {}

  toggleDetails(): void {
    this.showDetails.update(v => !v);
  }

  onDismiss(): void {
    this.errorService.clearError();
  }

  onReload(): void {
    this.errorService.clearError();
    window.location.reload();
  }
}
