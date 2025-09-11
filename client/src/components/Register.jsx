import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import styles from "./Register.module.css";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const username = watch("username");
  const password = watch("password");

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/user/register",
        data
      );

      if (response.status === 201 || response.status === 200) {
        navigate("/login");
      } else {
        setUsernameError("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Error during registration:", error);

      if (error.response) {
        if (error.response.status === 409) {
          setUsernameError("Username already exists");
        } else if (error.response.data?.msg) {
          setUsernameError(error.response.data.msg);
        } else {
          setUsernameError("Something went wrong on the server");
        }
      } else if (error.request) {
        setUsernameError("No response from server. Check your network.");
      } else {
        setUsernameError("Error: " + error.message);
      }
    }
  };

  useEffect(() => {
    if (username) {
      setUsernameError("");
    }
  }, [username]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.heading}>Create your account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <input
              id="username"
              type="text"
              {...register("username", {
                required: "Username is required",
                validate: {
                  lowercase: (value) =>
                    /^[a-z0-9]+$/.test(value) ||
                    "Use lowercase letters and numbers only",
                },
              })}
              className={styles.input}
              placeholder="Username"
            />
            {errors.username && (
              <p className={styles.error}>{errors.username.message}</p>
            )}
            {usernameError && (
              <p className={styles.error}>{usernameError}</p>
            )}
          </div>

          <div>
            <div className={styles.passwordContainer}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Minimum 8 characters required",
                  },
                })}
                className={styles.input}
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.toggleButton}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.password && (
              <p className={styles.error}>{errors.password.message}</p>
            )}
          </div>

          <div>
            <div className={styles.passwordContainer}>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                className={styles.input}
                placeholder="Confirm Password"
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className={styles.toggleButton}
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className={styles.error}>{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.button}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        <p className={styles.footerText}>
          Already have an account?{" "}
          <Link to="/login" className={styles.link}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
