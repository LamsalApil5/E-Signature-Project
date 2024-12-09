import { Router } from "express";
import authRoutes from "./auth";
import documentRoutes from "./document";
import commonRoutes from "./common";

const rootRouter: Router = Router()

rootRouter.use('/auth', authRoutes)
rootRouter.use('/documents', documentRoutes)
rootRouter.use('/common',commonRoutes)

export default rootRouter