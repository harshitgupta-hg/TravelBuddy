# Hotel API Client

A TypeScript client for the Hotel Booking API. This client provides a simple interface for authenticating users and searching for hotels across multiple vendors.

## Features

- JWT-based authentication
- Free hotel listings by city
- City-based hotel search with vendor comparison
- Detailed hotel search by ID
- Automatic token expiry handling
- Type-safe API responses
- Comprehensive error handling

## Usage

```typescript
import { apiClient } from './lib/api';

// Login
await apiClient.login('username', 'password');

// Get free hotels
const hotels = await apiClient.getFreeHotels('London');

// Search hotels in a city
const results = await apiClient.searchCity({
  city: 'London',
  page: 1,
  currency: 'USD',
  rooms: 1,
  adults: 2,
  checkIn: '2024-03-01',
  checkOut: '2024-03-05',
});

// Search specific hotel
const hotel = await apiClient.searchHotelById({
  hotelName: 'Grand Hotel',
  hotelId: '123',
  adults: 2,
  rooms: 1,
  checkIn: '2024-03-01',
  checkOut: '2024-03-05',
});
```

## Error Handling

The client includes comprehensive error handling for:
- Authentication failures
- Network errors
- API errors
- Token expiration

## Configuration

Set the following environment variables:
- `VITE_API_BASE_URL`: API base URL
- `VITE_API_KEY`: API key for authenticated endpoints