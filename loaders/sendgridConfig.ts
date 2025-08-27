import { Secret } from "apps/website/loaders/secret.ts";

export interface Props {
  sendgridApiKey: Secret;
}

export type Sendgrid = string;

/** @title Sendgrid config setup */
export default function loader(
  { sendgridApiKey }: Props,
): Sendgrid {
  const sendgridApiKeyString = typeof sendgridApiKey === "string"
    ? sendgridApiKey
    : sendgridApiKey.get() as string;

  return sendgridApiKeyString;
}
