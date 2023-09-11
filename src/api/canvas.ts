import { withRedis } from "./redis"
import getColorIndex from "./utils/getColorIndex"
import hexToRgb from "./utils/hexToRgb"

export async function getCanvas() {
  return withRedis(async redis => redis.getBuffer('canvas'))
}

export async function savePixel({ x, y, color }: {
  x: number
  y: number
  color: string
}) {
  return withRedis(async redis => {
    const index = getColorIndex(x, y)
    const [r, g, b] = hexToRgb(color)
    return redis.pipeline()
      .bitfield('canvas', 'SET', 'u8', `#${index + 0}`, r)
      .bitfield('canvas', 'SET', 'u8', `#${index + 1}`, g)
      .bitfield('canvas', 'SET', 'u8', `#${index + 2}`, b)
      .bitfield('canvas', 'SET', 'u8', `#${index + 3}`, 255)
      .exec()
  })
}
