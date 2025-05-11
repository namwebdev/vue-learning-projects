import { and, eq } from "drizzle-orm";
import db from "..";
import { locationLog, type CreateLocationLogType } from "../schema/location-log";

export async function findLocationLogs(id: number, userId: string) {
    const foundLogs = await db.query.locationLog.findMany({
        where: and(eq(locationLog.id, id),
            eq(locationLog.userId, userId),),
        // with: {
        //     location: true,
        // },
    });
    return foundLogs
}

export async function createLocationLog(
    locationId: number,
    insertable: CreateLocationLogType,
    userId: string,
) {
    const [inserted] = await db.insert(locationLog).values({
        ...insertable,
        locationId,
        userId,
    }).returning();

    return inserted;
}