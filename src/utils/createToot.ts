type TootParams = {
  status: string
  in_reply_to_id?: string
  media_ids?: string[]
}

const MASTODON_API_URL = Bun.env.MASTODON_API_URL
const MASTODON_ACCESS_TOKEN = Bun.env.MASTODON_ACCESS_TOKEN

export default function createToot(params: TootParams) {
  return fetch(`${MASTODON_API_URL}/api/v1/statuses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MASTODON_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      status: params.status,
      in_reply_to_id: params.in_reply_to_id,
      media_ids: params.media_ids || [],
      visibility: 'unlisted',
    }),
  })
}
