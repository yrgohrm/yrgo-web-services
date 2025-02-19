import type { Config, Context } from "@netlify/functions"
import { fortunes } from './library'
import { markdown } from './apidoc'

export const config: Config = {
  path: [ "/fortunes/:type", "/fortunes" ]
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST",
}

export default async (req: Request, context: Context) => {
  // set up very liberal CORS policy
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    })
  }
  else if (req.method === "GET") {
    return get(req, context);
  }

  return error(400)
}

function get(req: Request, context: Context) {
  const type = context.params?.type;

  if (type === "short") {
    return getShort();
  }
  else if (type === "showerthought") {
    return getShower();
  }
  else if (type === "traditional") {
    return getTrad();
  }
  else if (type === "query") {
    return performQuery(req);
  }
  else if (type === "random") {
    return getFortune();
  }
  else {
    return new Response(markdown, { headers: { "Content-type": "text/markdown", ...corsHeaders } });
  }
}

function performQuery(req: Request) {
  const url = new URL(req.url)
  const query = url.searchParams.get("q")

  if (query != null && query.length > 2) {
    const lcQuery = query.toLowerCase();
    const matches = fortunes.filter(fortune => fortune.f.toLowerCase().indexOf(lcQuery) !== -1).map(fortune => ({ fortune: fortune.f }));
    const json = JSON.stringify(matches);
    return new Response(json, { headers: { "Content-type": "application/json", ...corsHeaders } })
  }

  return error(400);
}

function getShort() {
  try {
    let random;
    do {
      random = fortunes[Math.floor(Math.random() * fortunes.length)];
    } while (!random.short);

    const json = JSON.stringify({ fortune: random.f });
    return new Response(json, { headers: { "Content-type": "application/json", ...corsHeaders } })
  }
  catch (err) {
    return error(400)
  }
}

function getShower() {
  try {
    let random;
    do {
      random = fortunes[Math.floor(Math.random() * fortunes.length)];
    } while (!random.shower);

    const json = JSON.stringify({ fortune: random.f });
    return new Response(json, { headers: { "Content-type": "application/json", ...corsHeaders } })
  }
  catch (err) {
    return error(400)
  }
}

function getTrad() {
  try {
    let random;
    do {
      random = fortunes[Math.floor(Math.random() * fortunes.length)];
    } while (random.shower);

    const json = JSON.stringify({ fortune: random.f });
    return new Response(json, { headers: { "Content-type": "application/json", ...corsHeaders } })
  }
  catch (err) {
    return error(400)
  }
}

function getFortune() {
  try {
    const random = fortunes[Math.floor(Math.random() * fortunes.length)];
    const json = JSON.stringify({ fortune: random.f });
    return new Response(json, { headers: { "Content-type": "application/json", ...corsHeaders } })
  }
  catch (err) {
    return error(400)
  }
}

function error(status: number): Response {
  return new Response(null, { status, headers: corsHeaders })
}