import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.BASE_URL || "/";

const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 px-4 py-12">
    <div className="flex flex-col items-center">
      <img
        src={`${BASE_URL}logos/smile_logo_full.png`}
        alt="SMILE Logo"
        className="w-42 h-42 mb-2 animate-bounce"
      />
      <h1 className="text-6xl font-extrabold text-[var(--brand-secondary)] mb-2">
        404
      </h1>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-center">
        Oops! Page Not Found
      </h2>
      <p className="text-lg text-gray-700 mb-8 text-center max-w-md">
        The page you are looking for doesn&apos;t exist or has been moved.<br />
        Let&apos;s get you back to a smiling start!
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--brand-secondary)] hover:bg-[var(--brand-secondary-dark)] text-white font-semibold text-lg transition-all duration-150 active:scale-95 cursor-pointer"
      >
        Go to Home Page
      </Link>
    </div>
  </div>
);

export default NotFoundPage;