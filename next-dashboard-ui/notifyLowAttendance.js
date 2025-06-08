import { prisma } from "../prisma";
import nodemailer from "nodemailer";

async function notifyLowAttendance() {
  const lowAttendanceThreshold = 0.75; // 75% attendance required

  // Fetch students with attendance records
  const studentsWithLowAttendance = await prisma.student.findMany({
    include: {
      attendances: true,
    },
  });

  // Calculate attendance percentage
  const studentsToNotify = studentsWithLowAttendance
    .map((student) => {
      const totalSessions = student.attendances.length;
      const attendedSessions = student.attendances.filter(
        (a) => a.present
      ).length;
      const attendancePercentage =
        totalSessions > 0 ? attendedSessions / totalSessions : 0;

      return {
        ...student,
        attendancePercentage,
      };
    })
    .filter((student) => student.attendancePercentage < lowAttendanceThreshold);

  // Configure Nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Notify students
  for (const student of studentsToNotify) {
    const mailOptions = {
      from: "immaturepentester@gmail.com",
      to: "aniketsharmaaksh@gmail.com",
      subject: "Low Attendance Alert",
      text: `Dear ${student.name} ${
        student.surname
      },\n\nYour current attendance is ${
        student.attendancePercentage * 100
      }%. Please take necessary actions to improve it.\n\nBest regards,\nSchool Management`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${student.email}`);
    } catch (error) {
      console.error(`Error sending email to ${student.email}:`, error);
    }
  }
}

notifyLowAttendance().catch(console.error);
