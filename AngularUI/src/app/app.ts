import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { PropertyService } from './services/property.service';
import { CartService } from './services/cart.service';
import { City, State, Property, SellerContact, UserSession, PropertyFilterCriteria } from './models/models';

import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroSearchComponent } from './components/hero-search/hero-search.component';
import { PropertyListComponent } from './components/property-list/property-list.component';
import { AuthModalComponent } from './components/auth-modal/auth-modal.component';
import { CartModalComponent } from './components/cart-modal/cart-modal.component';
import { ContactModalComponent } from './components/contact-modal/contact-modal.component';
import { SellerPortalComponent } from './components/seller-portal/seller-portal.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { PropertyDetailModalComponent } from './components/property-detail-modal/property-detail-modal.component';
import { ToastComponent } from './components/toast/toast.component';

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
    AdminPanelComponent,
    PropertyDetailModalComponent,
    ToastComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  // Application Data Signals
  readonly cities = signal<City[]>([]);
  readonly states = signal<State[]>([]);
  readonly properties = signal<Property[]>([]);
  readonly allVerifiedProperties = signal<Property[]>([]);
  readonly isLoadingProperties = signal<boolean>(false);

  // Modal Signals
  readonly isAuthOpen = signal<boolean>(false);
  readonly isCartOpen = signal<boolean>(false);
  readonly isSellerPortalOpen = signal<boolean>(false);
  readonly isAdminPanelOpen = signal<boolean>(false);
  readonly isContactOpen = signal<boolean>(false);
  readonly isDetailOpen = signal<boolean>(false);

  // Detail Modal Selection
  readonly selectedDetailProperty = signal<Property | null>(null);

  // Active Seller Contact
  readonly selectedContact = signal<SellerContact | null>(null);
  readonly isLoadingContact = signal<boolean>(false);

  // Toast Notification Signals
  readonly toastMessage = signal<string | null>(null);
  readonly toastType = signal<'success' | 'error' | 'info'>('success');
  private toastTimer: any = null;

  // Central Reactive Filter State
  readonly activeFilter = signal<PropertyFilterCriteria>({
    propertyOption: 'Sell'
  });

  // Active City Computed
  readonly activeCity = computed(() => {
    const cid = this.activeFilter().cityId;
    return cid ? this.cities().find(c => c.cityId === Number(cid)) ?? null : null;
  });

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
    this.loadAllVerifiedMaster();
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

  loadAllVerifiedMaster(): void {
    this.propertyService.getVerifiedProperties().subscribe({
      next: res => {
        if (res.success && res.data) {
          this.allVerifiedProperties.set(res.data);
        }
      }
    });
  }

  loadProperties(): void {
    this.isLoadingProperties.set(true);
    const filter = this.activeFilter();
    this.propertyService.searchProperties(
      filter.cityId ? Number(filter.cityId) : undefined,
      filter.propertyType,
      filter.propertyOption,
      filter.sortBy
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

  onSearchTriggered(params: PropertyFilterCriteria): void {
    this.activeFilter.update(curr => ({
      ...curr,
      ...params
    }));
    this.loadProperties();
  }

  onFilterChanged(params: PropertyFilterCriteria): void {
    this.activeFilter.update(curr => ({
      ...curr,
      ...params
    }));
    this.loadProperties();
  }

  onClearCity(): void {
    this.activeFilter.update(curr => ({
      ...curr,
      cityId: null
    }));
    this.loadProperties();
  }

  onHomeReset(): void {
    this.activeFilter.set({ propertyOption: 'Sell' });
    this.loadProperties();
  }

  onAuthSuccess(session: UserSession): void {
    this.refreshUserCart();
    this.showToast(`Welcome, ${session.fullName}! (${session.userType})`, 'success');
  }

  openPropertyDetails(property: Property): void {
    this.selectedDetailProperty.set(property);
    this.isDetailOpen.set(true);
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
      this.showToast('Please login to bookmark properties', 'info');
      return;
    }
    if (user.userType !== 'Buyer' || !user.profileId) {
      this.showToast('Only registered Buyers can add properties to cart', 'info');
      return;
    }

    const prop = this.properties().find(p => p.propertyId === propertyId);
    const existing = this.cartService.cartItems().find(i => i.propertyId === propertyId);
    if (existing) {
      this.cartService.removeFromCart(existing.cartId, user.profileId).subscribe(() => {
        this.showToast('Property removed from your cart', 'info');
      });
    } else {
      this.cartService.addToCart(user.profileId, propertyId, prop).subscribe(() => {
        this.showToast('✓ Added property to your cart!', 'success');
      });
    }
  }

  onRemoveCartItem(cartId: number): void {
    const user = this.authService.currentUser();
    if (user && user.profileId) {
      this.cartService.removeFromCart(cartId, user.profileId).subscribe(() => {
        this.showToast('Property removed from cart', 'info');
      });
    }
  }

  showToast(msg: string, type: 'success' | 'error' | 'info' = 'success'): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
    this.toastMessage.set(msg);
    this.toastType.set(type);

    this.toastTimer = setTimeout(() => {
      this.toastMessage.set(null);
    }, 3500);
  }
}
