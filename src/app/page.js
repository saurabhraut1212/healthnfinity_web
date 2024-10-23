import React from 'react';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      {/* Title Section */}
      <section className="text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Welcome to log Website
        </h1>
        <p className="text-lg text-gray-600">
          See the logs of your actions
        </p>
      </section>
    </div>
  );
};

export default HomePage;
