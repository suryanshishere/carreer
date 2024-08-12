import React from "react";
import { Date, Input, TextArea } from "shared/utilComponents/form/input/Input";
import { useAdminExamData } from "db/adminDb/AdminExamData";
import Para from "shared/uiComponents/cover/Para";
import { Dropdown } from "shared/utilComponents/form/input/Dropdown";


export const ImportantDates = () => (
  <>
    <Para
      className="w-auto text-center mt-4 mb-2"
      style={{ color: "var(--color-black)" }}
    >
      Important dates
    </Para>
    <div className="flex gap-3">
      <div className="flex flex-col gap-2">
        <Para className="text-sm text-center">Application Start Date</Para>
        <Date
          name="important_dates__application_begin__current_year"
          required
        />
        <Date
          name="important_dates__application_begin__previous_year"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Para className="text-sm text-center">Application end date</Para>
        <Date name="important_dates__application_end__current_year" required />
        <Date name="important_dates__application_end__previous_year" required />
      </div>
      <div className="flex flex-col gap-2">
        <Para className=" text-sm text-center">Exam Date</Para>
        <Date name="important_dates__exam_date__current_year" required />
        <Date name="important_dates__exam_date__previous_year" required />
      </div>
      <div className="flex flex-col gap-2">
        <Para className=" text-sm text-center">Admit Card Issued Date</Para>
        <Date
          name="important_dates__admit_card_availablity__current_year"
          required
        />
        <Date
          name="important_dates__admit_card_availablity__previous_year"
          required
        />
      </div>
    </div>
  </>
);

export const ApplicationFormFee = () => (
  <>
    <Para
      className="w-auto text-center mt-4 mb-2"
      style={{ color: "var(--color-black)" }}
    >
      Application form fee
    </Para>
    <div className="flex gap-3">
      <div className="flex flex-col gap-3">
        <Para className="text-sm text-center">Male</Para>
        <Input
          placeholder="Male (current year)"
          name="application_fee__male__current_year"
          type="number"
          required
        />
        <Input
          placeholder="Male (previous year)"
          name="application_fee__male__previous_year"
          type="number"
          required
        />
      </div>
      <div className="flex flex-col gap-3">
        <Para className="text-sm text-center">Female</Para>
        <Input
          placeholder="Female (current year)"
          name="application_fee__female__current_year"
          type="number"
          required
        />
        <Input
          placeholder="Female (previous year)"
          name="application_fee__female__previous_year"
          type="number"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Para className="text-sm text-center">Fee</Para>
        <Date
          placeholder="Last submission date"
          name="application_fee__last_submission_date"
          type="number"
          required
        />
      </div>
    </div>
  </>
);

export const Vacancy = () => {
  const { vacancy__gender_applicant } = useAdminExamData();

  return (
    <>
      <Para
        className="w-auto text-center mt-4 mb-2"
        style={{ color: "var(--color-black)" }}
      >
        Vacancy
      </Para>
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <Dropdown
            name="vacancy__gender_applicant"
            placeholder="Applicants"
            dropdownData={vacancy__gender_applicant}
            required
          />
          <Input
            placeholder="Number of Applicant"
            name="vacancy__number_of_applicant"
            type="number"
            required
          />
          <Input placeholder="Vacancy" name="vacancy" type="number" required />
        </div>
        <div>OTHER (DETAIL TABLE)</div>
      </div>
    </>
  );
};

export const AgeCriteria = () => (
  <>
    <Para
      className="w-auto text-center mt-4 mb-2"
      style={{ color: "var(--color-black)" }}
    >
      Age Criteria
    </Para>
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <div className="w-1/3">
          <Input type="number" name="age_criterior__minimum_age" required />
        </div>
        <div className="w-1/3">
          <Input type="number" name="age_criterior__maximum_age" required />
        </div>
        <Input name="age_criterior__age_relaxation" required />
      </div>
      <Input name="age_criterior__other_age_limits" required />
    </div>
  </>
);

export const Eligibility = () => {
  const { eligibility__minimun_qualification } = useAdminExamData();
  return (
    <>
      <Para
        className="w-auto text-center mt-4 mb-2"
        style={{ color: "var(--color-black)" }}
      >
        Eligibility{" "}
      </Para>
      <div className="flex gap-3">
        <div className="w-2/5">
          <Dropdown
            name="eligibility__minimun_qualification"
            dropdownData={eligibility__minimun_qualification}
            required
          />
        </div>
        <Input
          name="eligibility__other_qualification"
          placeholder="Eligibility Other Qualification"
        />
      </div>{" "}
    </>
  );
};

export const ImportantLinks = () => (
  <>
    <Para
      className="w-auto text-center mt-4 mb-2"
      style={{ color: "var(--color-black)" }}
    >
      Important Links
    </Para>
    <div className="flex flex-col gap-3">
      <Input name="important_links__apply_online" required />
      <Input name="important_links__download_notification" required />
      <Input name="important_links__official_website" required />
      <Input name="important_links__other" required />
      {/* <AddInput name="important_links-other"/> */}
    </div>{" "}
  </>
);

//other
const CreateFormOther = () => {
  return <div>CreateFormOther</div>;
};

export default CreateFormOther;
