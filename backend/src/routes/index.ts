import { Router } from "express";
import authRoutes from "./auth";
import documentRoutes from "./document";

const rootRouter: Router = Router()

rootRouter.use('/auth', authRoutes)
rootRouter.use('/documents', documentRoutes)
export default rootRouter