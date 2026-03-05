import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="w-full bg-white/80 backdrop-blur-md shadow-md px-10 py-4 flex items-center justify-between border-b">
      
      {/* Logo */}
      <div>
        <span className="text-2xl font-bold tracking-wide text-gray-800">
          INVOICE GENERATOR
        </span>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-8 text-gray-700 font-medium">
        
        <Link
          to="/invoice-table"
          className="hover:text-black hover:underline transition-all active:scale-95"
        >
          Table
        </Link>

        <Link
          to="/invoice-form"
          className="hover:text-black hover:underline transition-all active:scale-95"
        >
          Create
        </Link>

        <Link
          to="/settings"
          className="hover:text-black hover:underline transition-all active:scale-95"
        >
          Settings
        </Link>

        <Link
          to="/logout"
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all active:scale-95"
        >
          Logout
        </Link>

      </div>
    </div>
  );
}

export default Header;