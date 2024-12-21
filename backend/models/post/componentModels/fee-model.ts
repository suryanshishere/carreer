import mongoose, { Schema, Types } from "mongoose";

interface ICategoryFees extends Document {
  general?: number;
  obc?: number;
  ews?: number;
  sc?: number;
  st?: number;
  ph_dviyang?: number;
}

interface IFee extends Document {
  createdAt: Date;
  updatedAt: Date;
  created_by: Types.ObjectId;
  contributors?: Types.ObjectId[];
  approved: boolean;

  male?: number;
  female?: number;
  category_wise?: ICategoryFees;

  additional_resources?: string;
}

const CategoryFeesSchema: Schema = new Schema<ICategoryFees>({
  general: { type: Number },
  obc: { type: Number },
  ews: { type: Number },
  sc: { type: Number },
  st: { type: Number },
  ph_dviyang: { type: Number },
});

const FeeSchema: Schema = new Schema<IFee>(
  {
    created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
    contributors: [{ type: Schema.Types.ObjectId, ref: "User" }],
    approved: { type: Boolean, default: false, required: true },

    male: { type: Number },
    female: { type: Number },
    category_wise: CategoryFeesSchema,

    additional_resources: { type: String },
  },
  { timestamps: true }
);

const FeeModel = mongoose.model<IFee>("Fee", FeeSchema);

export default FeeModel;
