import {
  FaUserSecret,
  FaQuestionCircle,
  FaUsers,
  FaShieldAlt,
  FaRocket,
  FaComments,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Marquee from "react-fast-marquee";

const BuzzMain = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 select-none">
      <Navbar />
      {/* Hero Section */}
      <div className="container mx-auto">
        <div className="relative -z-0 text-center  h-[70vh] flex justify-center items-center flex-col ">
          <div class="absolute animate-pulse duration-500 transition-all bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#fdba741e_1px,transparent_1px),linear-gradient(to_bottom,#fdba742e_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_80%_100%_at_50%_0%,#000_90%,transparent_100%)]"></div>
          <div className="z-10 relative ">
            <h1 className="text-7xl logo  mb-4 text-transparent bg-clip-text font-bold bg-gradient-to-r from-orange-300 to-yellow-500">
              BUZZ-BEE
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Where Curiosity Meets Anonymity
            </p>
            <Link
              to="/"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full text-lg"
            >
              Join The Hive
            </Link>
          </div>
        </div>
          <div className="z-10 mb-10">
            <ImageMarquee />
          </div>
        {/* How It Works Section */}
        <h2 className="text-3xl font-bold text-center mb-12">How BUZZ Works</h2>
        <div className="grid md:grid-cols-3 gap-8 mb-20 max-w-6xl mx-auto px-2">
          <div className="bg-gray-800 p-6 rounded-lg hover:transform hover:scale-105 transition duration-300">
            <FaRocket className="text-4xl text-yellow-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">1. Create Your Account</h3>
            <p className="text-gray-400">
              Sign up with email only - no personal details required
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg hover:transform hover:scale-105 transition duration-300">
            <FaShieldAlt className="text-4xl text-yellow-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">
              2. Get Your Anonymous Identity
            </h3>
            <p className="text-gray-400">
              Receive a unique anonymous identifier that protects your privacy
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg hover:transform hover:scale-105 transition duration-300">
            <FaUsers className="text-4xl text-yellow-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">3. Join The Community</h3>
            <p className="text-gray-400">
              Start asking questions, providing answers, and engaging with
              others
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid md:grid-cols-3 gap-8 mb-20 max-w-6xl mx-auto px-2">
          <div className="bg-gray-800 p-6 rounded-lg hover:transform hover:scale-105 transition duration-300">
            <FaUserSecret className="text-4xl text-yellow-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Complete Anonymity</h3>
            <p className="text-gray-400">
              Express yourself freely without revealing your identity
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg hover:transform hover:scale-105 transition duration-300">
            <FaQuestionCircle className="text-4xl text-yellow-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Ask Anything</h3>
            <p className="text-gray-400">
              Get honest answers from a diverse community
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg hover:transform hover:scale-105 transition duration-300">
            <FaComments className="text-4xl text-yellow-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Engage Freely</h3>
            <p className="text-gray-400">
              Participate in discussions without judgment
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gray-800 border-b p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Join?</h2>
          <p className="text-gray-400 mb-8">
            Join thousands of users who are already part of our anonymous
            community
          </p>
          <Link
            to="/login"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full text-lg"
          >
            Get Started Now
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 py-8 ">
        <div className="container mx-auto px-4 text-center text-gray-400 capitalize">
          <p>© 2024 BUZZ. All rights preserved. Privacy first.</p>
        </div>
      </footer>
    </div>
  );
};

export default BuzzMain;

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full z-50 bg-gray-900/80 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1 className="text-4xl logo tracking-widest font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
              BUZZ-BEE
            </h1>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <a href="">
                <FaGithub className="text-3xl hover:scale-105 hover:text-purple-400" />
              </a>
              <a href="">
                <FaLinkedin className="text-3xl hover:scale-105 hover:text-blue-400" />
              </a>

              {isLoggedIn ? (
                <button
                  onClick={() => auth.signOut()}
                  className="bg-gray-800 hover:bg-gray-700 px-4 py-1 rounded-md transition-all"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="bg-primary hover:bg-primary/90 px-4 py-1 rounded-md transition-all"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

const ImageMarquee = () => {
  const images = [
    "https://i.pinimg.com/originals/64/15/98/641598e610f50c992b32687e81aac326.gif",
    "https://i.pinimg.com/originals/1e/45/f5/1e45f560e8a2618be332d5aae60f6119.gif",
    "https://i.pinimg.com/originals/45/d4/32/45d4328e3a454cbcd7367a7dfbd1f76e.gif",
    "https://i.pinimg.com/originals/b8/11/ff/b811ff649b9058f1b32d2d5b73f32fec.gif",
    "https://i.pinimg.com/originals/67/e2/68/67e2687af9f32ef46277b9d1e713189a.gif",
    "https://i.pinimg.com/originals/78/cb/a2/78cba24f280d1103251709d161ec802b.gif",
    "https://i.pinimg.com/originals/ae/81/0a/ae810a114ef56535d5c7de5feb5935bb.gif",
    "https://i.pinimg.com/originals/0c/9d/3d/0c9d3d35281c96847d2f805f4c866dfd.gif",
    "https://i.pinimg.com/originals/3a/a3/e7/3aa3e778f4f1f2f47dd00cc500201f3a.gif",
    "https://i.pinimg.com/originals/de/63/ee/de63ee1767d87cc78a606811e63be8c6.gif",
    "https://i.pinimg.com/originals/31/87/c7/3187c71af0f1e5153d5e6ae34b6bc2a9.gif",
    "https://i.pinimg.com/originals/5d/82/7f/5d827ff7af8df7d1f796403e9e110c87.gif",
  ];

  const images2 = [
    "https://i.pinimg.com/originals/6d/83/a0/6d83a0b0ea239eec91ec413874414e5e.gif",
    "https://i.pinimg.com/originals/56/bf/61/56bf61d67d511238a588817bf9c48e80.gif",
    "https://i.pinimg.com/originals/f6/d2/e4/f6d2e4d12d3f596fe90eaae11d259f1e.gif",
    "https://i.pinimg.com/originals/a6/06/f6/a606f68cad1de193b12a56c734dd86b9.gif",
    "https://i.pinimg.com/originals/bf/a2/a7/bfa2a76a809d57263421c391d0427cf2.gif",
    "https://i.pinimg.com/originals/9d/03/67/9d0367525ca40e6c1fbedcf23bb28e44.gif",
    "https://i.pinimg.com/originals/2d/6f/c8/2d6fc8a815c7bc6cb4b9ed9b0ea49c74.gif",
    "https://i.pinimg.com/originals/5b/22/1e/5b221e34637787f7ff4179351f527c4d.gif",
    "https://i.pinimg.com/originals/dc/1d/48/dc1d487d4ad4ec5a138d686bfc149816.gif",
    "https://i.pinimg.com/originals/2e/93/ce/2e93ceb15c58480879d348b43f908743.gif",
    "https://i.pinimg.com/originals/06/33/78/06337855ff13c6befe41a6f0f38da716.gif",
    "https://i.pinimg.com/originals/62/85/62/62856263df365f930650a907e514a00e.gif",
  ];

  return (
    <div className="w-full relative overflow-hidden space-y-3 select-none pointer-events-none">
      <Marquee speed={100} gradient={false}>
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Image ${index + 1}`}
            className="lg:h-36 lg:w-36 h-20 w-20 overflow-hidden rounded-md object-cover mx-4"
          />
        ))}
      </Marquee>
      <Marquee speed={100} gradient={false} direction="right">
        {images2.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Image ${index + 1}`}
            className="lg:h-36 lg:w-36 h-20 w-20 overflow-hidden rounded-md object-cover mx-4"
          />
        ))}
      </Marquee>
    </div>
  );
};
