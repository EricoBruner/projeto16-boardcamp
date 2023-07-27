import { Router } from "express";

import { customerController } from "../controllers/index.controller.js";

const customerRouter = Router();

customerRouter.post("/customers", customerController.createCustomer);

customerRouter.put("/customers", customerController.editCustomer);

customerRouter.get("/customers", customerController.getAllCustomers);
customerRouter.get("/customers/:id", customerController.getCustomer);

export default customerRouter;
