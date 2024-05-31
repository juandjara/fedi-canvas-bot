const FEDICANVAS_API_URL = Bun.env.FEDICANVAS_API_URL

export default async function getCanvas() {
  const url = `${FEDICANVAS_API_URL}/api/canvas`
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'image/png',
    },
  })

  if (!res.ok) {
    throw new Error(`Failed to connect to ${FEDICANVAS_API_URL}/api/canvas:\n  ${res.status} ${res.statusText}`)
  }

  return res
}
