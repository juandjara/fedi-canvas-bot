const MASTODON_API_URL = Bun.env.MASTODON_API_URL

export default async function checkAPIHealth() {
  const healthURL = `${MASTODON_API_URL}/api/v1/streaming/health`
  const healthResponse = await fetch(healthURL)
  if (!healthResponse.ok) {
    throw new Error(`Failed to connect to ${healthURL}:\n  ${healthResponse.status} ${healthResponse.statusText}}`)
  } else {
    console.log(`Connected to ${healthURL}`)
  }
}
