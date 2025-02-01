import { describe, it } from "vitest";
import { uploadDirectory } from "./uploader";

const baseUrl = process.env.DIFY_ENDPOINT + "/v1" || "https://api.dify.ai/v1";

describe('uploader', () => {
  it('should upload directory', async () => {
    await uploadDirectory({
      baseUrl,
      token: process.env.DIFY_API_KEY || 'token',
      name: 'dify-knowledge-uploader',
      directory: '.',
    })
    console.log('finished')
  });
});