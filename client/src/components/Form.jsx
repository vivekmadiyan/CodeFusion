import React, { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DoorOpen, PlusCircle } from "lucide-react";
import styles from "./Form.module.css";

function Form() {
  const navigate = useNavigate();
  const { username } = useParams();

  const [roomId, setRoomId] = useState("");

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success("Created a new room");
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("ROOM ID & username is required");
      return;
    }

    navigate(`/editor/${roomId}`, {
      state: { username },
    });
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.logoText}>CodeFusion</span>
          <p>Join an existing room or create a new one</p>
        </div>

        {/* Input */}
        <div className={styles.field}>
          <input
            type="text"
            placeholder="Enter ROOM ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            onKeyUp={handleInputEnter}
          />
        </div>

        {/* Actions */}
        <button className={styles.joinBtn} onClick={joinRoom}>
          <DoorOpen size={18} /> Join Room
        </button>

        <p className={styles.createText}>
          Don&apos;t have an invite?{" "}
          <Link onClick={createNewRoom} className={styles.createBtn}>
            <PlusCircle size={16} /> Create new room
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Form;
