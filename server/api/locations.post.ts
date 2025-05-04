import { and, DrizzleError, eq } from "drizzle-orm";
import slugify from "slug";
import { CreateLocation, location } from "~/lib/db/schema/location"
import { createLocation, findLocationBySlug } from "~/lib/db/queries/location";
import db from "~/lib/db"
import { generateNanoId } from "~/utils/index";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
    const user = event.context.user
    const result = await readValidatedBody(event, CreateLocation.safeParse)
    if (!result.success) {
        const statusMessage = result.error.issues.map(issue => `${issue.path.join(".")}: ${issue.message}`).join(", ")
        const data = result.error.issues.reduce((errors, issue) => {
            errors[issue.path.join(".")] = issue.message
            return errors
        }, {} as Record<string, string>);

        return sendError(event, createError({ statusCode: 422, statusMessage, data }))
    }

    const existingLocation = await db.query.location.findFirst({
        where: and(
            eq(location.userId, user.id),
            eq(location.name, result.data.name)
        )
    })
    if (existingLocation) {
        return sendError(event, createError({ statusCode: 409, statusMessage: "Location already exists" }))
    }

    let slug = slugify(result.data.name);
    let existing = !!(await findLocationBySlug(slug));

    while (existing) {
        const id = generateNanoId()
        const idSlug = `${slug}-${id}`;

        existing = !!(await findLocationBySlug(idSlug));
        if (!existing) slug = idSlug;
    }

    try {
        const formData = {
            ...result.data,
            userId: user.id,
            slug,
        }
        return await createLocation(formData, slug, user.id)
    }
    catch (e) {
        const uniqueConstraintMessage = "SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: location.slug"

        const error = e as DrizzleError;
        if (error.message === uniqueConstraintMessage)
            return sendError(event, createError({
                statusCode: 409,
                statusMessage: "Slug must be unique (the location name is used to generate the slug).",
            }));

        throw error;
    }

})

