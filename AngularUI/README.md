# EasyHousingSolution - AngularUI

This directory is reserved for the presentation layer client application (Angular 18) to be created in the subsequent sprint.

### Backend Endpoints Available via Ocelot API Gateway (`http://localhost:5000`):
- **Authentication**: `POST /api/auth/register-buyer`, `POST /api/auth/register-seller`, `POST /api/auth/login`
- **Users & Profiles**: `GET /api/users`, `GET /api/buyers/{id}`, `GET /api/sellers/{id}`, `GET /api/sellers/{id}/contact`
- **Properties**: `GET /api/properties/verified`, `GET /api/properties/search`, `POST /api/properties`, `PUT /api/properties/{id}`
- **Images**: `POST /api/properties/{id}/images` (max 6 images per property), `GET /api/properties/{id}/images`
- **Admin Verification**: `GET /api/verifications/all`, `PUT /api/verifications/{id}/verify`, `PUT /api/verifications/{id}/deactivate`
- **Locations**: `GET /api/states`, `GET /api/cities/by-state/{stateId}`
- **Cart**: `POST /api/cart`, `GET /api/cart/buyer/{buyerId}`, `DELETE /api/cart/{cartId}`
