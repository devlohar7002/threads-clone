// src/pages/ErrorPage.js

import React from 'react';
import { Link } from 'react-router-dom';

function ErrorPage() {
    return (
        <div className="h-screen flex flex-col justify-center items-center">
            <h1 className="text-xl font-bold">404 Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <Link to="/" className="mt-4 text-blue-500 hover:text-blue-700">
                Go back to the homepage
            </Link>
        </div>
    );
}

export default ErrorPage;
