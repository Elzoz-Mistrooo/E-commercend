import { roles } from "../../middleware/auntication.js";

export const endpoint = {

    create: [roles.Admin],
    update: [roles.Admin]
}