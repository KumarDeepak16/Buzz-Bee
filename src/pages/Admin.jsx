import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  MessageSquare,
  Activity,
  Grid,
  FileText,
  Search,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
} from "firebase/firestore";
import { toast } from "react-hot-toast";

function Admin() {
  const [data, setData] = useState({
    users: [],
    polls: [],
    threads: [],
    communities: [],
    submissions: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const collections = [
          "users",
          "polls",
          "threads",
          "communities",
          "submissions",
        ];
        const fetchPromises = collections.map(async (collectionName) => {
          const q = query(collection(db, collectionName));
          const snapshot = await getDocs(q);
          return [
            collectionName,
            snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
          ];
        });

        const results = await Promise.all(fetchPromises);
        const newData = Object.fromEntries(results);
        setData(newData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id, collectionName) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteDoc(doc(db, collectionName, id));
        setData((prev) => ({
          ...prev,
          [collectionName]: prev[collectionName].filter(
            (item) => item.id !== id
          ),
        }));
        toast.success("Item deleted successfully");
      } catch (error) {
        console.error("Error deleting item:", error);
        toast.error("Failed to delete item");
      }
    }
  };

  const filterData = (items) => {
    return items.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const StatsCard = ({ icon: Icon, label, value, trend, color }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className={`bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 border 
                 border-gray-700/50 hover:border-${color}-500/50 transition-all duration-300`}
    >
      <div className="flex justify-between items-start">
        <div className={`p-3 bg-${color}-500/20 rounded-xl`}>
          <Icon className={`w-6 h-6 text-${color}-500`} />
        </div>
        {trend && (
          <span className={`text-${color}-500 flex items-center text-sm`}>
            <TrendingUp className="w-4 h-4 mr-1" />
            {trend}%
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-white mt-4">{value}</h3>
      <p className="text-gray-400 text-sm mt-1">{label}</p>
    </motion.div>
  );

  const DataCard = ({ item, collectionName }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 border 
                 border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {item.title ||
              item.name ||
              item.displayName ||
              item.username ||
              "Untitled"}
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            {item?.description || item.email }
          </p>
  
        </div>
        <button
          onClick={() => handleDelete(item.id, collectionName)}
          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
        >
          <Trash2 className="w-5 h-5 text-red-400" />
        </button>
      </div>
    </motion.div>
  );

  const DataList = ({ collectionName }) => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white capitalize">
          {collectionName}
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder={`Search ${collectionName}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-900/50 text-gray-300 rounded-lg pl-10 pr-4 py-2
                     border border-gray-700 focus:border-blue-500 focus:ring-1 
                     focus:ring-blue-500 outline-none w-64"
          />
          <Search className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence>
          {filterData(data[collectionName] || []).map((item) => (
            <DataCard
              key={item.id}
              item={item}
              collectionName={collectionName}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800/40 backdrop-blur-md border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatsCard
            icon={Users}
            label="Users"
            value={data.users.length}
            color="blue"
          />
          <StatsCard
            icon={Activity}
            label="Polls"
            value={data.polls.length}
            color="green"
          />
          <StatsCard
            icon={MessageSquare}
            label="Threads"
            value={data.threads.length}
            color="purple"
          />
          <StatsCard
            icon={Grid}
            label="Communities"
            value={data.communities.length}
            color="yellow"
          />
          <StatsCard
            icon={FileText}
            label="Submissions"
            value={data.submissions.length}
            color="pink"
          />
        </div>

        <div className="flex space-x-4 mb-6 overflow-x-auto">
          {Object.keys(data).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                activeTab === tab
                  ? "bg-blue-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <DataList key={activeTab} collectionName={activeTab} />
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

export default Admin;
