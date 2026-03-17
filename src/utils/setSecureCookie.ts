import { Response } from "express";

export default function setSecureCookie(
   res: Response,
   name: string,
   value: string,
   maxAgeInMiliseconds: number,
   path: string = ""
) {
   res.cookie(name, value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: path === "" ? "/" : path,
      maxAge: maxAgeInMiliseconds
   });
};