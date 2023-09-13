import { userAgent } from "./userAgent"

const MASTODON_API_URL = Bun.env.MASTODON_API_URL
const MASTODON_ACCESS_TOKEN = Bun.env.MASTODON_ACCESS_TOKEN

export default async function getNotificationStreamReader() {
  const notificationURL = `${MASTODON_API_URL}/api/v1/streaming/user/notification`
  const response = await fetch(notificationURL, {
    headers: {
      Authorization: `Bearer ${MASTODON_ACCESS_TOKEN}`,
      'User-Agent': userAgent
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to connect to ${notificationURL}:\n  ${response.status} ${response.statusText}`)
  } else {
    console.log(`Connected to ${notificationURL}`)
  }

  return response.body
}
