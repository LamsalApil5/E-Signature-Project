import { Request, Response, NextFunction } from "express";
import { prismaClient } from "..";
import { UnprocessableEntity } from "../exceptions/validation";
import { ErrorCodes } from "../exceptions/root";

export const getAllDocuments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const documents = await prismaClient.document.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
      },
    });

    res.status(200).json(documents);
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
