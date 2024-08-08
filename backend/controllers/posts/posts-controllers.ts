import { Request, Response, NextFunction } from "express";
import Admission from "@models/post/category/postAdmission";
import AdmitCard from "@models/post/category/postAdmitCard";
import CertificateVerification from "@models/post/category/postCertificateVerification";
import PostImportant from "@models/post/category/postImportant";
import LatestJob from "@models/post/category/postLatestJob";
import Result from "@models/post/category/postResult";
import Syllabus from "@models/post/category/postSyllabus";
import PostDate from "@models/post/overall/postDate";
import PostFee from "@models/post/overall/postFee";
import PostLink from "@models/post/overall/postLink";
import PostCommon from "@models/post/postCommon";
import Post from "@models/post/postModel";
import AnswerKey from "@models/post/category/postAnswerKey";


export const getExam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  CertificateVerification.find({})
  Admission.find({})
  AdmitCard.find({})
};

export const getCategoryExam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
};

export const getDetailByExamId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

};
