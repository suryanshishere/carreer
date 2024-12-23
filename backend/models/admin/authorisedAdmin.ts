import mongoose from "mongoose";

const { Schema, model } = mongoose;
const { Types.ObjectId } = Schema.Types;

export const authorisedAdminSchema = new Schema({
    _id: {
      type: Schema.Types.ObjectId,
      ref: "User", // Replace "User" with the name of your user model
      required: true,
    },
    // You can add other fields specific to the authorized admin here
  }, { _id: false }); // Disables the automatic generation of _id

const AuthorisedAdmin = model("AuthorisedAdmin", authorisedAdminSchema);
export default AuthorisedAdmin;
