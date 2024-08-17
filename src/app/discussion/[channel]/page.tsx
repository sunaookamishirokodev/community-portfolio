"use client";
import { UserData } from "@/app/template";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { getDefaultAvatarName, getUserMedia } from "@/functions/user";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function DiscussionPage({ params: { channel } }: { params: { channel: string } }) {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [newMessagesCount, setNewMessagesCount] = useState<number>(-1);
	const [messages, setMessages] = useState<DiscussionMessage[]>([]);
	const [message, setMessage] = useState<string>("");
	const { user } = useContext(UserData);
	const [error, setError] = useState<string | null>(null);
	const [currentChannel, setCurrentChannel] = useState<DiscussionChannel | null>(null);
	const { toast } = useToast();
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const ulRef = useRef<HTMLUListElement>(null);

	useEffect(() => {
		const server = io(`${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/discussion`, { withCredentials: true });
		server.emit("joinRoom", channel, (cb: null | DiscussionChannel) => {
			if (!cb) setError("Invalid channel");
			setCurrentChannel(cb);
		});
		setSocket(server);

		axios
			.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/discussion/message/${channel}`, { withCredentials: true })
			.then((res) => {
				setMessages(res.data.data);
				setNewMessagesCount(0);
			})
			.catch((err) => setError(err.response.data.msg));

		return () => {
			server.disconnect();
		};
	}, [channel]);

	useEffect(() => {
		socket?.on("receiveMessage", (msg) => {
			console.log(msg);
			setMessages([msg, ...messages]);
		});

		socket?.on("connect_error", (err) => console.log(err.message));
	}, [socket, messages]);

	// useEffect(() => {
	// 	if (!ulRef.current) return;
	// 	if (ulRef.current.scrollTop === 0) {
	// 		axios
	// 			.get(
	// 				`${process.env.NEXT_PUBLIC_API_BASE_URL}/discussion/message/${channel}?position=${messages.length}`,
	// 				{ withCredentials: true },
	// 			)
	// 			.then((res) => setMessages([res.data.data, ...messages]))
	// 			.catch((err) => setError(err.response.data.msg));
	// 	}
	// }, [channel, messages.length]);

	useEffect(() => {
		if (!inputRef.current || !buttonRef.current) return;

		const onKeyDown = (ev: KeyboardEvent) => {
			if (ev.key === "Backspace") {
				return;
			}

			if (ev.key === "Enter") {
				if (ev.shiftKey) {
					return;
				} else {
					return buttonRef.current?.click();
				}
			}

			inputRef.current?.focus();
		};

		window.addEventListener("keydown", onKeyDown);

		return () => {
			window.removeEventListener("keydown", onKeyDown);
		};
	}, []);

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

	useLayoutEffect(() => {
		if (ulRef.current) {
			ulRef.current.scrollTop = ulRef.current.scrollHeight;
		}
	}, [newMessagesCount]);

	return (
		<div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-3 dark:border-neutral-700 dark:bg-neutral-900">
			<ul ref={ulRef} className="flex flex-1 flex-col gap-2 overflow-y-scroll px-2" id="scrollableDiv">
				<InfiniteScroll
					dataLength={messages.length}
					endMessage={
						<p style={{ textAlign: "center" }}>
							<b>Yay! You have seen it all</b>
						</p>
					}
					style={{ display: "flex", flexDirection: "column-reverse" }}
					scrollThreshold={"100px"}
					// inverse={true}
					hasMore={true}
					loader={<h4>Loading...</h4>}
					next={() => {
						axios
							.get(
								`${process.env.NEXT_PUBLIC_API_BASE_URL}/discussion/message/${channel}?position=${messages.length}`,
								{ withCredentials: true },
							)
							.then((res) => {
								console.log(res.data);
								setMessages([...messages, res.data.data]);
							})
							.catch((err) => setError(err.response.data.msg));
					}}
					scrollableTarget="scrollableDiv"
				>
					{messages.map((msg, index) => {
						return (
							<li
								key={index}
								className={`flex items-center gap-2 ${msg.member_id === user?.id ? "ml-auto flex-row-reverse" : "mr-auto"}`}
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
				</InfiniteScroll>
			</ul>
			<div className="flex gap-3">
				<Textarea
					className="resize-none overflow-auto"
					ref={inputRef}
					onChange={(e) => setMessage(e.target.value)}
					disabled={!user || !currentChannel}
					placeholder={
						!user
							? "Login to continue"
							: !currentChannel
								? "Invalid channel"
								: `Type a message to ${currentChannel.name}`
					}
					autoComplete={"off"}
					autoFocus={true}
				/>
				<Button
					ref={buttonRef}
					variant="secondary"
					onClick={() => {
						if (!message) return;
						socket?.emit("sendMessage", message, channel, (data: DiscussionMessage) => {
							if (data) {
								if (!inputRef.current || !ulRef.current) return;
								setMessage("");
								inputRef.current.value = "";
								setMessages([data, ...messages]);
								setNewMessagesCount(newMessagesCount + 1);
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
