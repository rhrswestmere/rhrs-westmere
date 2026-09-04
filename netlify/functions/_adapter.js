// Netlify function adapter - converts Netlify event to Vercel-like req/res
export function adaptHandler(handler) {
  return async (event, context) => {
    const headers = event.headers || {}

    // Parse query string from both URL and queryStringParameters
    const query = { ...(event.queryStringParameters || {}) }

    // Also parse from original request URL if available
    if (event.rawUrl) {
      try {
        const url = new URL(event.rawUrl)
        url.searchParams.forEach((v, k) => { query[k] = v })
      } catch {}
    }

    // Parse body
    let body = null
    if (event.body) {
      try {
        body = event.isBase64Encoded
          ? JSON.parse(Buffer.from(event.body, 'base64').toString())
          : JSON.parse(event.body)
      } catch {
        body = event.body
      }
    }

    const req = {
      method: event.httpMethod || 'GET',
      headers,
      query,
      body,
      url: event.path || '/',
    }

    const resHeaders = {}
    let statusCode = 200
    let responseBody = null

    const res = {
      status(code) { statusCode = code; return res },
      setHeader(k, v) { resHeaders[k] = v; return res },
      json(data) { responseBody = JSON.stringify(data); return res },
      end(data) { if (data) responseBody = typeof data === 'string' ? data : JSON.stringify(data); return res },
    }

    try {
      await handler(req, res)
    } catch (err) {
      statusCode = 500
      responseBody = JSON.stringify({ error: 'Internal server error' })
    }

    return {
      statusCode,
      headers: {
        'Content-Type': 'application/json',
        ...resHeaders,
      },
      body: responseBody || '',
    }
  }
}
