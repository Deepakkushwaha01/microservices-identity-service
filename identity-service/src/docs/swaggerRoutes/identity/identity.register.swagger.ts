import { IdentitySchema } from "../../../controllers/identity/identity.validation";
import { swaggerRegistry } from "../../swagger/swagger";

swaggerRegistry?.register('userRegister', IdentitySchema)

export const userRouteDocs = swaggerRegistry?.registerPath({
    method: 'post',
    path: '/api/user/register',
    tags: ['User Controller'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: IdentitySchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Created',
      },
      409: {
        description: 'Conflict',
      },
      404: {
        description: 'Not Found',
      },
      500: {
        description: 'Server Error',
      },
    },
  });