// import { useEffect, useRef, useState } from "react";
// import { SendHorizonalIcon } from "lucide-react";
// import ReactMarkdown from "react-markdown";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import vs2015 from "react-syntax-highlighter/dist/esm/styles/prism/atom-dark";
// import { Textarea } from "@/components/ui/textarea";
// import TypingLoader from "@/components/TypingLoader";
// import { useMutation } from "@tanstack/react-query";
// import { promptGPT } from "@/lib/api";

// /* ------------------ Component ------------------ */

// export default function Homepage() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [chatID,setChatID] = useState("")
//   const { chat_uid } = useParams();

//   const [input, setInput] = useState("");
//   const [isTyping, setIsTyping] = useState(false);

//   const bottomRef = useRef(null);

//   /* Initialize / reset chat */
//   useEffect(() => {
//     if (chat_uid) {
//       setChatID(chat_uid);
//     } else {
//       setChatID(crypto.randomUUID());
//     }
//   }, [chat_uid]);

//   /* Messages (frontend only) */
//   const [messages, setMessages] = useState([
//     { role: "assistant", content: "Welcome! I'm here to assist you." },
//   ]);

// const mutation = useMutation({
//     mutationFn: promptGPT,
//     onSuccess:(res)=>{
//       console.log(res)
//       // setMessages(prev=>[...prev,res.reply])
//     }
//   })



//   /* Reset when starting new chat */
//   useEffect(() => {
//     if (location.pathname === "/" || location.pathname === "/chats/new") {
//       setMessages([
//         { role: "assistant", content: "Welcome! I'm here to assist you." },
//       ]);
//     }
//   }, [location.pathname]);

//   /* Auto scroll */
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, isTyping]);

//   /* Send message */
//   const handleSend = () => {
//     if (!input.trim()) return;

//     if (location.pathname === "/" || location.pathname === "/chats/new") {
//       navigate(`/chats/${chatID}`);
//     }

//     const userMessage = { role: "user", content: input };

//     setMessages((prev) => 
//       [...prev,userMessage].filter(
//         (m) => m.content !== "Welcome! I'm here to assist you."
//       ),
//       userMessage,
//     );
//     mutation.mutate({chat_id:chatID,content:input})
//     setInput("");
//     setIsTyping(true);

//     /* Fake assistant reply */
//     setTimeout(() => {
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content:
//             "This is a **frontend-only mock reply**.\n\n```js\nconsole.log('Hello from the UI');\n```",
//         },
//       ]);
//       setIsTyping(false);
//     }, 1200);
//   };

//   return (
//     <div className="flex flex-1">
//       <div className="flex flex-1 flex-col bg-background text-foreground">
//         {/* Messages */}
//         <div className="flex-1 space-y-4 overflow-y-auto p-6">
//           {messages.map((msg, idx) =>
//             msg.role === "user" ? (
//               <div
//                 key={idx}
//                 className="ml-auto max-w-xl rounded-xl bg-primary p-4 text-primary-foreground"
//               >
//                 {msg.content}
//               </div>
//             ) : (
//               <div
//                 key={idx}
//                 className="prose max-w-none rounded-lg bg-muted p-4 shadow dark:prose-invert"
//               >
//                 <ReactMarkdown
//                   components={{
//                     code({ inline, className, children }) {
//                       const match = /language-(\w+)/.exec(className || "");
//                       return !inline && match ? (
//                         <SyntaxHighlighter
//                           style={vs2015}
//                           language={match[1]}
//                           PreTag="div"
//                           className="rounded-md"
//                         >
//                           {String(children).replace(/\n$/, "")}
//                         </SyntaxHighlighter>
//                       ) : (
//                         <code className="rounded bg-muted px-1 py-0.5 text-sm">
//                           {children}
//                         </code>
//                       );
//                     },
//                   }}
//                 >
//                   {msg.content}
//                 </ReactMarkdown>
//               </div>
//             )
//           )}

//           {isTyping && <TypingLoader />}
//           <div ref={bottomRef} />
//         </div>

//         {/* Input */}
//         <div className="sticky bottom-0 z-50 border-t bg-background p-4">
//           <div className="mx-auto flex max-w-2xl items-center gap-4">
//             <Textarea
//               placeholder="Send a message..."
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter" && !e.shiftKey) {
//                   e.preventDefault();
//                   handleSend();
//                 }
//               }}
//               className="min-h-[80px] max-h-[200px] flex-1 resize-none rounded-md border bg-muted/40 px-4 py-3 text-sm shadow-sm transition focus-visible:ring-2"
//             />

//             <button
//               onClick={handleSend}
//               className="rounded-md bg-primary p-2 text-primary-foreground transition hover:bg-primary/90"
//             >
//               <SendHorizonalIcon size={18} />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useRef, useState } from "react";
import { SendHorizonalIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import vs2015 from "react-syntax-highlighter/dist/esm/styles/prism/atom-dark";
import { Textarea } from "@/components/ui/textarea";
import TypingLoader from "@/components/TypingLoader";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getChatMessages, promptGPT } from "@/lib/api";

export default function Homepage() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const { chat_uid } = useParams();

  const [chatID, setChatID] = useState("");
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef(null);

  const [messages, setMessages] = useState([
    { role: "assistant", content: "Welcome! I'm here to assist you." },
  ]);

  /* Initialize chat ID */
  useEffect(() => {
    const id = chat_uid ?? crypto.randomUUID();
    setChatID(id);
  }, [chat_uid]);

  /* Fetch chat history */
  const {
    data: chatData,
    isPending: chatPending,
    isError: chatError,
  } = useQuery({
    queryKey: ["chatMessages", chatID],
    queryFn: () => getChatMessages(chatID),
    enabled: !!chatID && chatID.length > 20, // Only fetch if it's a real UUID (not "new")
  });

  /* Load messages from backend */
  useEffect(() => {
    if (chatData && chatData.length > 0) {
      setMessages(chatData);
    } else if (!chat_uid) {
      setMessages([
        { role: "assistant", content: "Welcome! I'm here to assist you." },
      ]);
    }
  }, [chatData, chat_uid]);

  /* Auto-scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /* Send prompt */
  const mutation = useMutation({
    mutationFn: promptGPT,
    onSuccess: (res) => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.reply },
      ]);
      setIsTyping(false);
      // Invalidate the chat list to show the new chat in the sidebar
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
    },
    onError: (err) => {
      console.error("GPT error:", err);
      setIsTyping(false);
    },
  });

  const handleSend = () => {
    if (!input.trim() || mutation.isPending) return;

    if (location.pathname === "/" || location.pathname === "/chats/new") {
      navigate(`/chats/${chatID}`);
    }

    const userMessage = { role: "user", content: input };

    setMessages((prev) => [
      ...prev.filter(
        (m) => m.content !== "Welcome! I'm here to assist you."
      ),
      userMessage,
    ]);

    setIsTyping(true);
    mutation.mutate({ chat_id: chatID, content: input });
    setInput("");
  };

  return (
    <div className="flex flex-1">
      <div className="flex flex-1 flex-col bg-background text-foreground">
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {messages.map((msg, idx) =>
            msg.role === "user" ? (
              <div
                key={idx}
                className="ml-auto max-w-xl rounded-xl bg-primary p-4 text-primary-foreground"
              >
                {msg.content}
              </div>
            ) : (
              <div
                key={idx}
                className="prose max-w-none rounded-lg bg-muted p-4 shadow dark:prose-invert"
              >
                <ReactMarkdown
                  components={{
                    code({ inline, className, children }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={vs2015}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-md"
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className="rounded bg-muted px-1 py-0.5 text-sm">
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            )
          )}

          {isTyping && <TypingLoader />}
          <div ref={bottomRef} />
        </div>

        <div className="sticky bottom-0 border-t bg-background p-4">
          <div className="mx-auto flex max-w-2xl items-center gap-4">
            <Textarea
              placeholder="Send a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="min-h-[80px] flex-1 resize-none"
            />

            <button
              onClick={handleSend}
              disabled={mutation.isPending}
              className="rounded-md bg-primary p-2 text-primary-foreground disabled:opacity-50"
            >
              <SendHorizonalIcon size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
