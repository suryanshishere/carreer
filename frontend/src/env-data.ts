interface IPostEnvData {
  ALPHA_NUM_UNDERSCORE: RegExp;
  ALPHA_NUM_UNDERSCORE_SPACE: RegExp;
  MIN_POST_NAME_PUBLISHER: number;
  MAX_POST_NAME_PUBLISHER: number;
  MIN_POST_NAME: number;
  MAX_POST_NAME: number;
  MIN_POST_CODE: number;
  MAX_POST_CODE: number;
  SECTIONS: string[];
  COMPONENTS: string[];
  OVERALL: string[];
}

const POST_ENV_DATA: IPostEnvData = {
  ALPHA_NUM_UNDERSCORE: /^[A-Za-z0-9_]+$/,
  ALPHA_NUM_UNDERSCORE_SPACE:/^[A-Za-z0-9_\s]+$/,
  MIN_POST_NAME_PUBLISHER: Number(process.env.MIN_POST_NAME_PUBLISHER) || 6,
  MAX_POST_NAME_PUBLISHER: Number(process.env.MAX_POST_NAME_PUBLISHER) || 750,
  MIN_POST_NAME: Number(process.env.MIN_POST_NAME) || 20,
  MAX_POST_NAME: Number(process.env.MAX_POST_NAME) || 750,
  MIN_POST_CODE: Number(process.env.MIN_POST_CODE) || 6,
  MAX_POST_CODE: Number(process.env.MAX_POST_CODE) || 100,
  SECTIONS: [
    "result",
    "admit_card",
    "latest_job",
    "answer_key",
    "syllabus",
    "certificate_verification",
    "admission",
    "important",
  ],
  COMPONENTS: ["date", "common", "link", "fee"],
  OVERALL: [],
};

// Populate OVERALL dynamically
POST_ENV_DATA.OVERALL = [
  ...POST_ENV_DATA.SECTIONS,
  ...POST_ENV_DATA.COMPONENTS,
];
export { POST_ENV_DATA };
