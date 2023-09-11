import { load } from 'cheerio'

const MASTODON_API_URL = Bun.env.MASTODON_API_URL
const ACCESS_TOKEN = Bun.env.ACCESS_TOKEN

async function main() {
  const healthURL = `${MASTODON_API_URL}/streaming/health`
  const healthResponse = await fetch(healthURL)
  if (!healthResponse.ok) {
    throw new Error(`Failed to connect to ${healthURL}`)
  } else {
    console.log(`Connected to ${healthURL}`)
  }

  const notificationURL = `${MASTODON_API_URL}/streaming/user/notification`
  const notificationResponse = await fetch(notificationURL, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'User-Agent': 'FediCanvas bot v0.0.1'
    },
  })

  if (!notificationResponse.ok) {
    throw new Error(`Failed to connect to ${notificationURL}`)
  } else {
    console.log(`Connected to ${notificationURL}`)
  }

  const reader = notificationResponse.body.getReader()
  while (true) {
    const { done, value } = await reader.read();
    processChunk(value)
    if (done) {
      return
    }
  }
}

function processChunk(value: Uint8Array) {
  const lines = Buffer.from(value).toString().split('\n')
  lines.forEach(processChunkLine)
}

function processChunkLine(line: string) {
  if (!line) {
    return
  }

  if (line.startsWith('data:')) {
    console.log('received data line')
    const data = line.replace('data:', '').trim()
    try {
      const jsonData = JSON.parse(data)
      if (jsonData?.type === 'mention') {
        const html = jsonData.status.content
        const params = processHTML(html)
        if (params) {
          const { x, y, color } = params
          // call fedicanvas api with these params
          // TODO

          // reply to mention with api response
          // TODO
        }
      }
    } catch (err) {
      throw new Error('Failed to parse JSON data from event')
    }
  } else {
    const text = line.length < 10 ? line : `${line.slice(0, 10)}...` 
    console.log('line not processed', text)
  }
}

function processHTML(html: string) {
  try {
    const dom = load(html)
    const text = dom.text()
    return processMentionText(text)
  } catch (err) {
    throw new Error('Failed to parse HTML from mention content')
  }
}

function processMentionText(text: string) {
  const [_, command, ...parts] = text.split(' ')
  if (command === '!pixel') {
    const [x, y, color] = parts
    console.log('pixel command received', { x, y, color })
    return { x, y, color }
  } else {
    console.log('command not processed', command)
  }
}

try {
  main()
} catch (err) {
  console.error(err)
}
