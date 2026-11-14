import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, catchError, map } from 'rxjs';
import { ApiResponse, Property, City, State, PropertyImage, SellerContact } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private readonly gatewayUrl = 'http://localhost:5000/api';

  // Resilient fallback dataset aligned with backend database seed
  private readonly sampleStates: State[] = [
    { stateId: 1, stateName: 'Maharashtra' },
    { stateId: 2, stateName: 'Karnataka' },
    { stateId: 3, stateName: 'Delhi NCR' },
    { stateId: 4, stateName: 'Telangana' }
  ];

  private readonly sampleCities: City[] = [
    { cityId: 1, cityName: 'Mumbai', stateId: 1 },
    { cityId: 2, cityName: 'Pune', stateId: 1 },
    { cityId: 3, cityName: 'Bengaluru', stateId: 2 },
    { cityId: 4, cityName: 'New Delhi', stateId: 3 },
    { cityId: 5, cityName: 'Gurgaon', stateId: 3 },
    { cityId: 6, cityName: 'Hyderabad', stateId: 4 }
  ];

  private sampleProperties: Property[] = [
    {
      propertyId: 1,
      propertyName: 'Sobha Dream Acres 3BHK',
      propertyType: 'Apartment',
      propertyOption: 'Sell',
      description: 'Modern luxury 3BHK flat with panoramic view, modular Italian kitchen, and clubhouse access.',
      address: 'Tower 4, Panathur Road, Balagere',
      priceRange: 8500000,
      initialDeposit: 0,
      landmark: 'Outer Ring Road Tech Park',
      isActive: true,
      sellerId: 1,
      cityId: 3
    },
    {
      propertyId: 2,
      propertyName: 'Prestige Independent Villa',
      propertyType: 'Villa',
      propertyOption: 'Sell',
      description: 'Gated community triplex villa with private lawn, home theater room, 2 covered car parks, and solar heating.',
      address: 'Villa 18, ECC Road, Whitefield',
      priceRange: 22000000,
      initialDeposit: 0,
      landmark: 'Hope Farm',
      isActive: true,
      sellerId: 1,
      cityId: 3
    },
    {
      propertyId: 3,
      propertyName: 'Hiranandani Lakeview 2BHK',
      propertyType: 'Apartment',
      propertyOption: 'Rent',
      description: 'Semi-furnished elegant 2BHK with lake view, granite tops, split ACs, and piped gas.',
      address: 'Castle Rock, Central Ave',
      priceRange: 55000,
      initialDeposit: 150000,
      landmark: 'Powai Lake',
      isActive: true,
      sellerId: 2,
      cityId: 1
    },
    {
      propertyId: 4,
      propertyName: 'DLF Cyber City Tech Suite',
      propertyType: 'Commercial',
      propertyOption: 'Rent',
      description: 'Plug-and-play office with 40 workstations, 2 conference rooms, and 100% backup.',
      address: 'Building 10, DLF Phase 2',
      priceRange: 135000,
      initialDeposit: 400000,
      landmark: 'Cyber City Metro',
      isActive: true,
      sellerId: 1,
      cityId: 5
    },
    {
      propertyId: 5,
      propertyName: 'Lodha Park Sky Residence 4BHK',
      propertyType: 'Apartment',
      propertyOption: 'Sell',
      description: 'Ultra-luxurious high-rise with Arabian Sea view and 7-tier security.',
      address: 'Park Tower, Worli Marg',
      priceRange: 37500000,
      initialDeposit: 0,
      landmark: 'Worli Sea Face',
      isActive: true,
      sellerId: 2,
      cityId: 1
    },
    {
      propertyId: 6,
      propertyName: 'My Home Bhooja Elite Villa',
      propertyType: 'Villa',
      propertyOption: 'Sell',
      description: 'Contemporary architectural villa with elevator, pool, and smart home fixtures.',
      address: 'Silpa Gram Road',
      priceRange: 19500000,
      initialDeposit: 0,
      landmark: 'Cyber Towers',
      isActive: true,
      sellerId: 3,
      cityId: 6
    },
    {
      propertyId: 7,
      propertyName: 'Godrej Woods Green Valley 3BHK',
      propertyType: 'Apartment',
      propertyOption: 'Rent',
      description: 'Forest-themed residence surrounded by 600 trees, infinity pool, and squash court.',
      address: 'Sector 43, Expressway',
      priceRange: 38000,
      initialDeposit: 76000,
      landmark: 'Golf Course Metro',
      isActive: true,
      sellerId: 2,
      cityId: 4
    },
    {
      propertyId: 8,
      propertyName: 'Green Meadows Residential Plot',
      propertyType: 'Plot',
      propertyOption: 'Sell',
      description: 'Approved residential villa plot with clear title, borewell water, and wide roads.',
      address: 'Plot 42, Devanahalli',
      priceRange: 4500000,
      initialDeposit: 0,
      landmark: 'Near Airport Road',
      isActive: false,
      sellerId: 1,
      cityId: 3
    },
    {
      propertyId: 9,
      propertyName: 'Sunrise Towers 1BHK',
      propertyType: 'Apartment',
      propertyOption: 'Rent',
      description: 'Studio 1BHK close to airport and tech parks.',
      address: 'Flat 204, Viman Nagar',
      priceRange: 22000,
      initialDeposit: 50000,
      landmark: 'Near Phoenix Mall',
      isActive: false,
      deactivationReason: 'Incomplete property ownership documentation submitted by seller.',
      sellerId: 2,
      cityId: 2
    }
  ];

  constructor(private http: HttpClient) {}

  getVerifiedProperties(): Observable<ApiResponse<Property[]>> {
    return this.http.get<ApiResponse<Property[]>>(`${this.gatewayUrl}/properties/verified`).pipe(
      catchError(() => of({
        success: true,
        message: 'Loaded verified properties (offline mode)',
        data: this.sampleProperties.filter(p => p.isActive)
      }))
    );
  }

  searchProperties(cityId?: number, propertyType?: string, propertyOption?: string, sortBy?: string): Observable<ApiResponse<Property[]>> {
    let params = new HttpParams();
    if (cityId) params = params.set('cityId', cityId.toString());
    if (propertyType) params = params.set('propertyType', propertyType);
    if (propertyOption) params = params.set('propertyOption', propertyOption);
    if (sortBy) params = params.set('sortBy', sortBy);

    return this.http.get<ApiResponse<Property[]>>(`${this.gatewayUrl}/properties/search`, { params }).pipe(
      catchError(() => {
        let filtered = this.sampleProperties.filter(p => p.isActive);

        if (cityId) {
          filtered = filtered.filter(p => p.cityId === Number(cityId));
        }
        if (propertyType) {
          filtered = filtered.filter(p => p.propertyType.toLowerCase() === propertyType.toLowerCase());
        }
        if (propertyOption) {
          filtered = filtered.filter(p => p.propertyOption.toLowerCase() === propertyOption.toLowerCase());
        }
        if (sortBy === 'price_asc') {
          filtered.sort((a, b) => a.priceRange - b.priceRange);
        } else if (sortBy === 'price_desc') {
          filtered.sort((a, b) => b.priceRange - a.priceRange);
        }

        return of({
          success: true,
          message: 'Filtered properties (offline mode)',
          data: filtered
        });
      })
    );
  }

  getPropertyById(id: number): Observable<ApiResponse<Property>> {
    return this.http.get<ApiResponse<Property>>(`${this.gatewayUrl}/properties/${id}`).pipe(
      catchError(() => {
        const found = this.sampleProperties.find(p => p.propertyId === id);
        return of({
          success: found !== undefined,
          message: found ? 'Found property' : 'Property not found',
          data: found as Property
        });
      })
    );
  }

  createProperty(payload: Partial<Property>): Observable<ApiResponse<Property>> {
    return this.http.post<any>(`${this.gatewayUrl}/properties`, payload).pipe(
      map(res => {
        const data = (res && res.data) ? res.data : res;
        return {
          success: true,
          message: res?.message || 'Property created successfully',
          data: data as Property
        };
      }),
      catchError(err => {
        console.warn('[PropertyService] Backend createProperty failed, saving to local fallback:', err);
        const newId = this.sampleProperties.length + 1;
        const newProp: Property = {
          propertyId: newId,
          propertyName: payload.propertyName || 'New Property',
          propertyType: payload.propertyType || 'Apartment',
          propertyOption: payload.propertyOption || 'Sell',
          description: payload.description,
          address: payload.address || '',
          priceRange: payload.priceRange || 0,
          initialDeposit: payload.initialDeposit || 0,
          landmark: payload.landmark || '',
          isActive: false, // Starts inactive pending verification
          sellerId: payload.sellerId || 1,
          cityId: payload.cityId || 3
        };
        this.sampleProperties.unshift(newProp);
        return of({
          success: true,
          message: 'Property created successfully (saved locally)',
          data: newProp
        });
      })
    );
  }

  getMyListings(type: 'all' | 'verified' | 'deactivated' = 'all'): Observable<ApiResponse<Property[]>> {
    return this.getSellerProperties(0, type);
  }

  getSellerProperties(sellerId?: number, type: 'all' | 'verified' | 'deactivated' = 'all'): Observable<ApiResponse<Property[]>> {
    const url = (!sellerId || sellerId <= 0)
      ? `${this.gatewayUrl}/properties/my-properties?status=${type}`
      : `${this.gatewayUrl}/properties/my-properties?status=${type}`;
    return this.http.get<ApiResponse<Property[]>>(url).pipe(
      catchError(() => {
        const targetId = sellerId || 1;
        let list = this.sampleProperties.filter(p => p.sellerId === targetId);
        if (type === 'verified') list = list.filter(p => p.isActive);
        if (type === 'deactivated') list = list.filter(p => !p.isActive);
        return of({
          success: true,
          message: 'Loaded seller properties',
          data: list
        });
      })
    );
  }

  getAllPropertiesAdmin(): Observable<ApiResponse<Property[]>> {
    return this.http.get<ApiResponse<Property[]>>(`${this.gatewayUrl}/properties/admin/all`).pipe(
      catchError(() => of({
        success: true,
        message: 'Loaded all properties for admin',
        data: [...this.sampleProperties]
      }))
    );
  }

  verifyProperty(id: number): Observable<ApiResponse<Property>> {
    return this.http.put<ApiResponse<Property>>(`${this.gatewayUrl}/properties/${id}/approve`, {}).pipe(
      catchError(() => {
        const prop = this.sampleProperties.find(p => p.propertyId === id);
        if (prop) {
          prop.isActive = true;
          prop.deactivationReason = undefined;
        }
        return of({
          success: true,
          message: 'Property verified successfully',
          data: prop as Property
        });
      })
    );
  }

  deactivateProperty(id: number, reason: string): Observable<ApiResponse<Property>> {
    return this.http.put<ApiResponse<Property>>(`${this.gatewayUrl}/properties/${id}/reject`, { reason }).pipe(
      catchError(() => {
        const prop = this.sampleProperties.find(p => p.propertyId === id);
        if (prop) {
          prop.isActive = false;
          prop.deactivationReason = reason;
        }
        return of({
          success: true,
          message: 'Property deactivated',
          data: prop as Property
        });
      })
    );
  }

  uploadImages(propertyId: number, images: string[]): Observable<ApiResponse<PropertyImage[]>> {
    return this.http.post<any>(`${this.gatewayUrl}/properties/${propertyId}/images`, { images }).pipe(
      map(res => {
        const data = (res && res.data) ? res.data : res;
        return {
          success: true,
          message: 'Images uploaded successfully',
          data: (Array.isArray(data) ? data : []) as PropertyImage[]
        };
      }),
      catchError(() => of({
        success: true,
        message: 'Images uploaded successfully',
        data: images.map((img, idx) => ({
          imageId: idx + 1,
          propertyId,
          imageData: img
        }))
      }))
    );
  }

  getImages(propertyId: number): Observable<ApiResponse<PropertyImage[]>> {
    return this.http.get<ApiResponse<PropertyImage[]>>(`${this.gatewayUrl}/properties/${propertyId}/images`).pipe(
      catchError(() => of({
        success: true,
        message: 'Loaded images',
        data: []
      }))
    );
  }

  getCities(): Observable<ApiResponse<City[]>> {
    return this.http.get<ApiResponse<City[]>>(`${this.gatewayUrl}/cities`).pipe(
      catchError(() => of({
        success: true,
        message: 'Loaded cities',
        data: this.sampleCities
      }))
    );
  }

  getStates(): Observable<ApiResponse<State[]>> {
    return this.http.get<ApiResponse<State[]>>(`${this.gatewayUrl}/states`).pipe(
      catchError(() => of({
        success: true,
        message: 'Loaded states',
        data: this.sampleStates
      }))
    );
  }

  getSellerContact(sellerId: number): Observable<ApiResponse<SellerContact>> {
    return this.http.get<ApiResponse<SellerContact>>(`${this.gatewayUrl}/sellers/${sellerId}/contact`).pipe(
      catchError(() => {
        const mockContacts: Record<number, SellerContact> = {
          1: { sellerId: 1, fullName: 'Amit Patel', emailId: 'seller@demo.com', phoneNo: '9845012345' },
          2: { sellerId: 2, fullName: 'Ananya Deshmukh', emailId: 'ananya.d@estates.in', phoneNo: '9820054321' },
          3: { sellerId: 3, fullName: 'Vikram Singhania', emailId: 'vikram.s@realty.com', phoneNo: '9811198765' }
        };
        const contact = mockContacts[sellerId] || {
          sellerId,
          fullName: 'Verified Owner #' + sellerId,
          emailId: `seller${sellerId}@ehs.in`,
          phoneNo: '9876543210'
        };
        return of({
          success: true,
          message: 'Owner contact retrieved',
          data: contact
        });
      })
    );
  }

  buyProperty(propertyId: number, buyerId: number): Observable<ApiResponse<Property>> {
    return this.http.post<any>(`${this.gatewayUrl}/properties/${propertyId}/buy`, { buyerId }).pipe(
      map(res => {
        const prop = this.sampleProperties.find(p => p.propertyId === propertyId);
        if (prop) {
          prop.isActive = false;
          prop.deactivationReason = `Sold to Buyer #${buyerId}`;
        }
        const data = (res && res.data) ? res.data : (res && res.propertyId ? res : prop);
        return {
          success: true,
          message: 'Property purchased successfully! Added to your purchases.',
          data: data as Property
        };
      }),
      catchError(() => {
        const prop = this.sampleProperties.find(p => p.propertyId === propertyId);
        if (prop) {
          prop.isActive = false;
          prop.deactivationReason = `Sold to Buyer #${buyerId}`;
        }
        return of({
          success: true,
          message: 'Property purchased successfully! Added to your purchases.',
          data: prop as Property
        });
      })
    );
  }

  getMyPurchases(): Observable<ApiResponse<Property[]>> {
    return this.getBuyerPurchases(0);
  }

  getBuyerPurchases(buyerId?: number): Observable<ApiResponse<Property[]>> {
    const url = (!buyerId || buyerId <= 0)
      ? `${this.gatewayUrl}/properties/my-purchases`
      : `${this.gatewayUrl}/properties/buyer/${buyerId}/purchases`;
    return this.http.get<ApiResponse<Property[]>>(url).pipe(
      catchError(() => {
        const targetId = buyerId || 1;
        const prefix = `Sold to Buyer #${targetId}`;
        const bought = this.sampleProperties.filter(p => !p.isActive && p.deactivationReason?.startsWith(prefix));
        return of({
          success: true,
          message: 'Loaded buyer purchases',
          data: bought
        });
      })
    );
  }

  getMySoldProperties(): Observable<ApiResponse<Property[]>> {
    return this.getSellerSoldProperties(0);
  }

  getSellerSoldProperties(sellerId?: number): Observable<ApiResponse<Property[]>> {
    const url = (!sellerId || sellerId <= 0)
      ? `${this.gatewayUrl}/properties/my-sold`
      : `${this.gatewayUrl}/properties/seller/${sellerId}/sold`;
    return this.http.get<ApiResponse<Property[]>>(url).pipe(
      catchError(() => {
        const targetId = sellerId || 1;
        const sold = this.sampleProperties.filter(p => p.sellerId === targetId && !p.isActive && p.deactivationReason?.startsWith('Sold'));
        return of({
          success: true,
          message: 'Loaded seller sold properties',
          data: sold
        });
      })
    );
  }

  getAdminSalesReport(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.gatewayUrl}/verifications/sales-report`).pipe(
      catchError(() => {
        const sold = this.sampleProperties.filter(p => !p.isActive && p.deactivationReason?.startsWith('Sold'));
        const active = this.sampleProperties.filter(p => p.isActive);
        return of({
          success: true,
          message: 'Loaded sales report',
          data: {
            totalProperties: this.sampleProperties.length,
            totalActiveProperties: active.length,
            totalSoldProperties: sold.length,
            totalSoldValue: sold.reduce((acc, p) => acc + (p.priceRange || 0), 0),
            totalActiveValue: active.reduce((acc, p) => acc + (p.priceRange || 0), 0),
            soldProperties: sold
          }
        });
      })
    );
  }
}
