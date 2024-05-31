type UploadParams = {
  file: ReadableStream,
  description: string,
}

const MASTODON_API_URL = Bun.env.MASTODON_API_URL
const MASTODON_ACCESS_TOKEN = Bun.env.MASTODON_ACCESS_TOKEN

// upload image to mastodon
export default async function uploadImage(params: UploadParams) {
  const { file, description } = params

  const blob = await Bun.readableStreamToBlob(file)
  const form = new FormData()
  form.append('file', blob, 'fedicanvas.png')
  form.append('description', description)

  const res = await fetch(`${MASTODON_API_URL}/api/v2/media`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MASTODON_ACCESS_TOKEN}`,
    },
    body: form,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Failed to upload image to mastodon:\n  ${res.status} ${res.statusText} \n  ${text}`)
  }

  const json = await res.json()
  return json.id
}
