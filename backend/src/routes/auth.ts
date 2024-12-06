import { Router } from 'express';
import { getUserById, getUserList, login, signup } from '../controllers/auth';

const authRoutes: Router = Router();

authRoutes.post('/signup', signup);
authRoutes.get('/users', getUserList);
authRoutes.get('/users:userId', getUserById);
authRoutes.post("/login", login)
export default authRoutes;
