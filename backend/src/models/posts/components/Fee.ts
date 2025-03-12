import { Model, Schema, model, Document } from "mongoose";
import { POST_LIMITS_DB } from "../db";

const { non_negative_num, short_char_limit } = POST_LIMITS_DB;

const numberObject = {
  type: Number,
  required: false,
  min: non_negative_num.min,
  max: non_negative_num.max,
};

const CategoryFeesSchema: Schema = new Schema<ICategoryFees>({
  general: numberObject,
  obc: numberObject,
  ews: numberObject,
  sc: numberObject,
  st: numberObject,
  ph_dviyang: numberObject,
});

const FeeSchema: Schema = new Schema<IFee>(
  {
    male: numberObject,
    female: numberObject,
    category_wise: CategoryFeesSchema,
    additional_resources: {
      type: String,
      required: true,
      minlength: short_char_limit.min,
      maxlength: short_char_limit.max,
    },
  },
  { timestamps: true }
);

const FeeModel: Model<IFee> = model<IFee>("Fee", FeeSchema);
export default FeeModel;

// -------------------

interface ICategoryFees {
  general?: number;
  obc?: number;
  ews?: number;
  sc?: number;
  st?: number;
  ph_dviyang?: number;
}

export interface IFee extends Document {
  male?: number;
  female?: number;
  category_wise: ICategoryFees;
  additional_resources: string;
}
