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
    console.log("Form submitted:", data);

    try {
      // Correct API endpoint
      const response = await axios.post(`${API_BASE_URL}/user/login`, data);

      console.log("Backend response:", response.data);

      if (response.status === 200) {
        // Redirect to dashboard
        navigate(`/dashboard/${data.username}`);
      }
    } catch (error) {
      // More detailed error logging
      console.error(
        "Login error:",
        error.response?.data || error.message || error
      );
      setLoginError(
        error.response?.data?.message || "Invalid username or password."
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.heading}>Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              id="username"
              type="text"
              {...register("username", {
                required: "Username is required",
              })}
              className={styles.input}
              placeholder="Username"
            />
            {errors.username && (
              <p className={styles.error}>{errors.username.message}</p>
            )}
          </div>

          <div className={styles.inputWrapper}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
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
            {errors.password && (
              <p className={styles.error}>{errors.password.message}</p>
            )}
          </div>

          {loginError && <p className={styles.error}>{loginError}</p>}

          <button type="submit" className={styles.button}>
            {isSubmitting ? "Loading..." : "Sign In"}
          </button>
        </form>

        <p className={styles.footerText}>
          Don't have an account?{" "}
          <Link to="/register" className={styles.link}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
