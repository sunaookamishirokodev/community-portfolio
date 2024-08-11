declare namespace NodeJS {
	interface ProcessEnv {
		readonly NEXT_PUBLIC_API_BASE_URL: string;
		readonly NEXT_PUBLIC_SSO_BASE_URL: string;
		readonly NEXT_PUBLIC_BASE_URL: string;
		readonly NEXT_PUBLIC_GITHUB_SOURCE: string;
		readonly NEXT_PUBLIC_GATEWAY_BASE_URL: string;
	}
}
