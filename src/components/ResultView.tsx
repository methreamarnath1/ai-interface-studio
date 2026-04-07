import { CheckCircle, AlertTriangle, Lightbulb, FileText, Target } from "lucide-react";
import type { RoomResult } from "@/lib/api";

function Section({ icon: Icon, title, color, children }: { icon: React.ElementType; title: string; color: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`h-4 w-4 ${color}`} />
        <h3 className="font-semibold text-sm text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export function ResultView({ result }: { result: RoomResult }) {
  return (
    <div className="space-y-4 animate-slide-up">
      {/* Conclusion */}
      <div className="glass rounded-xl p-6 border-primary/20">
        <div className="flex items-center gap-2 mb-3">
          <Target className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Conclusion</h3>
        </div>
        <p className="text-secondary-foreground leading-relaxed">{result.conclusion}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Section icon={Lightbulb} title="Key Points" color="text-amber">
          <ul className="space-y-2">
            {result.keyPoints.map((p, i) => (
              <li key={i} className="flex gap-2 text-sm text-secondary-foreground">
                <span className="text-amber mt-0.5">•</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={CheckCircle} title="Agreements" color="text-green">
          <ul className="space-y-2">
            {result.agreements.map((a, i) => (
              <li key={i} className="flex gap-2 text-sm text-secondary-foreground">
                <CheckCircle className="h-3.5 w-3.5 text-green mt-0.5 shrink-0" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={AlertTriangle} title="Conflicts" color="text-rose">
          <ul className="space-y-2">
            {result.conflicts.map((c, i) => (
              <li key={i} className="flex gap-2 text-sm text-secondary-foreground">
                <AlertTriangle className="h-3.5 w-3.5 text-rose mt-0.5 shrink-0" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={FileText} title="Full Transcript" color="text-cyan">
          <pre className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto font-mono">
            {result.transcript}
          </pre>
        </Section>
      </div>
    </div>
  );
}
