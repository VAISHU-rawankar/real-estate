import React from 'react';
import { Link, useRouteError } from 'react-router-dom';

export default function ErrorBoundary() {
  const error = useRouteError();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">⚠️</div>
        <h1 className="text-3xl font-display font-bold text-navy-900 mb-3">Something went wrong</h1>
        <p className="text-slate-500 mb-8">{error?.statusText || error?.message || 'An unexpected error occurred.'}</p>
        <Link to="/" className="btn-primary btn-md">Go Home</Link>
      </div>
    </div>
  );
}
