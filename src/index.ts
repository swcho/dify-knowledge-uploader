import { Command } from 'commander';
import dotenv from 'dotenv';
import { uploadDirectory } from './uploader';

dotenv.config();

const program = new Command();

program
  .name('dify-upload')
  .description('Upload code directory to Dify Knowledge Base')
  .version('1.0.0')
  .requiredOption('-d, --dir <directory>', 'Directory path to upload')
  .option('-t, --token <token>', 'Dify API token (or use DIFY_API_TOKEN env variable)')
  .option('-p, --provider <provider>', 'Knowledge provider ID')
  .option('-b, --base-url <url>', 'Dify API base URL', 'https://api.dify.ai/v1')
  .action(async (options) => {
    try {
      const token = options.token || process.env.DIFY_API_TOKEN;
      if (!token) {
        throw new Error('API token is required. Provide it via --token option or DIFY_API_TOKEN environment variable');
      }

      await uploadDirectory({
        directory: options.dir,
        token,
        providerId: options.provider,
        baseUrl: options.baseUrl
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error:', error.message);
      }
      process.exit(1);
    }
  });

program.parse();