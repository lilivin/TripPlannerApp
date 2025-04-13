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