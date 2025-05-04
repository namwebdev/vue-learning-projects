import { generateNanoId } from '~/utils/index';
import type { CreateLocationType } from '../schema/location';
import db from '..';
import { location } from '../schema/location';
import { eq } from 'drizzle-orm';

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
    userId: string,
) {
    const [created] = await db.insert(location).values({
        ...insertable,
        slug,
        userId,
    }).returning();
    return created;
}