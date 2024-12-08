import { Router } from "express";
import {
  createDocument,
  getDocumentById,
  getPaginatedDocuments,
  updateDocument,
  deleteDocument,
} from "../controllers/document";

const documentRoutes: Router = Router();

documentRoutes.post("/create", createDocument);
documentRoutes.get("/", getPaginatedDocuments);
documentRoutes.get("/document", getDocumentById);
documentRoutes.put("/:id", updateDocument);
documentRoutes.delete("/:id", deleteDocument);

export default documentRoutes;
