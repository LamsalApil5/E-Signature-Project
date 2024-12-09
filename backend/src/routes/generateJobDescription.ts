import { Router } from 'express';
import { generateJobDescription } from '../controllers/generateJobDescription';

const generateJobDescriptionRoutes: Router = Router();

generateJobDescriptionRoutes.post('/create', generateJobDescription);
export default generateJobDescriptionRoutes;
