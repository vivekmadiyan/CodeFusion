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
import "codemirror/addon/scroll/simplescrollbars.css";

// Search
import "codemirror/addon/search/search";
import "codemirror/addon/search/searchcursor";
import "codemirror/addon/search/jump-to-line";
import "codemirror/addon/dialog/dialog";
import "codemirror/addon/dialog/dialog.css";

const Editor = ({ onCodeChange }) => {
  const editorRef = useRef(null);

  const lang = useRecoilValue(language);
  const editorTheme = useRecoilValue(cmtheme);

  // 🔥 LOCAL STATE (not Recoil)
  const [codeData, setCodeData] = useState("");
  const [processing, setProcessing] = useState(false);
  const [outputDetails, setOutputDetails] = useState(null);

  // ========================
  // Initialize CodeMirror
  // ========================
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.toTextArea();
      editorRef.current = null;
    }

    const textarea = document.getElementById("realtimeEditor");
    if (!textarea) return;

    editorRef.current = Codemirror.fromTextArea(textarea, {
      mode: { name: lang },
      theme: editorTheme,
      autoCloseTags: true,
      autoCloseBrackets: true,
      lineNumbers: true,
    });

    // ✅ Always start empty (no shared code)
    editorRef.current.setValue("");

    editorRef.current.on("change", (instance, changes) => {
      if (changes.origin === "setValue") return;

      const code = instance.getValue();
      setCodeData(code);
      onCodeChange?.(code);
    });

    return () => {
      if (editorRef.current) {
        editorRef.current.toTextArea();
      }
    };
  }, [lang, editorTheme]);

  // ========================
  // COMPILE — SAME AS BEFORE
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
      csharp: 51,
      php: 68,
      ruby: 72,
      go: 60,
      rust: 73,
      typescript: 74,
      kotlin: 78,
      swift: 83,
      xml: 75,
      html: 63,
      css: 63,
      markdown: 63,
      shell: 46,
    };

    let languageId;
    if (typeof lang === "string") {
      languageId = LANGUAGE_IDS[lang.toLowerCase()] || 63;
    } else if (lang?.id) {
      languageId = lang.id;
    } else {
      languageId = 63;
    }

    // ✅ ORIGINAL WORKING API CONFIG
    const API_URL =
      import.meta.env.VITE_RAPID_API_URL ||
      "https://judge0-ce.p.rapidapi.com/submissions";

    const API_HOST =
      import.meta.env.VITE_RAPID_API_HOST ||
      "judge0-ce.p.rapidapi.com";

    const API_KEY =
      import.meta.env.VITE_RAPID_API_KEY;

    try {
      const response = await axios.request({
        method: "POST",
        url: API_URL,
        params: { base64_encoded: "true", fields: "*" },
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Host": API_HOST,
          "X-RapidAPI-Key": API_KEY,
        },
        data: {
          language_id: languageId,
          source_code: btoa(codeData),
          stdin: btoa(""),
        },
      });

      const token = response.data.token;

      let result;
      for (let i = 0; i < 10; i++) {
        await new Promise((r) => setTimeout(r, 1500));

        const res = await axios.request({
          method: "GET",
          url: `${API_URL}/${token}`,
          params: { base64_encoded: "true", fields: "*" },
          headers: {
            "X-RapidAPI-Host": API_HOST,
            "X-RapidAPI-Key": API_KEY,
          },
        });

        result = res.data;
        if (result.status?.id > 2) break;
      }

      setOutputDetails(result);
    } catch (err) {
      console.error("Judge0 error:", err);
      setOutputDetails({
        status: { description: "Error" },
        stderr: btoa("Compilation failed"),
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
