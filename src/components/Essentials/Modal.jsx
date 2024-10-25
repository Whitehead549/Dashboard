import { motion } from 'framer-motion';

const Modal = ({ isOpen, onClose, title, message, onGmailClick }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="text-right space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition"
          >
            Close
          </button>
          <button
            onClick={onGmailClick} // Triggers openGmail when clicked
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            Check Your Inbox
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Modal;
