import express from "express";
import cors from "cors";
import journalRoutes from "./routes/journal.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/journal", journalRoutes);

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
