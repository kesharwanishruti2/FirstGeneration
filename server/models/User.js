import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    assessment: {
      score: {
        type: Number,
        default: 0
      },

      total: {
        type: Number,
        default: 0
      },

      level: {
        type: String,
        default: "Not assessed"
      },

      answers: [
        {
          question: String,
          selectedOption: String,
          correctOption: String,
          isCorrect: Boolean
        }
      ]
    },

    progress: {
      type: Number,
      default: 0
    },

    lessonsCompleted: {
      type: Number,
      default: 0
    },

    quizzes: [
      {
        quizId: String,
        score: Number,
        total: Number,
        answers: [
          {
            question: String,
            selectedOption: String,
            correctOption: String,
            isCorrect: Boolean
          }
        ],
        attemptedAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

export default User;