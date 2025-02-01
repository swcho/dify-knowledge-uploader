import { AxiosInstance } from "axios";
import qs from "query-string";

export declare namespace DatasetApi {
  export type Params = {
    axios: AxiosInstance;
    baseUrl: string;
    datasetId?: string;
  };

  export interface Dataset {
    id: string;
    name: string;
    description: string;
    provider: string;
    permission: string;
    data_source_type: null | string;
    indexing_technique: null | string;
    app_count: number;
    document_count: number;
    word_count: number;
    created_by: string;
    created_at: number;
    updated_by: null | string;
    updated_at: number;
    embedding_model: null | string;
    embedding_model_provider: null | string;
    embedding_available: boolean;
    retrieval_model_dict: RetrievalModelDict;
    tags: any[];
    doc_form: null | string;
    external_knowledge_info: ExternalKnowledgeInfo;
    external_retrieval_model: ExternalRetrievalModel;
  }

  interface ExternalRetrievalModel {
    top_k: number;
    score_threshold: null | number;
    score_threshold_enabled: boolean | null;
  }

  interface ExternalKnowledgeInfo {
    external_knowledge_id: null | string;
    external_knowledge_api_id: null | string;
    external_knowledge_api_name: null | string;
    external_knowledge_api_endpoint: null | string;
  }

  interface RetrievalModelDict {
    search_method: null | string;
    reranking_enable: boolean | null;
    reranking_mode: null | string;
    reranking_model: RerankingModel;
    weights: Weight | null;
    top_k: number;
    score_threshold_enabled: boolean;
    score_threshold: null | number;
  }

  interface Weight {
    keyword_setting: KeywordSetting;
    vector_setting: VectorSetting;
  }

  interface VectorSetting {
    vector_weight: number;
    embedding_model_name: string;
    embedding_provider_name: string;
  }

  interface KeywordSetting {
    keyword_weight: number;
  }

  interface RerankingModel {
    reranking_provider_name: null | string;
    reranking_model_name: null | string;
  }

  export type IndexingTechnique = "high_quality" | "economy";
  namespace create {
    export type Permission = "only_me" | "all_team_members" | "partial_members";
    export type Params = {
      name: string;
      description: string;
      indexing_technique: IndexingTechnique;
      permission: Permission;
      provider?: "vendor" | "external"; // Provider (optional, default: vendor)
      external_knowledge_api_id?: string;
      external_knowledge_id?: string;
    };
    export type Resp = Dataset;
  }

  namespace list {
    export type Params = {
      page: number;
      limit: number;
    };
    export type Resp = RootObject;

    interface RootObject {
      data: Dataset[];
      has_more: boolean;
      limit: number;
      total: number;
      page: number;
    }
  }

  namespace createByText {
    export type DocForm =
      | "text_model" // Text documents are directly embedded; economy mode defaults to using this form
      | "hierarchical_model" // Parent-child mode
      | "qa_model"; // Question-answer mode
    export type Language = "English" | "Chinese" | "Japanese" | "Korean";
    export type CustomRule = {
      pre_processing_rules: { id: string; enabled: boolean }[];
      segmentation: {
        separator: string; // Custom segment identifier, currently only allows one delimiter to be set. Default is \n
        max_tokens: number; // Maximum length (token) defaults to 1000
      };
      parent_mode: "full-doc" | "paragraph" | string; // Retrieval mode of parent chunks: full-doc full text retrieval / paragraph paragraph retrieval
      subchunk_segmentation: {
        separator: string; // Segmentation identifier. Currently, only one delimiter is allowed. The default is ***
        max_tokens: number; // The maximum length (tokens) must be validated to be shorter than the length of the parent chunk
        chunk_overlap?: number; // Define the overlap between adjacent chunks
      };
    };
    export type ProcessingRule =
      | {
          mode: "automatic";
        }
      | {
          mode: "custom"; // Cleaning, segmentation mode, automatic / custom
          rules: CustomRule;
        };
    export type RetrievalModel = {
      search_method: "hybrid_search" | "semantic_search" | "full_text_search";
      reranking_enable: boolean;
      reranking_mode: {
        reranking_provider_name: string;
        reranking_model_name: string;
      };
      top_k: number;
      score_threshold_enabled: boolean;
      score_threshold: number;
    };
    export type Params = {
      name: string;
      text: string;
      indexing_technique: IndexingTechnique;
      doc_form: DocForm;
      doc_language: Language;
      process_rule: ProcessingRule;
      retrieval_model?: RetrievalModel;
      embedding_model?: string;
      embedding_model_provider?: string;
    };
    export type Resp = RootObject;
    interface RootObject {
      document: Document;
      batch: string;
    }

    interface Document {
      id: string;
      position: number;
      data_source_type: string;
      data_source_info: DataSourceInfo;
      data_source_detail_dict: DataSourceDetailDict;
      dataset_process_rule_id: string;
      name: string;
      created_from: string;
      created_by: string;
      created_at: number;
      tokens: number;
      indexing_status: string;
      error: null;
      enabled: boolean;
      disabled_at: null;
      disabled_by: null;
      archived: boolean;
      display_status: string;
      word_count: number;
      hit_count: number;
      doc_form: string;
    }

    interface DataSourceDetailDict {
      upload_file: Uploadfile;
    }

    interface Uploadfile {
      id: string;
      name: string;
      size: number;
      extension: string;
      mime_type: string;
      created_by: string;
      created_at: number;
    }

    interface DataSourceInfo {
      upload_file_id: string;
    }
  }
}

export class DatasetApi {
  private axios: AxiosInstance;
  private baseUrl: string;
  private datasetId?: string;
  constructor({ axios, baseUrl, datasetId }: DatasetApi.Params) {
    this.axios = axios;
    this.baseUrl = baseUrl;
    this.datasetId = datasetId;
  }

  async create(params: DatasetApi.create.Params) {
    return this.axios
      .post<DatasetApi.create.Resp>(`${this.baseUrl}/datasets`, params)
      .then((r) => r.data);
  }

  async list(params: DatasetApi.list.Params) {
    return this.axios
      .get<DatasetApi.list.Resp>(
        `${this.baseUrl}/datasets?${qs.stringify(params)}`
      )
      .then((r) => r.data);
  }

  async remove() {
    return this.axios
      .delete(`${this.baseUrl}/datasets/${this.datasetId}`)
      .then((r) => r.data);
  }

  async createByText(params: DatasetApi.createByText.Params) {
    return this.axios
      .post<DatasetApi.createByText.Resp>(
        `${this.baseUrl}/datasets/${this.datasetId}/document/create-by-text`,
        params
      )
      .then((r) => r.data);
  }
}
