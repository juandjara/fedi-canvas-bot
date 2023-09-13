const FEDICANVAS_API_URL = Bun.env.FEDICANVAS_API_URL

export default async function postPixel({ x, y, color, jwt }: {
  x: number;
  y: number;
  color: string;
  jwt: string;
}) {
  const url = `${FEDICANVAS_API_URL}/api/pixel`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`,
    },
    body: JSON.stringify({ x, y, color }),
  })

  if (!res.ok) {
    if (res.status !== 429) {
      throw new Error(`Failed to post pixel: ${res.status} ${res.statusText}`)
    }
    const json = await res.json()
    const lastTime = json.lastTime
    const now = Date.now()
    const diff = now - lastTime

    return {
      timeout: diff / 1000
    }
  }
}
