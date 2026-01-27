import React, { useEffect, useRef, useState } from "react";
import { language, cmtheme } from "../atoms";
import { useRecoilValue } from "recoil";
import OutputWindow from "./OutputWindow";
import axios from "axios";

// Codemirror
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";

// Themes
import "codemirror/theme/dracula.css";
import "codemirror/theme/material.css";
import "codemirror/theme/monokai.css";
import "codemirror/theme/ayu-dark.css";
import "codemirror/theme/eclipse.css";
import "codemirror/theme/duotone-light.css";

// Modes
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

// Features
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";

const Editor = ({ onCodeChange }) => {
  const editorRef = useRef(null);

  const lang = useRecoilValue(language);
  const editorTheme = useRecoilValue(cmtheme);

  const [codeData, setCodeData] = useState("");
  const [processing, setProcessing] = useState(false);
  const [outputDetails, setOutputDetails] = useState(null);

  // ========================
  // INIT CODEMIRROR
  // ========================
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.toTextArea();
    }

    const textarea = document.getElementById("realtimeEditor");
    if (!textarea) return;

    editorRef.current = Codemirror.fromTextArea(textarea, {
      mode: { name: lang },
      theme: editorTheme,
      lineNumbers: true,
      autoCloseTags: true,
      autoCloseBrackets: true,
    });

    editorRef.current.setValue("");

    editorRef.current.on("change", (instance, change) => {
      if (change.origin === "setValue") return;
      const value = instance.getValue();
      setCodeData(value);
      onCodeChange?.(value);
    });

    return () => {
      editorRef.current?.toTextArea();
    };
  }, [lang, editorTheme]);

  // ========================
  // COMPILE (BACKEND ONLY)
  // ========================
  const handleCompile = async () => {
    if (!codeData) return;

    setProcessing(true);
    setOutputDetails(null);

    const LANGUAGE_IDS = {
      javascript: 63,
      python: 71,
      java: 62,
      cpp: 54,
      c: 50,
      php: 68,
      ruby: 72,
      go: 60,
      rust: 73,
    };

    const languageId =
      typeof lang === "string"
        ? LANGUAGE_IDS[lang.toLowerCase()] || 63
        : 63;

    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/compile",
        {
          language_id: languageId,
          source_code: btoa(unescape(encodeURIComponent(codeData))),
        }
      );

      setOutputDetails(response.data);
    } catch (err) {
      console.error("Compile error:", err);
      setOutputDetails({
        status: { description: "Error" },
        stderr: btoa("Compilation failed on server"),
      });
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
        className={`bg-green-500 text-white fixed top-5 right-5 px-4 py-2 rounded shadow-lg z-50 ${
          processing || !codeData ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {processing ? "⏳ Processing..." : "▶ Run Code"}
      </button>

      <OutputWindow outputDetails={outputDetails} />
    </div>
  );
};

export default Editor;
