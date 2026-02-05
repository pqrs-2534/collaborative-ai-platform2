import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiZap, FiUsers, FiMessageCircle } from 'react-icons/fi';
import { FaBrain } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import Button from '../components/common/Button';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <FaBrain className="text-primary-600" size={24} />,
      title: 'AI-Powered Ideation',
      description: 'Generate creative ideas and solutions with advanced AI assistance',
    },
    {
      icon: <FiUsers className="text-secondary-600" size={24} />,
      title: 'Real-time Collaboration',
      description: 'Work together seamlessly with your team in real-time',
    },
    {
      icon: <FiZap className="text-yellow-600" size={24} />,
      title: 'Smart Task Management',
      description: 'Organize and track your projects with intelligent Kanban boards',
    },
    {
      icon: <FiMessageCircle className="text-purple-600" size={24} />,
      title: 'Instant Communication',
      description: 'Chat, comment, and collaborate without leaving your workspace',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl mb-8">
            <span className="text-white font-bold text-3xl">CA</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Collaborate Smarter with{' '}
            <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              AI Power
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Transform your team's productivity with AI-powered ideation, real-time collaboration,
            and intelligent project management—all in one platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="lg" className="group">
                  Go to Dashboard
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" className="group">
                    Get Started Free
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-card hover:shadow-hover transition-shadow"
            >
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to transform your workflow?
          </h2>
          <p className="text-primary-100 mb-8 text-lg max-w-2xl mx-auto">
            Join thousands of teams already collaborating smarter with CollabAI
          </p>
          {!isAuthenticated && (
            <Link to="/register">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary-700 hover:bg-gray-50"
              >
                Start Free Trial
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
