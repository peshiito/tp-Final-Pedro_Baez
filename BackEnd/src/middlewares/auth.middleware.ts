import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IJWTPayload, IRequestWithUser } from "../interfaces";

export const authenticate = (
  req: IRequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secreto",
    ) as IJWTPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: IRequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }

    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({
        message: "No tienes permisos para esta acción",
        requiredRoles: roles,
        userRole: req.user.rol,
      });
    }

    next();
  };
};
