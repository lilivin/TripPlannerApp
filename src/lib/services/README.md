# API Services Documentation

## Attractions API

### GET /api/attractions

Retrieves a list of attractions with pagination and filtering options.

**Query Parameters:**
- `page` (optional): Page number, defaults to 1
- `limit` (optional): Items per page, defaults to 10
- `creator_id` (optional): Filter by creator
- `search` (optional): Search by name or description
- `latitude` & `longitude` (optional): Filter by location (must be provided together)
- `radius` (optional): Radius in meters for location search, defaults to 1000
- `tag_id` (optional): Filter by specific tag
- `tag_category` (optional): Filter by tag category

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "description": "string",
      "address": "string",
      "geolocation": {
        "latitude": "decimal",
        "longitude": "decimal"
      },
      "images": ["string"],
      "creator": {
        "id": "uuid",
        "display_name": "string"
      },
      "average_visit_time_minutes": "integer",
      "tags": [
        {
          "id": "uuid",
          "name": "string",
          "category": "string"
        }
      ]
    }
  ],
  "pagination": {
    "total": "integer",
    "page": "integer",
    "limit": "integer",
    "pages": "integer"
  }
}
```

### GET /api/attractions/{id}

Retrieves detailed information about a specific attraction.

**Response:**
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "address": "string",
  "geolocation": {
    "latitude": "decimal",
    "longitude": "decimal"
  },
  "opening_hours": "object",
  "contact_info": "object",
  "images": ["string"],
  "creator": {
    "id": "uuid",
    "display_name": "string"
  },
  "average_visit_time_minutes": "integer",
  "ticket_price_info": "string",
  "accessibility_info": "string",
  "tags": [
    {
      "id": "uuid",
      "name": "string",
      "category": "string"
    }
  ]
}
```

### POST /api/attractions

Creates a new attraction. Requires authentication and creator privileges.

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "address": "string",
  "geolocation": {
    "latitude": "decimal",
    "longitude": "decimal"
  },
  "opening_hours": "object (optional)",
  "contact_info": "object (optional)",
  "images": ["string (url)"],
  "average_visit_time_minutes": "integer (optional)",
  "ticket_price_info": "string (optional)",
  "accessibility_info": "string (optional)",
  "tag_ids": ["uuid"]
}
```

**Validation Rules:**
- `name`: Required, max 255 characters
- `description`: Required
- `address`: Required
- `geolocation`: Required with valid latitude and longitude
- `images`: At least one image URL required
- `tag_ids`: At least one tag ID required

**Response Status Codes:**
- `201 Created`: Attraction successfully created
- `400 Bad Request`: Invalid data submitted
- `401 Unauthorized`: User not authenticated
- `403 Forbidden`: User is not a verified creator
- `500 Internal Server Error`: Server-side error

**Response Body:**
The response is the same as the `GET /api/attractions/{id}` endpoint.

**Example Usage:**
```typescript
const createAttraction = async (data) => {
  const response = await fetch('/api/attractions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create attraction');
  }
  
  return await response.json();
};
```

## Guides API

### GET /api/guides

Retrieves a list of guides with pagination and filtering options.

**Query Parameters:**
- `page` (optional): Page number, defaults to 1
- `limit` (optional): Items per page, defaults to 10, max 100
- `creator_id` (optional): Filter by creator UUID
- `language` (optional): Filter by language code
- `location` (optional): Filter by location name
- `min_days` (optional): Filter by minimum recommended days
- `max_days` (optional): Filter by maximum recommended days
- `is_published` (optional): Filter by publication status, defaults to true
- `search` (optional): Search in title and description

**Validation Rules:**
- `page`: Positive number
- `limit`: Positive number, maximum 100
- `creator_id`: Valid UUID format
- `min_days` & `max_days`: Positive numbers, min_days must be <= max_days
- `is_published`: Boolean value

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "string",
      "description": "string",
      "language": "string",
      "price": "decimal",
      "creator": {
        "id": "uuid",
        "display_name": "string"
      },
      "location_name": "string",
      "recommended_days": "integer",
      "cover_image_url": "string or null",
      "created_at": "timestamp",
      "average_rating": "decimal or null"
    }
  ],
  "pagination": {
    "total": "integer",
    "page": "integer",
    "limit": "integer",
    "pages": "integer"
  }
}
```

**Response Status Codes:**
- `200 OK`: Guides successfully retrieved
- `400 Bad Request`: Invalid query parameters
- `500 Internal Server Error`: Server-side error

**Performance Optimizations:**
- In-memory caching with 10-minute TTL
- HTTP Cache-Control headers (max-age=600)
- Efficient database queries with pagination
- Single-query calculation of average ratings

**Example Usage:**
```typescript
// Fetch all guides
const fetchGuides = async () => {
  const response = await fetch('/api/guides');
  return await response.json();
};

// Fetch guides with filters
const fetchFilteredGuides = async (filters) => {
  const params = new URLSearchParams();
  
  if (filters.location) {
    params.append('location', filters.location);
  }
  
  if (filters.language) {
    params.append('language', filters.language);
  }
  
  if (filters.minDays) {
    params.append('min_days', filters.minDays.toString());
  }
  
  if (filters.maxDays) {
    params.append('max_days', filters.maxDays.toString());
  }
  
  if (filters.search) {
    params.append('search', filters.search);
  }
  
  if (filters.page) {
    params.append('page', filters.page.toString());
  }
  
  if (filters.limit) {
    params.append('limit', filters.limit.toString());
  }
  
  const response = await fetch(`/api/guides?${params.toString()}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch guides');
  }
  
  return await response.json();
};
```

### GET /api/guides/{id}

Retrieves detailed information about a specific guide including its attractions.

**Response:**
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "language": "string",
  "price": "decimal",
  "creator": {
    "id": "uuid",
    "display_name": "string"
  },
  "location_name": "string",
  "recommended_days": "integer",
  "cover_image_url": "string or null",
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "is_published": "boolean",
  "version": "integer",
  "reviews_count": "integer",
  "average_rating": "decimal or null",
  "attractions": [
    {
      "id": "uuid",
      "name": "string",
      "description": "string",
      "custom_description": "string or null",
      "order_index": "integer",
      "is_highlight": "boolean",
      "address": "string",
      "images": ["string"],
      "tags": [
        {
          "id": "uuid",
          "name": "string",
          "category": "string"
        }
      ]
    }
  ]
}
```

**Response Status Codes:**
- `200 OK`: Guide successfully retrieved
- `400 Bad Request`: Invalid guide ID format
- `404 Not Found`: Guide with the specified ID does not exist
- `500 Internal Server Error`: Server-side error

**Performance Optimizations:**
- In-memory caching with 1-hour TTL
- HTTP Cache-Control headers (max-age=3600)
- Optimized database queries for related entities (attractions, tags)

**Example Usage:**
```typescript
const fetchGuideDetails = async (guideId) => {
  const response = await fetch(`/api/guides/${guideId}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Przewodnik nie został znaleziony');
    }
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch guide details');
  }
  
  return await response.json();
};
``` 