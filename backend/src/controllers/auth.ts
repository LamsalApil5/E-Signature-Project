import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { BadRequestsException } from "../exceptions/bad-requests";
import { ErrorCodes } from "../exceptions/root";
import { UnprocessableEntity } from "../exceptions/validation";
import { signupSchema } from "../schema/users";
// SignUp Handler
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    signupSchema.parse(req.body)
    const {name, email, password } = req.body;

    let user = await prismaClient.user.findFirst({ where: { email } });
    if (user) {
      return next(
        new BadRequestsException(
          "User already created found!",
          ErrorCodes.ALREADY_EXISTS
        )
      );
    }

    user = await prismaClient.user.create({
      data: {
        name,
        email,
        password: hashSync(password, 10),
      },
    });

    res.json(user);
  } catch (err: any) {
    next(
      new UnprocessableEntity(
        err?.issues,
        "unprocessable entity",
        ErrorCodes.UNPROCESSABLE_ENTITY
      )
    );
  }
};

//get user List
export const getUserList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Fetch users from the database
    const users = await prismaClient.user.findMany();

    if (!users || users.length === 0) {
      return next(
        new BadRequestsException(
          "No users found!",
          ErrorCodes.NOT_FOUND
        )
      );
    }

    // Return the list of users
    res.json(users);
  } catch (err: any) {
    // Handle error (if any)
    next(
      new BadRequestsException(
        "Error fetching users",
        ErrorCodes.SERVER_ERROR
      )
    );
  }
};
// Get a user by ID
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params; // Getting the user ID from the URL parameters
    if (!userId || typeof userId !== "string") {
      return next(
        new BadRequestsException(
          "Invalid or missing userId parameter",
          ErrorCodes.MISSING_REQUIRED_FIELDS
        )
      );
    }
    // Fetch the user by ID from the database
    const user = await prismaClient.user.findUnique({
      where: { id: userId }, // Prisma will handle the ObjectId string
    });
    if (!user) {
      return next(
        new BadRequestsException(
          "User not found!",
          ErrorCodes.NOT_FOUND
        )
      );
    }

    // Return the user data
    res.status(200).json(user);
  } catch (err: any) {
    // Handle error (if any)
    next(
      new BadRequestsException(
        "Error fetching user",
        ErrorCodes.SERVER_ERROR
      )
    );
  }
};

// Login Handler
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  let user = await prismaClient.user.findFirst({ where: { email } });
  if (!user) {
    return next(
      new BadRequestsException(
        "User does not exists!",
        ErrorCodes.NOT_FOUND
      )
    );
  }

  if (!compareSync(password, user.password)) res.json(user);
  const token = jwt.sign(
    {
      userId: user.id,
    },
    JWT_SECRET
  );

  res.json({ user, token });
};
