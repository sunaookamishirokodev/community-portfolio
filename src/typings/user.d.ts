interface User {
	id: string;
	display_name: string;
	username: string;
	mail: string;
	mail_hidden: boolean;
	create_at: Date;
	update_at: Date;
	hashed_password: string;
	banner?: string;
	avatar?: string;
	status?: string;
	biography?: string;
	banned: boolean;
	user_roles: ("shiroko_friend" | "shiroko_villager" | "shiroko_donater")[];
	verified: boolean;
}

interface SafeUser extends Omit<User, "hashed_password", "mail"> {}
interface HiddenMailUser extends Omit<User, "mail"> {}
interface HiddenPasswordUser extends Omit<User, "hashed_password"> {}
