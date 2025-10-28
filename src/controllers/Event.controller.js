import mongoose from "mongoose";
import Event from "../models/Event.model.js";
import Reservation from "../models/Reservation.model.js";
import { v4 as uuidv4 } from "uuid";

export const bookReservation = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { eventName, eventId, seats } = req.body;

        // Basic validation
        if (!eventId || !seats || !eventName) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        if (typeof seats !== "number" || seats <= 0 || seats > 10) {
            return res
            .status(400)
            .json({ error: "Seats must be an integer between 1 and 10" });
        }

        // Check if event exists & has enough seats atomically
        const event = await Event.findOneAndUpdate(
            { eventId, availableSeats: { $gte: seats } },
            {
                $inc: { availableSeats: -seats, reservationCount: seats, version: 1 },
            },
            { new: true, session }
        );

        // If event not found or not enough seats
        if (!event) {
            await Reservation.create(
                [
                    {
                        reservationId: uuidv4(),
                        eventId,
                        seats,
                        status: "declined",
                    },
                ],
                { session }
        );

        await session.abortTransaction();
        session.endSession();
        return res.status(409).json({ error: "Not enough seats left" });
        }

        // Create reservation
        const reservation = await Reservation.create(
        [
            {
                reservationId: uuidv4(),    
                eventId,
                seats,
                status: "confirmed",
            },
        ],
        { session }
        );

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
        message: "Reservation successful",
        reservation: reservation[0],
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
};

export const cancelReservation = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { reservationId } = req.params;

        if (!reservationId) {
        return res.status(400).json({ error: "Missing reservationId" });
        }

        // 1️⃣ Find the reservation using ID
        const reservation = await Reservation.findOne({
        reservationId,
        status: "confirmed",
        }).session(session);

        if (!reservation) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ error: "Reservation not found or already cancelled" });
        }

        // 2️⃣ Extract eventId from reservation
        const { eventId, seats } = reservation;

        // 3️⃣ Atomically update event seats
        const event = await Event.findOneAndUpdate(
            { eventId },
            {
                $inc: {
                availableSeats: seats,
                reservationCount: -seats,
                version: 1,
                },
            },
            { new: true, session }
        );

        if (!event) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ error: "Event not found" });
        }

        // 4️⃣ Update reservation status
        reservation.status = "cancelled";
        await reservation.save({ session });

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
        message: "Reservation cancelled successfully",
        updatedEvent: {
            eventId: event.eventId,
            availableSeats: event.availableSeats,
            reservationCount: event.reservationCount,
        },
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
};



export const eventDetails = async (req, res) => {
    try {
        const { eventId } = req.body;

        if (!eventId) {
        return res.status(400).json({ error: "Missing eventId" });
        }

        const event = await Event.findOne({ eventId });

        if (!event) {
        return res.status(404).json({ error: "Event not found" });
        }

        return res.status(200).json({
        message: "Event details fetched successfully",
        event,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
};


export const createEvent = async (req, res) => {
  try {
    const { eventName, eventId, totalSeats } = req.body;

    if (!eventName || !eventId || !totalSeats) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const existing = await Event.findOne({ eventId });
    if (existing) {
      return res.status(409).json({
        error: "Event with this ID already exists",
      });
    }

    const event = await Event.create({
      eventName,
      eventId,
      totalSeats,
      availableSeats: totalSeats, 
      reservedCount: 0,
      version: 1,
    });

    return res.status(201).json({
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
