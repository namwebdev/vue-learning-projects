import { customAlphabet } from "nanoid";

export const generateNanoId = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 5);