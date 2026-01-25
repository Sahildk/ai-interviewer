import mongoose, { Schema, Document } from 'mongoose';

export interface IInterview extends Document {
  config: {
    type: string;
    difficulty: string;
    context: string;
  };
  history: {
    role: 'user' | 'model';
    parts: { text: string }[];
    timestamp: Date;
  }[];
  report: any;
  status: 'active' | 'completed';
}

const interviewSchema = new Schema<IInterview>({
  config: {
    type: { type: String, required: true },
    difficulty: { type: String, required: true },
    context: { type: String, required: true }
  },
  history: [{
    role: { type: String, enum: ['user', 'model'], required: true },
    parts: [{ text: { type: String, required: true } }],
    timestamp: { type: Date, default: Date.now }
  }],
  report: { type: Object, default: null },
  status: { type: String, enum: ['active', 'completed'], default: 'active' }
});

export default mongoose.models.Interview || mongoose.model<IInterview>('Interview', interviewSchema);
