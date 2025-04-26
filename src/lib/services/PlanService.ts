import type {
  PlanDetailDto,
  PlanListResponse,
  PlanQuery,
  UpdatePlanCommand,
  OfflineCacheStatusDto,
  UpdateOfflineCacheStatusCommand,
} from "@/types";

/**
 * Klasa obsługująca operacje na planach podróży przez API
 */
export class PlanService {
  private static readonly BASE_URL = "/api/plans";

  /**
   * Pobiera listę planów podróży
   * @param params Parametry zapytania
   * @returns Promise z odpowiedzią zawierającą listę planów
   */
  static async getPlans(params?: PlanQuery): Promise<PlanListResponse> {
    try {
      const queryString = params
        ? `?${Object.entries(params)
            .filter(([, value]) => value !== undefined)
            .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
            .join("&")}`
        : "";

      const response = await fetch(`${this.BASE_URL}${queryString}`);
      if (!response.ok) {
        throw this.handleApiError(response);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching plans:", error);
      throw error;
    }
  }

  /**
   * Pobiera szczegóły planu podróży
   * @param id Identyfikator planu
   * @returns Promise z odpowiedzią zawierającą szczegóły planu
   */
  static async getPlanById(id: string): Promise<PlanDetailDto> {
    try {
      const response = await fetch(`${this.BASE_URL}/${id}`);
      if (!response.ok) {
        throw this.handleApiError(response);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching plan ${id}:`, error);
      throw error;
    }
  }

  /**
   * Aktualizuje plan podróży
   * @param id Identyfikator planu
   * @param data Dane do aktualizacji
   * @returns Promise z zaktualizowanym planem
   */
  static async updatePlan(id: string, data: UpdatePlanCommand): Promise<PlanDetailDto> {
    try {
      const response = await fetch(`${this.BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw this.handleApiError(response);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating plan ${id}:`, error);
      throw error;
    }
  }

  /**
   * Pobiera status dostępności planu offline
   * @param id Identyfikator planu
   * @returns Promise z informacją o statusie offline
   */
  static async getOfflineStatus(id: string): Promise<OfflineCacheStatusDto> {
    try {
      const response = await fetch(`${this.BASE_URL}/${id}/offline`);

      if (!response.ok) {
        throw this.handleApiError(response);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching offline status for plan ${id}:`, error);
      throw error;
    }
  }

  /**
   * Aktualizuje status dostępności planu offline
   * @param id Identyfikator planu
   * @param data Dane do aktualizacji
   * @returns Promise z zaktualizowanym statusem offline
   */
  static async updateOfflineStatus(id: string, data: UpdateOfflineCacheStatusCommand): Promise<OfflineCacheStatusDto> {
    try {
      const response = await fetch(`${this.BASE_URL}/${id}/offline`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw this.handleApiError(response);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating offline status for plan ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obsługuje błędy z API i zwraca odpowiedni komunikat
   * @param response Odpowiedź z API
   * @returns Error z odpowiednim komunikatem
   */
  private static handleApiError(response: Response): Error {
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
  }
}
