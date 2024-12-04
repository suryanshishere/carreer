import mongoose, { ObjectId, Schema, Types } from "mongoose";

interface ICategoryFees extends Document {
  general?: number;
  obc?: number;
  ews?: number;
  sc?: number;
  st?: number;
  "ph_(dviyang)"?: number;
}

interface IFee extends Document {
  createdAt: Date;
  updatedAt: Date;
  created_by: ObjectId;
  contributors?: ObjectId[];
  approved: boolean;
  male?: ICategoryFees;
  female?: ICategoryFees;
  other?: ICategoryFees;
  additional_resources?: string;
}

const CategoryFeesSchema: Schema = new Schema<ICategoryFees>({
  general: { type: Number },
  obc: { type: Number },
  ews: { type: Number },
  sc: { type: Number },
  st: { type: Number },
  "ph_(dviyang)": { type: Number },
});

const FeeSchema: Schema = new Schema<IFee>(
  {
    created_by: { type: Types.ObjectId, ref: "User", required: true },
    contributors: [{ type: Types.ObjectId, ref: "User" }],
    approved: { type: Boolean, default: false, required: true },
    male: { type: CategoryFeesSchema },
    female: { type: CategoryFeesSchema },
    other: { type: CategoryFeesSchema },
    additional_resources: { type: String },
  },
  { timestamps: true }
);

const FeeDetailsModel = mongoose.model<IFee>("Fee", FeeSchema);

export default FeeDetailsModel;
