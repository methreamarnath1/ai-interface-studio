import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Loader2, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { BotAvatar, RoleBadge } from "@/components/BotAvatar";
import { ConversationView } from "@/components/ConversationView";
import { ResultView } from "@/components/ResultView";
import { getConversation, startDiscussion, getResult, type Message, type Bot, type RoomResult } from "@/lib/api";
import { toast } from "sonner";

const RoomPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [status, setStatus] = useState("pending");
  const [rounds, setRounds] = useState(3);
  const [bots, setBots] = useState<Bot[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [result, setResult] = useState<RoomResult | null>(null);
  const [starting, setStarting] = useState(false);
  const [polling, setPolling] = useState(false);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const fetchConvo = async () => {
    if (!id) return;
    try {
      const data = await getConversation(id);
      setTopic(data.topic);
      setStatus(data.status);
      setRounds(data.rounds);
      setBots(data.bots);
      setMessages(data.conversation);
      return data.status;
    } catch (e: any) {
      toast.error(e.message);
      return null;
    }
  };

  const fetchResult = async () => {
    if (!id) return;
    try {
      const data = await getResult(id);
      setResult(data.result);
    } catch {}
  };

  useEffect(() => {
    fetchConvo().then((s) => {
      if (s === "completed") fetchResult();
    });
  }, [id]);

  // Polling
  useEffect(() => {
    if (status === "running") {
      setPolling(true);
      pollRef.current = setInterval(async () => {
        const s = await fetchConvo();
        if (s === "completed") {
          setPolling(false);
          if (pollRef.current) clearInterval(pollRef.current);
          fetchResult();
        }
      }, 2000);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [status]);

  const handleStart = async () => {
    if (!id) return;
    setStarting(true);
    try {
      toast.info("Discussion started! Bots are debating...");
      setStatus("running");
      const data = await startDiscussion(id);
      setStatus(data.status);
      setMessages(data.conversation);
      if (data.result) setResult(data.result);
      toast.success("Discussion completed!");
    } catch (e: any) {
      toast.error(e.message);
      fetchConvo();
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 backdrop-blur-md bg-background/60 sticky top-0 z-20">
          <div className="container max-w-4xl mx-auto flex items-center gap-4 h-14 px-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="text-muted-foreground">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-sm font-medium text-foreground truncate">{topic || "Loading..."}</h1>
              <p className="text-xs text-muted-foreground">{rounds} rounds · {bots.length} bots</p>
            </div>
            <StatusBadge status={status} />
            {status === "pending" && (
              <Button variant="glow" size="sm" onClick={handleStart} disabled={starting} className="gap-1.5">
                {starting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                Start
              </Button>
            )}
          </div>
        </header>

        <div className="container max-w-4xl mx-auto px-4 py-6">
          {/* Bot lineup */}
          <div className="glass rounded-xl p-4 mb-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Participants</p>
            <div className="flex flex-wrap gap-3">
              {bots.map((bot, i) => (
                <div key={i} className="flex items-center gap-2 bg-muted/40 rounded-lg px-3 py-2">
                  <BotAvatar name={bot.name} role={bot.role} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{bot.name}</p>
                    <RoleBadge role={bot.role} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conversation */}
          <div className="glass rounded-xl p-5 mb-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Conversation</p>
            <ConversationView messages={messages} loading={status === "running"} />
          </div>

          {/* Result */}
          {result && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Analysis & Summary</p>
              <ResultView result={result} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
