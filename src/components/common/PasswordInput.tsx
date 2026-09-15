"use client";

import { FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from "react";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  name?: string;
  required?: boolean;
  helperText?: string;
}

export default function PasswordInput({
  value,
  onChange,
  placeholder = "Password",
  label,
  name,
  required = false,
  helperText,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="form-group">

      {label && (
        <label className="mb-2 fw-bold">
          {label}
        </label>
      )}

      <div className="position-relative">

        <input
          name={name}
          required={required}
          type={showPassword ? "text" : "password"}
          className="form-control pe-5"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />

        <button
          type="button"
          className="position-absolute border-0 bg-transparent p-0"
          style={{
            right: "15px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            color: "#6c757d",
            cursor: "pointer",
          }}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <FiEyeOff size={18} />
          ) : (
            <FiEye size={18} />
          )}
        </button>

      </div>

      {helperText && (
        <small className="text-muted">
          {helperText}
        </small>
      )}

    </div>
  );
}