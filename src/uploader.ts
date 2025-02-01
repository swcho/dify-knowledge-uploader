import { glob } from "glob";
import { readFile } from "fs/promises";
import path from "path";
import axiosStatic from "axios";
import ora from "ora";
import chalk from "chalk";
import { DatasetApi } from "./DatasetApi";

interface UploadOptions {
  baseUrl: string;
  token: string;
  name: string;
  directory: string;
  providerId?: string;
}

export async function uploadDirectory(options: UploadOptions) {
  const { baseUrl, token, name, directory, providerId } = options;

  const spinner = ora(`Scanning ${directory}...`).start();

  const axios = axiosStatic.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  axios.interceptors.request.use((config) => {
    console.log("Request", config.url);
    return config;
  });

  const dataset = await new DatasetApi({ axios, baseUrl }).create({
    name,
    description: "Uploaded by Dify Knowledge Uploader",
    indexing_technique: "high_quality",
    permission: "only_me",
  });
  
  const api = new DatasetApi({
    axios,
    baseUrl,
    datasetId: dataset.id,
  })

  try {
    // Get all files in the directory
    const files = await glob("**/*", {
      cwd: options.directory,
      nodir: true,
      ignore: ["**/node_modules/**", "**/dist/**", "**/.git/**"],
    });

    spinner.text = `Found ${files.length} files. Starting upload...`;

    for (const file of files) {
      const filePath = path.join(options.directory, file);
      const content = await readFile(filePath, "utf-8");
      
      await api.createByText({
        name: file,
        text: content,
        indexing_technique: "high_quality",
        doc_form: 'text_model',
        doc_language: 'Korean',
        process_rule: {
          mode: 'automatic'
        }
      });

      try {
        spinner.text = `Uploaded: ${chalk.green(file)}`;
      } catch (error) {
        if (error instanceof Error) {
          spinner.warn(`Failed to upload ${chalk.red(file)}: ${error.message}`);
        }
      }
    }

    spinner.succeed("Upload completed successfully!");
  } catch (error) {
    if (error instanceof Error) {
      spinner.fail(`Upload failed: ${error.message}`);
    }
    throw error;
  }
}
