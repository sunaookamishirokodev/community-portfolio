"use client";
// clzmxugcf0000ac1y9w7m7vxo
import { UserData } from "@/app/template";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { getDefaultAvatarName, getUserMedia } from "@/functions/user";
import { useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function DiscussionPage({ params: { channel } }: { params: { channel: string } }) {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [messages, setMessages] = useState<DiscussionMessage[]>([]);
	const [message, setMessage] = useState<string>("");
	const { user } = useContext(UserData);
	const [error, setError] = useState<string | null>(null);
	const [currentChannel, setCurrentChannel] = useState<DiscussionChannel | null>(null);
	const { toast } = useToast();
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const server = io(`${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/discussion`, { withCredentials: true });
		server.emit("joinRoom", channel, (cb: null | DiscussionChannel) => {
			if (!cb) setError("Invalid channel");
			setCurrentChannel(cb);
		});
		setSocket(server);

		return () => {
			server.disconnect();
		};
	}, [channel]);

	useEffect(() => {
		socket?.on("receiveMessage", (msg) => {
			console.log(msg);
			setMessages([...messages, msg]);
		});

		socket?.on("connect_error", (err) => console.log(err.message));
	}, [socket, messages]);

	useEffect(() => {
		toast({
			title: "Something went wrong",
			description: error,
			action: (
				<ToastAction onClick={() => location.reload()} altText="Reload">
					Reload
				</ToastAction>
			),
			variant: "destructive",
		});
	}, [error, toast]);

	return (
		<div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-3 dark:border-neutral-700 dark:bg-neutral-900">
			<ul className="flex flex-1 flex-col gap-2">
				{messages.map((msg, index) => {
					return (
						<li
							key={index}
							className={`flex gap-2 ${msg.member_id === user?.id ? "ml-auto flex-row-reverse" : "mr-auto"}`}
						>
							<Avatar>
								<AvatarImage src={getUserMedia(user?.avatar!)} alt={user?.display_name} />
								<AvatarFallback>{getDefaultAvatarName(user?.display_name!)}</AvatarFallback>
							</Avatar>
							<span
								className={`rounded-xl bg-primary px-3 py-1 ${msg.member_id === user?.id ? "rounded-tr-none" : "rounded-tl-none"}`}
							>
								{msg.content}
							</span>
						</li>
					);
				})}
			</ul>
			<div className="flex gap-3">
				<Input
					ref={inputRef}
					onChange={(e) => setMessage(e.target.value)}
					type="text"
					disabled={!user || !currentChannel}
					placeholder={!user ? "Login to continue" : !currentChannel ? "Invalid channel" : "Type a message"}
				/>
				<Button
					variant="secondary"
					onClick={() => {
						if (!message) return;
						socket?.emit("sendMessage", message, channel, (data: DiscussionMessage) => {
							if (data) {
								if (!inputRef.current) return;
								setMessage("");
								inputRef.current.value = "";
								setMessages([...messages, data]);
							}
						});
					}}
					disabled={!message || !user || !currentChannel}
				>
					Send
				</Button>
			</div>
		</div>
	);
}
