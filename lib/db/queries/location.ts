import type { CreateLocationType } from "../schema/location";
import db from "..";
import { location } from "../schema/location";
import { locationLog, type CreateLocationLogType } from "../schema/location-log";
import { and, eq } from "drizzle-orm";

export async function findLocation(slug: string, userId: string) {
  return db.query.location.findFirst({
    where: and(eq(location.slug, slug), eq(location.userId, userId)),
    with: {
      locationLogs: {
        orderBy(fields, operators) {
          return operators.desc(fields.createdAt)
        }
      },
    },
  });
}

export async function findLocationBySlug(slug: string) {
  return db.query.location.findFirst({
    where: eq(location.slug, slug),
  });
}

export async function getLocationsByUser(userId: string) {
  return db.query.location.findMany({
    where: eq(location.userId, userId),
  });
}

export async function createLocation(
  insertable: CreateLocationType,
  slug: string,
  userId: string
) {
  const [created] = await db
    .insert(location)
    .values({
      ...insertable,
      slug,
      userId,
    })
    .returning();
  return created;
}

export async function updateLocationBySlug(updateable: CreateLocationType, slug: string, userId: string) {
  const [updated] = await db.update(location).set(updateable).where(and(eq(location.slug, slug), eq(location.userId, userId))).returning();
  return updated;
}