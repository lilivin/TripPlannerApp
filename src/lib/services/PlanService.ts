import type {
  PlanDetailDto,
  PlanListResponse,
  PlanQuery,
  UpdatePlanCommand,
  OfflineCacheStatusDto,
  UpdateOfflineCacheStatusCommand,
} from "@/types";

const BASE_URL = "/api/plans";

/**
 * Obsługuje błędy z API i zwraca odpowiedni komunikat
 * @param response Odpowiedź z API
 * @returns Error z odpowiednim komunikatem
 */
const handleApiError = (response: Response): Error => {
  switch (response.status) {
    case 401:
      return new Error("Unauthorized. Please login.");
    case 403:
      return new Error("You don't have permission to access this resource.");
    case 404:
      return new Error("The requested resource was not found.");
    case 400:
      return new Error("Invalid request data.");
    case 500:
      return new Error("Server error. Please try again later.");
    default:
      return new Error(`API Error: ${response.status}`);
  }
};

/**
 * Pobiera listę planów podróży
 * @param params Parametry zapytania
 * @returns Promise z odpowiedzią zawierającą listę planów
 */
export const getPlans = async (params?: PlanQuery): Promise<PlanListResponse> => {
  try {
    const queryString = params
      ? `?${Object.entries(params)
          .filter(([, value]) => value !== undefined)
          .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
          .join("&")}`
      : "";

    const response = await fetch(`${BASE_URL}${queryString}`);
    if (!response.ok) {
      throw handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching plans:", error);
    throw error;
  }
};

/**
 * Pobiera szczegóły planu podróży
 * @param id Identyfikator planu
 * @returns Promise z odpowiedzią zawierającą szczegóły planu
 */
export const getPlanById = async (id: string): Promise<PlanDetailDto> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) {
      throw handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching plan ${id}:`, error);
    throw error;
  }
};

/**
 * Aktualizuje plan podróży
 * @param id Identyfikator planu
 * @param data Dane do aktualizacji
 * @returns Promise z zaktualizowanym planem
 */
export const updatePlan = async (id: string, data: UpdatePlanCommand): Promise<PlanDetailDto> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating plan ${id}:`, error);
    throw error;
  }
};

/**
 * Pobiera status dostępności planu offline
 * @param id Identyfikator planu
 * @returns Promise z informacją o statusie offline
 */
export const getOfflineStatus = async (id: string): Promise<OfflineCacheStatusDto> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}/offline`);

    if (!response.ok) {
      throw handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching offline status for plan ${id}:`, error);
    throw error;
  }
};

/**
 * Aktualizuje status dostępności planu offline
 * @param id Identyfikator planu
 * @param data Dane do aktualizacji
 * @returns Promise z zaktualizowanym statusem offline
 */
export const updateOfflineStatus = async (
  id: string,
  data: UpdateOfflineCacheStatusCommand
): Promise<OfflineCacheStatusDto> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}/offline`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating offline status for plan ${id}:`, error);
    throw error;
  }
};
