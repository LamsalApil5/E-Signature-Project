import { Request, Response, NextFunction } from "express";
import { prismaClient } from "..";
import { BadRequestsException } from "../exceptions/bad-requests";
import { UnprocessableEntity } from "../exceptions/validation";
import { ErrorCodes } from "../exceptions/root";
import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'public', 'uploads'); 
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); 
    }
    cb(null, uploadPath); // Save files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    // Set the filename for the uploaded file (timestamp + original name)
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype !== "application/pdf") {
    // Reject the file if it is not a PDF and throw a BadRequestsException
    return new BadRequestsException(
      "Only PDF files are allowed",
      ErrorCodes.UPLOAD_FAILED
    );
  }
  // Accept the file
  cb(null, true);
};

// Create the multer upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).single("contentFile"); // 'content' is the field name in the form for the uploaded file

export const createDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  debugger
  // First, handle the file upload using multer
  upload(req, res, async (err) => {
    if (err) {
      return next(
        new BadRequestsException("File upload error", ErrorCodes.UPLOAD_FAILED)
      );
    }

    try {
      const { title } = req.body;
      const contentFile = req.file?.path; // The path where the PDF was stored on the server

      // Validate the data (example: check if title is provided)
      if (!title || !contentFile) {
        return next(
          new BadRequestsException(
            "Title and Content are required!",
            ErrorCodes.MISSING_REQUIRED_FIELDS
          )
        );
      }

      // Create the document in the database with the file path stored in content
      const document = await prismaClient.document.create({
        data: {
          title,
          contentFile, // Save the file path here
        },
      });

      // Return the created document
      res.status(201).json(document);
    } catch (err: any) {
      next(
        new UnprocessableEntity(
          err?.issues,
          "Unprocessable entity",
          ErrorCodes.UNPROCESSABLE_ENTITY
        )
      );
    }
  });
};



export const updateDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { documentId } = req.params;

  // Handle file upload if a new file is provided
  upload(req, res, async (err) => {
    if (err) {
      return next(
        new BadRequestsException("File upload error", ErrorCodes.UPLOAD_FAILED)
      );
    }

    try {
      const { title } = req.body;
      const contentFile = req.file?.path; // New file path if uploaded

      if (!title && !contentFile) {
        return next(
          new BadRequestsException(
            "At least one field (title or file) must be updated.",
            ErrorCodes.MISSING_REQUIRED_FIELDS
          )
        );
      }

      // Fetch the existing document to update
      const existingDocument = await prismaClient.document.findUnique({
        where: { id: documentId },
      });

      if (!existingDocument) {
        return next(
          new BadRequestsException(
            "Document not found!",
            ErrorCodes.NOT_FOUND
          )
        );
      }

      // Update document
      const updatedDocument = await prismaClient.document.update({
        where: { id: documentId },
        data: {
          title: title || existingDocument.title, // Keep existing title if not updated
          contentFile: contentFile || existingDocument.contentFile, // Keep existing file if not updated
        },
      });

      res.status(200).json(updatedDocument);
    } catch (err: any) {
      next(
        new UnprocessableEntity(
          err?.issues,
          "Unprocessable entity",
          ErrorCodes.UNPROCESSABLE_ENTITY
        )
      );
    }
  });
};

export const deleteDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { documentId } = req.params;

  try {
    // Fetch the document to delete
    const document = await prismaClient.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return next(
        new BadRequestsException("Document not found!", ErrorCodes.NOT_FOUND)
      );
    }

    // Delete the document file from the server if it exists
    if (document.contentFile && fs.existsSync(document.contentFile)) {
      fs.unlinkSync(document.contentFile);
    }

    // Delete the document from the database
    await prismaClient.document.delete({
      where: { id: documentId },
    });

    res.status(200).json({ message: "Document deleted successfully!" });
  } catch (err: any) {
    next(
      new UnprocessableEntity(
        err?.issues,
        "Unprocessable entity",
        ErrorCodes.UNPROCESSABLE_ENTITY
      )
    );
  }
};

export const getPaginatedDocuments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const pageNumber = parseInt(page as string);
    const pageSize = parseInt(limit as string);
    const skip = (pageNumber - 1) * pageSize;

    // Fetch documents with pagination
    const [documents, totalDocuments] = await prismaClient.$transaction([
      prismaClient.document.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" }, // Assuming a `createdAt` field
      }),
      prismaClient.document.count(),
    ]);

    res.status(200).json({
      data: documents,
      meta: {
        total: totalDocuments,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(totalDocuments / pageSize),
      },
    });
  } catch (err: any) {
    next(
      new UnprocessableEntity(
        err?.issues,
        "Unprocessable entity",
        ErrorCodes.UNPROCESSABLE_ENTITY
      )
    );
  }
};

export const getDocumentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.query; // Get the 'id' from the query parameters

  if (!id) {
    return next(
      new BadRequestsException("ID parameter is required", ErrorCodes.MISSING_REQUIRED_FIELDS)
    );
  }

  try {
    // Fetch the document from the database using Prisma
    const document = await prismaClient.document.findUnique({
      where: {
        id: id as string, // Type assertion for the query parameter
      },
    });

    if (!document) {
      // If document not found, return an error
      return next(
        new BadRequestsException("Document not found", ErrorCodes.NOT_FOUND)
      );
    }

    // Send back the found document in the response
    res.status(200).json(document);
  } catch (err: any) {
    next(
      new UnprocessableEntity(
        err?.issues,
        "Unprocessable entity",
        ErrorCodes.UNPROCESSABLE_ENTITY
      )
    );
  }
};
