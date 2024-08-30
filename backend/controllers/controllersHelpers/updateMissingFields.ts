import mongoose, { Schema, Document } from "mongoose";

const updateMissingFields = (
    schema: Schema,
    selectedPost: Document,
    postId: string
  ): { updatedPost: Document; missingFields: string[] } => {
    // Get schema fields excluding '_id' and '__v'
    const schemaFields = Object.keys(schema.paths).filter(
      (key) => key !== "_id" && key !== "__v"
    );
  
    const schemaPaths = schema.paths;
  
    // Identify reference fields
    const referenceFields = schemaFields.filter((field) => !!schemaPaths[field].options.ref);
  
    // Find fields that are undefined in the selected post
    let missingFields = schemaFields.filter((field) => selectedPost.get(field) === undefined);
  
    // Update missing reference fields with postId
    missingFields.forEach((field) => {
      if (referenceFields.includes(field)) {
        selectedPost.set(field, postId); // Set missing reference field to postId
      }
    });
  
    // Recalculate missing fields excluding reference fields
    missingFields = schemaFields.filter(
      (field) => selectedPost.get(field) === undefined && !referenceFields.includes(field)
    );
  
    return {
      updatedPost: selectedPost,
      missingFields,
    };
  };
  
  export default updateMissingFields;