import React from "react";
import { Date, Input, TextArea } from "shared/utilComponents/form/input/Input";
import { usePostAdminData } from "db/adminDb/post-admin-data";
import { Dropdown } from "shared/utilComponents/form/input/Dropdown";

const DirectForm = () => {
  const {
    post_code, postId
  } = usePostAdminData();

  return (
    <>
      <Input name="name_of_the_post" required />
      <TextArea name="name_of_the_post_(detail)" required />
      {/* <Dropdown
        // customInput
        dropdownData={exam_conducting_body}
        name="exam_conducting_body"
        required
      /> */}
      <div className="flex gap-3">
        <div className="w-3/4">
          {/* <Dropdown dropdownData={category} name="category" required /> */}
        </div>
        {/* <Dropdown dropdownData={post_code} name="exam_code" required /> */}
      </div>
      <div className="flex gap-3">
        {/* <Dropdown dropdownData={exam_level} name="exam_level" required />
        <Dropdown dropdownData={exam_mode} name="exam_mode" required /> */}
        <Input name="exam_frequency" type="number" required />
        <Input name="exam_duration" type="number" required />
      </div>
      <div className="flex gap-3">
        <div className="w-2/5">
          {/* <Dropdown name="job_type" dropdownData={job_type} required /> */}
        </div>
        <div className="w-3/5">
          {/* <Dropdown
            name="state_and_union_territory"
            dropdownData={state_and_union}
            required
          /> */}
        </div>
        <Input name="department" required />
      </div>
      {/* <Dropdown
        name="syllabus"
        multiple
        customInput
        dropdownData={syllabus}
        required
      /> */}
      <TextArea name="short_information" required />
    </>
  );
};

export default DirectForm;

