import express from "express";
import {
  
  createExam,
  getSaveExam,
  removeExam,
  saveExam,
} from "../../../controllers/users/account/account-exams-controllers";

const router = express.Router();

router.get("/:userId/saved_exam", getSaveExam);

router.post("/:userId/save_exam", saveExam);

router.delete("/:userId/save_exam", removeExam);


router.post("/:userId/create_exam", createExam);

export default router;
