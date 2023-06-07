import * as React from 'react';
// External
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
// Icons
import { HomeIcon } from '@heroicons/react/24/outline';

export function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>404 Page Not Found</title>
        <meta name="description" content="Page not found" />
      </Helmet>
      <div className="h-screen flex items-center flex-col justify-center min-h-[320px]">
        <div className="font-bold text-black text-4xl">
          4
          <span role="img" aria-label="Crying Face">
            😢
          </span>
          4
        </div>
        <div className="mt-8 flex items-center flex-col">
          <p className="text-xs">Page not found.</p>
          <Link
            to="/"
            className="text-primera-100 flex items-center flex-row font-semibold mt-2"
          >
            Back to{' '}
            {<HomeIcon className="h-5 w-5 stroke-2 mx-1 text-segunda-200" />}
          </Link>
        </div>
      </div>
    </>
  );
}
