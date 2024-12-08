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
documentRoutes.put("/update", updateDocument);
documentRoutes.delete("/delete", deleteDocument);

export default documentRoutes;
