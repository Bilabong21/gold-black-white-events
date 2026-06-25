import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Building2, Navigation } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type Branch = {
  id: string;
  name: string;
  city: string | null;
  province: string;
  address: string | null;
  nearest_landmark: string | null;
};

const PROVINCE_NAMES: Record<string, string> = {
  GP: "Gauteng",
  NW: "North West",
  FS: "Free State",
  NC: "Northern Cape",
};

const buildMapsUrl = (b: Branch) => {
  const q = [b.address || b.nearest_landmark, b.city, PROVINCE_NAMES[b.province], "South Africa", `BRCSA ${b.name}`]
    .filter(Boolean)
    .join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
};

const Branches = () => {
  const { data: branches = [], isLoading } = useQuery({
    queryKey: ["public-branches"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("branches").select("*").order("name");
      if (error) throw error;
      return data as Branch[];
    },
  });

  const grouped = (["GP", "NW", "FS", "NC"] as const).map((p) => ({
    code: p,
    name: PROVINCE_NAMES[p],
    items: branches.filter((b) => b.province === p),
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative bg-secondary text-secondary-foreground py-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/15 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 border border-primary/30 mb-4">
            <Building2 className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">{branches.length} Branches</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="text-primary">Branches</span>
          </h1>
          <p className="text-lg text-secondary-foreground/80 max-w-2xl mx-auto">
            BRCSA operates across Gauteng, North West, Free State and Northern Cape. Tap any branch to open it in Google Maps.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {isLoading && <p className="text-center text-muted-foreground">Loading branches…</p>}
          {!isLoading && grouped.map((group) => (
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
              {group.items.length === 0 ? (
                <p className="text-sm text-muted-foreground">No branches in this province yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.items.map((b) => (
                    <Card key={b.id} className="border-l-4 border-l-primary hover:shadow-lg transition-shadow flex flex-col">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-lg text-card-foreground">{b.name}</CardTitle>
                          <Badge variant="secondary">{group.code}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5 text-primary" />
                            <span>{b.city || "—"}</span>
                          </div>
                          {b.address && (
                            <p className="text-card-foreground/80">{b.address}</p>
                          )}
                          {!b.address && b.nearest_landmark && (
                            <p className="text-card-foreground/80 italic">Near {b.nearest_landmark}</p>
                          )}
                          {b.address && b.nearest_landmark && (
                            <p className="text-xs text-muted-foreground">Landmark: {b.nearest_landmark}</p>
                          )}
                        </div>
                        <Button asChild size="sm" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                          <a href={buildMapsUrl(b)} target="_blank" rel="noopener noreferrer">
                            <Navigation className="h-4 w-4 mr-2" />Open in Google Maps
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Branches;
