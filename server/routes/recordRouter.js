import express from "express";
import { fetchRecord, saveRecord } from "../controllers/recordController.js";

const router = express.Router();

router.post("/save", saveRecord);
router.get("/fetch", fetchRecord);

export default router;
