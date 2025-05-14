// zod/identity.schema.ts
import { z } from 'zod'
import { userRole } from '../../utils/enums/user-role.enum'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const IdentitySchema = z.object({
  userName: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(Object.values(userRole) as [string, ...string[]]).optional().default(userRole.USER)
}).openapi('IdentitySchema');

export const IdentityLoginSchema = IdentitySchema.pick({
  email: true,
  password: true
}).openapi('IdentityLoginSchema');

// ✅ Type inference from schema (optional, but nice to have)
export type IIdentity = z.infer<typeof IdentitySchema>
export type IIdentityLogin = z.infer<typeof IdentityLoginSchema>
