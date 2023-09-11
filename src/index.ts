import api from './api/api'

const port = parseInt(process.env.PORT) || 5000;

console.log(`API running at http://localhost:${port}`);

export default {
  port,
  fetch: api.fetch,
};
