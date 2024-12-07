import { SchemaType } from "@google/generative-ai";

const commonPromptSchema = {
  description:
    "Schema representing exam details including important dates, eligibility, vacancies, and other related information.",
  type: SchemaType.OBJECT,
  properties: {
    short_information: {
      type: SchemaType.STRING,
      description: "Brief description of the exam and recruitment process.",
    },
    highlighted_information: {
      type: SchemaType.STRING,
      description: "Key details highlighted for the exam notification.",
    },
    department: {
      type: SchemaType.STRING,
      description: "Name of the organizing department or agency.",
    },
    stage_level: {
      type: SchemaType.STRING,
      description:
        "Level at which the exam is conducted (e.g., National, State).",
    },
    applicants: {
      type: SchemaType.OBJECT,
      description:
        "Information about the number of applicants and selected candidates.",
      properties: {
        number_of_applicants_each_year: {
          type: SchemaType.NUMBER,
          description: "Number of applicants each year.",
        },
        number_of_applicants_selected: {
          type: SchemaType.NUMBER,
          description: "Number of applicants selected each year.",
        },
      },
      required: [
        "number_of_applicants_each_year",
        "number_of_applicants_selected",
      ],
    },
    post_importance: {
      type: SchemaType.STRING,
      description:
        "Importance of the post and its relevance to admissions or recruitment.",
    },
    post_exam_toughness_ranking: {
      type: SchemaType.NUMBER,
      description: "Ranking of the exam's difficulty level on a scale.",
    },
    job_type: {
      type: SchemaType.STRING,
      description: "Type of job associated with the exam (if applicable).",
    },
    post_exam_duration: {
      type: SchemaType.NUMBER,
      description: "Duration of the exam in minutes.",
    },
    age_criteria: {
      type: SchemaType.OBJECT,
      description: "Age criteria for different categories and genders.",
      properties: {
        male: {
          type: SchemaType.OBJECT,
          properties: {
            general: {
              type: SchemaType.OBJECT,
              properties: {
                minimum_age: { type: SchemaType.NUMBER },
                maximum_age: { type: SchemaType.NUMBER },
                age_relaxation: { type: SchemaType.STRING },
              },
              required: ["minimum_age", "maximum_age", ],
            },
            obc: {
              type: SchemaType.OBJECT,
              properties: {
                minimum_age: { type: SchemaType.NUMBER },
                maximum_age: { type: SchemaType.NUMBER },
                age_relaxation: { type: SchemaType.STRING },
              },
              required: ["minimum_age", "maximum_age", ],
            },
            ews: {
               type: SchemaType.OBJECT,
              properties: {
                minimum_age: { type: SchemaType.NUMBER },
                maximum_age: { type: SchemaType.NUMBER },
                age_relaxation: { type: SchemaType.STRING },
              },
              required: ["minimum_age", "maximum_age", ],
            },
            sc: {
               type: SchemaType.OBJECT,
              properties: {
                minimum_age: { type: SchemaType.NUMBER },
                maximum_age: { type: SchemaType.NUMBER },
                age_relaxation: { type: SchemaType.STRING },
              },
              required: ["minimum_age", "maximum_age", ],
            },
            st: {
               type: SchemaType.OBJECT,
              properties: {
                minimum_age: { type: SchemaType.NUMBER },
                maximum_age: { type: SchemaType.NUMBER },
                age_relaxation: { type: SchemaType.STRING },
              },
              required: ["minimum_age", "maximum_age", ],
            },
            ph_dviyang: {
               type: SchemaType.OBJECT,
              properties: {
                minimum_age: { type: SchemaType.NUMBER },
                maximum_age: { type: SchemaType.NUMBER },
                age_relaxation: { type: SchemaType.STRING },
              },
              required: ["minimum_age", "maximum_age", ],
            },
          },
          required: ["general", "obc", "ews", "sc", "st", "ph_dviyang"],
        },
        female: {
          type: SchemaType.OBJECT,
          properties: {
            general: {
              type: SchemaType.OBJECT,
              properties: {
                minimum_age: { type: SchemaType.NUMBER },
                maximum_age: { type: SchemaType.NUMBER },
                age_relaxation: { type: SchemaType.STRING },
              },
              required: ["minimum_age", "maximum_age", ],
            },
            obc: {
              type: SchemaType.OBJECT,
              properties: {
                minimum_age: { type: SchemaType.NUMBER },
                maximum_age: { type: SchemaType.NUMBER },
                age_relaxation: { type: SchemaType.STRING },
              },
              required: ["minimum_age", "maximum_age", ],
            },
            ews: {
               type: SchemaType.OBJECT,
              properties: {
                minimum_age: { type: SchemaType.NUMBER },
                maximum_age: { type: SchemaType.NUMBER },
                age_relaxation: { type: SchemaType.STRING },
              },
              required: ["minimum_age", "maximum_age", ],
            },
            sc: {
               type: SchemaType.OBJECT,
              properties: {
                minimum_age: { type: SchemaType.NUMBER },
                maximum_age: { type: SchemaType.NUMBER },
                age_relaxation: { type: SchemaType.STRING },
              },
              required: ["minimum_age", "maximum_age", ],
            },
            st: {
               type: SchemaType.OBJECT,
              properties: {
                minimum_age: { type: SchemaType.NUMBER },
                maximum_age: { type: SchemaType.NUMBER },
                age_relaxation: { type: SchemaType.STRING },
              },
              required: ["minimum_age", "maximum_age", ],
            },
            ph_dviyang: {
               type: SchemaType.OBJECT,
              properties: {
                minimum_age: { type: SchemaType.NUMBER },
                maximum_age: { type: SchemaType.NUMBER },
                age_relaxation: { type: SchemaType.STRING },
              },
              required: ["minimum_age", "maximum_age", ],
            },
          },
          required: ["general", "obc", "ews", "sc", "st", "ph_dviyang"],
        },
        other: {
          type: SchemaType.OBJECT,
          properties: {
            general: {
              type: SchemaType.OBJECT,
              properties: {
                minimum_age: { type: SchemaType.NUMBER },
                maximum_age: { type: SchemaType.NUMBER },
                age_relaxation: { type: SchemaType.STRING },
              },
              required: ["minimum_age", "maximum_age", ],
            },
            obc: {
              type: SchemaType.OBJECT,
              properties: {
                minimum_age: { type: SchemaType.NUMBER },
                maximum_age: { type: SchemaType.NUMBER },
                age_relaxation: { type: SchemaType.STRING },
              },
              required: ["minimum_age", "maximum_age", ],
            },
            ews: {
               type: SchemaType.OBJECT,
              properties: {
                minimum_age: { type: SchemaType.NUMBER },
                maximum_age: { type: SchemaType.NUMBER },
                age_relaxation: { type: SchemaType.STRING },
              },
              required: ["minimum_age", "maximum_age", ],
            },
            sc: {
               type: SchemaType.OBJECT,
              properties: {
                minimum_age: { type: SchemaType.NUMBER },
                maximum_age: { type: SchemaType.NUMBER },
                age_relaxation: { type: SchemaType.STRING },
              },
              required: ["minimum_age", "maximum_age", ],
            },
            st: {
               type: SchemaType.OBJECT,
              properties: {
                minimum_age: { type: SchemaType.NUMBER },
                maximum_age: { type: SchemaType.NUMBER },
                age_relaxation: { type: SchemaType.STRING },
              },
              required: ["minimum_age", "maximum_age", ],
            },
            ph_dviyang: {
               type: SchemaType.OBJECT,
              properties: {
                minimum_age: { type: SchemaType.NUMBER },
                maximum_age: { type: SchemaType.NUMBER },
                age_relaxation: { type: SchemaType.STRING },
              },
              required: ["minimum_age", "maximum_age", ],
            },
          },
          required: ["general", "obc", "ews", "sc", "st", "ph_dviyang"],
        },
      },
      additional_resources: {
        type: SchemaType.STRING,
        description: "Additional resources or details about age criteria.",
      },
    },
    vacancy: {
      type: SchemaType.OBJECT,
      description:
        "Details of available vacancies including category-wise distribution.",
      properties: {
        detail: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              post_name: { type: SchemaType.STRING },
              total_post: { type: SchemaType.NUMBER },
              post_eligibility: { type: SchemaType.STRING },
            },
            required: ["post_name", "total_post", "post_eligibility"],
          },
        },
        category_wise: {
          type: SchemaType.OBJECT,
          properties: {
            male: {
              type: SchemaType.OBJECT,
              properties: {
                general: {
                  type: SchemaType.NUMBER,
                  description: "Number of the seat / vacancy available",
                },
                obc: {
                  type: SchemaType.NUMBER,
                  description: "Number of the seat / vacancy available",
                },
                ews: {
                  type: SchemaType.NUMBER,
                  description: "Number of the seat / vacancy available",
                },
                sc: {
                  type: SchemaType.NUMBER,
                  description: "Number of the seat / vacancy available",
                },
                st: {
                  type: SchemaType.NUMBER,
                  description: "Number of the seat / vacancy available",
                },
                ph_dviyang: {
                  type: SchemaType.NUMBER,
                  description: "Number of the seat / vacancy available",
                },
              },
              required: ["general", "obc", "ews", "sc", "st", "ph_dviyang"],
            },
            female:  {
              type: SchemaType.OBJECT,
              properties: {
                general: {
                  type: SchemaType.NUMBER,
                  description: "Number of the seat / vacancy available",
                },
                obc: {
                  type: SchemaType.NUMBER,
                  description: "Number of the seat / vacancy available",
                },
                ews: {
                  type: SchemaType.NUMBER,
                  description: "Number of the seat / vacancy available",
                },
                sc: {
                  type: SchemaType.NUMBER,
                  description: "Number of the seat / vacancy available",
                },
                st: {
                  type: SchemaType.NUMBER,
                  description: "Number of the seat / vacancy available",
                },
                ph_dviyang: {
                  type: SchemaType.NUMBER,
                  description: "Number of the seat / vacancy available",
                },
              },
              required: ["general", "obc", "ews", "sc", "st", "ph_dviyang"],
            },
            other:  {
              type: SchemaType.OBJECT,
              properties: {
                general: {
                  type: SchemaType.NUMBER,
                  description: "Number of the seat / vacancy available",
                },
                obc: {
                  type: SchemaType.NUMBER,
                  description: "Number of the seat / vacancy available",
                },
                ews: {
                  type: SchemaType.NUMBER,
                  description: "Number of the seat / vacancy available",
                },
                sc: {
                  type: SchemaType.NUMBER,
                  description: "Number of the seat / vacancy available",
                },
                st: {
                  type: SchemaType.NUMBER,
                  description: "Number of the seat / vacancy available",
                },
                ph_dviyang: {
                  type: SchemaType.NUMBER,
                  description: "Number of the seat / vacancy available",
                },
              }
            },
          },
        },
        additional_resources: {
          type: SchemaType.STRING,
          description:
            "Additional resources or verification links for vacancy details.",
        },
      },
      required: ["detail", "category_wise", "additional_resources"],
    },
    eligibility: {
      type: SchemaType.OBJECT,
      description: "Eligibility criteria for the exam.",
      properties: {
        minimum_qualification: {
          type: SchemaType.STRING,
          description: "Minimum educational qualification required.",
        },
        other_qualification: {
          type: SchemaType.STRING,
          description: "Additional preferred qualifications.",
        },
      },
      required: ["minimum_qualification"],
    },
    post_exam_mode: {
      type: SchemaType.STRING,
      description:
        "Mode in which the exam is conducted (e.g., offline, online).",
    },
    applicants_gender_that_can_apply: {
      type: SchemaType.STRING,
      description:
        "Gender eligibility for applicants (e.g., all, male, female, other).",
      enum: ["male", "female", "other", "all"],
    },
  },
  required: [
    "short_information",
    "highlighted_information",
    "department",
    "stage_level",
    "applicants",
    "post_importance",
    "post_exam_toughness_ranking",
    "job_type",
    "post_exam_duration",
    "age_criteria",
    "vacancy",
    "eligibility",
    "post_exam_mode",
    "applicants_gender_that_can_apply",
  ],
};

export default commonPromptSchema;
