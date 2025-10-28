import express from "express";
import { bookReservation, cancelReservation, eventDetails, createEvent } from "../controllers/Event.controller.js";

const router = express.Router();

router.post("/events", createEvent)

// Book a reservation
router.post("/reservations", bookReservation);

// Cancel a reservation
router.delete("/reservations/:reservationId", cancelReservation);

// Event summary (details)
router.get("/showBookings", eventDetails);

export default router;