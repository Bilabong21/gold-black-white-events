import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const positions = ['Chairperson', 'Deputy Chairperson', 'Secretary', 'Deputy Secretary', 'Treasurer', 'Deputy Treasurer', 'Additional Member'];
const provinces = ['NC', 'FS', 'NW', 'GP'];
const ministryCategories = ['Youth', 'Women', 'Men', 'Choir', 'Sunday School', 'Ushers'] as const;

interface MemberFormProps {
  data: any;
  onChange: (data: any) => void;
  onSubmit: () => void;
  submitLabel: string;
  groups: any[];
}

const AdminMemberForm = ({ data, onChange, onSubmit, submitLabel, groups }: MemberFormProps) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label>Full Name *</Label>
      <Input value={data.name} onChange={(e) => onChange({ ...data, name: e.target.value })} placeholder="e.g., Rev. John Doe" />
    </div>
    <div className="space-y-2">
      <Label>Email</Label>
      <Input type="email" value={data.email} onChange={(e) => onChange({ ...data, email: e.target.value })} placeholder="email@brcsa.org" />
    </div>
    <div className="space-y-2">
      <Label>Phone</Label>
      <Input value={data.phone} onChange={(e) => onChange({ ...data, phone: e.target.value })} placeholder="+27 xx xxx xxxx" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Church Group</Label>
        <Select value={data.group_id} onValueChange={(v) => onChange({ ...data, group_id: v })}>
          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
          <SelectContent>{groups.map((g: any) => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Position *</Label>
        <Select value={data.position} onValueChange={(v) => onChange({ ...data, position: v })}>
          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
          <SelectContent>{positions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
        </Select>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Ministry Category</Label>
        <Select value={data.ministry_category || ''} onValueChange={(v) => onChange({ ...data, ministry_category: v })}>
          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
          <SelectContent>{ministryCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Province</Label>
        <Select value={data.province} onValueChange={(v) => onChange({ ...data, province: v })}>
          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
          <SelectContent>{provinces.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
        </Select>
      </div>
    </div>
    <div className="space-y-2">
      <Label>Branch</Label>
      <Input value={data.branch} onChange={(e) => onChange({ ...data, branch: e.target.value })} placeholder="BRCSA ..." />
    </div>
    <Button onClick={onSubmit} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">{submitLabel}</Button>
  </div>
);

export { positions, provinces, ministryCategories };
export default AdminMemberForm;
