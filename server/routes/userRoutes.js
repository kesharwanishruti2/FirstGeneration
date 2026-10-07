import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();


// SIGNUP / REGISTER USER
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required."
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long."
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists. Please log in instead."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword
    });

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      message: "Account created successfully!",
      user: userObj
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error during registration",
      error: error.message
    });
  }
});

// Alias /register -> same as /signup
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required."
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists. Please log in instead."
      });
    }

    let hashedPassword = "";
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword
    });

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      message: "Account created successfully!",
      user: userObj
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error during registration",
      error: error.message
    });
  }
});


// LOGIN USER
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required."
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        message: "No account found with this email. You must register first before logging in.",
        notRegistered: true
      });
    }

    // Verify password
    if (user.password) {
      const isMatch = await bcrypt.compare(password, user.password).catch(() => false);
      const isPlainMatch = user.password === password;

      if (!isMatch && !isPlainMatch) {
        return res.status(401).json({
          message: "Incorrect password. Please check your password and try again."
        });
      }
    } else {
      return res.status(400).json({
        message: "Account does not have a password configured. Please sign up again to set a password.",
        notRegistered: true
      });
    }

    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({
      message: "Welcome back!",
      user: userObj
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error during login",
      error: error.message
    });
  }
});


// CREATE / GET EXISTING USER (FALLBACK FOR LEGACY COMPATIBILITY)
router.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required"
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      const userObj = existingUser.toObject();
      delete userObj.password;
      return res.status(200).json({
        message: "Welcome back",
        user: userObj
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail
    });

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      message: "User created",
      user: userObj
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
        returnDocument: "after",
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
        returnDocument: "after",
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
        returnDocument: "after",
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