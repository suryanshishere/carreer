import { useState } from "react";
import PostEditable from ".";

type FieldItem = {
  id: number;
  keyProp: string;
  valueProp: string | number;
};

type PostEditableListProps = {
  initialItems?: FieldItem[];
};

const PostEditableList: React.FC<PostEditableListProps> = ({
  initialItems = [],
}) => {
  // Initialize with given items or with one blank field.
  const [fields, setFields] = useState<FieldItem[]>(
    initialItems.length > 0
      ? initialItems
      : [{ id: Date.now(), keyProp: "", valueProp: "" }]
  );

  const addField = () => {
    setFields((prev) => [...prev, { id: Date.now(), keyProp: "", valueProp: "" }]);
  };

  const removeField = (id: number) => {
    setFields((prev) => prev.filter((field) => field.id !== id));
  };

  return (
    <div className="flex flex-col gap-3">
      {fields.map((field, index) => (
        <PostEditable
          key={field.id}
          keyProp={initialItems[0].keyProp}
          valueProp={field.valueProp}
          genKey
          onSaved={() => {
            if (index === fields.length - 1) {
              addField();
            }
          }}
          onRemove={() => removeField(field.id)}
        />
      ))}
    </div>
  );
};

export default PostEditableList;
