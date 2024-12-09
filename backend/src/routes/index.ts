import { Router } from "express";
import authRoutes from "./auth";
import documentRoutes from "./document";
import commonRoutes from "./common";
import generateJobDescriptionRoutes from "./generateJobDescription";

const rootRouter: Router = Router()

rootRouter.use('/auth', authRoutes)
rootRouter.use('/documents', documentRoutes)
rootRouter.use('/common',commonRoutes)
rootRouter.use('/chatgpt', generateJobDescriptionRoutes)
export default rootRouter