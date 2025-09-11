import React, { useState } from "react";
import Form from "../components/Form";
import { useParams } from "react-router-dom";

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { username } = useParams();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const record = [
    // { name: "xyx", id: "b7e0a702-ae08-414b-935f-3cd3285d16ab" },
    // { name: "xyx", id: "b7e0a702-ae08-414b-935f-3cd3285d16ab" },
    // { name: "xyx", id: "b7e0a702-ae08-414b-935f-3cd3285d16ab" },
  ];

  const str = "CodeFusion";
  const alphabetArray = str.split("");

  return (
    <main className="min-h-screen bg-gray-900">
      <nav className="bg-[#121212] text-white p-4 flex justify-between items-center">
        <div className="flex items-center justify-center cursor-pointer pb-2">
          <img
            src="/logo.png"
            alt="CodeFusion Logo"
            className="size-8 hover:scale-125"
          />
          {alphabetArray.map((char, index) => (
            <span className="text-4xl bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent font-bold hover:scale-125" key={index}>
              {char}
            </span>
          ))}
        </div>
        <p className="text-2xl">{username}</p>
      </nav>

      <p className="text-white mx-24 m-8 text-7xl">
        Welcome back <span className="text-blue-600">{username}</span>, happy
        coding...
      </p>

      <div className="mx-24 my-10">
        <button
          onClick={openModal}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Create / Join
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
          {record.map((r, index) => (
            <button
              key={index}
              className="bg-gray-700 p-4 border border-gray-600 rounded-lg shadow-md hover:shadow-lg hover:bg-gray-600 active:bg-gray-500 focus:outline-none transition-all duration-300"
            >
              {/* Name Section */}
              <div className="mb-4 flex gap-2 text-left">
                <p className="font-semibold text-gray-200">Name :</p>
                <p className="text-white">{r.name}</p>
              </div>

              {/* RoomID Section */}
              <div className="text-left">
                <p className="font-semibold text-gray-200">RoomID :</p>
                <p className="text-white">{r.id}</p>
              </div>
            </button>
          ))}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="relative">
              <button
                type="button"
                onClick={closeModal}
                className="absolute top-2 right-3 text-2xl text-red-500 hover:text-red-600 hover:scale-110"
              >
                X
              </button>
              <Form />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Dashboard;
