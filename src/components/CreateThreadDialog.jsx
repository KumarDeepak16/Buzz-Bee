import React, { useState, useEffect } from "react";
import { db, storage, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import toast from "react-hot-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";
function CreateThreadDialog() {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate(); // Initialize navigate

  const storedUserInfo =
    JSON.parse(sessionStorage.getItem("userInfo")) ||
    JSON.parse(localStorage.getItem("userInfo"));

  let username = null;
  let profileImage = null;
  if (storedUserInfo) {
    username = storedUserInfo.username;
    profileImage = storedUserInfo.profileImage;
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to create a thread.");
      return;
    }

    setLoading(true);

    let imageUrl = "";
    if (image) {
      const imageRef = ref(storage, `thread_images/${image.name}`);
      await uploadBytes(imageRef, image);
      imageUrl = await getDownloadURL(imageRef);
    }

    try {
      // Initialize Gemini AI
      const genAI = new GoogleGenerativeAI(
        "AIzaSyAcZYGlmNkIUUIPaou6sRwV16to27ZRAT4"
      );
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      // Generate AI response based on title and description
      const prompt = `As a helpful community member, provide a clear and concise response to:

      Topic: ${title}
      Details: ${description}
      
      Please structure your response with:
      1. A brief summary of the main point (1-2 sentences)
      2. 2-3 key insights or suggestions
      3. A constructive conclusion
      
      Keep the response friendly and helpful, but concise and to the point. Avoid using markdown formatting, asterisks, or special characters.`;

      const result = await model.generateContent(prompt);
      const aiResponse = result.response.text();

      // Format the AI response for better readability
      const formattedResponse = aiResponse
        .replace(/\*\*/g, "") // Remove any asterisks
        .replace(/\n\n+/g, "\n\n") // Normalize spacing
        .trim(); // Remove extra whitespace

      // Create the initial reply from Buzz-Bee
      const initialReply = {
        commentorId: "Buzz-Bee",
        content: formattedResponse,
        imageUrl: "",
        commentor: "Buzzy (AI-Generated Comment)",
        commentorAvatar: "https://i.gifer.com/7csY.gif", // Replace with actual avatar URL
        createdAt: new Date(),
        votes: 0,
      };

      // Create the thread document with the AI reply
      await addDoc(collection(db, "threads"), {
        title,
        description,
        imageUrl,
        author: username,
        authorAvatar: profileImage,
        createdAt: serverTimestamp(),
        authorId: user.uid,
        views: 0,
        votes: 0,
        replyCount: 1, // Set to 1 since we have the initial AI reply
        replies: [initialReply],
        trendingScore: 0,
      });

      // Reset form state
      setTitle("");
      setDescription("");
      setImage(null);

      navigate("/");
      toast.success("Successfully Created!");
    } catch (error) {
      console.error("Error creating thread:", error);
      toast.error("Error creating thread. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2 flex justify-center items-center min-h-[calc(100vh-110px)]">
      <div className="p-3 rounded-lg w-full max-w-md border border-yellow-500">
        <h2 className="text-2xl font-bold mb-4 text-white">
          Create New Discussion
        </h2>
        <div className="mb-4 p-2 bg-gray-800 rounded-lg text-sm text-gray-300 border border-gray-700">
          <span className="text-yellow-500">Note:</span> An AI-generated response from Buzzy will be automatically added as the first comment to help start the discussion.
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 mb-4 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-300"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 mb-4 bg-gray-700 text-white border scrollbar border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-300"
            required
            rows="4"
          />

          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full p-2 file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className={`px-4 py-2 ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-yellow-500 hover:bg-yellow-600"
              } text-white rounded`}
              disabled={loading} // Disable button while loading
            >
              {loading ? "Creating..." : "Create"}{" "}
              {/* Change button text based on loading state */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateThreadDialog;
