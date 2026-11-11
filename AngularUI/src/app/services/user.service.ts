import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { ApiResponse, UserSummary } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = 'http://localhost:5000/api';

  private readonly sampleUsers: UserSummary[] = [
    { profileId: 1, emailId: 'admin@easysolution.com', userName: 'admin@easysolution.com', fullName: 'System Administrator', phoneNo: '9999999999', userType: 'Admin', address: 'Headquarters, Mumbai' },
    { profileId: 1, emailId: 'buyer@demo.com', userName: 'buyer@demo.com', fullName: 'Rajesh Sharma', phoneNo: '9876543210', userType: 'Buyer', address: 'Indiranagar, Bengaluru' },
    { profileId: 2, emailId: 'priya.nair@outlook.com', userName: 'priya.nair@outlook.com', fullName: 'Priya Nair', phoneNo: '9820067890', userType: 'Buyer', address: 'Bandra West, Mumbai' },
    { profileId: 1, emailId: 'seller@demo.com', userName: 'seller@demo.com', fullName: 'Amit Patel', phoneNo: '9845012345', userType: 'Seller', address: '123 MG Road, Bengaluru' },
    { profileId: 2, emailId: 'ananya.d@estates.in', userName: 'ananya.d@estates.in', fullName: 'Ananya Deshmukh', phoneNo: '9820054321', userType: 'Seller', address: '45 Worli Sea Face, Mumbai' },
    { profileId: 3, emailId: 'vikram.s@realty.com', userName: 'vikram.s@realty.com', fullName: 'Vikram Singhania', phoneNo: '9811198765', userType: 'Seller', address: '78 Jubilee Hills, Hyderabad' }
  ];

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<ApiResponse<UserSummary[]>> {
    return this.http.get<ApiResponse<UserSummary[]>>(`${this.baseUrl}/users`).pipe(
      catchError(() => of({
        success: true,
        message: 'Loaded users (offline mode)',
        data: this.sampleUsers
      }))
    );
  }

  getAllBuyers(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/buyers`).pipe(
      catchError(() => of({
        success: true,
        message: 'Loaded buyers (offline mode)',
        data: this.sampleUsers.filter(u => u.userType === 'Buyer')
      }))
    );
  }

  getAllSellers(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/sellers`).pipe(
      catchError(() => of({
        success: true,
        message: 'Loaded sellers (offline mode)',
        data: this.sampleUsers.filter(u => u.userType === 'Seller')
      }))
    );
  }
}
