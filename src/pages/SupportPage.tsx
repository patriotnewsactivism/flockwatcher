import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const DONATION_TIERS = [
  { amount: 5, label: "$5", desc: "Buy a coffee" },
  { amount: 25, label: "$25", desc: "Fund camera verification" },
  { amount: 50, label: "$50", desc: "Support development" },
  { amount: 100, label: "$100", desc: "Champion sponsor" },
];

const PARTNERS = [
  {
    name: "Electronic Frontier Foundation",
    url: "https://www.eff.org",
    desc: "Digital privacy & civil liberties",
  },
  {
    name: "ACLU",
    url: "https://www.aclu.org",
    desc: "American Civil Liberties Union",
  },
  {
    name: "Surveillance Technology Oversight Project",
    url: "https://www.stopspying.org",
    desc: "Fighting discriminatory surveillance",
  },
];

export function SupportPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            onClick={() => navigate("/")}
          >
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary-foreground">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2" />
              </svg>
            </div>
            <span className="font-bold">FlockWatch</span>
          </button>
          <Button variant="outline" size="sm" onClick={() => navigate("/map")}>
            Back to Map
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-16 max-w-3xl">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-black mb-4">
            Support the <span className="text-primary">Watch</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            FlockWatch is a community project fighting for transparency in surveillance.
            Your support keeps the lights on and the map growing.
          </p>
        </div>

        {/* Donation Tiers */}
        <div className="mb-16">
          <h2 className="text-lg font-bold mb-6 text-center">Make a Contribution</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {DONATION_TIERS.map((tier) => (
              <button
                key={tier.amount}
                type="button"
                className="bg-card border border-border rounded-xl p-5 text-center hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all group"
              >
                <div className="text-2xl font-black text-primary group-hover:scale-110 transition-transform">
                  {tier.label}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {tier.desc}
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-4">
            Stripe payments coming soon. For now, reach out to support the project.
          </p>
        </div>

        {/* Why We Fight */}
        <div className="bg-card border border-border rounded-xl p-8 mb-16">
          <h2 className="text-lg font-bold mb-4">Why We Fight</h2>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              Across America, private companies are building a surveillance infrastructure
              that tracks your car — and by extension, you — everywhere you go. ALPR cameras
              record every license plate that passes, building databases of your movements
              that can be searched by law enforcement, private companies, and others.
            </p>
            <p>
              Most people have no idea these cameras exist in their neighborhoods.
              FlockWatch changes that. By crowdsourcing camera locations, we give
              communities the knowledge they need to have informed conversations
              about surveillance in their towns.
            </p>
            <p className="font-medium text-foreground">
              Transparency is the first step to accountability.
            </p>
          </div>
        </div>

        {/* Mission Partners */}
        <div className="mb-16">
          <h2 className="text-lg font-bold mb-6 text-center">Mission Partners</h2>
          <div className="space-y-3">
            {PARTNERS.map((partner) => (
              <a
                key={partner.name}
                href={partner.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between bg-card border border-border rounded-lg p-4 hover:border-primary/30 transition-colors group"
              >
                <div>
                  <div className="font-semibold text-sm group-hover:text-primary transition-colors">
                    {partner.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{partner.desc}</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground group-hover:text-primary transition-colors">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Back to map CTA */}
        <div className="text-center">
          <Button
            size="lg"
            className="rounded-full px-8 font-semibold"
            onClick={() => navigate("/map")}
          >
            ← Back to the Map
          </Button>
        </div>
      </div>
    </div>
  );
}
