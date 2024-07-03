export interface CodeItem {
  code: string;
  count?: boolean | number;
}

export interface AdminExamProps {
  exam_conducting_body:CodeItem[];
  exam_mode: CodeItem[];
  exam_code: CodeItem[];
  exam_level: CodeItem[]; 
  job_type: CodeItem[];
  state_and_union: CodeItem[];
  syllabus: CodeItem[];
  category: CodeItem[];
  vacancy__gender_applicant:CodeItem[];
  eligibility__minimun_qualification:CodeItem[];
}
