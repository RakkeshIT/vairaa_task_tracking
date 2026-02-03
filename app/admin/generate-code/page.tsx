"use client";

import { useState } from "react";

const sections = [
  {
    name: "JavaScript",
    topics: ["Variables", "Functions", "Array Methods", "Promises"],
  },
  {
    name: "React JS",
    topics: ["Hooks", "State Management", "Routing", "Context API"],
  },
  {
    name: "Next JS",
    topics: ["App Router", "API Routes", "Auth", "Middleware"],
  },
];

export default function GenerateAttendanceCode() {
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const [isCodeActive, setIsCodeActive] = useState(false);
  const [isAttendancePageEnabled, setIsAttendancePageEnabled] =
    useState(false);

  const generateCode = () => {
    if (!selectedSection || !selectedTopic) {
      alert("Please select section and topic");
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
  };

  const currentTopics =
    sections.find((sec) => sec.name === selectedSection)?.topics || [];

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Generate Attendance Code</h1>

      {/* Section Select */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Select Section</label>
        <select
          className="w-full border p-2 rounded"
          value={selectedSection}
          onChange={(e) => {
            setSelectedSection(e.target.value);
            setSelectedTopic("");
          }}
        >
          <option value="">-- Select Section --</option>
          {sections.map((sec) => (
            <option key={sec.name} value={sec.name}>
              {sec.name}
            </option>
          ))}
        </select>
      </div>

      {/* Topic Select */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Select Topic</label>
        <select
          className="w-full border p-2 rounded"
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          disabled={!selectedSection}
        >
          <option value="">-- Select Topic --</option>
          {currentTopics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </div>

      {/* Generate Button */}
      <button
        onClick={generateCode}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
      >
        Generate Code
      </button>

      {/* Generated Code Display */}
      {generatedCode && (
        <div className="border p-4 rounded bg-gray-50">
          <h2 className="text-lg font-semibold mb-2">
            Attendance Code: {generatedCode}
          </h2>

          <p className="text-sm text-gray-600 mb-4">
            Section: {selectedSection} | Topic: {selectedTopic}
          </p>

          {/* Toggle Code Active */}
          <div className="flex items-center justify-between mb-3">
            <span>Code Active</span>
            <input
              type="checkbox"
              checked={isCodeActive}
              onChange={() => setIsCodeActive(!isCodeActive)}
            />
          </div>

          {/* Toggle Attendance Page */}
          <div className="flex items-center justify-between">
            <span>Enable Student Attendance Page</span>
            <input
              type="checkbox"
              checked={isAttendancePageEnabled}
              onChange={() =>
                setIsAttendancePageEnabled(!isAttendancePageEnabled)
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
