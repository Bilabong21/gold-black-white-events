import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building2 } from "lucide-react";

type Branch = { name: string; province: "GP" | "NW" | "FS" | "NC"; city?: string };

// 27 branches across the four provinces BRCSA operates in
const BRANCHES: Branch[] = [
  // Gauteng (GP) — 9
  { name: "Johannesburg Central", province: "GP", city: "Johannesburg" },
  { name: "Soweto", province: "GP", city: "Soweto" },
  { name: "Pretoria North", province: "GP", city: "Pretoria" },
  { name: "Pretoria East", province: "GP", city: "Pretoria" },
  { name: "Tembisa", province: "GP", city: "Tembisa" },
  { name: "Vereeniging", province: "GP", city: "Vereeniging" },
  { name: "Krugersdorp", province: "GP", city: "Krugersdorp" },
  { name: "Benoni", province: "GP", city: "Benoni" },
  { name: "Mamelodi", province: "GP", city: "Pretoria" },

  // North West (NW) — 6
  { name: "Mahikeng", province: "NW", city: "Mahikeng" },
  { name: "Rustenburg", province: "NW", city: "Rustenburg" },
  { name: "Klerksdorp", province: "NW", city: "Klerksdorp" },
  { name: "Potchefstroom", province: "NW", city: "Potchefstroom" },
  { name: "Brits", province: "NW", city: "Brits" },
  { name: "Vryburg", province: "NW", city: "Vryburg" },

  // Free State (FS) — 7
  { name: "Bloemfontein Central", province: "FS", city: "Bloemfontein" },
  { name: "Botshabelo", province: "FS", city: "Botshabelo" },
  { name: "Welkom", province: "FS", city: "Welkom" },
  { name: "Bethlehem", province: "FS", city: "Bethlehem" },
  { name: "Kroonstad", province: "FS", city: "Kroonstad" },
  { name: "Sasolburg", province: "FS", city: "Sasolburg" },
  { name: "QwaQwa", province: "FS", city: "QwaQwa" },

  // Northern Cape (NC) — 5
  { name: "Kimberley", province: "NC", city: "Kimberley" },
  { name: "Upington", province: "NC", city: "Upington" },
  { name: "Kuruman", province: "NC", city: "Kuruman" },
  { name: "De Aar", province: "NC", city: "De Aar" },
  { name: "Springbok", province: "NC", city: "Springbok" },
];

const PROVINCE_NAMES: Record<Branch["province"], string> = {
  GP: "Gauteng",
  NW: "North West",
  FS: "Free State",
  NC: "Northern Cape",
};

const Branches = () => {
  const grouped = (["GP", "NW", "FS", "NC"] as const).map((p) => ({
    code: p,
    name: PROVINCE_NAMES[p],
    items: BRANCHES.filter((b) => b.province === p),
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative bg-secondary text-secondary-foreground py-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/15 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 border border-primary/30 mb-4">
            <Building2 className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">27 Branches</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="text-primary">Branches</span>
          </h1>
          <p className="text-lg text-secondary-foreground/80 max-w-2xl mx-auto">
            BRCSA operates 27 branches across Gauteng, North West, Free State and Northern Cape.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {grouped.map((group) => (
            <div key={group.code}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  {group.name}
                </h2>
                <Badge variant="outline" className="border-primary text-primary">
                  {group.items.length} branches
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.items.map((b) => (
                  <Card
                    key={`${group.code}-${b.name}`}
                    className="border-l-4 border-l-primary hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-card-foreground">{b.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {b.city}
                        </span>
                        <Badge variant="secondary">{group.code}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Branches;
