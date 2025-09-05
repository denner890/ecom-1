import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash?: string;
  role: 'user' | 'admin';
  provider: 'local' | 'google' | 'firebase';
  firebaseUid?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;

  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: function (this: IUser) {
        return this.provider === 'local';
      },
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
      ],
    },
    passwordHash: {
      type: String,
      required: function (this: IUser) {
        return this.provider === 'local';
      },
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    provider: {
      type: String,
      enum: ['local', 'google', 'firebase'], // ✅ added firebase
      default: 'local',
    },
    firebaseUid: {
      type: String,
      unique: true,
      sparse: true,
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret) {
        (ret as any).passwordHash = undefined;
        return ret;
      },
    },
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ firebaseUid: 1 });

// Password hashing middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    if (typeof this.passwordHash === 'string') {
      this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.passwordHash) return false;
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function (): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in the environment variables.');
  }

  const expiresIn: string = process.env.JWT_EXPIRE || '7d';

  const options: SignOptions = {
    expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
  };

  return jwt.sign(
    { userId: this._id, role: this.role },
    secret,
    options
  );
};

const UserModel = mongoose.model<IUser>('User', userSchema);

export const User = UserModel;
