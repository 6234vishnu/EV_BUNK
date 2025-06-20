import React, { useState, useEffect } from "react";
import "../../../assets/css/user/UserUpdateModal.css";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  isAdmin: boolean;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface UserUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUpdate: (updatedUser: Partial<User>) => void;
}

const UserUpdateModal: React.FC<UserUpdateModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    isAdmin: false,
    isBlocked: false,
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        isBlocked: user.isBlocked,
      });
      setErrors({ name: "", email: "", phone: "" });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = { name: "", email: "", phone: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
      isValid = false;
    } else if (!/^\d{10,}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Phone must be at least 10 digits";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onUpdate(formData);
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      isAdmin: user?.isAdmin || false,
      isBlocked: user?.isBlocked || false,
    });
    setErrors({ name: "", email: "", phone: "" });
    onClose();
  };

  if (!isOpen || !user) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Update User</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`form-input ${errors.name ? "form-input-error" : ""}`}
              placeholder="Enter name"
            />
            {errors.name && (
              <span className="error-message">{errors.name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-input ${errors.email ? "form-input-error" : ""}`}
              placeholder="Enter email"
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`form-input ${errors.phone ? "form-input-error" : ""}`}
              placeholder="Enter phone number"
            />
            {errors.phone && (
              <span className="error-message">{errors.phone}</span>
            )}
          </div>

          <div className="checkbox-group">
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="isAdmin"
                name="isAdmin"
                checked={formData.isAdmin}
                onChange={handleInputChange}
                className="form-checkbox"
              />
              <label htmlFor="isAdmin" className="checkbox-label">
                Admin User
              </label>
            </div>

            <div className="checkbox-item">
              <input
                type="checkbox"
                id="isBlocked"
                name="isBlocked"
                checked={formData.isBlocked}
                onChange={handleInputChange}
                className="form-checkbox"
              />
              <label htmlFor="isBlocked" className="checkbox-label">
                Blocked User
              </label>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-update">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserUpdateModal;
