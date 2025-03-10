import React from "react";
import contactmail from "../assets/webpImages/contactmail.webp";
import help from "../assets/webpImages/help.webp";
import phone from "../assets/webpImages/phone.webp";
import telephone from "../assets/webpImages/telephone.webp";
import mountain from "../assets/webpImages/mountain.webp";

const features = [
  { name: "Email", description: "swca.support@iadabaddi.com" },
  { name: "Phone", description: "1795244222" },
  {
    name: "Address",
    description: "WRJ8+5CM, MDR7, Baddi, Himachal Pradesh 174103",
  },
  { name: "Support Hours", description: "Mon-Fri, 10am-6pm (IST)" },
];

export default function Contact() {
  return (
    <div
      className="py-16 relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${mountain})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative p-8 md:p-4 md:rounded-3xl mx-auto flex flex-col-reverse md:flex-row items-center gap-x-8 gap-y-16 px-4 sm:px-6 sm:py-32 lg:max-w-7xl lg:grid-cols-2 lg:px-8 bg-white bg-opacity-90 shadow-lg">
        <div className="md:w-1/2 mb-4">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Contact Us
          </h1>
          <p className="mt-4 text-lg text-gray-700">
            Reach out to us through any of the following methods:
          </p>

          <dl className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
            {features.map((feature) => (
              <div key={feature.name} className="border-t border-gray-300 pt-4">
                <dt className="text-xl font-medium text-gray-900">
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base text-gray-600">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6 lg:gap-8 md:w-1/2">
          <img
            alt="mail"
            src={contactmail}
            loading="lazy"
            className="rounded-lg bg-gray-200 shadow-md hover:scale-105 transform transition-transform duration-300"
          />
          <img
            alt="Support team"
            src={help}
            loading="lazy"
            className="rounded-lg bg-gray-200 shadow-md hover:scale-105 transform transition-transform duration-300"
          />
          <img
            alt="Customer service"
            src={phone}
            loading="lazy"
            className="rounded-lg bg-gray-200 shadow-md hover:scale-105 transform transition-transform duration-300"
          />
          <img
            alt="Contact us"
            src={telephone}
            loading="lazy"
            className="rounded-lg bg-gray-200 shadow-md hover:scale-105 transform transition-transform duration-300"
          />
        </div>
      </div>
    </div>
  );
}
