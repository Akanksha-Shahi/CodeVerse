// DefenseChatApp.jsx
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const rooms = ["Room A", "Room B", "Room C"];

export default function DefenseChatApp() {
  const [activeRoom, setActiveRoom] = useState("Room A");
  const [messages, setMessages] = useState({
    "Room A": [],
    "Room B": [],
    "Room C": [],
  });
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = { text: input, time: new Date().toLocaleTimeString() };
    setMessages({
      ...messages,
      [activeRoom]: [...messages[activeRoom], newMsg],
    });
    setInput("");
  };

  return (
    <div className="grid grid-cols-4 gap-4 p-4 h-screen">
      <div className="col-span-1 border-r pr-4">
        <h2 className="text-xl font-bold mb-4">Defense Rooms</h2>
        <ul>
          {rooms.map((room) => (
            <li
              key={room}
              className={`p-2 rounded cursor-pointer ${
                activeRoom === room ? "bg-blue-500 text-white" : "hover:bg-gray-200"
              }`}
              onClick={() => setActiveRoom(room)}
            >
              {room}
            </li>
          ))}
        </ul>
      </div>

      <div className="col-span-3 flex flex-col">
        <Card className="flex-1 overflow-y-auto">
          <CardContent className="p-4 space-y-2">
            <h3 className="text-lg font-semibold mb-2">{activeRoom} Chat</h3>
            {messages[activeRoom].map((msg, index) => (
              <div key={index} className="bg-gray-100 p-2 rounded">
                <span className="block text-sm text-gray-700">{msg.text}</span>
                <span className="text-xs text-gray-500">{msg.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="mt-2 flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
}