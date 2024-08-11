interface DiscussionMessage {
	id: string;
	channel_id: string;
	member_id: string;
	content: string;
	create_at: Date;
	edit_at: Date | null;
}

interface DiscussionChannel {
	id: string;
	last_message_sent_at: string;
	name: string;
	readonly: string;
}
