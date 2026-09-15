export interface DashboardResponse {
  jobCounts: JobCounts;
  syncStates: SyncState[];
  deadLetters: DeadLetterJob[];
  activeWorkerCount: number;
  rateLimitBucket: string;
}

export interface JobCounts {
  pending: number;
  processing: number;
  done: number;
  retry: number;
  dead_letter: number;
}

export interface SyncState {
  id: number;
  entity_type: string;

  last_synced_at: string | null;

  last_cursor_ts: string | null;

  status: "idle" | "syncing" | "failed";

  last_error: string | null;

  records_processed: number;
}

export interface DeadLetterJob {
  id: number;

  job_type: string;

  payload: Record<string, any>;

  status:
    | "pending"
    | "processing"
    | "done"
    | "retry"
    | "dead_letter";

  attempts: number;

  max_attempts: number;

  run_at: string;

  locked_by: string | null;

  locked_at: string | null;

  error_message: string | null;

  createdAt: string;

  updatedAt: string;
}

export interface QueueJob {
  id: string;
  job_type: string;
  payload: Record<string, unknown>;
  status: "pending" | "processing" | "done" | "retry" | "dead_letter";
  attempts: number;
  max_attempts: number;
  run_at: string;
  locked_by: string | null;
  locked_at: string | null;
  error_message: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface QueueResponse {
  data: QueueJob[];
  count: number;
}


export interface ReadOnlyResponse {
  read_only_mode: boolean;
}

export interface OAuthUrlResponse {
  authorizeUrl: string;
}

export interface ActionResponse {
  message: string;
}

