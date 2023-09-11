import { Hono } from "hono"
import { serveStatic } from "hono/serve-static.bun"
import { getCanvas, savePixel } from "./canvas"
import clampToTexture from "./utils/clampToTexture"

const app = new Hono()

app.use("/favicon.ico", serveStatic({ path: "./public/favicon.ico" }))

app.get("/", (c) => {
  return c.json({ message: "Hello World!" })
})

app.get('/pixel', async (c) => {
  try {
    const buffer = await getCanvas()
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(buffer);
        controller.close();
      },
    })

    return c.body(stream)
  } catch (err) {
    console.error(err)

    c.status(500)
    return c.json({ message: "Internal Server Error" })
  }
})

function errWithCode(code: number, message: string) {
  const err = new Error(message) as Error & { code: number }
  err.code = code
  return err
}

app.post('/pixel', async (c) => {
  try {
    const body = await c.req.json<{ x: number, y: number, color: string }>()
    const { x, y, color } = body
    if (!Number.isFinite(x)) {
      throw errWithCode(400, 'Invalid x')
    }
    if (!Number.isFinite(y)) {
      throw errWithCode(400, 'Invalid y')
    }
    if (typeof color !== 'string') {
      throw errWithCode(400, 'Invalid color')
    }
    const [x1, y1] = clampToTexture([x, y])
    const response = await savePixel({
      x: x1,
      y: y1,
      color,
    })

    c.json({
      message: 'Pixel saved successfully',
      x: x1,
      y: y1,
      color,
      redisResponse: response,
    })
  } catch (err) {
    console.error(err)
    const code = err.code || 500

    c.status(code)
    return c.json({ code, message: err.message || 'Internal Server Error' })
  }
})

export default app
