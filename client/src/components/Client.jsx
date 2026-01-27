import React from "react";
import Avatar from "react-avatar";

const Client = ({ username }) => {
  return (
    <div className="client">
      <Avatar
        name={username}
        size="44"
        round="12px"
        textSizeRatio={2}
      />
      <span className="userName">{username}</span>
    </div>
  );
};

export default Client;
