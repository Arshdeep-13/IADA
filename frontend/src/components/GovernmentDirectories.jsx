import React from 'react';
import { FaIndustry, FaBuilding, FaUserShield } from 'react-icons/fa';

// GovernmentDirectories component
function GovernmentDirectories() {
  return (
    // Container div with max width, padding, and margin auto
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      {/* Grid layout with different columns based on screen size */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 items-center gap-6 md:gap-10">
      
        {/* Card 1 */}
        <div className="size-full bg-white shadow-lg rounded-lg p-5 dark:bg-slate-900">
          {/* Flex container for icon and text */}
          <div className="flex items-center gap-x-4 mb-3">
            {/* Icon */}
            <div className="inline-flex justify-center items-center size-[62px] rounded-full border-4 border-blue-50 bg-blue-100 dark:border-blue-900 dark:bg-blue-800">
              {/* Icon SVG */}
              <FaIndustry className="flex-shrink-0 size-6 text-blue-600 dark:text-blue-400" />
            </div>
            {/* Text */}
            <div className="flex-shrink-0">
              <h3 className="block text-lg font-semibold text-gray-800 dark:text-white">Industrial Areas</h3>
            </div>
          </div>
          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400">The industry areas include Baddi, Katha, Thana, Lodhi Majra, Barotiwala, Jhajra Majri and Bhud</p>
        </div>

        {/* Card 2 */}
        <div className="size-full bg-white shadow-lg rounded-lg p-5 dark:bg-slate-900">
          <div className="flex items-center gap-x-4 mb-3">
            <div className="inline-flex justify-center items-center size-[62px] rounded-full border-4 border-blue-50 bg-blue-100 dark:border-blue-900 dark:bg-blue-800">
              <FaBuilding className="flex-shrink-0 size-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-shrink-0">
              <h3 className="block text-lg font-semibold text-gray-800 dark:text-white">Improvements</h3>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Continuos improvements are carried in the industrial areas  </p>
        </div>

        {/* Card 3 */}
        <div className="size-full bg-white shadow-lg rounded-lg p-5 dark:bg-slate-900">
          <div className="flex items-center gap-x-4 mb-3">
            <div className="inline-flex justify-center items-center size-[62px] rounded-full border-4 border-blue-50 bg-blue-100 dark:border-blue-900 dark:bg-blue-800">
              <FaUserShield className="flex-shrink-0 size-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-shrink-0">
              <h3 className="block text-lg font-semibold text-gray-800 dark:text-white">Industrial Safety Standards</h3>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Multiple safety measures are implemented to protect workers and the environment within industrial areas.</p>
        </div>
        

      </div>
    </div>
  );
}

export default GovernmentDirectories;
