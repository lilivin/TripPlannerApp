import type { APIRoute } from 'astro';
import { attractionsService } from '../../../lib/services/attractions.service';
import { attractionsQuerySchema } from '../../../schemas/attraction.schema';
import { createAttractionSchema } from '../../../schemas/attraction-create.schema';
import { ApiError, createSuccessResponse } from '../../../lib/utils/api-response';

export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    
    const parseResult = attractionsQuerySchema.safeParse(queryParams);
    
    if (!parseResult.success) {
      return ApiError.validationError(
        'Nieprawidłowe parametry zapytania',
        parseResult.error.format()
      ).toResponse();
    }
    
    const { data: query } = parseResult;
    
    try {
      const result = await attractionsService.getAttractions(locals.supabase, query);
      return createSuccessResponse(result);
    } catch (serviceError) {
      // If it's already an ApiError, just return it
      if (serviceError instanceof ApiError) {
        return serviceError.toResponse();
      }
      
      // Otherwise, convert to internal error
      console.error('Unexpected service error:', serviceError);
      return ApiError.internalError('Wystąpił nieoczekiwany błąd podczas pobierania atrakcji').toResponse();
    }
  } catch (error) {
    console.error('Error fetching attractions:', error);
    return ApiError.internalError('Wystąpił błąd podczas pobierania atrakcji').toResponse();
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Temporarily disabled authentication for testing purposes
    // TODO: Re-enable authentication before production deployment
    /*
    // Check authentication
    const { supabase } = locals;
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return ApiError.authenticationError().toResponse();
    }
    */

    // For testing purposes - mock user ID
    const testUserId = '00000000-0000-0000-0000-000000000000';

    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (e) {
      return ApiError.validationError('Nieprawidłowy format JSON').toResponse();
    }
    
    const parseResult = createAttractionSchema.safeParse(requestBody);
    
    if (!parseResult.success) {
      return ApiError.validationError(
        'Nieprawidłowe dane atrakcji',
        parseResult.error.format()
      ).toResponse();
    }
    
    const attractionData = parseResult.data;
    
    try {
      // Call service to create attraction with test user ID
      const result = await attractionsService.createAttraction(
        locals.supabase, 
        testUserId, // Use test user ID instead of session.user.id
        attractionData
      );
      
      return createSuccessResponse(result, 201);
    } catch (serviceError) {
      // If it's already an ApiError, just return it
      if (serviceError instanceof ApiError) {
        return serviceError.toResponse();
      }
      
      // Otherwise, convert to internal error
      console.error('Unexpected service error:', serviceError);
      return ApiError.internalError('Wystąpił nieoczekiwany błąd podczas tworzenia atrakcji').toResponse();
    }
  } catch (error) {
    console.error('Error creating attraction:', error);
    return ApiError.internalError('Wystąpił błąd podczas tworzenia atrakcji').toResponse();
  }
}; 