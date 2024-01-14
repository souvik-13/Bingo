import { useEffect, useState } from "react";
// import { Socket, io } from "socket.io-client";

const Join = () => {
  const [localName, setLocalName] = useState<string>(localStorage.getItem("name") || "");
  useEffect(() => {
    localStorage.setItem("name", localName);
  }, [localName]);
  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col w-full max-w-sm px-4 py-8 bg-white rounded-lg shadow dark:bg-gray-900 sm:px-6 md:px-8 lg:px-10">
        <div className="self-center mb-6 text-xl font-light text-gray-600 sm:text-2xl dark:text-white">
          <h1 className="mb-4 text-2xl font-extrabold leading-none text-gray-900 lg:text-5xl dark:text-white">
            Join a room
          </h1>
        </div>
        <div className="flex flex-col items-center justify-center mt-6">
          <input
            type="text"
            className="w-full px-4 py-2 mb-4 text-base text-gray-700 bg-gray-200 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
            placeholder="Enter your name"
            value={localName}
            onChange={(e) => {
              e.preventDefault();
              setLocalName(e.target.value);
              localStorage.setItem("name", localName);
            }}
          />
          <button
            className="w-full"
            onClick={(e) => {
              e.preventDefault();
              if (localName) {
                window.location.href = `/room?name=${localName}`;
              }
            }}
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default Join;
