// src/RegistrationForm.js

import React, { useState } from 'react';

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.username) newErrors.username = 'Username is required';
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/S+@S+.S+/.test(formData.email)) {
            newErrors.email = 'Email address is invalid';
        }
        if (!formData.password) newErrors.password = 'Password is required';
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            console.log('Form submitted successfully:', formData);
            // Here you can also send the data to your backend
            setFormData({ username: '', email: '', password: '' });
            setErrors({});
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Username:</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                />
                {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
            </div>

            <div>
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
            </div>

            <div>
                <label>Password:</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />
                {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
            </div>

            <button type="submit">Register</button>
        </form>
    );
};

export default RegistrationForm;
