import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEdit, faTrash, faCheck } from '@fortawesome/free-solid-svg-icons';
import { doc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

function ReplyOptionsModal({ 
  thread, 
  replyIndex, 
  onClose, 
  updateThreadState 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(thread.replies[replyIndex].content);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = async () => {
    try {
      const threadRef = doc(db, "threads", thread.id);
      const oldReply = thread.replies[replyIndex];
      const updatedReply = { ...oldReply, content: editedContent };

      await updateDoc(threadRef, {
        replies: arrayRemove(oldReply)
      });

      await updateDoc(threadRef, {
        replies: arrayUnion(updatedReply)
      });

      updateThreadState();
      onClose();
      toast.success("Reply updated successfully!");
    } catch (error) {
      console.error("Error updating reply:", error);
      toast.error("Failed to update reply");
    }
  };

  const handleDelete = async () => {
    try {
      const threadRef = doc(db, "threads", thread.id);
      const replyToDelete = thread.replies[replyIndex];

      await updateDoc(threadRef, {
        replies: arrayRemove(replyToDelete),
        replyCount: increment(-1)
      });

      updateThreadState();
      onClose();
      toast.success("Reply deleted successfully!");
    } catch (error) {
      console.error("Error deleting reply:", error);
      toast.error("Failed to delete reply");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="  flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gray-900 rounded-2xl p-6 max-w-md w-full shadow-xl border border-gray-800"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">
            {isEditing ? 'Edit Reply' : isDeleting ? 'Delete Reply' : 'Reply Options'}
          </h2>
          <button 
            onClick={onClose}
            className=" px-2 py-1 hover:bg-gray-800 rounded-full transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-gray-400 hover:text-white" />
          </button>
        </div>

        <AnimatePresence mode='wait'>
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white h-32 focus:outline-none focus:border-yellow-500 transition-colors resize-none"
                placeholder="Edit your reply"
              />
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEdit}
                  className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faCheck} />
                  Save Changes
                </button>
              </div>
            </motion.div>
          ) : isDeleting ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <p className="text-gray-300">
                Are you sure you want to delete this reply? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setIsDeleting(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faTrash} />
                  Delete
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              <button
                onClick={() => setIsEditing(true)}
                className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-750 text-white rounded-lg transition-colors flex items-center gap-3"
              >
                <FontAwesomeIcon icon={faEdit} className="text-yellow-400" />
                Edit Reply
              </button>
              <button
                onClick={() => setIsDeleting(true)}
                className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-750 text-white rounded-lg transition-colors flex items-center gap-3"
              >
                <FontAwesomeIcon icon={faTrash} className="text-red-400" />
                Delete Reply
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default ReplyOptionsModal;