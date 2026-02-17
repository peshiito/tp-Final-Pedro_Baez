import { Request, Response } from "express";
import { comparePassword } from "../utils/bcrypt.helper";
import { generateToken } from "../utils/jwt.helper";
import { UsuarioModel } from "../models/usuario.model";
import { DuenoModel } from "../models/dueno.model";
import { VeterinarioModel } from "../models/veterinario.model";
import {
  RegisterDuenoDTO,
  RegisterVeterinarioDTO,
  LoginDTO,
} from "../dtos/auth.dto";

export class AuthController {
  // Login para cualquier usuario
  static async login(req: Request, res: Response) {
    try {
      const { email, password }: LoginDTO = req.body;

      // Buscar usuario por email
      const usuario = await UsuarioModel.findByEmail(email);
      if (!usuario) {
        return res
          .status(401)
          .json({ message: "Email o contraseña incorrectos" });
      }

      // Verificar contraseña
      const isValidPassword = await comparePassword(password, usuario.password);
      if (!isValidPassword) {
        return res
          .status(401)
          .json({ message: "Email o contraseña incorrectos" });
      }

      // Obtener nombre del rol
      const rolNombre = await UsuarioModel.getRolName(usuario.rol_id);

      // Obtener perfil según rol
      let perfilId = null;
      if (rolNombre === "DUENO") {
        const dueno = await DuenoModel.findByUsuarioId(usuario.id!);
        perfilId = dueno?.id;
      } else if (rolNombre === "VETERINARIO") {
        const veterinario = await VeterinarioModel.findByUsuarioId(usuario.id!);
        perfilId = veterinario?.id;
      }

      // Generar token
      const token = generateToken({
        id: usuario.id!,
        email: usuario.email,
        rol: rolNombre!,
        perfilId,
      });

      res.json({
        message: "Login exitoso",
        token,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          rol: rolNombre,
        },
      });
    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  // Registrar un dueño (acceso público)
  static async registerDueno(req: Request, res: Response) {
    try {
      const data: RegisterDuenoDTO = req.body;

      // Verificar si el email ya existe
      const existingUser = await UsuarioModel.findByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ message: "El email ya está registrado" });
      }

      // Obtener ID del rol DUENO
      const rolId = await UsuarioModel.getRolId("DUENO");
      if (!rolId) {
        return res
          .status(500)
          .json({ message: "Error con la configuración de roles" });
      }

      // Crear usuario
      const usuarioId = await UsuarioModel.create({
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        password: data.password,
        direccion: data.direccion,
        rol_id: rolId,
      });

      // Crear dueño
      const duenoId = await DuenoModel.create({
        usuario_id: usuarioId,
        telefono: data.telefono,
        dni: data.dni,
      });

      res.status(201).json({
        message: "Dueño registrado exitosamente",
        usuarioId,
        duenoId,
      });
    } catch (error) {
      console.error("Error registrando dueño:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  // Registrar un veterinario (solo admin)
  static async registerVeterinario(req: Request, res: Response) {
    try {
      const data: RegisterVeterinarioDTO = req.body;

      // Verificar si el email ya existe
      const existingUser = await UsuarioModel.findByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ message: "El email ya está registrado" });
      }

      // Verificar si la matrícula ya existe
      const existingMatricula = await VeterinarioModel.findByMatricula(
        data.matricula,
      );
      if (existingMatricula) {
        return res
          .status(400)
          .json({ message: "La matrícula ya está registrada" });
      }

      // Obtener ID del rol VETERINARIO
      const rolId = await UsuarioModel.getRolId("VETERINARIO");
      if (!rolId) {
        return res
          .status(500)
          .json({ message: "Error con la configuración de roles" });
      }

      // Crear usuario
      const usuarioId = await UsuarioModel.create({
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        password: data.password,
        direccion: data.direccion,
        rol_id: rolId,
      });

      // Crear veterinario
      const veterinarioId = await VeterinarioModel.create({
        usuario_id: usuarioId,
        matricula: data.matricula,
        especialidad: data.especialidad,
      });

      res.status(201).json({
        message: "Veterinario registrado exitosamente",
        usuarioId,
        veterinarioId,
      });
    } catch (error) {
      console.error("Error registrando veterinario:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}
