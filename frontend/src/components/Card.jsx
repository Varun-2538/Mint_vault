// src/components/Card.jsx
import React from 'react';

export const Card = ({ className, children }) => {
  return (
    <div className={`rounded-lg shadow-lg bg-white ${className}`}>{children}</div>
  );
};

export const CardHeader = ({ className, children }) => {
  return <div className={`border-b pb-2 ${className}`}>{children}</div>;
};

export const CardTitle = ({ className, children }) => {
  return <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>;
};

export const CardContent = ({ className, children }) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

export const CardDescription = ({ className, children }) => {
  return <p className={`text-sm text-gray-600 ${className}`}>{children}</p>;
};
