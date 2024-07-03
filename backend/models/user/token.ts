import mongoose, { Schema, Document } from "mongoose";

export interface IToken extends Document {
  userId: mongoose.Types.ObjectId;
  token: string; // Change type to string
  createdAt: Date;
}

const tokenSchema: Schema<IToken> = new Schema<IToken>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  token: { type: String, required: true }, // Change type to String
  createdAt: { type: Date, default: Date.now, expires: 180 },
});


const Token = mongoose.model<IToken>("Token", tokenSchema);
export default Token;
