const express = require("express");
const router = express.Router();
const Fixer = require("../models/fixerModel");
const authMiddleware = require("../middlewares/authMiddleware");
const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel");

router.post("/get-fixer-info-by-user-id", authMiddleware, async (req, res) => {
  try {
    const fixer = await Fixer.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "Fixer info fetched successfully",
      data: fixer,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error getting fixer info", success: false, error });
  }
});

router.post("/get-fixer-info-by-id", authMiddleware, async (req, res) => {
  try {
    const fixer = await Fixer.findOne({ _id: req.body.fixerId });
    res.status(200).send({
      success: true,
      message: "Fixer info fetched successfully",
      data: fixer,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error getting fixer info", success: false, error });
  }
});

router.post("/update-fixer-profile", authMiddleware, async (req, res) => {
  try {
    const fixer = await Fixer.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(200).send({
      success: true,
      message: "Fixer profile updated successfully",
      data: fixer,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error getting fixer info", success: false, error });
  }
});

router.get(
  "/get-appointments-by-fixer-id",
  authMiddleware,
  async (req, res) => {
    try {
      const fixer = await Fixer.findOne({ userId: req.body.userId });
      const appointments = await Appointment.find({ fixerId: fixer._id });
      res.status(200).send({
        message: "Appointments fetched successfully",
        success: true,
        data: appointments,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error fetching appointments",
        success: false,
        error,
      });
    }
  }
);

router.post("/change-appointment-status", authMiddleware, async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(appointmentId, {
      status,
    });

    const user = await User.findOne({ _id: appointment.userId });
    const unseenNotifications = user.unseenNotifications;
    unseenNotifications.push({
      type: "appointment-status-changed",
      message: `Your appointment status has been ${status}`,
      onClickPath: "/appointments",
    });

    await user.save();

    res.status(200).send({
      message: "Appointment status updated successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error changing appointment status",
      success: false,
      error,
    });
  }
});

module.exports = router;
