import express from "express"
import eventRoutes from "./routes/Event.route.js"

const app = express();

app.use(express.json());

app.use("/api", eventRoutes);

app.get("/", (req, res) => {
    res.send("hello world");
})

export default app;