import { type } from "arktype";

export const Staff = type({
  id: "string",
  role: "string",
  userBank: "string",
  userContact: "string",
  userEmail: "string",
  userName: "string",
  userPassword: "string",
  userSalary: "string",
  "status?": "boolean",
});

export type Staff = typeof Staff.infer;
