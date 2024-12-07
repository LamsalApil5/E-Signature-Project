'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { CHATGPT_KEY } from '@/config';

const PromptGenerator = () => {
  const [jobTitle, setJobTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');

  const handleGeneratePrompt = async () => {
    if (!jobTitle.trim()) {
      setError('Job title is required');
      return;
    }

    setLoading(true);
    setError('');
    setJobDescription('');

    try {
      // Make request to OpenAI API to generate the job description
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions', // Correct endpoint for GPT models
        {
          model: 'gpt-4o-mini', // Use a valid model name like 'gpt-4' or 'gpt-3.5-turbo'
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            {
              role: 'user',
              content: `Generate a detailed job description for a role titled "${jobTitle}". It should include key responsibilities, required skills, and other relevant details for the role.`,
            },
          ],
          max_tokens: 150, // You can adjust the token limit as needed
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CHATGPT_KEY}`, // Replace with your actual OpenAI API key
          },
        }
      );

      // Check if the response contains the job description
      const description = response.data.choices[0].message.content.trim();
      setJobDescription(description);
    } catch (error: any) {
      // Improved error handling
      if (error.response) {
        setError(`Error: ${error.response.status} - ${error.response.data.error.message}`);
      } else if (error.request) {
        setError('No response received from the API.');
      } else {
        setError(`Request failed: ${error.message}`);
      }
      console.error('Error with the API request:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Generate Job Role Description</h1>

      {/* Input for Job Title */}
      <div className="mb-4">
        <input
          type="text"
          className="border p-2 w-full"
          placeholder="Enter job title (e.g. Laravel Developer)"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          disabled={loading}
        />
      </div>

      {/* Generate button */}
      <button
        onClick={handleGeneratePrompt}
        className="p-2 bg-blue-500 text-white"
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Job Description'}
      </button>

      {/* Error Message */}
      {error && (
        <div className="mt-4 text-red-500">
          <p>{error}</p>
        </div>
      )}

      {/* Displaying generated job description */}
      {jobDescription && (
        <div className="mt-6 space-y-4">
          <div className="border p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold">Job Description</h2>
            <pre>{jobDescription}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptGenerator;
