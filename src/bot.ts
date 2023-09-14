import checkAPIHealth from "./utils/checkAPIHealth"
import createJWT from "./utils/createJWT"
import createToot from "./utils/createToot"
import getCanvas from "./utils/getCanvas"
import getNotificationStream from "./utils/getNotificationStream"
import postPixel from "./utils/postPixel"
import processMentionHTML from "./utils/processMentionHTML"
import uploadImage from "./utils/uploadImage"

async function main() {
  await checkAPIHealth()

  const stream = await getNotificationStream()
  const reader = stream.getReader()

  while (true) {
    const { done, value } = await reader.read();
    await processChunk(value)
    if (done) {
      return
    }
  }
}

async function processChunk(value: Uint8Array) {
  const lines = Buffer.from(value).toString().split('\n')
  for (const line of lines) {
    await processChunkLine(line)
  }
}

async function processChunkLine(line: string) {
  if (!line) {
    return
  }

  if (line.startsWith('data:')) {
    const data = line.replace('data:', '').trim()
    try {
      const jsonData = JSON.parse(data)
      if (jsonData?.type === 'mention') {
        const id = jsonData.status.id
        const content = jsonData.status.content
        const account = jsonData.account.acct
        console.log('proccesing mention with data', { id, account, content })

        await processMention({ id, account, content })
      } else {
        console.log(`data event of type "${jsonData.type}" not processed`)
      }
    } catch (err) {
      console.error('Failed to parse JSON data from event')
    }
  } else {
    const text = line.length < 10 ? line : `${line.slice(0, 10)}...` 
    console.log('line not processed', text)
  }
}

async function processMention({
  id, account, content
}: { id: string; account: string; content: string }) {
  const data = processMentionHTML(content)
  if (data) {
    const { x, y, color } = data
    try {
      const jwt = await createJWT(account)
      const apiResponse = await postPixel({
        x: Number(x),
        y: Number(y),
        color,
        jwt
      })
      if (apiResponse?.timeout) {
        const toot = {
          status: `@${account} you can place your pixel again in ${apiResponse.timeout} seconds`,
          in_reply_to_id: id,
        }

        await createToot(toot)
      } else {
        const res = await getCanvas()
        const uploadParams = {
          file: res.body,
          description: 'fedicanvas snapshot at ' + new Date().toISOString(),
        }
        const uploadId = await uploadImage(uploadParams)

        const toot = {
          status: `@${account} your pixel was placed at ${x},${y} with color ${color}`,
          in_reply_to_id: id,
          media_ids: [uploadId],
        }

        await createToot(toot)
      }
    } catch (err) {
      console.error('Error processing mention', err)
    }
  }
}

try {
  main()
} catch (err) {
  console.error(err)
}
