import "@typespec/http";
import "@typespec/rest";
import "@typespec/openapi3";

using TypeSpec.Http;
using TypeSpec.Rest;

@service({
  title: "Запись на звонок — API",
  version: "1.0.0",
})
namespace BookingAPI;

model Owner {
  id: string;
  name: string;
  email: string;
  description?: string;
}

model EventType {
  id: string;
  name: string;
  description?: string;
  durationMinutes: int32;
}

model EventTypeCreate {
  name: string;
  description?: string;
  durationMinutes: int32;
}

model EventTypeUpdate {
  name?: string;
  description?: string;
  durationMinutes?: int32;
}

model Slot {
  date: plainDate;
  startTime: string;
  endTime: string;
  available: boolean;
}

model Booking {
  id: string;
  eventTypeId: string;
  eventTypeName: string;
  startTime: utcDateTime;
  endTime: utcDateTime;
  guestName: string;
  guestEmail: string;
  guestNotes?: string;
  createdAt: utcDateTime;
}

model BookingCreate {
  eventTypeId: string;
  startTime: utcDateTime;
  guestName: string;
  guestEmail: string;
  guestNotes?: string;
}

model ApiError {
  status: int32;
  code: string;
  message: string;
}

@route("/owner")
interface Owner {
  @get get(): Owner;
}

@route("/event-types")
interface EventTypes {
  @get list(): EventType[];
  @post create(@body body: EventTypeCreate): EventType;
}

@route("/event-types/{id}")
interface EventTypeDetail {
  @get get(@path id: string): EventType;
  @patch update(@path id: string, @body body: EventTypeUpdate): EventType;
  @delete delete(@path id: string): void;
}

@route("/event-types/{id}/slots")
interface Slots {
  @get list(@path id: string, @query date: plainDate): Slot[];
}

@route("/bookings")
interface Bookings {
  @get list(): Booking[];
  @post create(@body body: BookingCreate): Booking;
}

@route("/bookings/{id}")
interface BookingDetail {
  @get get(@path id: string): Booking;
  @delete delete(@path id: string): void;
}
