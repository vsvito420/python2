// Main entry point for Cloudflare Worker API
import { onRequest } from './routes';

// Register event handlers for fetch events
export default {
  fetch: onRequest
};