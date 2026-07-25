import { test, expect } from "@playwright/test";

const cleanupEventTypes = async (page: import("@playwright/test").Page, names: string[]) => {
  const existing = await (await page.request.get("/api/event-types")).json();
  for (const et of existing) {
    if (names.includes(et.name)) {
      await page.request.delete(`/api/event-types/${et.id}`).catch(() => {});
    }
  }
};

test.describe("Booking flow", () => {
  test("full booking scenario: create event type → book slot → verify in admin", async ({ page }) => {
    // 1. Admin creates an event type
    await page.goto("/admin");
    await expect(page.getByRole("heading", { name: "Управление" })).toBeVisible();

    await page.getByRole("button", { name: "Добавить" }).click();
    await page.locator("#event-type-name").fill("Консультация");
    await page.locator("#event-type-description").fill("30-минутная консультация");
    await page.locator("#event-type-duration").fill("30");
    await page.getByRole("button", { name: "Создать" }).click();

    await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("heading", { name: "Консультация" })).toBeVisible();
    await expect(page.getByText("30 мин")).toBeVisible();

    // 2. Guest views event types and selects one
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Запишитесь на встречу" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Консультация" })).toBeVisible();

    await page.getByRole("button", { name: "Выбрать" }).click();

    // 3. Guest picks a slot
    await expect(page.getByText("Выберите время")).toBeVisible();

    const nextBtn = page.locator("button").filter({ has: page.locator('[class*="chevron-right"]') }).first();
    for (let i = 0; i < 3; i++) {
      const disabled = await nextBtn.isDisabled();
      if (disabled) break;
      await nextBtn.click();
      await page.waitForTimeout(300);
    }

    const slotButtons = page.locator("button").filter({ hasNot: page.locator('[class*="opacity-50"]') });
    const firstSlot = slotButtons.filter({ hasText: /^\d{2}:\d{2}$/ }).first();
    await expect(firstSlot).toBeVisible({ timeout: 5000 });
    await firstSlot.click();

    // 4. Guest fills booking form
    await expect(page.getByText("Подтвердите запись")).toBeVisible();

    await page.locator("#guest-name").fill("Иван Иванов");
    await page.locator("#guest-email").fill("ivan@example.com");
    await page.locator("#guest-notes").fill("Позвоните за 5 минут");
    await page.getByRole("button", { name: "Записаться" }).click();

    // 5. Success page
    await expect(page.getByText("Запись подтверждена!")).toBeVisible({ timeout: 10000 });

    // 6. Admin sees the booking
    await page.goto("/admin");
    await expect(page.getByRole("heading", { name: "Консультация" })).toBeVisible();
    await expect(page.getByText("Иван Иванов")).toBeVisible();
    await expect(page.getByText("ivan@example.com")).toBeVisible();
  });

  test("double booking is rejected", async ({ page }) => {
    // Create event type via UI
    await page.goto("/admin");
    await page.getByRole("button", { name: "Добавить" }).click();
    await page.locator("#event-type-name").fill("Double Test");
    await page.locator("#event-type-duration").fill("30");
    await page.getByRole("button", { name: "Создать" }).click();
    await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("heading", { name: "Double Test" })).toBeVisible();

    // Get the event type ID via API
    const eventTypes = await (await page.request.get("/api/event-types")).json();
    const et = eventTypes.find((e: any) => e.name === "Double Test");
    expect(et).toBeDefined();

    // Book a slot via API
    const startTime = new Date(Date.now() + 7 * 86400000).toISOString();
    const bookingRes1 = await page.request.post("/api/bookings", {
      data: {
        eventTypeId: et.id,
        startTime,
        guestName: "User One",
        guestEmail: "user1@example.com",
      },
    });
    expect(bookingRes1.status()).toBe(201);

    // Try to book the same slot again → 409
    const bookingRes2 = await page.request.post("/api/bookings", {
      data: {
        eventTypeId: et.id,
        startTime,
        guestName: "User Two",
        guestEmail: "user2@example.com",
      },
    });
    expect(bookingRes2.status()).toBe(409);
  });

  test("event type CRUD in admin", async ({ page }) => {
    await cleanupEventTypes(page, ["CRUD Test", "CRUD Test Updated"]);
    await page.goto("/admin");

    // Create
    await page.getByRole("button", { name: "Добавить" }).click();
    await page.locator("#event-type-name").fill("CRUD Test");
    await page.locator("#event-type-duration").fill("45");
    await page.getByRole("button", { name: "Создать" }).click();
    await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("heading", { name: "CRUD Test" })).toBeVisible();

    // Edit - click the edit icon button
    await page.locator("button").filter({ has: page.locator('[class*="lucide-edit-3"]') }).first().click();
    await page.locator("#event-type-name").fill("CRUD Test Updated");
    await page.getByRole("button", { name: "Сохранить" }).click();
    await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("heading", { name: "CRUD Test Updated" })).toBeVisible();

    // Delete - click the trash icon button
    await page.locator("button").filter({ has: page.locator('[class*="lucide-trash-2"]') }).first().click();
    await expect(page.getByRole("heading", { name: "CRUD Test Updated" })).not.toBeVisible();
  });
});
