import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    eventName: {type: String, required: true, unique: true},
    eventId: { type: String, required: true, unique: true },
    totalSeats: { type: Number, required: true },
    availableSeats: { 
      type: Number,  
      default: function () {
        return this.totalSeats;
      } 
    },
    reservationCount: {type: Number, default: 0},
    version: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;