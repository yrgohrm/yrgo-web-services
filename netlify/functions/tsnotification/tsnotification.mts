/*

This endpoint is a fake "send notification by email" service called by
code in ts_lending_system.

*/
import type { Config } from "@netlify/functions"

export const config: Config = {
  path: "/tsnotification"
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST",
}

type NotificationKind = "notification" | "reminder";
type NotificationData = { kind: NotificationKind, recipient: string; subject: string; message: string };

export default async (req: Request) => {
  // set up very liberal CORS policy
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    })
  }
  else if (req.method === "POST") {
    return post(req)
  }

  return error(400)
}

async function post(req: Request) {
  const data = await req.json()

  if (isNotificationData(data)) {
    return dataToResponse(data)
  }

  return error(400);
}

function dataToResponse(data: NotificationData): Response {
  if (data.recipient.indexOf("@") === -1) {
    return error(400);
  }

  try {
    return new Response(`{"response":"ok"}`, { headers: { "Content-type": "application/json", ...corsHeaders } })
  }
  catch (err) {
    return error(400)
  }
}

function error(status: number): Response {
  return new Response(null, { status, headers: corsHeaders })
}

function isNotificationData(obj: any): obj is NotificationData {
  return (
    typeof obj === "object" &&
    obj !== null &&
    (obj.kind === "notification" || obj.kind === "reminder") &&
    typeof obj.recipient === "string" &&
    typeof obj.subject === "string" &&
    typeof obj.message === "string"
  );
}