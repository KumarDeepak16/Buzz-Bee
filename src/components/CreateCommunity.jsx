import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function CreateCommunity() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to create a community');
      return;  // Abort if user is not logged in.
    }

    setLoading(true); // Set loading to true

    try {
      await addDoc(collection(db, 'communities'), {
        name,
        description,
        members,
        createdAt: new Date(),
      });
      navigate('/'); // Redirect to the communities list after creating
      toast.success('Successfully Created!')
    } catch (error) {
      console.error("Error creating community:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className='flex justify-center items-center min-h-[calc(100vh-110px)]'>
      <div className="w-[95%] md:max-w-md border border-yellow-500 mx-auto mt-10 p-4 bg-gray-900 text-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Create New Community</h1>
        <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder='Enter Community Name'
              className="w-full px-3 mb-4 py-2 bg-gray-700 mt-2 text-white border outline-none border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-300"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-700 mt-2 scrollbar text-white border outline-none border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500  mb-4 focus:border-transparent transition duration-300"
              rows="5"
              placeholder='Enter description'
            />
          <div className="flex justify-between items-center">
            <button 
              type="submit" 
              className={`bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 ${loading ? "cursor-not-allowed bg-gray-500" : ""}`} 
              disabled={loading} // Disable button while loading
            >
              {loading ? "Creating..." : "Create Community"} {/* Change button text based on loading state */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCommunity;
