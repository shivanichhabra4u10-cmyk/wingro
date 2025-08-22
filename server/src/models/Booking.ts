import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  coachId: mongoose.Types.ObjectId;
  coachName: string;
  userEmail: string;
  userName: string;
  phoneNumber?: string;
  date: Date;
  time: string;
  duration: number;
  sessionType: string;
  topic: string;
  notes?: string;
  adminComments?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema = new Schema(
  {
    coachId: { type: Schema.Types.ObjectId, ref: 'Coach', required: true },
    coachName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
    time: { type: String, required: true },
    duration: { type: Number, required: true },
    sessionType: { type: String, required: true },
    topic: { type: String, required: true },
    phoneNumber: { type: String },
    notes: { type: String },
    adminComments: { type: String },
    status: { type: String, default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.model<IBooking>('Booking', BookingSchema);
