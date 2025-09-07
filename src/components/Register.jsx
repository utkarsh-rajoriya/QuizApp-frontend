import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Register = (props) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [showForget, setShowForget] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userinfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUserInfo({ ...userinfo, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseUrl}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userinfo),
      });

      const data = await response.json();

      if (!response.ok || data.message !== "success") {
        alert(data.message || "Login failed. Please try again.");
        return;
      }

      // success
      login(data.name, data.email);
      setUserInfo({ name: "", email: "", password: "" });
      setConfirmPassword("");
    } catch (error) {
      alert("Something went wrong!");
      console.error(error);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (userinfo.password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userinfo),
      });

      const data = await response.json();
      if (!response.ok || data.message !== "success") {
        alert(data.message || "Signup failed.");
        setUserInfo({ name: "", email: "", password: "" });
        setConfirmPassword("");
        return;
      }

      // success
      login(data.name, data.email);
      setUserInfo({ name: "", email: "", password: "" });
      setConfirmPassword("");
    } catch (error) {
      alert("Something went wrong!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleForget = async () => {
    if (!email) {
      alert("Please enter your email.");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}//api/forgot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!data) {
        alert("Account not exist with this email id.");
        return;
      }
      alert("Temporary password sent to your email.");
      setShowForget(false);
      setEmail("");
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  return (
    (props.showLogin || props.showSignup) && (
      <motion.div
        className="absolute top-40 z-50 w-[85%] md:w-[70%] lg:w-[50%] bg-white p-3 md:p-5 rounded-2xl shadow-lg opacity-100 space-y-5"
        key={props.showLogin ? "login" : "signup"}
        animate={{ scale: [0, 1] }}
      >
        {/* Forgot Password */}
        {showForget && (
          <div className="my-4 space-y-3">
            <input
              type="email"
              placeholder="Enter your registered email"
              className="border-b-2 border-gray-400 p-2 w-full text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleForget}
              className="bg-blue-700 text-white px-4 py-2 rounded-lg w-full"
            >
              Send Temporary Password
            </button>
          </div>
        )}

        <h2 className="mb-4 text-black text-3xl font-bold font-Shantell">
          {props.showLogin ? "Login here.." : "Sign Up.."}
        </h2>

        {/* Google Button Placeholder */}
        <div className="flex justify-center">
          <button className="flex items-center gap-4 border p-2 rounded-full shadow-sm hover:shadow-md transition duration-200">
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google Logo"
              className="w-5 h-5"
            />
            <span className="text-gray-700 font-medium">
              Abhi kaam nhi krta
            </span>
          </button>
        </div>

        <div className="my-4">
          <form
            className="max-w-md mx-auto"
            onSubmit={(e) => {
              e.preventDefault();
              props.showLogin ? handleLogin(e) : handleSignup(e);
            }}
          >
            {props.showSignup && (
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="name"
                  className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-600 peer"
                  onChange={handleChange}
                  value={userinfo.name}
                  minLength={3}
                  required
                />
                <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600">
                  Username
                </label>
              </div>
            )}
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="email"
                name="email"
                className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-600 peer"
                value={userinfo.email}
                onChange={handleChange}
                minLength={10}
                required
              />
              <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600">
                Email address
              </label>
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="password"
                name="password"
                className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-600 peer"
                value={userinfo.password}
                onChange={handleChange}
                minLength={5}
                required
              />
              <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600">
                Password
              </label>
            </div>
            {props.showSignup && (
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="password"
                  name="repeat_password"
                  className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-600 peer"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  minLength={5}
                  required
                />
                <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600">
                  Confirm password
                </label>
              </div>
            )}

            <div className="my-3 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className={`my-2 flex items-center justify-center gap-2 text-white cursor-pointer ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-700 hover:bg-blue-800"
                } focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center`}
              >
                {loading ? (
                  <>
                    <motion.div
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin "
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                    />
                    Signing Up...
                  </>
                ) : (
                  "Goo! Crush"
                )}
              </button>
            </div>

            {props.showSignup && (
              <div className="md:hidden" onClick={props.ClickLogin}>
                <p className="text-center text-lg underline text-gray-700 cursor-pointer">
                  Already have an account!
                </p>
              </div>
            )}

            {props.showLogin && (
              <div onClick={() => setShowForget(true)}>
                <p className="text-center text-lg underline text-gray-700 cursor-pointer">
                  Forgot Password?
                </p>
              </div>
            )}
          </form>
        </div>
      </motion.div>
    )
  );
};

export default Register;
