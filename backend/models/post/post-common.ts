import mongoose, { Schema } from "mongoose";

const { ObjectId } = Schema.Types;

const createCommonDataModel = (name: string, schemaDefinition: Schema) => {
    const commonDataSchema = new Schema({
        createdBy: {type: ObjectId, ref: "User"},
        createdAt: { type: Date, default: Date.now },
        last_updated: { type: Date, default: Date.now },
        contributors: [{ type: ObjectId, ref: "User" }],
        post_code: { type: String, unique: true, required: true },
        name_of_the_post: { type: String, unique: true },
    });
  
    commonDataSchema.add(schemaDefinition);
  
    return mongoose.model(name, commonDataSchema);
  };

  export default createCommonDataModel