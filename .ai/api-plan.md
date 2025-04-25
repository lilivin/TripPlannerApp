# REST API Plan for TripPlanner

## 1. Resources

- **Users**: Corresponds to `users` table - App users who can create and manage trip plans
- **Creators**: Corresponds to `creators` table - Content creators who make guides
- **Guides**: Corresponds to `guides` table - Travel guides created by creators
- **Attractions**: Corresponds to `attractions` table - Points of interest within guides
- **GuideAttractions**: Corresponds to `guide_attractions` table - Links between guides and attractions
- **Tags**: Corresponds to `tags` table - Categorization labels for attractions
- **AttractionTags**: Corresponds to `attraction_tags` table - Links between attractions and tags
- **Plans**: Corresponds to `plans` table - User-generated trip plans based on guides
- **UserGuideAccess**: Corresponds to `user_guide_access` table - Tracks user access to guides
- **Reviews**: Corresponds to `reviews` table - User reviews of guides
- **OfflineCacheStatus**: Corresponds to `offline_cache_status` table - Tracks offline availability of plans

## 2. Endpoints

### Authentication

Leveraging Supabase Auth service for authentication operations.

### Users

#### GET /api/users/me
- **Description**: Retrieve current user profile
- **Response Body**:
  ```json
  {
    "id": "uuid",
    "email": "string",
    "language_preference": "string",
    "avatar_url": "string",
    "created_at": "timestamp",
    "last_login_at": "timestamp"
  }
  ```
- **Success Codes**: 200 OK
- **Error Codes**: 401 Unauthorized, 500 Internal Server Error

#### PUT /api/users/me
- **Description**: Update current user profile
- **Request Body**:
  ```json
  {
    "language_preference": "string",
    "avatar_url": "string"
  }
  ```
- **Response Body**: Same as GET /api/users/me
- **Success Codes**: 200 OK
- **Error Codes**: 400 Bad Request, 401 Unauthorized, 500 Internal Server Error

### Creators

#### GET /api/creators
- **Description**: List creators
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `search`: Search by display name
- **Response Body**:
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "display_name": "string",
        "biography": "string",
        "profile_image_url": "string",
        "is_verified": "boolean",
        "website": "string"
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
- **Success Codes**: 200 OK
- **Error Codes**: 500 Internal Server Error

#### GET /api/creators/{id}
- **Description**: Get creator details
- **Response Body**:
  ```json
  {
    "id": "uuid",
    "display_name": "string",
    "biography": "string",
    "profile_image_url": "string",
    "is_verified": "boolean",
    "website": "string",
    "contact_email": "string",
    "guides_count": "integer"
  }
  ```
- **Success Codes**: 200 OK
- **Error Codes**: 404 Not Found, 500 Internal Server Error

#### GET /api/creators/me
- **Description**: Get current user's creator profile (if exists)
- **Response Body**: Same as GET /api/creators/{id}
- **Success Codes**: 200 OK
- **Error Codes**: 401 Unauthorized, 404 Not Found, 500 Internal Server Error

#### POST /api/creators
- **Description**: Create creator profile for current user
- **Request Body**:
  ```json
  {
    "display_name": "string",
    "biography": "string",
    "profile_image_url": "string",
    "contact_email": "string",
    "website": "string"
  }
  ```
- **Response Body**: Same as GET /api/creators/{id}
- **Success Codes**: 201 Created
- **Error Codes**: 400 Bad Request, 401 Unauthorized, 409 Conflict (already exists), 500 Internal Server Error

#### PUT /api/creators/me
- **Description**: Update current user's creator profile
- **Request Body**: Same as POST /api/creators
- **Response Body**: Same as GET /api/creators/{id}
- **Success Codes**: 200 OK
- **Error Codes**: 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Server Error

### Guides

#### GET /api/guides
- **Description**: List guides with filtering
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `creator_id`: Filter by creator
  - `language`: Filter by language
  - `location`: Filter by location name
  - `min_days`: Filter by minimum recommended days
  - `max_days`: Filter by maximum recommended days
  - `is_published`: Filter by publication status (default: true)
  - `search`: Search in title and description
- **Response Body**:
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
        "cover_image_url": "string",
        "created_at": "timestamp",
        "average_rating": "decimal"
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
- **Success Codes**: 200 OK
- **Error Codes**: 500 Internal Server Error

#### GET /api/guides/{id}
- **Description**: Get guide details
- **Query Parameters**:
  - `include_attractions`: Include attractions details (default: false)
- **Response Body**:
  ```json
  {
    "id": "uuid",
    "title": "string",
    "description": "string",
    "language": "string",
    "price": "decimal",
    "creator": {
      "id": "uuid",
      "display_name": "string",
      "profile_image_url": "string"
    },
    "location_name": "string",
    "recommended_days": "integer",
    "cover_image_url": "string",
    "created_at": "timestamp",
    "updated_at": "timestamp",
    "is_published": "boolean",
    "version": "integer",
    "average_rating": "decimal",
    "reviews_count": "integer",
    "attractions": [
      {
        "id": "uuid",
        "name": "string",
        "description": "string",
        "custom_description": "string",
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
- **Success Codes**: 200 OK
- **Error Codes**: 404 Not Found, 500 Internal Server Error

#### POST /api/guides
- **Description**: Create a new guide (creator only)
- **Request Body**:
  ```json
  {
    "title": "string",
    "description": "string",
    "language": "string",
    "price": "decimal",
    "location_name": "string",
    "recommended_days": "integer",
    "cover_image_url": "string",
    "is_published": "boolean"
  }
  ```
- **Response Body**: Same as GET /api/guides/{id} without attractions
- **Success Codes**: 201 Created
- **Error Codes**: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 500 Internal Server Error

#### PUT /api/guides/{id}
- **Description**: Update a guide (creator only)
- **Request Body**: Same as POST /api/guides
- **Response Body**: Same as GET /api/guides/{id} without attractions
- **Success Codes**: 200 OK
- **Error Codes**: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error

#### DELETE /api/guides/{id}
- **Description**: Delete a guide (soft delete, creator only)
- **Success Codes**: 204 No Content
- **Error Codes**: 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error

### Attractions

#### GET /api/attractions
- **Description**: List attractions with filtering
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `creator_id`: Filter by creator
  - `search`: Search in name and description
  - `latitude`: Filter by proximity (requires longitude)
  - `longitude`: Filter by proximity (requires latitude)
  - `radius`: Radius in meters for proximity search (default: 1000)
  - `tag_id`: Filter by tag
  - `tag_category`: Filter by tag category
- **Response Body**:
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
- **Success Codes**: 200 OK
- **Error Codes**: 500 Internal Server Error

#### GET /api/attractions/{id}
- **Description**: Get attraction details
- **Response Body**:
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
- **Success Codes**: 200 OK
- **Error Codes**: 404 Not Found, 500 Internal Server Error

#### POST /api/attractions
- **Description**: Create a new attraction (creator only)
- **Request Body**:
  ```json
  {
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
    "average_visit_time_minutes": "integer",
    "ticket_price_info": "string",
    "accessibility_info": "string",
    "tag_ids": ["uuid"]
  }
  ```
- **Response Body**: Same as GET /api/attractions/{id}
- **Success Codes**: 201 Created
- **Error Codes**: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 500 Internal Server Error

#### PUT /api/attractions/{id}
- **Description**: Update an attraction (creator only)
- **Request Body**: Same as POST /api/attractions
- **Response Body**: Same as GET /api/attractions/{id}
- **Success Codes**: 200 OK
- **Error Codes**: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error

#### DELETE /api/attractions/{id}
- **Description**: Delete an attraction (soft delete, creator only)
- **Success Codes**: 204 No Content
- **Error Codes**: 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error

### Guide Attractions

#### POST /api/guides/{guide_id}/attractions
- **Description**: Add an attraction to a guide (creator only)
- **Request Body**:
  ```json
  {
    "attraction_id": "uuid",
    "order_index": "integer",
    "custom_description": "string",
    "is_highlight": "boolean"
  }
  ```
- **Response Body**:
  ```json
  {
    "guide_id": "uuid",
    "attraction_id": "uuid",
    "order_index": "integer",
    "custom_description": "string",
    "is_highlight": "boolean"
  }
  ```
- **Success Codes**: 201 Created
- **Error Codes**: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 500 Internal Server Error

#### PUT /api/guides/{guide_id}/attractions/{attraction_id}
- **Description**: Update guide-attraction relationship (creator only)
- **Request Body**:
  ```json
  {
    "order_index": "integer",
    "custom_description": "string",
    "is_highlight": "boolean"
  }
  ```
- **Response Body**: Same as POST /api/guides/{guide_id}/attractions
- **Success Codes**: 200 OK
- **Error Codes**: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error

#### DELETE /api/guides/{guide_id}/attractions/{attraction_id}
- **Description**: Remove attraction from guide (creator only)
- **Success Codes**: 204 No Content
- **Error Codes**: 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error

### Tags

#### GET /api/tags
- **Description**: Get all tags
- **Query Parameters**:
  - `category`: Filter by category
- **Response Body**:
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "name": "string",
        "category": "string"
      }
    ]
  }
  ```
- **Success Codes**: 200 OK
- **Error Codes**: 500 Internal Server Error

### Plans

#### GET /api/plans
- **Description**: List current user's plans
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `guide_id`: Filter by guide
  - `is_favorite`: Filter favorites (boolean)
- **Response Body**:
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "name": "string",
        "guide": {
          "id": "uuid",
          "title": "string",
          "location_name": "string"
        },
        "created_at": "timestamp",
        "updated_at": "timestamp",
        "is_favorite": "boolean"
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
- **Success Codes**: 200 OK
- **Error Codes**: 401 Unauthorized, 500 Internal Server Error

#### GET /api/plans/{id}
- **Description**: Get plan details
- **Response Body**:
  ```json
  {
    "id": "uuid",
    "name": "string",
    "guide": {
      "id": "uuid",
      "title": "string",
      "location_name": "string"
    },
    "content": "object",
    "generation_params": "object",
    "created_at": "timestamp",
    "updated_at": "timestamp",
    "is_favorite": "boolean"
  }
  ```
- **Success Codes**: 200 OK
- **Error Codes**: 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error

#### POST /api/plans/generate
- **Description**: Generate a plan using AI
- **Request Body**:
  ```json
  {
    "guide_id": "uuid",
    "days": "integer",
    "preferences": {
      "include_tags": ["uuid"],
      "exclude_tags": ["uuid"],
      "start_time": "string",
      "end_time": "string",
      "include_meals": "boolean",
      "transportation_mode": "string"
    }
  }
  ```
- **Response Body**:
  ```json
  {
    "content": "object",
    "generation_params": "object",
    "ai_generation_cost": "decimal"
  }
  ```
- **Success Codes**: 200 OK
- **Error Codes**: 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Server Error

#### POST /api/plans
- **Description**: Save a generated plan
- **Request Body**:
  ```json
  {
    "name": "string",
    "guide_id": "uuid",
    "content": "object",
    "generation_params": "object",
    "is_favorite": "boolean"
  }
  ```
- **Response Body**: Same as GET /api/plans/{id}
- **Success Codes**: 201 Created
- **Error Codes**: 400 Bad Request, 401 Unauthorized, 500 Internal Server Error

#### PUT /api/plans/{id}
- **Description**: Update a plan
- **Request Body**:
  ```json
  {
    "name": "string",
    "content": "object",
    "is_favorite": "boolean"
  }
  ```
- **Response Body**: Same as GET /api/plans/{id}
- **Success Codes**: 200 OK
- **Error Codes**: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error

#### DELETE /api/plans/{id}
- **Description**: Delete a plan (soft delete)
- **Success Codes**: 204 No Content
- **Error Codes**: 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error

### Reviews

#### GET /api/guides/{guide_id}/reviews
- **Description**: Get reviews for a guide
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `rating`: Filter by rating
- **Response Body**:
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "user": {
          "id": "uuid",
          "avatar_url": "string"
        },
        "rating": "integer",
        "comment": "string",
        "created_at": "timestamp"
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
- **Success Codes**: 200 OK
- **Error Codes**: 500 Internal Server Error

#### POST /api/guides/{guide_id}/reviews
- **Description**: Create a review for a guide
- **Request Body**:
  ```json
  {
    "rating": "integer",
    "comment": "string"
  }
  ```
- **Response Body**:
  ```json
  {
    "id": "uuid",
    "user": {
      "id": "uuid",
      "avatar_url": "string"
    },
    "rating": "integer",
    "comment": "string",
    "created_at": "timestamp"
  }
  ```
- **Success Codes**: 201 Created
- **Error Codes**: 400 Bad Request, 401 Unauthorized, 404 Not Found, 409 Conflict, 500 Internal Server Error

#### PUT /api/guides/{guide_id}/reviews/{id}
- **Description**: Update a review
- **Request Body**: Same as POST /api/guides/{guide_id}/reviews
- **Response Body**: Same as POST /api/guides/{guide_id}/reviews response
- **Success Codes**: 200 OK
- **Error Codes**: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error

#### DELETE /api/guides/{guide_id}/reviews/{id}
- **Description**: Delete a review
- **Success Codes**: 204 No Content
- **Error Codes**: 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error

### Offline Cache Status

#### GET /api/plans/{plan_id}/offline
- **Description**: Get offline cache status for a plan
- **Response Body**:
  ```json
  {
    "is_cached": "boolean",
    "last_synced_at": "timestamp"
  }
  ```
- **Success Codes**: 200 OK
- **Error Codes**: 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error

#### PUT /api/plans/{plan_id}/offline
- **Description**: Update offline cache status
- **Request Body**:
  ```json
  {
    "is_cached": "boolean"
  }
  ```
- **Response Body**: Same as GET /api/plans/{plan_id}/offline
- **Success Codes**: 200 OK
- **Error Codes**: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error

### AI Services

#### POST /api/ai/chat
- **Description**: Send a chat message to AI to get additional information
- **Request Body**:
  ```json
  {
    "message": "string",
    "guide_id": "uuid",
    "plan_id": "uuid",
    "context": "object"
  }
  ```
- **Response Body**:
  ```json
  {
    "response": "string",
    "model_used": "string",
    "tokens": {
      "prompt": "integer",
      "completion": "integer",
      "total": "integer"
    }
  }
  ```
- **Success Codes**: 200 OK
- **Error Codes**: 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Server Error

## 3. Authentication and Authorization

The API will use Supabase Authentication for handling user authentication. The Supabase client SDK will be integrated on the frontend to manage authentication flows.

### Authentication Flow
1. Users register/login through Supabase Auth
2. Supabase Auth issues JWT tokens for authenticated users
3. These tokens are included in API requests as Bearer tokens
4. API endpoints validate tokens and extract user information

### Authorization

The API leverages Supabase Row-Level Security (RLS) policies to enforce authorization rules at the database level:

1. **Resource Ownership**:
   - Users can only access, modify, or delete their own resources
   - Creators can only modify their own guides and attractions

2. **Public Access**:
   - Published guides are publicly readable
   - Public creator profiles are readable by everyone
   - Attractions linked to published guides are publicly readable

3. **Role-Based Access**:
   - Regular users can create plans and reviews
   - Creators have additional permissions to create and manage guides and attractions

## 4. Validation and Business Logic

### Users
- Email must be valid and unique
- Language preference must be a valid ISO language code

### Creators
- Display name is required
- Each user can have at most one creator profile

### Guides
- Title and description are required
- Location name is required
- Language must be a valid ISO language code
- Price must be non-negative
- Recommended days must be positive

### Attractions
- Name, description, and address are required
- Geolocation coordinates must be valid
- Images URLs must be valid

### Guide Attractions
- Order index is required
- Each attraction can appear only once in a guide

### Tags
- Category must be one of: 'Cultural', 'Fun_Facts', 'Historical', 'Culinary'
- Tag name must be unique within a category

### Plans
- Must be associated with a valid guide
- Content JSON structure must follow the expected schema
- Generation parameters must be valid

### Reviews
- Rating must be between 1 and 5
- A user can have only one visible review per guide

### Business Logic Implementation

1. **AI Plan Generation**:
   - The `/api/plans/generate` endpoint handles:
     - Validating user has access to the specified guide
     - Retrieving guide and attractions data
     - Formatting data for OpenAI API
     - Calling OpenAI API with appropriate parameters
     - Processing and returning the generated plan
     - Calculating and recording generation cost

### OpenRouter Integration

1. **OpenRouter Service**:
   - Provides a unified interface to access multiple AI models
   - Handles authentication and rate limiting with OpenRouter API
   - Supports various request formats and model specifications
   - Implements retry logic and error handling

2. **Response Caching**:
   - Cache AI responses based on input parameters to minimize redundant API calls
   - Implement cache invalidation strategies for updated content
   - Store cached responses in Supabase for persistence across deployments

3. **AI Chat Functionality**:
   - Allow users to ask questions about guides, attractions, or plans
   - Maintain conversation context for multi-turn interactions
   - Support context-aware queries with reference to specific guides or plans
   - Provide relevant, accurate information by retrieving data from the database before processing AI requests

2. **Guide Publication**:
   - Guides start as unpublished drafts
   - Only published guides appear in public listings
   - Version tracking is maintained for future update features

3. **Soft Delete**:
   - All delete operations use soft deletes (`deleted_at` timestamp)
   - API endpoints filter out soft-deleted records
   - Database has indexes optimized for this pattern

4. **Geospatial Queries**:
   - Attraction endpoints support proximity searches
   - Uses PostGIS functions for efficient spatial queries

5. **Caching**:
   - Offline plan caching status is tracked
   - Last sync timestamp helps determine content freshness 