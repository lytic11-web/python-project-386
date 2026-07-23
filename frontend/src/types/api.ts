// ═══════════════════════════════════════════════════════════════
// Типы, сгенерированные из API-контракта (TypeSpec → OpenAPI)
// ═══════════════════════════════════════════════════════════════

export interface Owner {
  id: string;
  name: string;
  email: string;
  description?: string;
}

export interface EventType {
  id: string;
  name: string;
  description?: string;
  durationMinutes: number;
}

export interface EventTypeCreate {
  name: string;
  description?: string;
  durationMinutes: number;
}

export interface EventTypeUpdate {
  name?: string;
  description?: string;
  durationMinutes?: number;
}

export interface Slot {
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  available: boolean;
}

export interface Booking {
  id: string;
  eventTypeId: string;
  eventTypeName: string;
  startTime: string; // ISO 8601
  endTime: string; // ISO 8601
  guestName: string;
  guestEmail: string;
  guestNotes?: string;
  createdAt: string; // ISO 8601
}

export interface BookingCreate {
  eventTypeId: string;
  startTime: string; // ISO 8601
  guestName: string;
  guestEmail: string;
  guestNotes?: string;
}

export interface ApiError {
  status: number;
  code: string;
  message: string;
}
