import { v4 as uuidv4 } from "uuid";
import cron from "node-cron";
import moment from "moment-timezone";
import TimeLog from "../models/TimeLogModel.js";
import Process from "../models/ProcessModel.js";

export const createProcess = async (req, res, next) => {
  try {
    const processId = uuidv4();

    const newProcess = new Process({ processId });
    await newProcess.save();

    res.status(201).json({ processId });

    // Function to log time
    const logTime = async () => {
      const timeLog = new TimeLog({
        processId,
        time: new Date(),
      });
      await timeLog.save();
    };

    // Schedule logging time every 5 seconds
    cron.schedule("*/5 * * * * *", logTime);
  } catch (err) {
    next(err);
  }
};

// Getting single process and its time logs
export const getTimeLogs = async (req, res, next) => {
  try {
    const { processId } = req.params;
    const timeLogs = await TimeLog.find({ processId }).sort({ time: 1 }).exec();
    // Convert times to BD time
    const bdTimeLogs = timeLogs.map((log) => ({
      ...log._doc,
      time: moment(log.time)
        .tz("Asia/Dhaka")
        .format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
    }));

    res.status(200).json(bdTimeLogs);
  } catch (err) {
    next(err);
  }
};

//getting all processess
export const getAllProcesses = async (req, res, next) => {
  try {
    const processes = await Process.find().sort({ createdAt: 1 }).exec();

    // Convert createdAt times to BD time
    const bdProcesses = processes.map((process) => ({
      processId: process.processId,
      creationTime: moment(process.createdAt)
        .tz("Asia/Dhaka")
        .format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
    }));

    res.status(200).json(bdProcesses);
  } catch (err) {
    next(err);
  }
};

//Deleting process
export const deleteProcess = async (req, res, next) => {
  try {
    const { processId } = req.params;

    // Delete the process
    const process = await Process.findOneAndDelete({ processId });

    if (!process) {
      return res.status(404).json({ message: "Process not found" });
    }

    // Delete associated time logs
    await TimeLog.deleteMany({ processId });

    res
      .status(200)
      .json({ message: `${processId} Process and associated time logs deleted` });
  } catch (err) {
    next(err);
  }
};
