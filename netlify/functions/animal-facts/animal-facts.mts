import type { Config, Context } from "@netlify/functions"

export const config: Config = {
  path: "/animal-facts"
}

export default async (req: Request, context: Context) => {
    return new Response("Hello, world!", { headers: { "Content-type": "text/plain" } })
}
