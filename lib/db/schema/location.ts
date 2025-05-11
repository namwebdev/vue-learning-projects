import { int, real, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { user } from "./auth";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { locationLog } from "./location-log";
import type { SelectLocationLog } from "./location-log";

export const location = sqliteTable(
  "location",
  {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    slug: text().notNull().unique(),
    description: text().notNull(),
    lat: real().notNull(),
    long: real().notNull(),
    userId: text()
      .notNull()
      .references(() => user.id),
    createdAt: int()
      .notNull()
      .$default(() => Date.now()),
    updatedAt: int()
      .notNull()
      .$default(() => Date.now())
      .$onUpdate(() => Date.now()),
  },
  (t) => [unique().on(t.name, t.userId)]
);

export const locationRelations = relations(location, ({ many }) => ({
  locationLogs: many(locationLog),
}));

export const CreateLocation = createInsertSchema(location, {
  name: (field) =>
    field
      .min(1, { message: "Name is required" })
      .max(100, { message: "Name must be at most 100 characters" }),
  description: (field) =>
    field
      .min(1, { message: "Description is required" })
      .max(255, { message: "Description must be at most 255 characters" }),
  lat: z.coerce
    .number()
    .finite({ message: "Latitude must be a finite number" })
    .min(-90, { message: "Latitude must be at least -90" })
    .max(90, { message: "Latitude must be at most 90" }),
  long: z.coerce
    .number()
    .finite({ message: "Longitude must be a finite number" })
    .min(-180, { message: "Longitude must be at least -180" })
    .max(180, { message: "Longitude must be at most 180" }),
}).omit({
  id: true,
  slug: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateLocationType = z.infer<typeof CreateLocation>;
export type SelectLocation = typeof location.$inferSelect;
export type SelectLocationWithLogs = SelectLocation & {
  locationLogs: SelectLocationLog[];
};
