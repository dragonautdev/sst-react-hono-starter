import { z } from "zod";

export const CreateKey = z.object({
  name: z.string().min(1, 'Api Key name is required'),
});