import { useState } from "react";
import { Plus, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { createRoom, type Bot } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const PRESET_ROLES = [
  { value: "positive", label: "Positive Thinker" },
  { value: "negative", label: "Negative Critic" },
  { value: "neutral", label: "Neutral Analyst" },
  { value: "creative", label: "Creative Thinker" },
  { value: "devil_advocate", label: "Devil's Advocate" },
];

export function CreateRoomDialog() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [rounds, setRounds] = useState(3);
  const [bots, setBots] = useState<Bot[]>([
    { name: "Optimus", role: "positive" },
    { name: "Critic", role: "negative" },
    { name: "Sage", role: "neutral" },
  ]);
  const [loading, setLoading] = useState(false);

  const addBot = () => {
    if (bots.length >= 8) return;
    setBots([...bots, { name: "", role: "creative" }]);
  };

  const removeBot = (i: number) => {
    setBots(bots.filter((_, idx) => idx !== i));
  };

  const updateBot = (i: number, field: keyof Bot, value: string) => {
    setBots(bots.map((b, idx) => (idx === i ? { ...b, [field]: value } : b)));
  };

  const handleCreate = async () => {
    if (!topic.trim()) { toast.error("Enter a topic"); return; }
    if (bots.length < 2) { toast.error("Add at least 2 bots"); return; }
    setLoading(true);
    try {
      const room = await createRoom(topic, rounds, bots);
      toast.success("Room created!");
      setOpen(false);
      navigate(`/room/${room.id}`);
    } catch (e: any) {
      toast.error(e.message || "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="glow" size="lg" className="gap-2">
          <Sparkles className="h-4 w-4" />
          New Discussion
        </Button>
      </DialogTrigger>
      <DialogContent className="glass sm:max-w-lg border-border/50">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create Discussion Room</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 pt-2">
          <div>
            <Label className="text-muted-foreground text-xs uppercase tracking-wider">Topic</Label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Is AI dangerous for humanity?"
              className="mt-1.5 bg-muted/50 border-border/50 focus:border-primary"
            />
          </div>
          <div>
            <Label className="text-muted-foreground text-xs uppercase tracking-wider">Rounds</Label>
            <Input
              type="number"
              min={1}
              max={10}
              value={rounds}
              onChange={(e) => setRounds(Number(e.target.value))}
              className="mt-1.5 w-24 bg-muted/50 border-border/50"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider">Bots ({bots.length}/8)</Label>
              <Button variant="ghost" size="sm" onClick={addBot} disabled={bots.length >= 8} className="text-primary h-7 text-xs">
                <Plus className="h-3 w-3 mr-1" /> Add
              </Button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {bots.map((bot, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input
                    value={bot.name}
                    onChange={(e) => updateBot(i, "name", e.target.value)}
                    placeholder="Bot name"
                    className="flex-1 h-9 bg-muted/50 border-border/50 text-sm"
                  />
                  <Select value={bot.role} onValueChange={(v) => updateBot(i, "role", v)}>
                    <SelectTrigger className="w-40 h-9 bg-muted/50 border-border/50 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {PRESET_ROLES.map((r) => (
                        <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" onClick={() => removeBot(i)} className="h-9 w-9 text-muted-foreground hover:text-destructive shrink-0">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <Button onClick={handleCreate} disabled={loading} variant="glow" className="w-full">
            {loading ? "Creating..." : "Create & Enter Room"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
