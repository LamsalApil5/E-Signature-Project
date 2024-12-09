'use client';
import { CHATGPT } from "@/endpoints";
import { api } from "@/Services/apiService";  // Importing the API utility
import React, { useState } from "react";

// Define the request and response types
interface JobTitleRequest {
  jobTitle: string;
  description?: string; // Optional property for the response
}

const PromptGenerator = () => {
  const [jobTitle, setJobTitle] = useState<string>(""); // Job title input state
  const [loading, setLoading] = useState<boolean>(false); 
  const [error, setError] = useState<string>(""); 
  const [jobDescription, setJobDescription] = useState<string>(""); // Single description state

  const handleGeneratePrompt = async () => {
    if (!jobTitle.trim()) {
      setError("Job title is required");
      return;
    }

    setLoading(true);
    setError("");
    setJobDescription(""); // Clear previous description

    try {
      // Correct API call with the appropriate response type
      const response = await api.create<JobTitleRequest>(CHATGPT, { jobTitle });

      // Handle the response and extract the description
      setJobDescription(response.data.description ?? "No content available");
    } catch (error) {
      setError("Error generating job description");
      console.error("Error with API call:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Generate Job Role Descriptions</h1>

      {/* Input for Job Title */}
      <div className="mb-4">
        <input
          type="text"
          className="border p-2 w-full"
          placeholder="Enter job title (e.g. Laravel Developer)"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)} // Handle change for jobTitle input
          disabled={loading}
        />
      </div>

      {/* Generate button */}
      <button
        onClick={handleGeneratePrompt}
        className="p-2 bg-blue-500 text-white"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Job Description"}
      </button>

      {/* Error Message */}
      {error && (
        <div className="mt-4 text-red-500">
          <p>{error}</p>
        </div>
      )}

      {/* Displaying the generated job description */}
      {jobDescription && (
        <div className="mt-6 space-y-4">
          <div className="border p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold">Generated Job Description</h2>
            <pre>{jobDescription}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptGenerator;
