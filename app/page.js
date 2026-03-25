"use client";

import { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  limit,
  serverTimestamp
} from "firebase/firestore";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("")

  const bottomRef = useRef();

  // 🔥 Real-time listener
  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt", "asc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setMessages(msgs);
    });

    return () => unsubscribe();
  }, []);

  // 📤 Send message
  const sendMessage = async () => {
    if (!input.trim()) return;

    await addDoc(collection(db, "messages"), {
      text: input,
      sender: username,
      createdAt: serverTimestamp(),
    });

    setInput("");
  };

  // 🔽 Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <h1 className="text-3xl mb-4">Firebase Chat</h1>

      <div className="flex w-full max-w-xl items-center gap-2 mb-2">
        <label htmlFor="username">Username: </label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Type username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="flex-1 py-3 px-3 border bg-gray-800 rounded-lg text-white"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
      </div>

      {/* Chat Box */}
      <div className="w-full max-w-xl border bg-gray-600 rounded-lg p-4 h-[60vh] overflow-y-auto mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2 text-left">
            <span className="inline-block px-3 py-2 rounded-lg bg-gray-200 text-black break-words">
              <span className="font-bold text-lg">{msg.sender}: </span>{msg.text}
            </span>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      {/* Input */}
      <div className="flex w-full max-w-xl gap-2">
        <input
          type="text"
          placeholder="Type message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 py-3 px-3 border bg-gray-800 rounded-lg text-white"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}