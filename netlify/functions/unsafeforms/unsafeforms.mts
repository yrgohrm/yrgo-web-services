import type { Config, Context } from "@netlify/functions"

export const config: Config = {
  path: "/unsafeforms"
}

export default async (req: Request, context: Context) => {
  const spList: string[] = []

  const url = new URL(req.url)
  for (const [key, value] of url.searchParams) {
    spList.push(key + "=" + value)
  }

  const spOutput = spList.join("<br>")

  const webpage = `
  <html>
  <head>
    <meta charset="UTF-8">
    <title>echo</title>
  </head>
  <body>
    <h1>Echo Information</h1>
    <div>
      <h2>Method</h2>
      ${req.method}
    </div>
    <div>
      <h2>Query Parameters</h2>
      ${spOutput}
    </div>
    <div>
      <h2>Body</h2>
      ${await req.text()}
    </div>
  </body>
  </html>
  `

  if (webpage.length > 1500) {
    return new Response(null, { status: 413 })
  }

  return new Response(webpage, { headers: { "Content-type": "text/html" } })
}
