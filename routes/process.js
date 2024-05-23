import express from "express";
import {
    createProcess,
    getAllProcesses,
    getTimeLogs,
    deleteProcess
} from "../controllers/process.js";
const router = express.Router();

//create process
router.post("/create", createProcess);
//get all processes
router.get("/get", getAllProcesses);
//get time logs of specific process
router.get("/get/:processId", getTimeLogs);
//delete process
router.delete("/delete/:processId", deleteProcess);



export default router;
