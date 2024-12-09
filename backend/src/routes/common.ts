import { Router } from 'express';
import { getAllDocuments } from '../controllers/common';

const commonRoutes: Router = Router();

commonRoutes.get('/documents', getAllDocuments);
export default commonRoutes;
