import type {
  Owner,
  EventType,
  EventTypeCreate,
  EventTypeUpdate,
  Slot,
  Booking,
  BookingCreate,
  ApiError,
} from "@/types/api";

const API_BASE = "/api";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json();
}

// ═══════════════════════════════════════════════════════════════
// OWNER
// ═══════════════════════════════════════════════════════════════

export async function getOwner(): Promise<Owner> {
  const response = await fetch(`${API_BASE}/owner`);
  return handleResponse<Owner>(response);
}

// ═══════════════════════════════════════════════════════════════
// EVENT TYPES
// ═══════════════════════════════════════════════════════════════

export async function listEventTypes(): Promise<EventType[]> {
  const response = await fetch(`${API_BASE}/event-types`);
  return handleResponse<EventType[]>(response);
}

export async function createEventType(data: EventTypeCreate): Promise<EventType> {
  const response = await fetch(`${API_BASE}/event-types`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<EventType>(response);
}

export async function getEventType(id: string): Promise<EventType> {
  const response = await fetch(`${API_BASE}/event-types/${id}`);
  return handleResponse<EventType>(response);
}

export async function updateEventType(id: string, data: EventTypeUpdate): Promise<EventType> {
  const response = await fetch(`${API_BASE}/event-types/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<EventType>(response);
}

export async function deleteEventType(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/event-types/${id}`, {
    method: "DELETE",
  });
  return handleResponse<void>(response);
}

// ═══════════════════════════════════════════════════════════════
// SLOTS
// ═══════════════════════════════════════════════════════════════

export async function listSlots(eventTypeId: string, date: string): Promise<Slot[]> {
  const response = await fetch(
    `${API_BASE}/event-types/${eventTypeId}/slots?date=${date}`
  );
  return handleResponse<Slot[]>(response);
}

// ═══════════════════════════════════════════════════════════════
// BOOKINGS
// ═══════════════════════════════════════════════════════════════

export async function listBookings(): Promise<Booking[]> {
  const response = await fetch(`${API_BASE}/bookings`);
  return handleResponse<Booking[]>(response);
}

export async function createBooking(data: BookingCreate): Promise<Booking> {
  const response = await fetch(`${API_BASE}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<Booking>(response);
}

export async function getBooking(id: string): Promise<Booking> {
  const response = await fetch(`${API_BASE}/bookings/${id}`);
  return handleResponse<Booking>(response);
}

export async function deleteBooking(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/bookings/${id}`, {
    method: "DELETE",
  });
  return handleResponse<void>(response);
}
