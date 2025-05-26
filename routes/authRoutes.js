import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { check, validationResult } from 'express-validator';
const registerValidation = [
  // Common validations
  check("username", "Username is required").not().isEmpty(),
  check("username", "Username must be at least 3 characters").isLength({
    min: 3,
  }),
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password must be at least 6 characters").isLength({
    min: 6,
  }),
  check("phoneNumber", "Phone number is required").not().isEmpty(),

  // Custom validation for user type specific fields
  (req, res, next) => {
    const { userType } = req.body;

    if (userType === "assistant") {
      const assistantValidations = [
        check("experience", "Experience is required").not().isEmpty(),
        check(
          "specializations",
          "At least one specialization is required"
        ).isArray({ min: 1 }),
        check("availability", "Availability information is required").isArray({
          min: 1,
        }),
      ];

      Promise.all(assistantValidations.map((validation) => validation.run(req)))
        .then(() => next())
        .catch((err) => next(err));
    } else if (userType === "customer") {
      const customerValidations = [
        check("age", "Age is required").not().isEmpty(),
        check("emergencyContact", "Emergency contact information is required")
          .not()
          .isEmpty(),
        check(
          "assistanceNeeded",
          "At least one type of assistance needed is required"
        ).isArray({ min: 1 }),
      ];

      Promise.all(customerValidations.map((validation) => validation.run(req)))
        .then(() => next())
        .catch((err) => next(err));
    } else {
      next();
    }
  },
];

const router = express.Router();
router.post("/register", registerValidation, registerUser);

router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  loginUser
);

export default router;
