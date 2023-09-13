import { load } from 'cheerio'

export default function processMentionHTML(html: string) {
  try {
    const dom = load(html)
    const text = dom.text()
    return processMentionText(text)
  } catch (err) {
    console.error('Failed to parse HTML from mention content')
  }
}

function processMentionText(text: string) {
  const [_, command, ...parts] = text.split(' ')
  if (command === '!pixel') {
    const [x, y, color] = parts
    return { x, y, color }
  } else {
    console.log('command not processed', command)
  }
}
