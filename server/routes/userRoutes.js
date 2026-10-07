import express from "express";
import User from "../models/User.js";

const router = express.Router();


// CREATE USER
router.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(200).json({
        message: "Welcome back",
        user: existingUser
      });
    }

    const user = await User.create({
      name,
      email
    });

    res.status(201).json({
      message: "User created",
      user
    });

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message
    });
  }
});


// GET USER
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      user
    });

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message
    });
  }
});


// SAVE ASSESSMENT
router.patch("/:id/assessment", async (req, res) => {
  try {
    const { score, total, level, answers } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        assessment: {
          score,
          total,
          level,
          answers: answers || []
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "Assessment saved",
      user
    });

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message
    });
  }
});


// UPDATE PROGRESS
router.patch("/:id/progress", async (req, res) => {
  try {
    const { progress, lessonsCompleted } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        progress,
        lessonsCompleted
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "Progress updated",
      user
    });

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message
    });
  }
});


// SAVE QUIZ RESULT
router.post("/:id/quiz", async (req, res) => {
  try {
    const { quizId, score, total, answers } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          quizzes: {
            quizId,
            score,
            total,
            answers: answers || []
          }
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "Quiz result saved",
      user
    });

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message
    });
  }
});


export default router;