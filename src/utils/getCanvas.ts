const FEDICANVAS_API_URL = Bun.env.FEDICANVAS_API_URL

export default async function getCanvas() {
  const url = `${FEDICANVAS_API_URL}/api/pixel`
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'image/png',
    },
  })
  return res.blob()
}
