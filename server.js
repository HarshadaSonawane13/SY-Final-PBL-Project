import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "borcelle",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to database");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/app.html");
});

app.post("/bookAppointment", (req, res) => {
  const { doctor, time, patient } = req.body;
  const appointmentTime = new Date(time)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  const sql = `INSERT INTO appointments (doctor_id, appointment_time, patient_name) VALUES (?, ?, ?)`;
  db.query(sql, [doctor, appointmentTime, patient], (err, result) => {
    if (err) {
      console.log(err);
      res.send("Time slot has been already booked");
    } else {
      console.log(" Offline Appointment booked successfully");
      res.send("Offline Appointment booked successfully");
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
