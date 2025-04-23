# Guide API Endpoints

This document provides information about the Guide API endpoints, including request parameters, responses, and examples.

## GET /api/guides/{id}

Returns detailed information about a specific guide by its ID.

### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id        | UUID | Yes      | The unique identifier of the guide |

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| include_attractions | boolean | false | Whether to include detailed information about attractions associated with the guide |

### Response

```typescript
{
  id: string;
  title: string;
  description: string;
  language: string;
  price: number;
  creator: {
    id: string;
    display_name: string;
  };
  location_name: string;
  recommended_days: number;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  version: number;
  reviews_count: number;
  average_rating: number | null;
  attractions?: Array<{
    id: string;
    name: string;
    description: string;
    custom_description: string | null;
    order_index: number;
    is_highlight: boolean;
    address: string;
    images: string[];
    tags: Array<{
      id: string;
      name: string;
      category: string;
    }>;
  }>;
}
```

### Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Guide found and returned successfully |
| 400 | Bad Request - Invalid ID format or query parameters |
| 404 | Not Found - Guide with the specified ID does not exist |
| 500 | Internal Server Error - Server error occurred |

### Response Headers

| Header | Description |
|--------|-------------|
| Cache-Control | Caching policy (1 hour for basic responses, 30 minutes for responses with attractions) |
| ETag | Entity tag for caching |
| Vary | Headers that should be considered for caching variations |
| X-Response-Time | Time taken to process the request in milliseconds |

### Examples

#### Basic Request (without attractions)

```
GET /api/guides/550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Weekend in Paris",
  "description": "A perfect weekend guide to explore Paris",
  "language": "en",
  "price": 9.99,
  "creator": {
    "id": "33403540-4f57-44a4-83c0-8f3c0d52b45d",
    "display_name": "Paris Explorer"
  },
  "location_name": "Paris, France",
  "recommended_days": 2,
  "cover_image_url": "https://example.com/images/paris.jpg",
  "created_at": "2023-01-15T12:00:00Z",
  "updated_at": "2023-03-20T14:30:00Z",
  "is_published": true,
  "version": 3,
  "reviews_count": 15,
  "average_rating": 4.7
}
```

#### Request with Attractions

```
GET /api/guides/550e8400-e29b-41d4-a716-446655440000?include_attractions=true
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Weekend in Paris",
  "description": "A perfect weekend guide to explore Paris",
  "language": "en",
  "price": 9.99,
  "creator": {
    "id": "33403540-4f57-44a4-83c0-8f3c0d52b45d",
    "display_name": "Paris Explorer"
  },
  "location_name": "Paris, France",
  "recommended_days": 2,
  "cover_image_url": "https://example.com/images/paris.jpg",
  "created_at": "2023-01-15T12:00:00Z",
  "updated_at": "2023-03-20T14:30:00Z",
  "is_published": true,
  "version": 3,
  "reviews_count": 15,
  "average_rating": 4.7,
  "attractions": [
    {
      "id": "a7ff4380-bcd4-43f0-9152-e4c591d766fa",
      "name": "Eiffel Tower",
      "description": "Iconic tower in the heart of Paris",
      "custom_description": "Visit in the evening for a stunning light show",
      "order_index": 1,
      "is_highlight": true,
      "address": "Champ de Mars, 5 Avenue Anatole France, 75007 Paris",
      "images": [
        "https://example.com/images/eiffel1.jpg",
        "https://example.com/images/eiffel2.jpg"
      ],
      "tags": [
        {
          "id": "b5e44880-d8e2-4c58-a407-6848bd4b02c9",
          "name": "Landmark",
          "category": "attraction_type"
        },
        {
          "id": "c3f32a70-e9f1-4d6a-b312-79f248e2a3f8",
          "name": "View Point",
          "category": "feature"
        }
      ]
    },
    {
      "id": "b8991230-aed5-41f2-8a67-c427bd4a2f12",
      "name": "Louvre Museum",
      "description": "World's largest art museum and historic monument",
      "custom_description": null,
      "order_index": 2,
      "is_highlight": true,
      "address": "Rue de Rivoli, 75001 Paris",
      "images": [
        "https://example.com/images/louvre1.jpg",
        "https://example.com/images/louvre2.jpg"
      ],
      "tags": [
        {
          "id": "d4e31340-ca73-42f3-9145-5d93c02a8f28",
          "name": "Museum",
          "category": "attraction_type"
        },
        {
          "id": "e2f21450-ba84-44f5-b256-4e14d03a9f39",
          "name": "Art",
          "category": "interest"
        }
      ]
    }
  ]
}
```

### Performance Considerations

- When requesting with `include_attractions=true`, response size can be significantly larger
- Responses with attractions are cached for 30 minutes vs 1 hour for basic responses
- Consider only using `include_attractions=true` when the detailed attraction information is needed
- Use conditional requests with If-None-Match header to take advantage of the ETag caching 