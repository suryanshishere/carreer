import { SchemaType } from "@google/generative-ai";
import { POST_LIMITS_ENV_DB } from "@models/post/post-env-db";

const {
  short_char_limit,
  rank_minute_num,
  job_type, 
  age_num,
  non_negative_num,
  stage_level,
  post_exam_mode,
  applicants_gender_that_can_apply,
  long_char_limit,
} = POST_LIMITS_ENV_DB;

const ageCriteria = {
  minimum_age: {
    type: SchemaType.NUMBER,
    description: `Minimum age allowed, within ${age_num.min}-${age_num.max} range.`,
  },
  maximum_age: {
    type: SchemaType.NUMBER,
    description: `Maximum age allowed, within ${age_num.min}-${age_num.max} range.`,
  },
  age_relaxation: {
    type: SchemaType.STRING,
    description: `Age relaxation, within ${short_char_limit.min}-${short_char_limit.max} characters.`,
  },
};

const applicants = {
  number_of_applicants_each_year: {
    type: SchemaType.NUMBER,
    description: `The number of applicants who applied each year, within ${non_negative_num.min}-${non_negative_num.max} range.`,
  },
  number_of_applicants_selected: {
    type: SchemaType.NUMBER,
    description: `The number of applicants who were selected, within ${non_negative_num.min}-${non_negative_num.max} range.`,
  },
};

const vacancy = {
  type: SchemaType.OBJECT,
  properties: {
    detail: {
      description:
        "Information about the number and distribution of vacancies for the post.",
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          post_name: {
            type: SchemaType.STRING,
            description: `The name of the post, within ${short_char_limit.min}-${short_char_limit.max} characters.`,
          },
          total_post: {
            type: SchemaType.NUMBER,
            description: `The total number of posts available, within ${non_negative_num.min}-${non_negative_num.max} range.`,
          },
          post_eligibility: {
            type: SchemaType.STRING,
            description: `Eligibility criteria for the post, within ${short_char_limit.min}-${short_char_limit.max} characters.`,
          },
        },
        required: ["post_name", "total_post", "post_eligibility"],
      },
    },
    category_wise: {
      description: `Category-wise distribution of vacancies.`,
      type: SchemaType.OBJECT,
      properties: {
        general: {
          type: SchemaType.NUMBER,
          description: `Vacancies for the General category, within ${non_negative_num.min}-${non_negative_num.max} range.`,
        },
        obc: {
          type: SchemaType.NUMBER,
          description: `Vacancies for the OBC category, within ${non_negative_num.min}-${non_negative_num.max} range.`,
        },
        ews: {
          type: SchemaType.NUMBER,
          description: `Vacancies for the EWS category, within ${non_negative_num.min}-${non_negative_num.max} range.`,
        },
        sc: {
          type: SchemaType.NUMBER,
          description: `Vacancies for the SC category, within ${non_negative_num.min}-${non_negative_num.max} range.`,
        },
        st: {
          type: SchemaType.NUMBER,
          description: `Vacancies for the ST category, within ${non_negative_num.min}-${non_negative_num.max} range.`,
        },
        ph_dviyang: {
          type: SchemaType.NUMBER,
          description: `Vacancies for Physically Handicapped (Divyang) category, within ${non_negative_num.min}-${non_negative_num.max} range.`,
        },
      },
    },
    additional_resources: {
      type: SchemaType.STRING,
      description: `Additional information regarding vacancy, within ${short_char_limit.min}-${short_char_limit.max} characters.`,
    },
  },
  required: ["additional_resources"],
};

const commonPromptSchema = {
  description:
    "Schema describing common information fields related to a post, including eligibility, vacancy details, age criteria, and other related metadata.",
  type: SchemaType.OBJECT,
  properties: {
    short_information: {
      type: SchemaType.STRING,
      description: `A detailed and elaborative description of the post, providing a comprehensive overview within the allowed character range of ${long_char_limit.min} to ${long_char_limit.max} characters. The description should be informative and concise, summarizing the key aspects of the post and its relevance.`,
    },
    highlighted_information: {
      type: SchemaType.STRING,
      description: `Key highlights about the post that are SEO-friendly and engaging. Include primary responsibilities, unique benefits, and features using concise, keyword-rich phrases. Ensure content is within the character range of ${long_char_limit.min} to ${long_char_limit.max}. Focus on actionable, attention-grabbing language that appeals to the target audience while aligning with search engine optimization best practices.`,
    },
    department: {
      type: SchemaType.STRING,
      description: `The department or organization offering the post, within ${short_char_limit.min}-${short_char_limit.max} characters.`,
    },
    stage_level: {
      type: SchemaType.STRING,
      enum: stage_level,
    },
    applicants: {
      type: SchemaType.OBJECT,
      description:
        "Information about applicants who applied and got selected for the post.",
      properties: applicants,
    },
    post_importance: {
      type: SchemaType.STRING,
      description: `The significance or importance of the post, within ${long_char_limit.min}-${long_char_limit.max} characters. This should emphasize how the role contributes to the larger organizational goals and its value to the society or industry. Be sure to explain the responsibilities in a way that highlights its crucial nature.`,
    },
    job_type: {
      type: SchemaType.STRING,
      enum: job_type,
    },
    post_exam_duration: {
      type: SchemaType.NUMBER,
      description: `The duration of the examination for the post, in minutes, within ${rank_minute_num.min}-${rank_minute_num.max} range.`,
    },
    post_exam_toughness_ranking: {
      type: SchemaType.NUMBER,
      description: `The exam toughness ranking, withing ${rank_minute_num.min}-${rank_minute_num.max} range.`,
    },
    age_criteria: {
      description: `Age eligibility for the post.`,
      type: SchemaType.OBJECT,
      properties: ageCriteria,
    },
    vacancy,
    eligibility: {
      type: SchemaType.OBJECT,
      description: "Details about the eligibility criteria for the post.",
      properties: {
        minimum_qualification: {
          type: SchemaType.STRING,
          description: `The minimum required qualification for the post, within ${short_char_limit.min}-${short_char_limit.max} characters.`,
        },
        other_qualification: {
          type: SchemaType.STRING,
          description: `Any additional qualifications required for the post, within ${short_char_limit.min}-${short_char_limit.max} characters.`,
        },
      },
      required: ["minimum_qualification"],
    },
    post_exam_mode: {
      type: SchemaType.STRING,
      enum: post_exam_mode,
    },
    applicants_gender_that_can_apply: {
      type: SchemaType.STRING,
      enum: applicants_gender_that_can_apply,
    },
  },
  required: [
    "short_information",
    "highlighted_information",
    "department",
    "job_type",
    "age_criteria",
    "vacancy",
    "post_importance",
    "stage_level",
    "eligibility",
    "post_exam_mode",
    "applicants",
    "post_exam_toughness_ranking",
    "applicants_gender_that_can_apply",
  ],
};

export default commonPromptSchema;
