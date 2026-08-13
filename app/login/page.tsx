"use client";

import { useState } from "react";
import Link from "next/link";

type FormErrors = {
  email: string;
  password: string;
};

const emptyErrors: FormErrors = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>(emptyErrors);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = () => {
    const nextErrors: FormErrors = { ...emptyErrors };
    let isValid = true;

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      nextErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.password) {
      nextErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(nextErrors);
    setServerError("");
    setSuccessMessage("");
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (serverError) {
      setServerError("");
    }

    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setServerError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401) {
          setErrors((prev) => ({
            ...prev,
            email: "Invalid email or password",
            password: "Invalid email or password",
          }));
          setServerError("Invalid email or password");
          return;
        }

        const backendErrors = data?.details as
          | Record<string, string[] | undefined>
          | undefined;

        if (backendErrors && typeof backendErrors === "object") {
          const nextErrors: FormErrors = { ...emptyErrors };

          (Object.keys(backendErrors) as Array<keyof FormErrors>).forEach((field) => {
            const fieldErrors = backendErrors[field];
            if (fieldErrors && fieldErrors.length > 0) {
              nextErrors[field] = fieldErrors[0];
            }
          });

          setErrors(nextErrors);
          setServerError("Please correct the highlighted fields and try again.");
          return;
        }

        setServerError(data?.error || "Something went wrong. Please try again.");
        return;
      }

      setFormData({ email: "", password: "" });
      setErrors(emptyErrors);
      setSuccessMessage("Login successful!");
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Login</h1>
        <p className="text-gray-600 mb-6 text-sm">
          Welcome back! Please sign in to continue.
        </p>

        {serverError && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {serverError}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
}
