export const COMMON_POST_DETAIL_SELECT_FIELDS: string = "name_of_the_post _id updatedAt";

export const sectionPostDetailSelect: { [key: string]: string } = {
    result: "-application_fee -approved",
    admit_card: "-approved -application_fee",
    latest_job: "-approved",
    syllabus: "-application_fee -approved",
    answer_key: "-application_fee -approved",
    certificate_verification: "-approved -application_fee",
    important: "-approved -application_fee",
    admission: "-approved -application_fee",
  };
  