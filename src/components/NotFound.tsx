import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Rocket } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-space-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8 relative">
          <img 
            src="https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
            alt="Space" 
            className="w-full h-96 object-cover rounded-lg shadow-2xl opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-space-black to-transparent" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <h1 className="text-9xl font-bold text-white mb-4 tracking-tighter">404</h1>
          </div>
        </div>
        <h2 className="text-3xl text-white mb-4">
          Houston, We Have a Problem
        </h2>
        <p className="text-space-gray-300 mb-8 text-lg">
          The page you're looking for seems to have drifted into deep space.
        </p>
        <Link 
          to="/" 
          className="space-button inline-flex items-center gap-2 px-6 py-3"
        >
          <Home size={20} />
          <span>Return to Earth</span>
        </Link>
        <div className="mt-12 animate-bounce">
          <Rocket size={32} className="text-space-blue-light mx-auto" />
        </div>
      </div>
    </div>
  );
};

export default NotFound;