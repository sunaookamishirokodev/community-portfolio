export const getUserMedia = (path: string) => process.env.NEXT_PUBLIC_API_BASE_URL + "/" + path;
export const getDefaultAvatarName = (displayName: string) => {
	return displayName.split(" ").map((r) => r.slice(0, 1).toUpperCase());
};
