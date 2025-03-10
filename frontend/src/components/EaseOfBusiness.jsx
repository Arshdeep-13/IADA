import React from "react";

const EaseOfBusiness = () => {
  const infoSections = [
    {
      title: "Common Application Form",
      description:
        "This Facilitates online Filling of application form, that will contain requisite information for approval from an investor before establishing any industry.",
      icon: "✍️",
      bgColor: "bg-green-500",
      borderColor: "border-green-500",
    },
    {
      title: "Time Bound Project Approvals",
      description:
        "Project approvals with stipulated timelines backed by State Service Guarantee Act.",
      icon: "⏱️",
      bgColor: "bg-yellow-500",
      borderColor: "border-yellow-500",
    },
    {
      title: "Single Window Act",
      description:
        "A robust single window Act aimed at enhancing the EoDB in the state and improving the process of Single Window Clearance System.",
      icon: "✅",
      bgColor: "bg-green-400",
      borderColor: "border-green-400",
    },
    {
      title: "Investment Promotion & Facilitation Cell",
      description:
        "To Promote the state as an Ideal Industrial Investment Destination and Facilitate Industrial Investors.",
      icon: "📊",
      bgColor: "bg-blue-500",
      borderColor: "border-blue-500",
    },
    {
      title: "IAC (Industrial Advisory Council)",
      description:
        "Constituted to ensure healthy involvement and interaction with industrial stakeholders in decision making process.",
      icon: "ℹ️",
      bgColor: "bg-red-500",
      borderColor: "border-red-500",
    },
  ];

  return (
    <div className="flex flex-col items-center py-12 relative">
      <h2 className="text-3xl font-bold mb-8 bg-green-600 text-white p-7 rounded-custom shadow-xl">
        Ease Of Doing Business
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl px-6">
        {infoSections.map((section, index) => (
          <div
            key={index}
            className={`flex flex-col justify-center items-center p-5 rounded-full bg-white border-[33px] h-96 ${section.borderColor} custom-box-shadow shadow-2xl`}
          >
            <div
              className={`w-16 h-16 flex justify-center items-center rounded-full text-white text-3xl ${section.bgColor}`}
            >
              {section.icon}
            </div>
            <h3 className="text-xl font-semibold mt-4 text-center">
              {section.title}
            </h3>
            <p className="text-center text-gray-600 mt-2">
              {section.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EaseOfBusiness;
