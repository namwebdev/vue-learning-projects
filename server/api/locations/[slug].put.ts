import { CreateLocation } from "~/lib/db/schema";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";
import sendZodError from "~/utils/send-zod-error";

export default defineAuthenticatedEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug") as string;
  const res = await readValidatedBody(event, CreateLocation.safeParse);

  if (!res.success) return sendZodError(event, res.error);
});
