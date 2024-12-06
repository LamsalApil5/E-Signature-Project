import { Router } from 'express';
import { createDocument, getDocumentById, getDocuments, updateDocumentSignature } from '../controllers/document';

const documentRoutes: Router = Router();

documentRoutes.post('/create', createDocument);
documentRoutes.get('', getDocuments);
documentRoutes.get(':id', getDocumentById);
documentRoutes.put(':id/signature', updateDocumentSignature);
export default documentRoutes;
