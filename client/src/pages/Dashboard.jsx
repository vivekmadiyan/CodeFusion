import React, { useState } from "react";
import Form from "../components/Form";
import { useParams } from "react-router-dom";

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { username } = useParams();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const record = [];

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      {/* ===== NAVBAR ===== */}
      <nav className="flex items-center justify-between px-4 sm:px-8 py-4 bg-[#020617] border-b border-white/10">
        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          CodeFusion
        </h1>
        <p className="text-sm sm:text-lg text-gray-300 truncate max-w-[120px] sm:max-w-none">
          {username}
        </p>
      </nav>

      {/* ===== HERO ===== */}
      <section className="px-4 sm:px-8 py-8 sm:py-12">
        <h2 className="text-3xl sm:text-5xl font-bold leading-tight">
          Welcome back{" "}
          <span className="text-blue-500">{username}</span>
        </h2>
        <p className="mt-2 text-gray-400">
          Ready to collaborate and build something amazing?
        </p>

        <button
          onClick={openModal}
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 font-semibold hover:opacity-90 transition"
        >
          Create / Join Room
        </button>
      </section>

      {/* ===== RECENT ROOMS ===== */}
      <section className="px-4 sm:px-8 pb-16">
        {record.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {record.map((r, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition"
              >
                <p className="text-sm text-gray-400">Name</p>
                <p className="font-semibold">{r.name}</p>

                <p className="mt-3 text-sm text-gray-400">Room ID</p>
                <p className="text-xs break-all">{r.id}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ===== MODAL ===== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md mx-4">
            <button
              onClick={closeModal}
              className="absolute -top-10 right-0 text-2xl text-red-500 hover:scale-110 transition"
            >
              ✕
            </button>
            <Form />
          </div>
        </div>
      )}
    </main>
  );
}

export default Dashboard;
