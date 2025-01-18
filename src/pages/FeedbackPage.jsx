import React, { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFlag,
  faPaperPlane,
  faComments,
  faExclamationTriangle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { auth, db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import toast from 'react-hot-toast';


const FeedbackPage = () => {
  const [formType, setFormType] = useState("contact"); // contact, report, feedback
  const [formData, setFormData] = useState({
    type: "contact",
    subject: "",
    message: "",
    category: "",
    reportType: "",
    reportDetails: "",
    priority: "normal",
  });
  const [loading, setLoading] = useState(false);

  const reportCategories = [
    "Inappropriate Content",
    "Harassment",
    "Spam",
    "Misinformation",
    "Technical Issue",
    "Privacy Violation",
    "Other",
  ];

  const feedbackCategories = [
    "General Feedback",
    "Feature Request",
    "Bug Report",
    "User Experience",
    "Performance",
    "Suggestion",
    "Other",
  ];

  const contactCategories = [
    "General Inquiry",
    "Technical Support",
    "Account Issues",
    "Partnership",
    "Press",
    "Other",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userId = auth.currentUser?.uid || "anonymous";
      const userEmail = auth.currentUser?.email || formData.email || "anonymous";

      await addDoc(collection(db, "submissions"), {
        ...formData,
        userId,
        userEmail,
        timestamp: serverTimestamp(),
        status: "pending",
      });

      toast.success(
        "Your submission has been received. We'll get back to you soon!"
      );
      setFormData({
        type: formType,
        subject: "",
        message: "",
        category: "",
        reportType: "",
        reportDetails: "",
        priority: "normal",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit. Please try again.");
    }

    setLoading(false);
  };

  const formTypes = [
    {
      id: "contact",
      icon: faPaperPlane,
      title: "Contact Us",
      description: "Get in touch with our team",
    },
    {
      id: "report",
      icon: faFlag,
      title: "Report Issue",
      description: "Report inappropriate content or behavior",
    },
    {
      id: "feedback",
      icon: faComments,
      title: "Feedback",
      description: "Share your thoughts and suggestions",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 space-y-4 py-2 lg:py-0">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-5"
      >
        <h1 className="text-3xl font-bold text-yellow-400 heading tracking-widest mb-2">Get in Touch</h1>
        <p className="text-gray-400 text-lg">
          We're here to help and listen to your feedback
        </p>
      </motion.div>

      {/* Form Type Selection */}
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        {formTypes.map((type) => (
          <motion.button
            key={type.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setFormType(type.id);
              setFormData({ ...formData, type: type.id });
            }}
            className={`p-6 rounded-2xl border transition-all ${
              formType === type.id
                ? "bg-gradient-to-br from-yellow-600/20 to-yellow-600/20 border-yellow-500/50"
                : "bg-gray-800/50 border-gray-700/30 hover:border-gray-600/50"
            }`}
          >
            <FontAwesomeIcon
              icon={type.icon}
              className={`text-2xl mb-4 ${
                formType === type.id ? "text-yellow-400" : "text-gray-400"
              }`}
            />
            <h3 className="text-lg font-semibold text-white mb-2">
              {type.title}
            </h3>
            <p className="text-sm text-gray-400">{type.description}</p>
          </motion.button>
        ))}
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-lg rounded-2xl p-4 border border-gray-700/30 shadow-xl"
        >
          {/* Email Field (for non-authenticated users) */}
          {!auth.currentUser && (
            <div className="mb-2">
              <label className="block text-gray-300 mb-2 font-medium">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full bg-gray-700/50 text-white border border-gray-600/50 rounded-xl p-4 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter your email"
              />
            </div>
          )}

          {/* Category Selection */}
          <div className="mb-2">
            <label className="block text-gray-300 mb-2 font-medium">
              Category
            </label>
            <select
              required
              className="w-full bg-gray-700/50 text-white border border-gray-600/50 rounded-xl p-4 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="">Select a category</option>
              {formType === "contact" &&
                contactCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              {formType === "report" &&
                reportCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              {formType === "feedback" &&
                feedbackCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            </select>
          </div>

          {/* Subject Field */}
          <div className="mb-2">
            <label className="block text-gray-300 mb-2 font-medium">
              Subject
            </label>
            <input
              type="text"
              required
              className="w-full bg-gray-700/50 text-white border border-gray-600/50 rounded-xl p-4 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              placeholder="Enter subject"
            />
          </div>

          {/* Message Field */}
          <div className="mb-2">
            <label className="block text-gray-300 mb-2 font-medium">
              {formType === "report" ? "Report Details" : "Message"}
            </label>
            <textarea
              required
              className="w-full bg-gray-700/50 text-white border border-gray-600/50 rounded-xl p-4 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all min-h-[150px]"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              placeholder={
                formType === "report"
                  ? "Please provide detailed information about the issue..."
                  : "Your message here..."
              }
            />
          </div>

          {/* Priority Selection (for reports) */}
          {formType === "report" && (
            <div className="mb-6">
              <label className="block text-gray-300 mb-2 font-medium">
                Priority
              </label>
              <div className="flex gap-4">
                {["low", "normal", "high", "urgent"].map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, priority: priority })
                    }
                    className={`flex-1 py-3 px-4 rounded-xl capitalize transition-all ${
                      formData.priority === priority
                        ? "bg-gradient-to-r from-yellow-600 to-yellow-600 text-white"
                        : "bg-gray-700/50 text-gray-400 hover:bg-gray-700/70"
                    }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={loading}
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-600 to-yellow-600 hover:from-yellow-700 hover:to-yellow-700 text-white py-4 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon
                  icon={
                    formType === "report"
                      ? faFlag
                      : formType === "feedback"
                      ? faComments
                      : faPaperPlane
                  }
                />
                <span>
                  {formType === "report"
                    ? "Submit Report"
                    : formType === "feedback"
                    ? "Send Feedback"
                    : "Send Message"}
                </span>
              </>
            )}
          </motion.button>

          {/* Disclaimer */}
          <p className="mt-6 text-sm text-gray-400 text-center">
            By submitting this form, you agree to our{" "}
            <a href="#" className="text-yellow-400 hover:text-yellow-300">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-yellow-400 hover:text-yellow-300">
              Privacy Policy
            </a>
            .
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default FeedbackPage;