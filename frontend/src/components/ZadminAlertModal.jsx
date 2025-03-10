//ZA add alert modal for a specific industry
import React, { useState } from 'react';

const ZadminAlertModal = ({ showModal, setShowModal, addAlert }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [date, setDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newAlert = { title, content, date: new Date(date).toISOString().split('T')[0],alert_type:"industry" };
        addAlert(newAlert);
        setShowModal(false);
    };

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
  <div className="absolute inset-0 bg-black opacity-50"></div>
  <div className="bg-white rounded-lg p-8 relative z-10 max-w-lg w-full mx-4">
    <h2 className="text-3xl mb-6 text-center font-semibold text-gray-800">Add New Alert</h2>
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label className="block text-gray-700 mb-2 text-lg font-medium">Title</label>
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 mb-2 text-lg font-medium">Content</label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 h-32 resize-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 mb-2 text-lg font-medium">Date</label>
        <input
          type="date"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          className="bg-gray-500 text-white px-6 py-2 rounded-lg mr-2 hover:bg-gray-600 transition duration-200"
          onClick={() => setShowModal(false)}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-200"
        >
          Send 
        </button>
      </div>
    </form>
  </div>
</div>

    );
};

export default ZadminAlertModal;
