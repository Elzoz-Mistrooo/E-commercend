import { roles } from "../../middleware/auntication.js";

export const endpoint = {
    create: [roles.User],
    update: [roles.Admin]
}