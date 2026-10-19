import { handleComments } from '../lib/comments.mjs';

export default async function handler(request) {
  return handleComments('linear-algebra', request);
}
