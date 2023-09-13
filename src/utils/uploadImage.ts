type UploadParams = {
  file: Blob,
  description: string,
}

const MASTODON_API_URL = Bun.env.MASTODON_API_URL
const MASTODON_ACCESS_TOKEN = Bun.env.MASTODON_ACCESS_TOKEN

// upload image to mastodon
export default async function uploadImage(params: UploadParams) {
  const { file, description } = params

  const form = new FormData()
  form.append('file', file)
  form.append('description', description)

  const res = await fetch(`${MASTODON_API_URL}/api/v2/media`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MASTODON_ACCESS_TOKEN}`,
    },
    body: form,
  })

  if (!res.ok) {
    throw new Error(`Failed to upload image to mastodon: ${res.status} ${res.statusText}`)
  }

  const json = await res.json()
  return json.id
}
