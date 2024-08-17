export const getUserMedia = (path: string) => {
	if (!path) {
		return undefined;
	}

	return process.env.NEXT_PUBLIC_API_BASE_URL + "/" + path;
};

export const getDefaultAvatarName = (displayName: string) => {
	if (!displayName) {
		return undefined;
	}

	return displayName?.split(" ").map((r) => r.slice(0, 1).toUpperCase());
};
