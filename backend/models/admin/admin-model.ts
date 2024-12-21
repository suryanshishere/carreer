import mongoose, { Schema, Document } from "mongoose";
export interface IAdmin extends Document {
  email: string;
  status: "handlePublisher" | "handleApprover" | "ultimate" | "none";
  user: Schema.Types.ObjectId; // Reference to the user model
}

export const adminSchema: Schema = new Schema<IAdmin>(
  {
    //_id will be userid
    email: { type: String, required: true, unique: true, index: true },
    status: {
      type: String,
      default: "none",
      enum: ["handlePublisher", "handleApprover", "ultimate", "none"],
      required: true,
      index: true,
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference field
  },
  { timestamps: true }
);

const AdminModel = mongoose.model<IAdmin>("Admin", adminSchema);
export default AdminModel;
