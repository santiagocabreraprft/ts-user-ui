import React, { useState, useEffect } from 'react';
import type { User } from '../../types/User';

type FormData = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

type FormErrors = Partial<Record<keyof FormData, string>>;

interface UserFormProps {
    user?: User;
    onSave: (userData: FormData) => void;
    onCancel: () => void;
}

function UserForm({ user, onSave, onCancel }: UserFormProps) {

    const [formData, setFormData] = useState<FormData>({
        firstName:"",
        lastName: "",
        email: "",
        phone: ""
    });
    const [errors, setErrors] = useState<FormErrors>({});

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name as keyof FormData]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.firstName.trim()) {
            newErrors.firstName = "First name is required";
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = "Last name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = "Phone number must be 10 digits";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (validateForm()) {
            onSave(formData);
        }
    };

    return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{user ? 'Edit User' : 'Create New User'}</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`form-input ${errors.firstName ? 'error' : ''}`}
            />
            {errors.firstName && (
              <span className="error-message">{errors.firstName}</span>
            )}
          </div>

          <div className="form-group">
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`form-input ${errors.lastName ? 'error' : ''}`}
            />
            {errors.lastName && (
              <span className="error-message">{errors.lastName}</span>
            )}
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label>Phone:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`form-input ${errors.phone ? 'error' : ''}`}
            />
            {errors.phone && (
              <span className="error-message">{errors.phone}</span>
            )}
          </div>

          <div className="form-buttons">
            <button type="button" className="btn btn-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-save">
              {user ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserForm;