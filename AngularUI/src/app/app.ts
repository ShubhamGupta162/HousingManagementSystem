import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { PropertyService } from './services/property.service';
import { CartService } from './services/cart.service';
import { City, State, Property, SellerContact, UserSession } from './models/models';

import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroSearchComponent } from './components/hero-search/hero-search.component';
import { PropertyListComponent } from './components/property-list/property-list.component';
import { AuthModalComponent } from './components/auth-modal/auth-modal.component';
import { CartModalComponent } from './components/cart-modal/cart-modal.component';
import { ContactModalComponent } from './components/contact-modal/contact-modal.component';
import { SellerPortalComponent } from './components/seller-portal/seller-portal.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroSearchComponent,
    PropertyListComponent,
    AuthModalComponent,
    CartModalComponent,
    ContactModalComponent,
    SellerPortalComponent,
    AdminPanelComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  // Application Data Signals
  readonly cities = signal<City[]>([]);
  readonly states = signal<State[]>([]);
  readonly properties = signal<Property[]>([]);
  readonly isLoadingProperties = signal<boolean>(false);

  // Modal Signals
  readonly isAuthOpen = signal<boolean>(false);
  readonly isCartOpen = signal<boolean>(false);
  readonly isSellerPortalOpen = signal<boolean>(false);
  readonly isAdminPanelOpen = signal<boolean>(false);
  readonly isContactOpen = signal<boolean>(false);

  // Active Seller Contact
  readonly selectedContact = signal<SellerContact | null>(null);
  readonly isLoadingContact = signal<boolean>(false);

  // Filter State
  currentFilter: { cityId?: number; propertyType?: string; propertyOption?: string; sortBy?: string } = {
    propertyOption: 'Sell'
  };

  // Computeds
  readonly isBuyer = computed(() => this.authService.userRole() === 'Buyer');
  readonly cartPropertyIds = computed(() => this.cartService.cartItems().map(i => i.propertyId));

  constructor(
    public authService: AuthService,
    public propertyService: PropertyService,
    public cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadLocations();
    this.loadProperties();
    this.refreshUserCart();
  }

  loadLocations(): void {
    this.propertyService.getCities().subscribe({
      next: res => {
        if (res.success && res.data) {
          this.cities.set(res.data);
        }
      }
    });

    this.propertyService.getStates().subscribe({
      next: res => {
        if (res.success && res.data) {
          this.states.set(res.data);
        }
      }
    });
  }

  loadProperties(): void {
    this.isLoadingProperties.set(true);
    this.propertyService.searchProperties(
      this.currentFilter.cityId,
      this.currentFilter.propertyType,
      this.currentFilter.propertyOption,
      this.currentFilter.sortBy
    ).subscribe({
      next: res => {
        this.isLoadingProperties.set(false);
        if (res.success && res.data) {
          this.properties.set(res.data);
        }
      },
      error: () => {
        this.isLoadingProperties.set(false);
      }
    });
  }

  refreshUserCart(): void {
    const user = this.authService.currentUser();
    if (user && user.userType === 'Buyer' && user.profileId) {
      this.cartService.getBuyerCart(user.profileId).subscribe();
    } else {
      this.cartService.clearCart();
    }
  }

  onSearchTriggered(params: { cityId?: number; propertyType?: string; propertyOption?: string; sortBy?: string }): void {
    this.currentFilter = { ...this.currentFilter, ...params };
    this.loadProperties();
  }

  onFilterChanged(params: { cityId?: number; propertyType?: string; sortBy?: string }): void {
    this.currentFilter = { ...this.currentFilter, ...params };
    this.loadProperties();
  }

  onHomeReset(): void {
    this.currentFilter = { propertyOption: 'Sell' };
    this.loadProperties();
  }

  onAuthSuccess(session: UserSession): void {
    this.refreshUserCart();
  }

  openOwnerContact(sellerId: number): void {
    this.isContactOpen.set(true);
    this.isLoadingContact.set(true);
    this.selectedContact.set(null);

    this.propertyService.getSellerContact(sellerId).subscribe({
      next: res => {
        this.isLoadingContact.set(false);
        if (res.success && res.data) {
          this.selectedContact.set(res.data);
        }
      },
      error: () => {
        this.isLoadingContact.set(false);
      }
    });
  }

  onToggleCart(propertyId: number): void {
    const user = this.authService.currentUser();
    if (!user) {
      this.isAuthOpen.set(true);
      return;
    }
    if (user.userType !== 'Buyer' || !user.profileId) {
      return;
    }

    const existing = this.cartService.cartItems().find(i => i.propertyId === propertyId);
    if (existing) {
      this.cartService.removeFromCart(existing.cartId, user.profileId).subscribe();
    } else {
      this.cartService.addToCart(user.profileId, propertyId).subscribe();
    }
  }

  onRemoveCartItem(cartId: number): void {
    const user = this.authService.currentUser();
    if (user && user.profileId) {
      this.cartService.removeFromCart(cartId, user.profileId).subscribe();
    }
  }
}
