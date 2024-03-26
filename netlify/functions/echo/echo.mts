import type { Config } from "@netlify/functions"

export const config: Config = {
  path: "/echo"
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST",
}

export default async (req: Request) => {
  // set up very liberal CORS policy
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    })
  }
  else if (req.method === "GET") {
    return get(req);
  }
  else if (req.method === "POST") {
    return post(req)
  }

  return error(400)
}

function get(req: Request) {
  const url = new URL(req.url)
  const data = url.searchParams.get("data")

  return dataToResponse(data)
}

async function post(req: Request) {
  const data = await req.text()
  return dataToResponse(data)
}

function dataToResponse(data: string | null): Response {
  if (data == null) {
    return error(400)
  }

  // do not allow arbitrarily long data to get sent back
  if (data.length > 255) {
    return error(413)
  }

  try {
    const obj = JSON.parse(data)
    const json = JSON.stringify(obj)
    return new Response(json, { headers: { "Content-type": "application/json", ...corsHeaders } })
  }
  catch (err) {
    return error(400)
  }
}

function error(status: number): Response {
  return new Response(null, { status, headers: corsHeaders })
}