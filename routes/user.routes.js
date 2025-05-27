import { Router } from "express";
import {
  deleteUserByEmailController,
  fetchAllUserController,
  fetchUserByIdController,
  userController,
} from "../controllers/userController.js";

const router = Router();

/****************************************************/
router.route("/identify").post(userController);
/****************************************************/
router.route("/").get(fetchAllUserController);
router.route("/getById/:id").get(fetchUserByIdController);
router.route("/deleteByEmail/:email").delete(deleteUserByEmailController);

export default router;
