// console.log("Starting low attendance notification process...");

// import { prisma } from "../prisma";
// import nodemailer from "nodemailer";

// async function notifyLowAttendance() {
//   try {
//     const lowAttendanceThreshold = 0.75; // 75% attendance required

//     console.log("Fetching students with attendance records...");
//     // Fetch students with attendance records
//     const studentsWithLowAttendance = await prisma.student.findMany({
//       include: {
//         attendances: true,
//       },
//     });

//     console.log(`Fetched ${studentsWithLowAttendance.length} students`);

//     // Calculate attendance percentage
//     const studentsToNotify = studentsWithLowAttendance
//       .map((student) => {
//         const totalSessions = student.attendances.length;
//         const attendedSessions = student.attendances.filter(
//           (a) => a.present
//         ).length;
//         const attendancePercentage =
//           totalSessions > 0 ? attendedSessions / totalSessions : 0;

//         return {
//           ...student,
//           attendancePercentage,
//         };
//       })
//       .filter(
//         (student) => student.attendancePercentage < lowAttendanceThreshold
//       );

//     console.log(
//       `Found ${studentsToNotify.length} students with low attendance`
//     );

//     // Configure Nodemailer
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     console.log("Sending emails to students...");

//     // Notify students
//     for (const student of studentsToNotify) {
//       const mailOptions = {
//         from: "immaturepentester@gmail.com",
//         to: "aniketsharmaaksh@gmail.com", // Use student.email here
//         subject: "Low Attendance Alert",
//         text: `Dear ${student.name} ${
//           student.surname
//         },\n\nYour current attendance is ${
//           student.attendancePercentage * 100
//         }%. Please take necessary actions to improve it.\n\nBest regards,\nSchool Management`,
//       };

//       try {
//         await transporter.sendMail(mailOptions);
//         console.log(`Email sent to ${student.email}`);
//       } catch (error) {
//         console.error(`Error sending email to ${student.email}:`, error);
//       }
//     }
//   } catch (error) {
//     console.error("Error in notifyLowAttendance function:", error);
//   }
// }

// notifyLowAttendance().catch(console.error);

require("dotenv").config();
const nodemailer = require("nodemailer");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function notifyLowAttendance() {
  const lowAttendanceThreshold = 0.75; // 75% attendance required

  try {
    console.log("Fetching students with attendance records...");

    // Fetch students and their attendance records
    const studentsWithAttendance = await prisma.student.findMany({
      include: {
        attendances: true, // Include the related attendance records
      },
    });

    console.log(`Fetched ${studentsWithAttendance.length} students.`);

    // Calculate attendance percentage and filter low attendance students
    const studentsToNotify = studentsWithAttendance
      .map((student) => {
        const totalSessions = student.attendances.length;
        const attendedSessions = student.attendances.filter(
          (attendance) => attendance.present
        ).length;
        const attendancePercentage =
          totalSessions > 0 ? attendedSessions / totalSessions : 0;

        return {
          ...student,
          attendancePercentage,
        };
      })
      .filter(
        (student) => student.attendancePercentage < lowAttendanceThreshold
      );

    console.log(
      `Found ${studentsToNotify.length} students with low attendance.`
    );

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send emails to students with low attendance
    for (const student of studentsToNotify) {
      if (!student.email) {
        console.warn(`Student ${student.name} has no email address.`);
        continue;
      }

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: student.email, // Dynamic recipient email
        subject: "Low Attendance Alert",
        text: `Dear ${student.name} ${
          student.surname
        },\n\nYour current attendance is ${
          student.attendancePercentage * 100
        }%. Please take necessary actions to improve it.\n\nBest regards,\nSchool Management`,
      };

      console.log(`Sending email to ${student.email}...`);

      try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${student.email}`);
      } catch (error) {
        console.error(`Error sending email to ${student.email}:`, error);
      }
    }
  } catch (error) {
    console.error("Error in notifyLowAttendance:", error);
  } finally {
    // Ensure Prisma disconnects after script execution
    await prisma.$disconnect();
  }
}

notifyLowAttendance().catch((error) => {
  console.error("Unhandled error:", error);
});
