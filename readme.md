# 🎟️ Event Reservation System

A simple Node.js + Express-based API for managing **event seat reservations**.  
Supports dynamic seat management, conflict handling, and automatic rollback on declined bookings.

---

## 🚀 Features
- Create and manage events dynamically  
- Book and decline reservations based on seat availability  
- Prevent overbooking with concurrency-safe checks  
- Auto-rolls back seat counts when a reservation fails  
- Clean modular structure using controllers, models, and routes  

---

## 🗂️ Project Structure

```
.
├── src/
│   ├── models/
│   │   ├── Event.model.js
│   │   └── Reservation.model.js
│   ├── controllers/
│   │   |__ Event.controller.js
│   ├── routes/
│   │   |__ Event.route.js
│   |__ app.js
|   |__ server.js
├── package.json
├── .env
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/ticket-reservation-system.git
cd event-reservation-system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```
PORT=5000
MONGO_URI=mongodb+srv://<your_mongo_connection>
```

### 4. Run the Server
```bash
npm start
```

Server runs on:
👉 [http://localhost:5000](http://localhost:5000)

---

## 📘 API Documentation

### **1. Create Event**

**POST** `/api/events/create`

**Body:**
```json
{
  "eventName": "Concert Night",
  "eventId": "E123",
  "totalSeats": 50
}
```

**Response:**
```json
{
  "_id": "671a9b9e...",
  "eventName": "Concert Night",
  "eventId": "E123",
  "totalSeats": 50,
  "availableSeats": 50
}
```

---

### **2. Book Reservation**

**POST** `/api/reservations/book`

**Body:**
```json
{
  "partnerId": "E123",
  "email": "user@example.com",
  "seats": 3
}
```

✅ **Success Response (201):**
```json
{
  "reservationId": "e85f-4f2d-...-34b2",
  "partnerId": "E123",
  "seats": 3,
  "status": "confirmed"
}
```

❌ **Declined Response (409):**
```json
{
  "error": "Not enough seats left",
  "reservation": {
    "email": "user@example.com",
    "partnerId": "E123",
    "seats": 3,
    "status": "declined"
  }
}
```

---

### **3. Cancel Reservation**

**DELETE** `/api/reservations/cancel`

**Body:**
```json
{
  "email": "user@example.com",
  "partnerId": "E123"
}
```

**Response:**
```json
{
  "message": "Reservation cancelled successfully, seats restored."
}
```

---

### **4. Get All Events**

**GET** `/api/events`

**Response:**
```json
[
  {
    "eventName": "Concert Night",
    "eventId": "E123",
    "availableSeats": 47
  }
]
```

---

## 🧠 Technical Decisions

### Architecture
- **MVC structure** for clear separation of concerns.
- **Mongoose ODM** for schema validation and MongoDB interaction.
- **Atomic seat updates** to prevent race conditions in concurrent bookings.
- **UUID-based reservation IDs** for unique tracking.

### Storage
- **MongoDB Atlas** used for scalable and flexible event + reservation storage.
- **Event collection** tracks seat counts and versions.
- **Reservation collection** maintains booking history and status.

### Assumptions
- Each user can book multiple events using the same email.
- Seats per booking limited to `1–10`.
- Once declined, seats are automatically released for others.



---

## 🧑‍💻 Author

**Ujjwal Dobliyal**  
Full Stack Developer | Backend Focused  
📧 [45ujjwal@gmail.com](mailto:youremail@example.com)

---

## 🛡️ License

MIT License © 2025 Ujjwal Dobliyal