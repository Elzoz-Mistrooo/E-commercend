import { roles } from "../../middleware/auntication.js";

export const endPoint = {
    create: [roles.Admin],
    update: [roles.Admin]

}