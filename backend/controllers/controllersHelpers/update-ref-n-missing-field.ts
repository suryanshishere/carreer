import mongoose, { Schema, Document, Types } from "mongoose";

const updateMissingFields = (
  schema: Schema,
  selectedPost: Document,
  postId: string
): { updatedPost: Document; missingFields: string[] } => {
  // Get all schema paths excluding system fields like '_id' and '__v'
  const schemaFields = Object.keys(schema.paths).filter(
    (key) =>
      !["_id", "__v", "createdAt", "updatedAt"].includes(key)
  );

  const schemaPaths = schema.paths;

  // Reference fields with `ref` option
  const referenceFields = schemaFields.filter(
    (field) => schemaPaths[field].options.ref
  );

  // Identify missing fields that are undefined in the selected post
  let missingFields = schemaFields.filter(
    (field) => selectedPost.get(field) === undefined
  );

  // Automatically assign postId to missing reference fields
  referenceFields.forEach((field) => {
    if (missingFields.includes(field)) {
      selectedPost.set(field, new Types.ObjectId(postId)); // Assign Types.ObjectId from postId
      missingFields = missingFields.filter((missingField) => missingField !== field); // Remove the reference field from missingFields
    }
  });

  // Recalculate missing fields after updating reference fields
  missingFields = schemaFields.filter(
    (field) =>
      selectedPost.get(field) === undefined && !referenceFields.includes(field)
  );

  return {
    updatedPost: selectedPost,
    missingFields,
  };
};

export default updateMissingFields;
