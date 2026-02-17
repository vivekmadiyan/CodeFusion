import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import axios from "axios";
import styles from "./Login.module.css";

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

  const onSubmit = async (data) => {
    setLoginError("");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/user/login`,
        data
      );

      if (response.status === 200) {

        // 🔐 STORE JWT TOKEN
        localStorage.setItem("token", response.data.token);

        // Navigate after storing token
        navigate(`/dashboard/${data.username}`);
      }
    } catch (error) {
      setLoginError(
        error.response?.data?.message ||
          "Invalid username or password."
      );
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <LogIn size={36} />
          <h2>Welcome Back</h2>
          <p>Login to continue to CodeFusion</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Username */}
          <div className={styles.field}>
            <input
              type="text"
              placeholder="Username"
              {...register("username", {
                required: "Username is required",
              })}
            />
            {errors.username && (
              <span className={styles.error}>
                {errors.username.message}
              </span>
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

          {loginError && (
            <div className={styles.errorBox}>{loginError}</div>
          )}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className={styles.footer}>
          Don&apos;t have an account?{" "}
          <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
