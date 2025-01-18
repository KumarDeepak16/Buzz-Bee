import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import toast from 'react-hot-toast';
import {
  doc,
  setDoc,
  getDocs,
  query,
  collection,
  where,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import usernames from "../data/usernames";
import bios from "../data/bio";
import profileImages from "../data/profileimage";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  const MAX_LOGIN_ATTEMPTS = 5;
  const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

  const formValidation = {
    email: {
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address"
      }
    },
    password: {
      required: "Password is required",
      minLength: {
        value: 6,
        message: "Password must be at least 6 characters"
      },
      // pattern: {
      //   value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      //   message: "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
      // }
    }
  };

 
  const createNewUser = async (userId, email, displayName = null) => {
    const username = usernames[Math.floor(Math.random() * usernames.length)];
    const profileImage = profileImages[Math.floor(Math.random() * profileImages.length)];
    const bio = getRandomBio();
    const isActive = true;
    const timestamp = new Date();

    const userInfo = {
      userId,
      username,
      profileImage,
    };

    await setDoc(doc(db, "users", userId), {
      userId,
      username,
      email,
      profileImage,
      bio,
      isActive,
      timestamp,
    });

    return userInfo;
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user exists in our database
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      let userInfo;
      if (!userDoc.exists()) {
        // New Google user - create profile
        userInfo = await createNewUser(user.uid, user.email, user.displayName);
        toast.success("Account created successfully with Google");
      } else {
        // Existing user - get their info
        const userData = userDoc.data();
        userInfo = {
          userId: userData.userId,
          username: userData.username,
          profileImage: userData.profileImage,
        };
        toast.success("Logged in successfully with Google");
      }

      storeUserInfo(userInfo);
      navigate("/", { replace: false });
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkLoginAttempts = () => {
    const attempts = JSON.parse(localStorage.getItem('loginAttempts') || '{"count": 0}');
    if (attempts.count >= MAX_LOGIN_ATTEMPTS && 
        Date.now() - attempts.timestamp < LOCKOUT_TIME) {
      throw new Error('Too many login attempts. Please try again later.');
    }
  };

  const updateLoginAttempts = (success) => {
    const attempts = JSON.parse(localStorage.getItem('loginAttempts') || '{"count": 0}');
    if (success) {
      localStorage.removeItem('loginAttempts');
    } else {
      localStorage.setItem('loginAttempts', JSON.stringify({
        count: attempts.count + 1,
        timestamp: Date.now()
      }));
    }
  };

  const checkEmailExists = async (email) => {
    const q = query(
      collection(db, "users"),
      where("email", "==", email)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const getRandomBio = () => {
    return bios[Math.floor(Math.random() * bios.length)];
  };

  const storeUserInfo = (userInfo) => {
    sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  };

  const fetchUserInfo = async (userId) => {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        userId: userData.userId,
        username: userData.username,
        profileImage: userData.profileImage,
      };
    }
    return null;
  };

  const handleLogin = async (data) => {
    checkLoginAttempts();
    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    const userInfo = await fetchUserInfo(userCredential.user.uid);
    if (userInfo) {
      storeUserInfo(userInfo);
      updateLoginAttempts(true);
      navigate("/", { replace: false });
      toast.success("Logged in successfully");
    } else {
      updateLoginAttempts(false);
      toast.error("User information not found");
    }
  };

  const handleSignup = async (data) => {
    if (await checkEmailExists(data.email)) {
      toast.error("Email already exists");
      return;
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    
    const userInfo = await createNewUser(userCredential.user.uid, data.email);
    storeUserInfo(userInfo);
    navigate("/", { replace: false });
    toast.success("Account created successfully");
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Trim whitespace from inputs
      data.email = data.email.trim();
      data.password = data.password.trim();

      if (isLogin) {
        await handleLogin(data);
      } else {
        await handleSignup(data);
      }
    } catch (error) {
      if (isLogin) {
        updateLoginAttempts(false);
      }
      toast.error(error.message);
    } finally {
      setLoading(false);
      reset();
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="border backdrop-blur-md bg-gray-800/60 border-gray-500 w-[320px] md:w-[400px] p-4 rounded-lg">
        <div className="text-2xl font-bold mb-2 text-yellow-500 text-center">
          Welcome back to <span className="text-yellow-500 logo">BUZZ-BEE</span>
        </div>
        <div className="text-sm font-normal mb-4 text-center text-gray-300">
          {isLogin ? "Log in to your account" : "Sign up for a new account"}
        </div>
        
        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full mb-4 flex items-center justify-center gap-2 bg-white text-gray-800 p-2 rounded hover:bg-gray-100 transition-colors"
        >
          <FcGoogle className="text-xl" />
          <span>{isLogin ? "Sign in with Google" : "Sign up with Google"}</span>
        </button>

        {/* Divider */}
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-500"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-700/90 text-gray-400">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div className="relative">
            <label htmlFor="email" className="block text-gray-400 text-sm mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              disabled={loading}
              {...register("email", formValidation.email)}
              className="rounded border border-yellow-700 bg-gray-700 text-white text-sm w-full p-2"
              placeholder="Enter Email"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email.message}</span>
            )}
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-gray-400 text-sm mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              disabled={loading}
              {...register("password", formValidation.password)}
              className="rounded border border-yellow-700 bg-gray-700 text-white text-sm w-full p-2"
              placeholder="Password"
            />
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password.message}</span>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? "bg-gray-500" : "bg-yellow-700"
            } w-max m-auto px-6 py-2 rounded text-white text-sm font-normal hover:bg-yellow-600 transition-colors`}
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className="text-sm text-center mt-4">
          {isLogin ? (
            <>
              Don't have an account yet?{" "}
              <span
                className="text-yellow-500 cursor-pointer hover:text-yellow-400"
                onClick={() => {
                  setIsLogin(false);
                  reset();
                }}
              >
                Sign up for free!
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                className="text-yellow-500 cursor-pointer hover:text-yellow-400"
                onClick={() => {
                  setIsLogin(true);
                  reset();
                }}
              >
                Log in!
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;