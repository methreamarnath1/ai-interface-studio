import { useState, useEffect } from "react";
import { CreateRoomDialog } from "@/components/CreateRoomDialog";
import { RoomCard } from "@/components/RoomCard";
import { listRooms, type RoomListItem } from "@/lib/api";
import { BrainCircuit, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [rooms, setRooms] = useState<RoomListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listRooms();
      setRooms(data);
    } catch (e: any) {
      setError(e.message || "Could not connect to API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  return (
    <div className="min-h-screen bg-background dot-grid">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-accent/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 backdrop-blur-md bg-background/60 sticky top-0 z-20">
          <div className="container max-w-5xl mx-auto flex items-center justify-between h-16 px-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <BrainCircuit className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-base font-semibold text-foreground leading-none">AI Discussion Room</h1>
                <p className="text-xs text-muted-foreground mt-0.5">Multi-agent debates powered by AI</p>
              </div>
            </div>
            <CreateRoomDialog />
          </div>
        </header>

        {/* Hero */}
        <section className="container max-w-5xl mx-auto px-4 pt-16 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
            v1.0 · Grok Powered
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            Watch AI Bots <span className="glow-text">Debate Any Topic</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
            Create discussion rooms, assign bot personas, and watch intelligent multi-round debates unfold in real time.
          </p>
        </section>

        {/* Rooms List */}
        <section className="container max-w-5xl mx-auto px-4 pb-20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Recent Discussions</h3>
            <Button variant="ghost" size="sm" onClick={fetchRooms} className="text-muted-foreground h-8">
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
          </div>

          {loading && rooms.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="glass rounded-xl p-8 text-center">
              <p className="text-muted-foreground mb-2">Unable to connect to the API server</p>
              <p className="text-xs text-muted-foreground/60 mb-4">{error}</p>
              <Button variant="glass" size="sm" onClick={fetchRooms}>Retry</Button>
            </div>
          ) : rooms.length === 0 ? (
            <div className="glass rounded-xl p-12 text-center">
              <BrainCircuit className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground mb-1">No discussions yet</p>
              <p className="text-xs text-muted-foreground/60">Create your first discussion room to get started.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Index;
