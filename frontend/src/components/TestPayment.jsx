import React, { useState, useRef } from "react";

const TestPayment = () => {
  const [link, setlink] = useState("");

  async function handlePayment() {
    let res = await fetch(
      `${import.meta.env.VITE_SERVER}/generate-encrypted-url`,
      {
        method: "post",
      }
    );
    res = await res.json();
    window.location.href = decodeURIComponent(res.encryptedUrl);
    setlink(decodeURIComponent(res.encryptedUrl));
    return decodeURIComponent(res.encryptedUrl);
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-2">
      <button
        className="bg-blue-600 rounded px-5 py-2 text-xl text-white"
        onClick={handlePayment}
      >
        pay
      </button>
      <a href={link} id="link" >
        {link}
      </a>
    </div>
  );
};

export default TestPayment;
