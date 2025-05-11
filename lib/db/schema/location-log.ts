import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { location } from "./location";
import { user } from "./auth";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { DescriptionSchema, LatSchema, LongSchema, NameSchema, DateSchema } from "../../zod-schemas";

export const locationLog = sqliteTable("locationLog", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text(),
  startedAt: int().notNull(),
  endedAt: int().notNull(),
  lat: real().notNull(),
  long: real().notNull(),
  locationId: int()
    .notNull()
    .references(() => location.id),
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
});

export const locationLogRelation = relations(locationLog, ({ one }) => ({
  location: one(location, {
    fields: [locationLog.locationId],
    references: [location.id],
  }),
}));

export const CreateLocationLog = createInsertSchema(locationLog, {
  name: NameSchema,
  description: DescriptionSchema,
  lat: LatSchema,
  long: LongSchema,
  startedAt: DateSchema,
  endedAt: DateSchema,
}).omit({
  id: true,
  userId: true,
  locationId: true,
  createdAt: true,
  updatedAt: true,
}).superRefine((values, context) => {
  if (values.startedAt > values.endedAt || values.endedAt < values.startedAt) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Start Date must be before End Date",
      path: ["startedAt"],
    });
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "End Date must be after Start Date",
      path: ["endedAt"],
    });
  }
});

export type CreateLocationLogType = z.infer<typeof CreateLocationLog>;

export type SelectLocationLog = typeof locationLog.$inferSelect;