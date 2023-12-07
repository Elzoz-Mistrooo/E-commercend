import { roles } from "../../middleware/auntication.js";

export const endpoint = {
    create: [roles.User],
    CancelOrder: [roles.User],
    UpdateOrder: [roles.Admin]

}