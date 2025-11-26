import { type } from "arktype";

const ClockInOut = type({
  id: "string",
  clockInTime: "number",
  clockOutTime: "number",
  breakTime: "number",
  date: "string",
  userId: "string",
  userName: "string",
  totalHours: "number",
});

export type ClockInOut = typeof ClockInOut.infer;
