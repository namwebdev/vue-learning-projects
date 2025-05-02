/* eslint-disable node/no-process-env */
import type { ZodObject, ZodRawShape } from "zod";

import { z, ZodError } from "zod";

function tryParseEnv<T extends ZodRawShape>(EnvSchema: ZodObject<T>, buildEnv: Record<string, string | undefined> = process.env) {
    try {
        return EnvSchema.parse(buildEnv);
    } catch (error) {
        if (error instanceof ZodError) {
            let message = "Missing environment variables:\n";
            error.issues.forEach((issue) => {
                message += `${issue.path[0]}\n`;
            });
            const e = new Error(message);
            e.stack = "";
            throw e;
        }
        console.error(error);
        throw error;
    }
}

const EnvSchema = z.object({
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    TURSO_DATABASE_URL: z.string(),
    TURSO_AUTH_TOKEN: z.string().optional(),
    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.string(),
    AUTH_GITHUB_CLIENT_ID: z.string(),
    AUTH_GITHUB_CLIENT_SECRET: z.string(),
});

export type EnvSchema = z.infer<typeof EnvSchema>;

tryParseEnv(EnvSchema);

export default EnvSchema.parse(process.env);