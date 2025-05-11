import { findLocation } from "~/lib/db/queries/location";
import { createLocationLog } from "~/lib/db/queries/location-log";
import { CreateLocationLog } from "~/lib/db/schema/location-log";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";
import sendZodError from "~/utils/send-zod-error";

export default defineAuthenticatedEventHandler(async (event) => {
    const slug = getRouterParam(event, "slug") as string;
    const location = await findLocation(slug, event.context.user.id);

    if (!location) throw createError({
        statusCode: 404,
        statusMessage: "Location not found"
    })

    const result = await readValidatedBody(event, CreateLocationLog.safeParse)
    if (!result.success) return sendZodError(event, result.error)

    return createLocationLog(location.id, result.data, event.context.user.id)
})