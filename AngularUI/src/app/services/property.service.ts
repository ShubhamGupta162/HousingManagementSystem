import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Property, City, State, PropertyImage, SellerContact } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private readonly gatewayUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getVerifiedProperties(): Observable<ApiResponse<Property[]>> {
    return this.http.get<ApiResponse<Property[]>>(`${this.gatewayUrl}/properties/verified`);
  }

  searchProperties(cityId?: number, propertyType?: string, propertyOption?: string, sortBy?: string): Observable<ApiResponse<Property[]>> {
    let params = new HttpParams();
    if (cityId) params = params.set('cityId', cityId.toString());
    if (propertyType) params = params.set('propertyType', propertyType);
    if (propertyOption) params = params.set('propertyOption', propertyOption);
    if (sortBy) params = params.set('sortBy', sortBy);

    return this.http.get<ApiResponse<Property[]>>(`${this.gatewayUrl}/properties/search`, { params });
  }

  getPropertyById(id: number): Observable<ApiResponse<Property>> {
    return this.http.get<ApiResponse<Property>>(`${this.gatewayUrl}/properties/${id}`);
  }

  createProperty(payload: Partial<Property>): Observable<ApiResponse<Property>> {
    return this.http.post<ApiResponse<Property>>(`${this.gatewayUrl}/properties`, payload);
  }

  getSellerProperties(sellerId: number, type: 'all' | 'verified' | 'deactivated' = 'all'): Observable<ApiResponse<Property[]>> {
    return this.http.get<ApiResponse<Property[]>>(`${this.gatewayUrl}/properties/seller/${sellerId}/${type}`);
  }

  getAllPropertiesAdmin(): Observable<ApiResponse<Property[]>> {
    return this.http.get<ApiResponse<Property[]>>(`${this.gatewayUrl}/verifications/all`);
  }

  verifyProperty(id: number): Observable<ApiResponse<Property>> {
    return this.http.put<ApiResponse<Property>>(`${this.gatewayUrl}/verifications/${id}/verify`, {});
  }

  deactivateProperty(id: number, reason: string): Observable<ApiResponse<Property>> {
    return this.http.put<ApiResponse<Property>>(`${this.gatewayUrl}/verifications/${id}/deactivate`, { reason });
  }

  uploadImages(propertyId: number, images: string[]): Observable<ApiResponse<PropertyImage[]>> {
    return this.http.post<ApiResponse<PropertyImage[]>>(`${this.gatewayUrl}/properties/${propertyId}/images`, { images });
  }

  getImages(propertyId: number): Observable<ApiResponse<PropertyImage[]>> {
    return this.http.get<ApiResponse<PropertyImage[]>>(`${this.gatewayUrl}/properties/${propertyId}/images`);
  }

  getCities(): Observable<ApiResponse<City[]>> {
    return this.http.get<ApiResponse<City[]>>(`${this.gatewayUrl}/cities`);
  }

  getStates(): Observable<ApiResponse<State[]>> {
    return this.http.get<ApiResponse<State[]>>(`${this.gatewayUrl}/states`);
  }

  getSellerContact(sellerId: number): Observable<ApiResponse<SellerContact>> {
    return this.http.get<ApiResponse<SellerContact>>(`${this.gatewayUrl}/sellers/${sellerId}/contact`);
  }
}
