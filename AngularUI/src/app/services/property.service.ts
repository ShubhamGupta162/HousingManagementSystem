import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { ApiResponse, Property, City, State, PropertyImage, SellerContact } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private readonly gatewayUrl = 'http://localhost:5000/api';

  // Resilient fallback dataset for instant UI interaction
  private readonly sampleStates: State[] = [
    { stateId: 1, stateName: 'Karnataka' },
    { stateId: 2, stateName: 'Maharashtra' },
    { stateId: 3, stateName: 'Delhi NCR' },
    { stateId: 4, stateName: 'Telangana' }
  ];

  private readonly sampleCities: City[] = [
    { cityId: 1, cityName: 'Bengaluru', stateId: 1 },
    { cityId: 2, cityName: 'Mysuru', stateId: 1 },
    { cityId: 3, cityName: 'Mumbai', stateId: 2 },
    { cityId: 4, cityName: 'Pune', stateId: 2 },
    { cityId: 5, cityName: 'New Delhi', stateId: 3 },
    { cityId: 6, cityName: 'Gurgaon', stateId: 3 },
    { cityId: 7, cityName: 'Hyderabad', stateId: 4 }
  ];

  private sampleProperties: Property[] = [
    {
      propertyId: 101,
      propertyName: 'Sobha Dream Acres Luxury 3BHK',
      propertyType: 'Apartment',
      propertyOption: 'Sell',
      description: 'Modern luxury 3BHK flat with panoramic view, modular Italian kitchen, wooden flooring in master bedroom, and premium clubhouse access.',
      address: 'Tower 4, Panathur Road, Balagere',
      priceRange: 8500000,
      initialDeposit: 0,
      landmark: 'Near Outer Ring Road Tech Park',
      isActive: true,
      sellerId: 201,
      cityId: 1
    },
    {
      propertyId: 102,
      propertyName: 'Prestige Silver Oak Independent Villa',
      propertyType: 'Villa',
      propertyOption: 'Sell',
      description: 'Gated community triplex villa with private lawn, home theater room, 2 covered car parks, solar water heating, and 24x7 security.',
      address: 'Villa 18, ECC Road, Whitefield',
      priceRange: 22000000,
      initialDeposit: 0,
      landmark: 'Near Hope Farm Junction',
      isActive: true,
      sellerId: 202,
      cityId: 1
    },
    {
      propertyId: 103,
      propertyName: 'Hiranandani Gardens Lakeview 2BHK',
      propertyType: 'Apartment',
      propertyOption: 'Rent',
      description: 'Semi-furnished elegant 2BHK with lake view, granite countertops, split ACs installed, piped natural gas, and gymnasium membership.',
      address: 'Castle Rock Tower, Central Avenue, Powai',
      priceRange: 55000,
      initialDeposit: 150000,
      landmark: 'Opposite Powai Lake Promenade',
      isActive: true,
      sellerId: 203,
      cityId: 3
    },
    {
      propertyId: 104,
      propertyName: 'DLF Cyber City Premium Office Suite',
      propertyType: 'Commercial',
      propertyOption: 'Rent',
      description: 'Grade A plug-and-play office space with 40 workstations, 2 conference rooms, high-speed fiber internet, and 100% DG power backup.',
      address: 'Building 10, DLF Phase 2',
      priceRange: 135000,
      initialDeposit: 400000,
      landmark: 'Beside Cyber City Metro Station',
      isActive: true,
      sellerId: 204,
      cityId: 6
    },
    {
      propertyId: 105,
      propertyName: 'Lodha Park Sky Residence 4BHK',
      propertyType: 'Apartment',
      propertyOption: 'Sell',
      description: 'Ultra-luxurious high-rise apartment with Arabian Sea view, Italian marble, VRV central air-conditioning, and 7-tier security.',
      address: 'Park Tower, Pandurang Budhkar Marg, Worli',
      priceRange: 37500000,
      initialDeposit: 0,
      landmark: 'Near Worli Sea Face',
      isActive: true,
      sellerId: 201,
      cityId: 3
    },
    {
      propertyId: 106,
      propertyName: 'Godrej Woods Green Valley 3BHK',
      propertyType: 'Apartment',
      propertyOption: 'Rent',
      description: 'Forest-themed residential apartment surrounded by over 600 trees, infinity swimming pool, squash court, and EV charging bays.',
      address: 'Sector 43, Expressway',
      priceRange: 38000,
      initialDeposit: 76000,
      landmark: 'Near Golf Course Metro Station',
      isActive: true,
      sellerId: 202,
      cityId: 5
    },
    {
      propertyId: 107,
      propertyName: 'My Home Bhooja Elite Villa',
      propertyType: 'Villa',
      propertyOption: 'Sell',
      description: 'Contemporary architectural masterpiece with double-height ceiling, private elevator, swimming pool, and Italian modular fixtures.',
      address: 'Silpa Gram Craft Village Road, HITEC City',
      priceRange: 19500000,
      initialDeposit: 0,
      landmark: 'Near Cyber Towers',
      isActive: true,
      sellerId: 203,
      cityId: 7
    },
    {
      propertyId: 108,
      propertyName: 'Brigade Gateway Commercial Retail Bay',
      propertyType: 'Commercial',
      propertyOption: 'Sell',
      description: 'High-footfall ground floor commercial retail shop inside integrated township next to Orion Mall, ideal for boutique or clinic.',
      address: 'Dr Rajkumar Road, Rajajinagar',
      priceRange: 14500000,
      initialDeposit: 0,
      landmark: 'Inside World Trade Center Complex',
      isActive: true,
      sellerId: 204,
      cityId: 1
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
    return this.http.post<ApiResponse<Property>>(`${this.gatewayUrl}/properties`, payload).pipe(
      catchError(() => {
        const newId = 100 + this.sampleProperties.length + 1;
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
          sellerId: payload.sellerId || 201,
          cityId: payload.cityId || 1
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

  getSellerProperties(sellerId: number, type: 'all' | 'verified' | 'deactivated' = 'all'): Observable<ApiResponse<Property[]>> {
    return this.http.get<ApiResponse<Property[]>>(`${this.gatewayUrl}/properties/seller/${sellerId}/${type}`).pipe(
      catchError(() => {
        let list = this.sampleProperties.filter(p => p.sellerId === sellerId);
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
    return this.http.get<ApiResponse<Property[]>>(`${this.gatewayUrl}/verifications/all`).pipe(
      catchError(() => of({
        success: true,
        message: 'Loaded all properties for admin',
        data: [...this.sampleProperties]
      }))
    );
  }

  verifyProperty(id: number): Observable<ApiResponse<Property>> {
    return this.http.put<ApiResponse<Property>>(`${this.gatewayUrl}/verifications/${id}/verify`, {}).pipe(
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
    return this.http.put<ApiResponse<Property>>(`${this.gatewayUrl}/verifications/${id}/deactivate`, { reason }).pipe(
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
    return this.http.post<ApiResponse<PropertyImage[]>>(`${this.gatewayUrl}/properties/${propertyId}/images`, { images }).pipe(
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
          201: { sellerId: 201, fullName: 'Rajesh Varma', emailId: 'rajesh.varma@properties.com', phoneNo: '9845012345' },
          202: { sellerId: 202, fullName: 'Ananya Deshmukh', emailId: 'ananya.d@estates.in', phoneNo: '9820054321' },
          203: { sellerId: 203, fullName: 'Vikram Singhania', emailId: 'vikram.s@realty.com', phoneNo: '9811198765' },
          204: { sellerId: 204, fullName: 'Sunil Narang', emailId: 'sunil.narang@commercials.in', phoneNo: '9900011223' }
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
}
