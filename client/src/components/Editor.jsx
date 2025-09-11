import React, { useEffect, useRef, useState } from "react";
import { language, cmtheme, data } from "../atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import ACTIONS from "../actions/Actions";
import OutputWindow from "./OutputWindow";
import axios from "axios";

// Codemirror
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";

// Codemirror Themes
import "codemirror/theme/dracula.css";
import "codemirror/theme/material.css";
import "codemirror/theme/monokai.css";
import "codemirror/theme/ayu-dark.css";
import "codemirror/theme/eclipse.css";
import "codemirror/theme/duotone-light.css";

// Codemirror Modes
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/python/python";
import "codemirror/mode/clike/clike";
import "codemirror/mode/xml/xml";
import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/mode/css/css";
import "codemirror/mode/markdown/markdown";
import "codemirror/mode/php/php";
import "codemirror/mode/ruby/ruby";
import "codemirror/mode/shell/shell";

// Codemirror Features
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/scroll/simplescrollbars.css";

// Codemirror Search
import "codemirror/addon/search/search";
import "codemirror/addon/search/searchcursor";
import "codemirror/addon/search/jump-to-line";
import "codemirror/addon/dialog/dialog";
import "codemirror/addon/dialog/dialog.css";

const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef(null);
  const lang = useRecoilValue(language);
  const editorTheme = useRecoilValue(cmtheme);
  const [codeData, setCodeData] = useRecoilState(data);
  const [processing, setProcessing] = useState(false);
  const [outputDetails, setOutputDetails] = useState(null);

  useEffect(() => {
    async function init() {
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById("realtimeEditor"),
        {
          mode: { name: lang },
          theme: editorTheme,
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );

      editorRef.current.on("change", (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        setCodeData(code);
        if (origin !== "setValue" && socketRef.current) {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });
    }

    init();
  }, [lang]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off(ACTIONS.CODE_CHANGE);
      }
    };
  }, [socketRef.current]);

  const handleCompile = async () => {
    if (!codeData) return;
    setProcessing(true);

    const formData = {
      language_id: lang.id,
      source_code: btoa(codeData),
    };

    const options = {
      method: "POST",
      url: import.meta.env.VITE_RAPID_API_URL,
      params: { base64_encoded: "true", fields: "*", wait: "true" },
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Host": import.meta.env.VITE_RAPID_API_HOST,
        "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY,
      },
      data: formData,
    };

    try {
      const response = await axios.request(options);
      console.log("Execution Result", response.data);
      setOutputDetails(response.data);
    } catch (err) {
      const error = err.response ? err.response.data : err;
      const status = err.response?.status;
      console.log("Error:", error);
      if (status === 429) {
        console.log("Too many requests");
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="h-full w-full">
      <textarea id="realtimeEditor" />
      <button
        onClick={handleCompile}
        disabled={processing || !codeData}
        className={`bg-green-500 text-white fixed top-5 right-5 px-2 py-1 rounded ${
          processing || !codeData ? "cursor-not-allowed opacity-50" : ""
        }`}
      >
        {processing ? "Processing..." : "Compile"}
      </button>
      <OutputWindow outputDetails={outputDetails} />
    </div>
  );
};

export default Editor;
