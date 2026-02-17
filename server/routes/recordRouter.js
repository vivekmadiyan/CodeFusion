import express from "express";
import { fetchRecord, saveRecord } from "../controllers/recordController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/save", authMiddleware, saveRecord);
router.get("/fetch", authMiddleware, fetchRecord);


export default router;
