import { NominatimResult } from "~/lib/types";
import { SearchSchema } from "~/lib/zod-schemas";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";
import sendZodError from "~/utils/send-zod-error";

export default defineAuthenticatedEventHandler(defineCachedEventHandler(async (event) => {
    const result = await getValidatedQuery(event, SearchSchema.safeParse)

    if (!result.success) return sendZodError(event, result.error)

    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${result.data.q}&format=json`, {
            signal: AbortSignal.timeout(5000),
            headers: {
                "User-Agent": "travel-logs | zynmul@mail.com"
            }
        })
        if (!res.ok) return sendError(event, createError({
            statusCode: 504,
            statusMessage: "Unable to reach search API!"
        }))

        const results = await res.json() as NominatimResult[];
        return results;
    } catch (error) {
        console.error("🚀 ~ search GET ~ error:", error)
        return sendError(event, createError({
            statusCode: 504,
            statusMessage: "Unable to reach search API.",
        }));
    }
}, {
    maxAge: 60 * 60 * 24,
    name: "search-nominatim",
    getKey: (event) => {
        const q = getQuery(event)
        return q?.q?.toString() || ""
    }
}))