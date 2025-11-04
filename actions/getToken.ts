import { AppContext } from "site/apps/site.ts";

export interface LoginTokenResponse {
  access_token: string;
  expires_in?: number;
}

export default async function getToken(
  _props: unknown,
  _req: Request,
  ctx: AppContext,
): Promise<LoginTokenResponse> {
  const API_URL = ctx.apiBaseUrl;

  try {
    const res = await fetch(
      `${API_URL}/users/login/651f0350e5085e6250f6b366?exp_secs=1200`,
      {
        method: "GET",
        headers: {
          "community_id": "sophia-4375-44",
        },
      },
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("Erro ao obter token:", text);
      throw new Error(`Erro ao obter token: ${res.statusText}`);
    }

    const data: LoginTokenResponse = await res.json();
    return data;
  } catch (error) {
    console.error("Erro no getLoginToken:", error);
    throw error;
  }
}
