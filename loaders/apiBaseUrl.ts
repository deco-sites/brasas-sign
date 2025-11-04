import { Secret } from "apps/website/loaders/secret.ts";

export interface Props {
  /** @title API Base URL */
  apiBaseUrl: Secret;
}

export type ApiBaseUrl = string;

/** @title API base URL config */
export default function loader({ apiBaseUrl }: Props): ApiBaseUrl {
  const apiBaseUrlString = typeof apiBaseUrl === "string"
    ? apiBaseUrl
    : apiBaseUrl.get() as string;

  return apiBaseUrlString;
}
