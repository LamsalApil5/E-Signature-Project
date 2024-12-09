import { Request, Response, NextFunction } from "express";
import { OpenAI } from "openai"; // Import OpenAI package
import { UnprocessableEntity } from "../exceptions/validation";
import { ErrorCodes } from "../exceptions/root";
import { BadRequestsException } from "../exceptions/bad-requests";
import { CHATGPT_KEY } from "../secrets";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: CHATGPT_KEY, // OpenAI API key from environment variables
});

export const generateJobDescription = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Check if the request method is POST
  if (req.method !== "POST") {
    // Directly use `res.status().json()` without returning
    res.status(405).json({ error: "Method Not Allowed" });
    return; // Stop further execution after sending the response
  }

  const { jobTitle } = req.body;

  // Validate if jobTitle exists and is non-empty
  if (!jobTitle || jobTitle.trim().length === 0) {
    // Pass error to the next middleware for proper handling
    return next(
      new BadRequestsException(
        "Job title is required",
        ErrorCodes.MISSING_REQUIRED_FIELDS
      )
    );
  }

  try {
    // Generate the job description using OpenAI's API
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Use the ChatGPT 3.5 model
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: `Generate a detailed job description for a role titled "${jobTitle}". It should include key responsibilities, required skills, and other relevant details for the role.`,
        },
      ],
      max_tokens: 150, // Adjust token limit as needed
    });

    // Send the generated job description in the response
    res.status(200).json({ description: response?.choices?.[0]?.message?.content?.trim() });
  } catch (error: any) {
    console.error("Error generating job description:", error);
    // Pass error to next middleware
    next(
      new UnprocessableEntity(
        error?.issues || error.message,
        "Error generating job description",
        ErrorCodes.UNPROCESSABLE_ENTITY
      )
    );
  }
};
