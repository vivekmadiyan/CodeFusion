import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import styles from "./Login.module.css";

// Backend URL from env
const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    console.log("Login component mounted");
  }, []);

  const onSubmit = async (data) => {
    setLoginError("");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/user/login`,
        data
      );

      if (response.status === 200) {
        // 🔥 IMPORTANT FIX
        // Clear old user/editor data (recoil-persist, code editor, etc.)
        localStorage.clear();

        // Navigate to user dashboard
        navigate(`/dashboard/${data.username}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(
        error.response?.data?.message ||
          "Invalid username or password."
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.heading}>Login</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Username */}
          <div>
            <input
              type="text"
              placeholder="Username"
              className={styles.input}
              {...register("username", {
                required: "Username is required",
              })}
            />
            {errors.username && (
              <p className={styles.error}>
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className={styles.inputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={styles.input}
              {...register("password", {
                required: "Password is required",
              })}
            />
            <button
              type="button"
              className={styles.toggleButton}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
            {errors.password && (
              <p className={styles.error}>
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Error */}
          {loginError && (
            <p className={styles.error}>{loginError}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className={styles.button}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Loading..." : "Sign In"}
          </button>
        </form>

        <p className={styles.footerText}>
          Don&apos;t have an account?{" "}
          <Link to="/register" className={styles.link}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
