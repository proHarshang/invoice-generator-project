import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

const Auth = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        const result = await login(email, password);

        if (result.success) {
            navigate('/invoice-table');
        } else {
            setError(result.message);
        }
    };

    return (
      <div className="min-h-screen bg-[#F5F1EB] flex items-center justify-center px-4">
  <div className="w-full max-w-md bg-white border border-[#E8E2D9] rounded-2xl shadow-2xl p-10">

    <div className="text-center mb-8">
      <h1 className="text-3xl font-semibold tracking-wide text-black">
        Invoice Generator
      </h1>
      <p className="text-sm text-gray-500 mt-2">
        Please login to continue
      </p>
    </div>

    <form onSubmit={handleLogin} className="flex flex-col gap-6">

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 bg-[#FAF8F4] focus-within:ring-2 focus-within:ring-black transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-60 mr-3">
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793L8 8.5l7-3.207V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11A1.5 1.5 0 0 0 15 11.5V6.954L8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954Z" />
          </svg>
          <input
            type="email"
            className="w-full bg-transparent outline-none text-sm"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 bg-[#FAF8F4] focus-within:ring-2 focus-within:ring-black transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-60 mr-3">
            <path fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Z"
              clipRule="evenodd" />
          </svg>
          <input
            type="password"
            className="w-full bg-transparent outline-none text-sm"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm text-center">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-black text-white py-3 rounded-xl font-medium tracking-wide hover:bg-[#2E2E2E] transition shadow-md"
      >
        Sign In
      </button>
    </form>

  </div>
</div>
    )
}

export default Auth