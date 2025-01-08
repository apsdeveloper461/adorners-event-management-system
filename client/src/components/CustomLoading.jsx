import React from 'react';

const CustomLoading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex items-center justify-center space-x-2">
        <div className="w-5 h-5 bg-blue-300 rounded-full animate-pulse delay-75"></div>
        <div className="w-5 h-5 bg-blue-300 rounded-full animate-pulse delay-150"></div>
        <div className="w-5 h-5 bg-blue-300 rounded-full animate-pulse delay-225"></div>
        <div className="w-5 h-5 bg-blue-300 rounded-full animate-pulse delay-300"></div>
        <div className="w-5 h-5 bg-blue-300 rounded-full animate-pulse delay-375"></div>
      </div>
    </div>
  );
};

export default CustomLoading;
