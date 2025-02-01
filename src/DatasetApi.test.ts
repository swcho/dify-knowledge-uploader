import axiosStatic, { isAxiosError } from "axios";
import { describe, it } from "vitest";
import { DatasetApi } from "./DatasetApi";

describe("DatasetApi", () => {
  const axios = axiosStatic.create({
    headers: {
      Authorization: `Bearer ${process.env.DIFY_API_KEY}`,
    },
  });

  const baseUrl = process.env.DIFY_ENDPOINT + "/v1" || "https://api.dify.ai/v1";

  axios.interceptors.request.use((config) => {
    console.log("Request", config.url);
    return config;
  });

  it("clean up", async () => {
    const datasetApi = new DatasetApi({
      axios,
      baseUrl,
    });
    const { data } = await datasetApi.list({ page: 1, limit: 20 });
    for (const { id, name } of data) {
      if (name.startsWith("[test]")) {
        const api = new DatasetApi({
          axios,
          baseUrl,
          datasetId: id,
        });
        await api.remove();
      }
    }
  });

  it("create", async () => {
    const datasetApi = new DatasetApi({
      axios,
      baseUrl,
    });
    const resp = await datasetApi.create({
      name: "[test] Test Dataset",
      description: "Test Dataset Description",
      indexing_technique: "high_quality",
      permission: "only_me",
    });
    // console.log({ resp });
    const datasetApiForNew = new DatasetApi({
      axios,
      baseUrl,
      datasetId: resp.id,
    });

    try {
      const newDoc = await datasetApiForNew.createByText({
        name: "test",
        text: "Hello, world!",
        indexing_technique: "high_quality",
        doc_form: 'text_model',
        doc_language: 'Korean',
        process_rule: {
          mode: 'automatic'
        }
      });
      console.log({ newDoc });
    } catch (error) {
      isAxiosError(error) && console.error(error.response?.data);
    }
  });
});
