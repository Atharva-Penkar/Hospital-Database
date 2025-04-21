import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import prisma from "./utils/prisma"

// Routers
import loginStaffRouter from "./routes/authStaff/loginStaff.routes";

import authRouter from "./routes/authPatient/authPatient.routes";
import patientRouter from "./routes/patient/patientHome.routes";
import patientInfoRouter from "./routes/patient/patientInfo.routes";
import createAppointmentsRouter from "./routes/appointments/createAppointments.routes";
import getAppointmentsRouter from "./routes/appointments/Appointments.routes";
import getDoctorsBySpecializationRouter from "./routes/doctors/getDoctors.routes";
import getSpecializationsRouter from "./routes/doctors/getSpecializations.routes";
import scheduleAppointmentRouter from "./routes/appointments/updateAppointments.routes";
import testsAvailableRouter from "./routes/testsAvailable/testsAvailable.routes";
import treatmentsAvailableRouter from "./routes/treatmentsAvailable/treatmentsAvailable.routes";
import doctorInfoRouter from "./routes/doctorSnehal/doctorInfo.routes";
// import getAdmitRequestedAdmissionsRouter from "./routes/admissions/getAdmitRequestedAdmissions.routes";
// import getDischargeRequestedAdmissionsRouter from "./routes/admissions/getDischargeRequestedAdmissions.routes";
import admissionsRouter from "./routes/admissions/admissionsBASIC.routes";
// import roomRouter from "./routes/room/room.routes";
// import admitPatientRouter from "./routes/admissions/updateAR2AAdmissions.routes";

import doctorPendingAppointmentsRouter from "./routes/doctorSnehal/doctorPending.routes";
import doctorCompletedAppointmentsRouter from "./routes/doctorSnehal/doctorComplete.routes";
import doctorAdmittedPatientsRouter from "./routes/doctorSnehal/doctorAdmitted.routes";
import getAppointmentDetailsRouter from "./routes/appointments/getAppointmentDetails.routes";
import setAppointmentDetailsRouter from "./routes/appointments/setAppointmentDetails.routes";
import addAppointmentDetailsRouter from "./routes/appointments/addAppointmentDetails.routes";

import dbmanagerdoctor from "./routes/DBmanager/doctor.routes";
import dbtestavailable from "./routes/DBmanager/testavailable.routes";
import dbmanagerpatient from "./routes/DBmanager/patient.routes";

import testsPendingRouter from "./routes/tests/getTestsStatusPending.routes";
import testsRequestedRouter from "./routes/tests/getTestsStatusRequested.routes";
import testsCompletedRouter from "./routes/tests/getTestsStatusCompleted.routes";
import setTestResultsRouter from "./routes/tests/setTestsResults.routes";
import updateTestTimeAndStatusRouter from "./routes/tests/scheduleTest.routes";
import treatmentsRequestedRouter from "./routes/treatments/getTreatmentsStatusRequested.routes";
import treatmentsScheduledRouter from "./routes/treatments/getTreatmentsStatusScheduled.routes";
import updateTreatmentRouter from "./routes/treatments/scheduleTreatments.routes";

import getAdmitRequestsRouter from "./routes/admissionsSnehal/getAdmitRequests.routes";
import getDischargeRequestsRouter from "./routes/admissionsSnehal/getDischargeRequests.routes";
import admitPatientToRoomRouter from "./routes/admissionsSnehal/admitPatientToRoom.routes";
import dischargePatientFromRoomRouter from "./routes/admissionsSnehal/dischargePatientFromRoom.routes";
import getAllRoomsRouter from "./routes/admissionsSnehal/getAllRooms.routes";
import patientAppointmentsRouter from "./routes/patient/patientAppointments.routes";
import medicalHistoryRouter from "./routes/medical-history/medical-history.routes";
import logoutFDORouter from "./routes/authStaff/logoutFDO.routes";
import logoutDEORouter from "./routes/authStaff/logoutDEO.routes";
import logoutDARouter from "./routes/authStaff/logoutDA.routes";

dotenv.config();
const app = express();

const PORT = parseInt(process.env.PORT || "5000", 10);

// Middlewares
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://probable-parakeet-9vw4979p6q5c4x4-5173.app.github.dev",
    "https://effective-enigma-6jx7j47vvj635gqv-5173.app.github.dev",
    "https://improved-umbrella-6997vv74rqgpc59gx-5173.app.github.dev",
    "https://bug-free-zebra-7qw4vwr6jq5cwp6x-5173.app.github.dev",
    "https://special-spoon-q7wxq4pjqwrf4rrw-5173.app.github.dev",
    // Add any other frontend URLs you use
  ],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use("/api/staff-login", loginStaffRouter);
app.use("/api/auth-staff/logout/fdo", logoutFDORouter)
app.use("/api/auth-staff/logout/deo", logoutDEORouter)
app.use("/api/auth-staff/logout/da", logoutDARouter)

app.use("/api/auth-patient", authRouter);
app.use("/api/patient", patientRouter);
app.use("/api/patient-info", patientInfoRouter)
app.use("/api/appointments/patient", patientAppointmentsRouter)
app.use("/api/patient/medical-history", medicalHistoryRouter)

app.use("/api/appointments/request", createAppointmentsRouter)
app.use("/api/appointments", getAppointmentsRouter)
app.use("/api/appointments/schedule", scheduleAppointmentRouter)
app.use("/api/appointment-details", getAppointmentDetailsRouter)

app.use("/api/doctors/specialization", getDoctorsBySpecializationRouter)
app.use("/api/doctors/specializations", getSpecializationsRouter)

app.use("/api/tests-available", testsAvailableRouter)

app.use("/api/treatments-available", treatmentsAvailableRouter)

// app.use("/api/front-desk-operator/admissions", getAdmitRequestedAdmissionsRouter)
// app.use("/api/front-desk-operator/admissions", getDischargeRequestedAdmissionsRouter)
// app.use("/api/front-desk-operator/admissions/room", roomRouter)
// app.use("/api/front-desk-operator/admissions/admit", admitPatientRouter)

app.use("/api/front-desk-operator/tests/pending", testsPendingRouter)
app.use("/api/front-desk-operator/tests/requested", testsRequestedRouter)
app.use("/api/front-desk-operator/tests/schedule", updateTestTimeAndStatusRouter)

app.use("/api/front-desk-operator/treatments/requested", treatmentsRequestedRouter)
app.use("/api/front-desk-operator/treatments/scheduled", treatmentsScheduledRouter)
app.use("/api/front-desk-operator/treatments/schedule", updateTreatmentRouter)

app.use("/api/access/admissions", admissionsRouter)

app.use("/api/doctor-info", doctorInfoRouter)
app.use("/api/doctor-pending", doctorPendingAppointmentsRouter)
app.use("/api/doctor-completed", doctorCompletedAppointmentsRouter)
app.use("/api/doctor-admitted", doctorAdmittedPatientsRouter)
app.use("/api/appointment-details/set", setAppointmentDetailsRouter)
app.use("/api/appointment-details/add", addAppointmentDetailsRouter)

app.use("/api/tests-pending", testsPendingRouter)
app.use("/api/tests-completed", testsCompletedRouter)
app.use("/api/tests/set-results", setTestResultsRouter)

app.use("/api/front-desk-operator/admissions/admit-requests", getAdmitRequestsRouter)
app.use("/api/front-desk-operator/admissions/discharge-requests", getDischargeRequestsRouter)
app.use("/api/front-desk-operator/admissions/admit", admitPatientToRoomRouter)
app.use("/api/front-desk-operator/admissions/discharge", dischargePatientFromRoomRouter)
app.use("/api/front-desk-operator/admissions/rooms", getAllRoomsRouter)

app.get("/", (req, res) => {
  res.send("Hospital Management API is running");
});

app.use("/api/dbtest-available",dbtestavailable)
app.use("/api/dbdoctor-available",dbmanagerdoctor)
app.use("/api/dbpatient-available",dbmanagerpatient)

async function startServer() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to database");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    });

    // Optional: Keep-alive log to prevent Codespace from cleaning up
    setInterval(() => {
      console.log("🌀 Server is still alive...");
    }, 10000);

  } catch (err) {
    console.error("❌ Error starting server:", err);
    process.exit(1); // Exit if DB connection fails
  }
}

startServer();

// Graceful shutdown: disconnect Prisma on SIGINT (Ctrl+C) or SIGTERM (kill)
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
