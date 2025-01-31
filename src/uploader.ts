import { glob } from 'glob';
import { readFile } from 'fs/promises';
import path from 'path';
import axios from 'axios';
import ora from 'ora';
import chalk from 'chalk';

interface UploadOptions {
  directory: string;
  token: string;
  providerId?: string;
  baseUrl: string;
}

export async function uploadDirectory(options: UploadOptions) {
  const spinner = ora('Scanning directory...').start();

  try {
    // Get all files in the directory
    const files = await glob('**/*', {
      cwd: options.directory,
      nodir: true,
      ignore: ['**/node_modules/**', '**/dist/**', '**/.git/**']
    });

    spinner.text = `Found ${files.length} files. Starting upload...`;

    for (const file of files) {
      const filePath = path.join(options.directory, file);
      const content = await readFile(filePath, 'utf-8');
      
      try {
        await axios.post(
          `${options.baseUrl}/knowledge-bases/${options.providerId}/documents`,
          {
            content,
            name: file,
            metadata: {
              path: file,
              type: path.extname(file).substring(1)
            }
          },
          {
            headers: {
              'Authorization': `Bearer ${options.token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        spinner.text = `Uploaded: ${chalk.green(file)}`;
      } catch (error) {
        if (error instanceof Error) {
          spinner.warn(`Failed to upload ${chalk.red(file)}: ${error.message}`);
        }
      }
    }

    spinner.succeed('Upload completed successfully!');
  } catch (error) {
    if (error instanceof Error) {
      spinner.fail(`Upload failed: ${error.message}`);
    }
    throw error;
  }
}