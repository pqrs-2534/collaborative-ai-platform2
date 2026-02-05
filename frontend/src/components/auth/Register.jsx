import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import { register } from '../../redux/slices/authSlice';
import Input from '../common/Input';
import Button from '../common/Button';
import { validateForm, required, email as emailValidator, password as passwordValidator } from '../../utils/validators';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  const { name, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validationErrors = {
      name: required(name),
      email: emailValidator(email),
      password: passwordValidator(password),
    };

    if (password !== confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }

    // Remove null values
    Object.keys(validationErrors).forEach(key => {
      if (!validationErrors[key]) delete validationErrors[key];
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = await dispatch(register({ name, email, password }));
    if (result.type === 'auth/register/fulfilled') {
      navigate('/dashboard');
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl mb-4">
          <span className="text-white font-bold text-2xl">CA</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
        <p className="text-gray-600">Start collaborating with AI today</p>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Input
            label="Full Name"
            type="text"
            name="name"
            value={name}
            onChange={handleChange}
            placeholder="John Doe"
            icon={<FiUser />}
            error={errors.name}
            required
          />

          <Input
            label="Email Address"
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="you@example.com"
            icon={<FiMail />}
            error={errors.email}
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            placeholder="••••••••"
            icon={<FiLock />}
            error={errors.password}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            icon={<FiLock />}
            error={errors.confirmPassword}
            required
          />

          <div className="flex items-start">
            <input
              type="checkbox"
              className="w-4 h-4 mt-1 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              required
            />
            <span className="ml-2 text-sm text-gray-600">
              I agree to the{' '}
              <Link to="/terms" className="text-primary-600 hover:text-primary-700">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary-600 hover:text-primary-700">
                Privacy Policy
              </Link>
            </span>
          </div>

          <Button
            type="submit"
            fullWidth
            loading={loading}
            disabled={loading}
          >
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;