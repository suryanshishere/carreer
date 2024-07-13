import express from "express";
import { getExam, getDetailByExamId, getCategoryExam } from "@controllers/exams/exams-controllers";

const router = express.Router();

router.get("/", getExam);
router.get("/home", getExam);
router.get("/category/:category", getCategoryExam);
router.get('/category/:category/:examId', getDetailByExamId);


export default router;
