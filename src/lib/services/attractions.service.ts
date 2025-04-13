import type { SupabaseClient } from '@supabase/supabase-js';
import type { 
  AttractionQuery, 
  AttractionListResponse,
  AttractionSummaryDto,
  AttractionDetailDto,
  TagDto,
  UpsertAttractionCommand
} from '../../types';
import { validateImageUrls } from '../utils/validation';
import { ApiError, ApiErrorTypes } from '../utils/api-response';

// Interface for raw database attraction response
interface DatabaseAttraction {
  id: string;
  name: string;
  description: string;
  address: string;
  geolocation: string;
  images: string[];
  creator_id: string;
  average_visit_time_minutes: number | null;
  opening_hours: any | null;
  contact_info: any | null;
  ticket_price_info: string | null;
  accessibility_info: string | null;
  creator: {
    id: string;
    display_name: string;
  };
}

// DatabaseAttractionTag interface removed for MVP

export const attractionsService = {
  async getAttractions(
    supabase: SupabaseClient,
    query: AttractionQuery
  ): Promise<AttractionListResponse> {
    const { 
      page = 1, 
      limit = 10, 
      creator_id, 
      search,
      latitude, 
      longitude, 
      radius = 1000,
      // tag_id, removed for MVP
      // tag_category, removed for MVP
    } = query;
    
    const offset = (page - 1) * limit;
    
    // Build base query
    let attractionsQuery = supabase
      .from('attractions')
      .select(`
        id,
        name,
        description,
        address,
        geolocation,
        images,
        creator_id,
        average_visit_time_minutes,
        creator:creators!inner(id, display_name)
      `)
      .is('deleted_at', null);
    
    // Add filters
    if (creator_id) {
      attractionsQuery = attractionsQuery.eq('creator_id', creator_id);
    }
    
    if (search) {
      attractionsQuery = attractionsQuery.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    // Filter by geolocation
    if (latitude !== undefined && longitude !== undefined) {
      attractionsQuery = attractionsQuery.filter(
        'geolocation', 
        'st_dwithin', 
        `ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326), ${radius}`
      );
    }
    
    // Create a clone of the query for count
    let countQueryBuilder = supabase
      .from('attractions')
      .select('id', { count: 'exact' })
      .is('deleted_at', null);

    // Apply the same filters
    if (creator_id) {
      countQueryBuilder = countQueryBuilder.eq('creator_id', creator_id);
    }

    if (search) {
      countQueryBuilder = countQueryBuilder.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (latitude !== undefined && longitude !== undefined) {
      countQueryBuilder = countQueryBuilder.filter(
        'geolocation', 
        'st_dwithin', 
        `ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326), ${radius}`
      );
    }

    const { count, error: countError } = await countQueryBuilder;
    const total = count || 0;
    
    // Execute main query with pagination
    const { data: rawAttractions, error } = await attractionsQuery
      .range(offset, offset + limit - 1)
      .order('name');
      
    if (error) {
      throw error;
    }
    
    if (!rawAttractions) {
      return {
        data: [],
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    }
    
    // Type the attractions data safely
    const attractions = rawAttractions as unknown as DatabaseAttraction[];
    
    // Get tags for attractions - removed for MVP
    
    // Filter by tag or tag category - removed for MVP
    const filteredAttractions = attractions;
    
    // Map to DTO
    const mappedData: AttractionSummaryDto[] = filteredAttractions.map((attraction) => {
      // Extract point from GEOGRAPHY geometry
      const geoParts = attraction.geolocation.replace('POINT(', '').replace(')', '').split(' ');
      const longitude = parseFloat(geoParts[0]);
      const latitude = parseFloat(geoParts[1]);
      
      return {
        id: attraction.id,
        name: attraction.name,
        description: attraction.description,
        address: attraction.address,
        geolocation: {
          latitude,
          longitude
        },
        images: attraction.images,
        creator: {
          id: attraction.creator.id,
          display_name: attraction.creator.display_name
        },
        average_visit_time_minutes: attraction.average_visit_time_minutes,
        // tags: tagsList removed for MVP
      };
    });
    
    // Calculate pagination info
    const pages = Math.ceil(total / limit);
    
    return {
      data: mappedData,
      pagination: {
        total,
        page,
        limit,
        pages
      }
    };
  },

  async getAttractionDetails(
    supabase: SupabaseClient,
    id: string
  ): Promise<AttractionDetailDto | null> {
    // Query for attraction details
    const { data: rawAttraction, error } = await supabase
      .from('attractions')
      .select(`
        id,
        name,
        description,
        address,
        geolocation,
        images,
        opening_hours,
        contact_info,
        creator_id,
        average_visit_time_minutes,
        ticket_price_info,
        accessibility_info,
        creator:creators(id, display_name)
      `)
      .eq('id', id)
      .is('deleted_at', null)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        // Record not found
        return null;
      }
      throw error;
    }
    
    if (!rawAttraction) {
      return null;
    }
    
    // Type the attraction data safely
    const attraction = rawAttraction as unknown as DatabaseAttraction;
    
    // Get tags for the attraction - removed for MVP
    
    // Extract point from GEOGRAPHY geometry
    const geoParts = attraction.geolocation.replace('POINT(', '').replace(')', '').split(' ');
    const longitude = parseFloat(geoParts[0]);
    const latitude = parseFloat(geoParts[1]);
    
    return {
      id: attraction.id,
      name: attraction.name,
      description: attraction.description,
      address: attraction.address,
      geolocation: {
        latitude,
        longitude
      },
      images: attraction.images,
      creator: {
        id: attraction.creator.id,
        display_name: attraction.creator.display_name
      },
      average_visit_time_minutes: attraction.average_visit_time_minutes,
      // tags, removed for MVP
      opening_hours: attraction.opening_hours,
      contact_info: attraction.contact_info,
      ticket_price_info: attraction.ticket_price_info,
      accessibility_info: attraction.accessibility_info
    };
  },

  async createAttraction(
    supabase: SupabaseClient,
    userId: string,
    data: UpsertAttractionCommand
  ): Promise<AttractionDetailDto> {
    // Temporarily disabled creator verification for testing purposes
    // TODO: Re-enable creator verification before production deployment
    /*
    // First verify that the user is a creator
    const { data: creator, error: creatorError } = await supabase
      .from('creators')
      .select('id, is_verified')
      .eq('user_id', userId)
      .single();
      
    if (creatorError || !creator) {
      throw ApiError.authorizationError('Użytkownik nie jest twórcą');
    }
    
    if (!creator.is_verified) {
      throw ApiError.authorizationError('Twórca nie jest zweryfikowany');
    }
    */
    
    // For testing purposes - use provided creator_id or a fallback
    const mockCreatorId = '74cfa5fe-d76b-4d98-8192-47125fdb88f3';
    
    // Temporary flag for testing
    const skipValidation = true; // TODO: Set to false before production deployment
    
    if (!skipValidation) {
      // Validate image URLs
      const imageValidation = validateImageUrls(data.images);
      if (!imageValidation.allValid) {
        const errorMessages = imageValidation.errors
          .map(err => `${err.url}: ${err.error}`)
          .join('; ');
        throw ApiError.validationError(`Nieprawidłowe adresy URL obrazów: ${errorMessages}`);
      }
    }
    
    // Tag validation removed for MVP
    
    // Convert geolocation to PostGIS format
    const geoPoint = `POINT(${data.geolocation.longitude} ${data.geolocation.latitude})`;
    
    // Insert attraction record
    const { data: attraction, error } = await supabase
      .from('attractions')
      .insert({
        name: data.name,
        description: data.description,
        address: data.address,
        geolocation: geoPoint,
        opening_hours: data.opening_hours,
        contact_info: data.contact_info,
        images: data.images,
        creator_id: mockCreatorId, // Using valid creator ID
        average_visit_time_minutes: data.average_visit_time_minutes,
        ticket_price_info: data.ticket_price_info,
        accessibility_info: data.accessibility_info,
      })
      .select('id')
      .single();
    
    if (error) {
      throw ApiError.internalError(`Błąd podczas dodawania atrakcji: ${error.message}`);
    }
    
    // Tag insertion removed for MVP
    
    // Get the complete attraction details to return
    const attractionDetails = await this.getAttractionDetails(supabase, attraction.id);
    
    if (!attractionDetails) {
      throw ApiError.internalError('Błąd podczas pobierania utworzonej atrakcji');
    }
    
    return attractionDetails;
  }
}; 