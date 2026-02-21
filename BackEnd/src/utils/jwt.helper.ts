import jwt from "jsonwebtoken";
import { IJWTPayload } from "../interfaces";

export const generateToken = (payload: IJWTPayload): string => {
  // Asegurarnos de que el secreto sea string
  const secret: string = process.env.JWT_SECRET || "secreto";

  // Opciones tipadas correctamente
  const options: jwt.SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN ||
      "24h") as jwt.SignOptions["expiresIn"],
  };

  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string): IJWTPayload => {
  const secret: string = process.env.JWT_SECRET || "secreto";
  return jwt.verify(token, secret) as IJWTPayload;
};
