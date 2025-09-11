import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api";
import styles from "./Register.module.css";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState("");

  const onSubmit = async (data) => {
    setRegisterError("");
    try {
      const response = await api.post("/user/register", data);

      if (response.status === 201 || response.status === 200) {
        localStorage.setItem("username", data.username);
        navigate(`/dashboard/${data.username}`);
      }
    } catch (error) {
      console.error("Register error:", error);
      setRegisterError("Failed to register. Try again.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.heading}>Register</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              id="username"
              type="text"
              {...register("username", { required: "Username is required" })}
              className={styles.input}
              placeholder="Username"
            />
            {errors.username && (
              <p className={styles.error}>{errors.username.message}</p>
            )}
          </div>

          <div>
            <input
              id="email"
              type="email"
              {...register("email", { required: "Email is required" })}
              className={styles.input}
              placeholder="Email"
            />
            {errors.email && (
              <p className={styles.error}>{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              id="password"
              type="password"
              {...register("password", { required: "Password is required" })}
              className={styles.input}
              placeholder="Password"
            />
            {errors.password && (
              <p className={styles.error}>{errors.password.message}</p>
            )}
          </div>

          {registerError && <p className={styles.error}>{registerError}</p>}

          <button type="submit" className={styles.button} disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Sign Up"}
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
