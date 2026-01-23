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
    setOutputDetails(null); // Clear previous output

    // Language ID mapping for Judge0
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
      html: 63, // Uses JavaScript engine
      css: 63, // Uses JavaScript engine
      markdown: 63,
      shell: 46,
    };

    // Get language ID - handle both string and object formats
    let languageId;
    if (typeof lang === 'string') {
      languageId = LANGUAGE_IDS[lang.toLowerCase()] || 63;
    } else if (lang && lang.id) {
      languageId = lang.id;
    } else {
      languageId = 63; // Default to JavaScript
    }

    const formData = {
      language_id: languageId,
      source_code: btoa(codeData),
      stdin: btoa(""), // Empty input
    };

    const options = {
      method: "POST",
      url: import.meta.env.VITE_RAPID_API_URL,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Host": import.meta.env.VITE_RAPID_API_HOST,
        "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY,
      },
      data: formData,
    };

    try {
      // Submit the code
      const response = await axios.request(options);
      const token = response.data.token;

      console.log("Submission token:", token);

      // Poll for result
      let result;
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1500));

        const resultOptions = {
          method: "GET",
          url: `${import.meta.env.VITE_RAPID_API_URL}/${token}`,
          params: { base64_encoded: "true", fields: "*" },
          headers: {
            "X-RapidAPI-Host": import.meta.env.VITE_RAPID_API_HOST,
            "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY,
          },
        };

        const resultResponse = await axios.request(resultOptions);
        result = resultResponse.data;

        console.log(`Attempt ${attempts + 1}:`, result.status.description);

        // Check if processing is complete (status id > 2 means done)
        if (result.status.id > 2) {
          break;
        }

        attempts++;
      }

      console.log("Execution Result:", result);
      setOutputDetails(result);
    } catch (err) {
      const error = err.response ? err.response.data : err;
      const status = err.response?.status;
      console.error("Compilation error:", error);
      
      if (status === 429) {
        setOutputDetails({
          status: { description: "Error" },
          stderr: btoa("Rate limit exceeded. Please wait and try again."),
        });
      } else {
        setOutputDetails({
          status: { description: "Error" },
          stderr: btoa(error.message || "Compilation failed. Please check your code and try again."),
        });
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
        className={`bg-green-500 text-white fixed top-5 right-5 px-4 py-2 rounded shadow-lg hover:bg-green-600 transition-colors ${
          processing || !codeData ? "cursor-not-allowed opacity-50" : ""
        }`}
      >
        {processing ? "Processing..." : "▶ Run Code"}
      </button>
      <OutputWindow outputDetails={outputDetails} />
    </div>
  );
};

export default Editor;
