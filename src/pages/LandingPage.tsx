import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { CAMERA_STATUSES } from "@/lib/constants";

export function LandingPage() {
  const navigate = useNavigate();
  const stats = useQuery(api.cameras.stats);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="relative container mx-auto px-6 pt-20 pb-16 text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary-foreground">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight">FlockWatch</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight max-w-3xl mx-auto leading-[1.1]">
            Map the
            <span className="text-primary"> surveillance state</span>
            <br />
            one camera at a time
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Community-driven tracking of Flock Safety ALPR cameras and other
            automated license plate readers across America.
          </p>

          <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
            <Button
              size="lg"
              className="text-base px-8 py-3 h-auto rounded-full font-semibold shadow-lg shadow-primary/20"
              onClick={() => navigate("/map")}
            >
              View the Map →
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-base px-8 py-3 h-auto rounded-full"
              onClick={() => navigate("/signup")}
            >
              Join the Watch
            </Button>
          </div>

          {/* Stats */}
          {stats && (
            <div className="mt-16 flex items-center justify-center gap-8 md:gap-16 flex-wrap">
              {[
                { value: stats.total, label: "Cameras Tracked", color: CAMERA_STATUSES.confirmed.color },
                { value: stats.confirmed, label: "Confirmed", color: CAMERA_STATUSES.confirmed.color },
                { value: stats.cities, label: "Cities", color: "#94a3b8" },
                { value: stats.states, label: "States", color: "#94a3b8" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div
                    className="text-3xl md:text-4xl font-black tabular-nums"
                    style={{ color: s.color }}
                  >
                    {s.value.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 font-medium uppercase tracking-wider">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* How it works */}
      <div className="container mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold text-center mb-12">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              icon: "📍",
              title: "Spot a Camera",
              desc: "See an ALPR camera in your neighborhood? Report its exact location, type, and details.",
            },
            {
              icon: "✅",
              title: "Community Verifies",
              desc: "Other members confirm or dispute reports. 3 confirmations mark a camera as verified.",
            },
            {
              icon: "🗺️",
              title: "Map Gets Stronger",
              desc: "Every report helps build the most comprehensive public ALPR surveillance map in the US.",
            },
          ].map((step) => (
            <div
              key={step.title}
              className="bg-card border border-border rounded-xl p-6 text-center hover:border-primary/30 transition-colors"
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Why it matters */}
      <div className="bg-card border-y border-border">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-6">Why This Matters</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Flock Safety and similar companies have deployed thousands of ALPR
              cameras across America, creating a mass surveillance network that
              tracks the movements of millions of people — often without public
              knowledge or consent.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              FlockWatch believes in transparency. If they're watching us, we
              should at least know where the cameras are.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <a href="https://www.eff.org" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
                EFF
              </a>
              <span className="opacity-30">•</span>
              <a href="https://www.aclu.org" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
                ACLU
              </a>
              <span className="opacity-30">•</span>
              <a href="https://www.eff.org/pages/automated-license-plate-readers-alpr" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
                Learn about ALPRs
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to take a stand?</h2>
        <p className="text-muted-foreground mb-8">
          Join thousands of Americans mapping surveillance in their communities.
        </p>
        <Button
          size="lg"
          className="text-base px-8 py-3 h-auto rounded-full font-semibold shadow-lg shadow-primary/20"
          onClick={() => navigate("/signup")}
        >
          Create Free Account
        </Button>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-primary-foreground">
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <span>FlockWatch</span>
          </div>
          <span>Open source surveillance transparency</span>
        </div>
      </footer>
    </div>
  );
}
