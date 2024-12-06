import { Request, Response, NextFunction } from 'express';
import { prismaClient } from "..";
import { BadRequestsException } from '../exceptions/bad-requests'; 
import { UnprocessableEntity } from "../exceptions/validation";
import { ErrorCodes } from '../exceptions/root';

// Create a new document
export const createDocument = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { title, content, userId } = req.body;
  
      // Check if userId exists in the user table
      const user = await prismaClient.user.findFirst({
        where: { id: userId },
      });
  
  
  
      if (!user) {
        return next(
          new BadRequestsException(
            'User not found!',
            ErrorCodes.NOT_FOUND
          )
        );
      }
  
      // Validate the data (example: check if title and content are provided)
      if (!title || !content) {
        return next(
          new BadRequestsException(
            'Title and Content are required!',
            ErrorCodes.MISSING_REQUIRED_FIELDS
          )
        );
      }
  
      // Create document
      const document = await prismaClient.document.create({
        data: {
          title,
          content,
          userId, // assuming the document belongs to a user
        },
      });
  
      res.status(201).json(document); // Return the created document
    } catch (err: any) {
      next(
        new UnprocessableEntity(
          err?.issues,
          'Unprocessable entity',
          ErrorCodes.UNPROCESSABLE_ENTITY
        )
      );
    }
  };

// Get all documents
export const getDocuments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const documents = await prismaClient.document.findMany();
    res.status(200).json(documents);
  } catch (err: any) {
    next(
      new UnprocessableEntity(
        err?.issues,
        'unprocessable entity',
        ErrorCodes.UNPROCESSABLE_ENTITY
      )
    );
  }
};

// Get document by ID
export const getDocumentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { documentId } = req.params;

  try {
    const document = await prismaClient.document.findUnique({
      where: {
        id: documentId,
      },
    });

    if (!document) {
      return next(
        new BadRequestsException(
          'Document not found!',
          ErrorCodes.NOT_FOUND
        )
      );
    }

    res.status(200).json(document);
  } catch (err: any) {
    next(
      new UnprocessableEntity(
        err?.issues,
        'unprocessable entity',
        ErrorCodes.UNPROCESSABLE_ENTITY
      )
    );
  }
};

// Update document signature
export const updateDocumentSignature = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { documentId } = req.params;
  const { signature, userId } = req.body; // expecting base64 signature and signerId

  try {
    // Find the document by ID
    const document = await prismaClient.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return next(
        new BadRequestsException(
          'Document not found!',
          ErrorCodes.NOT_FOUND
        )
      );
    }

    // Update the document with the signature and signer
    const updatedDocument = await prismaClient.document.update({
      where: { id: documentId },
      data: {
        signature,  // Save the base64 signature
        userId,   // Store the signer's ID
        status: 'Signed',  // Update the status to 'Signed'
      },
    });

    res.status(200).json(updatedDocument);
  } catch (err: any) {
    next(
      new UnprocessableEntity(
        err?.issues,
        'unprocessable entity',
        ErrorCodes.UNPROCESSABLE_ENTITY
      )
    );
  }
};
