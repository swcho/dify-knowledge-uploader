import { describe, it } from "vitest";
import { uploadDirectory } from "./uploader";

describe('uploader', () => {
  it('should upload directory', async () => {
    await uploadDirectory({
      directory: '.',
      baseUrl: process.env.DIFY_API_BASE_URL || 'https://api.dify.ai/v1',
      token: process.env.DIFY_API_TOKEN || 'token',
    })
  });
});