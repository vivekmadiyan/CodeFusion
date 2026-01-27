import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import axios from "axios";
import styles from "./Register.module.css";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

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
        `${API_BASE_URL}/user/register`,
        data
      );

      if (response.status === 201 || response.status === 200) {
        navigate("/login");
      } else {
        setUsernameError("Unexpected response from server.");
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setUsernameError("Username already exists");
      } else {
        setUsernameError(
          error.response?.data?.msg ||
            "Something went wrong. Try again."
        );
      }
    }
  };

  useEffect(() => {
    if (username) setUsernameError("");
  }, [username]);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <UserPlus size={36} />
          <h2>Create Account</h2>
          <p>Join CodeFusion and start collaborating</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Username */}
          <div className={styles.field}>
            <input
              type="text"
              placeholder="Username"
              {...register("username", {
                required: "Username is required",
                validate: {
                  lowercase: (value) =>
                    /^[a-z0-9]+$/.test(value) ||
                    "Use lowercase letters and numbers only",
                },
              })}
            />
            {errors.username && (
              <span className={styles.error}>
                {errors.username.message}
              </span>
            )}
            {usernameError && (
              <span className={styles.error}>{usernameError}</span>
            )}
          </div>

          {/* Password */}
          <div className={styles.field}>
            <div className={styles.passwordBox}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Minimum 8 characters required",
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <span className={styles.error}>
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className={styles.field}>
            <div className={styles.passwordBox}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className={styles.error}>
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Create Account"}
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account?{" "}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
