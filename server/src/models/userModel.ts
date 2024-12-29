import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string;
  company?: string;
  blog?: string;
  location?: string;
  email?: string;
  bio?: string;
  public_repos: number;
  followers: string[];
  following: string[];
  created_at: Date;
  updated_at: Date;
  friends?: string[];
  isDeleted?: boolean;
  repos?: string[];
}

const UserSchema: Schema = new Schema(
  {
    login: { type: String, required: true, unique: true },
    id: { type: Number, required: true },
    avatar_url: { type: String, required: true },
    html_url: { type: String, required: true },
    name: { type: String, required: true },
    company: { type: String },
    blog: { type: String },
    location: { type: String },
    email: { type: String },
    bio: { type: String },
    public_repos: { type: Number, required: true },
    followers: { type: [String], default: [] },
    following: { type: [String], default: [] },
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true },
    friends: { type: [String], default: [] },
    isDeleted: { type: Boolean, default: false },
    repos: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>('User', UserSchema);
