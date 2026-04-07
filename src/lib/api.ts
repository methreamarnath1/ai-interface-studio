const BASE_URL = "http://localhost:5000";

export interface Bot {
  name: string;
  role: string;
}

export interface Message {
  botName: string;
  role: string;
  message: string;
  round: number;
  timestamp: string;
}

export interface RoomResult {
  transcript: string;
  keyPoints: string[];
  agreements: string[];
  conflicts: string[];
  conclusion: string;
}

export interface Room {
  id: string;
  topic: string;
  rounds: number;
  status: "pending" | "running" | "completed" | "failed";
  bots: Bot[];
  conversation: Message[];
  result: RoomResult | null;
  createdAt: string;
  updatedAt: string;
}

export interface RoomListItem {
  id: string;
  topic: string;
  status: string;
  rounds: number;
  botCount: number;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

export async function createRoom(topic: string, rounds: number, bots: Bot[]) {
  const res = await fetch(`${BASE_URL}/api/rooms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, rounds, bots }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to create room");
  return json.data as Room;
}

export async function startDiscussion(roomId: string, rounds?: number) {
  const res = await fetch(`${BASE_URL}/api/rooms/${roomId}/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rounds ? { rounds } : {}),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to start");
  return json.data as Room;
}

export async function getConversation(roomId: string) {
  const res = await fetch(`${BASE_URL}/api/rooms/${roomId}/conversation`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to get conversation");
  return json.data as {
    roomId: string;
    topic: string;
    status: string;
    rounds: number;
    bots: Bot[];
    totalMessages: number;
    conversation: Message[];
  };
}

export async function getResult(roomId: string) {
  const res = await fetch(`${BASE_URL}/api/rooms/${roomId}/result`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to get result");
  return json.data as {
    roomId: string;
    topic: string;
    status: string;
    rounds: number;
    bots: Bot[];
    result: RoomResult;
    completedAt: string;
  };
}

export async function listRooms() {
  const res = await fetch(`${BASE_URL}/api/rooms`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to list rooms");
  return json.data as RoomListItem[];
}

export async function healthCheck() {
  const res = await fetch(`${BASE_URL}/health`);
  return res.json();
}
