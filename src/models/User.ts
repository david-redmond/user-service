import { Model, Schema, model } from "mongoose";

interface IUser {
  firstname: string;
  surname: string;
  email: string;
  password?: string;
  provider: string;
  attributes: { [key: string]: any };
}

interface UserModel extends Model<IUser> {
  // myStaticMethod(): number;
}

const userSchema = new Schema<IUser, UserModel>({
  firstname: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    required: true,
  },
  attributes: {
    type: Object,
    required: true
  },
}, { minimize: false });

const User = model<IUser, UserModel>("Users", userSchema);

export { User };
