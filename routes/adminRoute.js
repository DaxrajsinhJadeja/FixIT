const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Fixer = require("../models/fixerModel");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/get-all-fixers", authMiddleware, async (req, res) => {
  try {
    const fixers = await Fixer.find({});
    res.status(200).send({
      message: "Fixers fetched successfully",
      success: true,
      data: fixers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error applying fixer account",
      success: false,
      error,
    });
  }
});

router.get("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({
      message: "Users fetched successfully",
      success: true,
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error applying fixer account",
      success: false,
      error,
    });
  }
});

router.post(
  "/change-fixer-account-status",
  authMiddleware,
  async (req, res) => {
    try {
      const { fixerId, status } = req.body;
      const fixer = await Fixer.findByIdAndUpdate(fixerId, {
        status,
      });

      const user = await User.findOne({ _id: fixer.userId });
      const unseenNotifications = user.unseenNotifications;
      unseenNotifications.push({
        type: "new-fixer-request-changed",
        message: `Your fixer account has been ${status}`,
        onClickPath: "/notifications",
      });
      user.isFixer = status === "approved" ? true : false;
      await user.save();

      res.status(200).send({
        message: "Fixer status updated successfully",
        success: true,
        data: fixer,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error applying fixer account",
        success: false,
        error,
      });
    }
  }
);

module.exports = router;
