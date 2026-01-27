import React from "react";

const OutputWindow = ({ outputDetails }) => {
  const safeDecode = (data) => {
    try {
      return data ? atob(data) : "";
    } catch {
      return "⚠️ Unable to decode output";
    }
  };

  const getOutput = () => {
    const statusId = outputDetails?.status?.id;

    // Compilation Error
    if (statusId === 6) {
      return (
        <pre className="text-red-400 text-sm whitespace-pre-wrap">
          {safeDecode(outputDetails?.compile_output)}
        </pre>
      );
    }

    // Success
    if (statusId === 3) {
      return (
        <pre className="text-green-400 text-sm whitespace-pre-wrap">
          {safeDecode(outputDetails?.stdout)}
        </pre>
      );
    }

    // Time Limit Exceeded
    if (statusId === 5) {
      return (
        <pre className="text-yellow-400 text-sm">
          ⏱ Time Limit Exceeded
        </pre>
      );
    }

    // Runtime / Other errors
    return (
      <pre className="text-red-400 text-sm whitespace-pre-wrap">
        {safeDecode(outputDetails?.stderr)}
      </pre>
    );
  };

  return (
    <div className="w-full bg-[#020617] border-t border-white/10">
      {/* Header */}
      <div className="px-4 py-2 text-sm font-semibold text-gray-300 bg-[#020617]">
        Output
      </div>

      {/* Output body */}
      <div className="max-h-48 overflow-y-auto px-4 pb-4">
        {outputDetails ? getOutput() : (
          <p className="text-gray-500 text-sm">
            Run the code to see output here…
          </p>
        )}
      </div>
    </div>
  );
};

export default OutputWindow;
