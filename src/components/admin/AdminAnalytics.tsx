import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ['hsl(43, 96%, 56%)', 'hsl(43, 80%, 40%)', 'hsl(43, 60%, 70%)', 'hsl(0, 0%, 30%)', 'hsl(0, 0%, 50%)', 'hsl(0, 0%, 70%)'];

const AdminAnalytics = () => {
  const { data: profiles = [] } = useQuery({
    queryKey: ['admin-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at');
      if (error) throw error;
      return data;
    },
  });

  const { data: members = [] } = useQuery({
    queryKey: ['committee-members'],
    queryFn: async () => {
      const { data, error } = await supabase.from('committee_members').select('*, church_groups(name)');
      if (error) throw error;
      return data;
    },
  });

  const { data: events = [] } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      const { data, error } = await supabase.from('events').select('*, church_groups(name)');
      if (error) throw error;
      return data;
    },
  });

  // Monthly registrations
  const monthlyRegs = profiles.reduce((acc: any, p: any) => {
    const month = new Date(p.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});
  const regData = Object.entries(monthlyRegs).map(([month, count]) => ({ month, count }));

  // Status distribution
  const statusCounts = profiles.reduce((acc: any, p: any) => {
    acc[p.status || 'pending'] = (acc[p.status || 'pending'] || 0) + 1;
    return acc;
  }, {});
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  // Category distribution
  const categoryCounts = members.reduce((acc: any, m: any) => {
    const cat = m.ministry_category || 'Unassigned';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));

  // Province distribution
  const provinceCounts = members.reduce((acc: any, m: any) => {
    const prov = m.province || 'Unknown';
    acc[prov] = (acc[prov] || 0) + 1;
    return acc;
  }, {});
  const provinceData = Object.entries(provinceCounts).map(([province, count]) => ({ province, count }));

  // Events by group
  const eventGroupCounts = events.reduce((acc: any, e: any) => {
    const name = e.church_groups?.name || 'General';
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});
  const eventGroupData = Object.entries(eventGroupCounts).map(([name, count]) => ({ name, count }));

  // Monthly events
  const monthlyEvents = events.reduce((acc: any, e: any) => {
    const month = new Date(e.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});
  const monthlyEventData = Object.entries(monthlyEvents).map(([month, count]) => ({ month, count }));

  const totalApproved = profiles.filter((p: any) => p.status === 'approved').length;
  const totalPending = profiles.filter((p: any) => p.status === 'pending').length;
  const totalRejected = profiles.filter((p: any) => p.status === 'rejected').length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-card border-primary/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{profiles.length}</div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-green-500/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{totalApproved}</div>
            <div className="text-sm text-muted-foreground">Approved</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-yellow-500/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{totalPending}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-red-500/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{totalRejected}</div>
            <div className="text-sm text-muted-foreground">Rejected</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-primary/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{events.length}</div>
            <div className="text-sm text-muted-foreground">Total Events</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-primary/20">
          <CardHeader><CardTitle className="text-lg">Monthly Registrations</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={regData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 80%)" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis allowDecimals={false} fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(43, 96%, 56%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-primary/20">
          <CardHeader><CardTitle className="text-lg">User Status Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-primary/20">
          <CardHeader><CardTitle className="text-lg">Members by Ministry Category</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-primary/20">
          <CardHeader><CardTitle className="text-lg">Members by Province</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={provinceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 80%)" />
                <XAxis dataKey="province" fontSize={12} />
                <YAxis allowDecimals={false} fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(43, 80%, 40%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-primary/20">
          <CardHeader><CardTitle className="text-lg">Events by Church Group</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={eventGroupData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 80%)" />
                <XAxis dataKey="name" fontSize={10} angle={-20} textAnchor="end" height={60} />
                <YAxis allowDecimals={false} fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(43, 96%, 56%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-primary/20">
          <CardHeader><CardTitle className="text-lg">Monthly Events Posted</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyEventData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 80%)" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis allowDecimals={false} fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(43, 60%, 70%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
