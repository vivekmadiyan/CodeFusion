import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { language, cmtheme, data } from "../atoms";
import {
  useRecoilState,
  useResetRecoilState,
} from "recoil";
import ACTIONS from "../actions/Actions";
import { initSocket } from "../socket";
import {
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";
import { languageOptions } from "../constants/languageOptions";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const EditorPage = () => {
  const [lang, setLang] = useRecoilState(language);
  const [them, setThem] = useRecoilState(cmtheme);

  const resetCode = useResetRecoilState(data);

  const [clients, setClients] = useState([]);
  const [initialCode, setInitialCode] = useState("");

  const socketRef = useRef(null);
  const codeRef = useRef("");

  const { roomId } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;

  // ================= SOCKET =================
  useEffect(() => {
    const init = async () => {
      try {
        socketRef.current = await initSocket();

        socketRef.current.on("connect_error", handleErrors);
        socketRef.current.on("connect_failed", handleErrors);

        socketRef.current.emit(ACTIONS.JOIN, { roomId });

        socketRef.current.on(
          ACTIONS.JOINED,
          ({ clients, username, socketId }) => {
            setClients(clients);

         if (codeRef.current && codeRef.current.trim() !== "") {
  socketRef.current.emit(ACTIONS.SYNC_CODE, {
    code: codeRef.current,
    socketId,
  });
         }
        }

        );

        socketRef.current.on(
          ACTIONS.DISCONNECTED,
          ({ socketId, username }) => {
            toast.success(`${username} left the room`);
            setClients((prev) =>
              prev.filter((c) => c.socketId !== socketId)
            );
          }
        );
      } catch (err) {
        handleErrors(err);
      }
    };

    init();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
      }
    };
  }, []);

  // Reset code on room change
 useEffect(() => {
  // Only reset if there is no saved code yet
  if (!initialCode) {
    resetCode();
    codeRef.current = "";
  }
}, [roomId, initialCode]);


  // ================= LOAD SAVED CODE =================
  useEffect(() => {
    const loadSavedCode = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/record/fetch?roomId=${roomId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.code) {
          setInitialCode(response.data.code);
          codeRef.current = response.data.code;
          toast.success("Loaded saved code");
        }
      } catch {
        console.log("No saved code found");
      }
    };

    loadSavedCode();
  }, [roomId]);

  const handleErrors = () => {
    toast.error("Socket connection failed");
    navigate("/");
  };

  // ================= SAVE CODE =================
  const saveCode = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/record/save`,
        {
          roomId,
          code: codeRef.current,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Code saved");
    } catch {
      toast.error("Save failed");
    }
  };

  const handleChange = (e) => {
    const selected = languageOptions.find(
      (l) => l.value === e.target.value
    );
    if (selected) {
      setLang({ id: selected.id, value: selected.value });
      window.location.reload();
    }
  };

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  const leaveRoom = () => navigate("/");

  // ================= UI (UNCHANGED) =================
  return (
    <div className="flex h-screen bg-[#020617] text-gray-200">
      <aside className="w-72 min-w-[18rem] flex flex-col border-r border-white/10 p-4 overflow-y-auto">
        <h2 className="text-2xl font-extrabold text-center bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">
          CodeFusion
        </h2>

        <p className="text-xs text-gray-400 uppercase mb-2">
          Connected
        </p>

        <div className="flex flex-col gap-2 mb-4">
          {clients.map((client) => (
            <Client
              key={client.socketId}
              username={client.username}
            />
          ))}
        </div>

        <div className="mt-auto space-y-3">
          <select
            value={lang.value}
            onChange={handleChange}
            className="w-full bg-[#020617] border border-white/10 px-2 py-1 rounded-md text-sm"
          >
            {languageOptions.map((l) => (
              <option key={l.id} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>

          <select
            value={them}
            onChange={(e) => {
              setThem(e.target.value);
              window.location.reload();
            }}
            className="w-full bg-[#020617] border border-white/10 px-2 py-1 rounded-md text-sm"
          >
            <option value="material">Material</option>
            <option value="monokai">Monokai</option>
            <option value="dracula">Dracula</option>
            <option value="ayu-dark">Ayu Dark</option>
          </select>

          <button
            onClick={saveCode}
            className="w-full bg-green-500 py-2 rounded-md font-semibold hover:bg-green-600"
          >
            Save Code
          </button>

          <button
            onClick={copyRoomId}
            className="w-full bg-white/10 py-2 rounded-md hover:bg-white/20"
          >
            Copy Room ID
          </button>

          <button
            onClick={leaveRoom}
            className="w-full bg-red-500/20 py-2 rounded-md text-red-400 hover:bg-red-500/30"
          >
            Leave Room
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col bg-[#0f172a] min-h-0">
        <div className="flex-1 overflow-hidden min-h-0">
          <Editor
            socketRef={socketRef}
            roomId={roomId}
            initialCode={initialCode}
            onCodeChange={(code) => {
              codeRef.current = code;
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default EditorPage;
