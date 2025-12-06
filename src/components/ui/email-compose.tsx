import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Mail, 
  Send, 
  Users, 
  FileImage, 
  Paperclip, 
  Check,
  Plus,
  Church,
  MapPin
} from "lucide-react";
import { toast } from "sonner";

// Church email addresses for NC, FS, NW, and GP provinces only
const churchEmails = [
  {
    id: 'brcsa-johannesburg',
    name: 'BRCSA Johannesburg Central',
    email: 'joburg@brcsa.org',
    region: 'Gauteng (GP)',
    members: 180
  },
  {
    id: 'brcsa-pretoria',
    name: 'BRCSA Pretoria',
    email: 'pretoria@brcsa.org',
    region: 'Gauteng (GP)',
    members: 145
  },
  {
    id: 'brcsa-soweto',
    name: 'BRCSA Soweto',
    email: 'soweto@brcsa.org',
    region: 'Gauteng (GP)',
    members: 120
  },
  {
    id: 'brcsa-bloemfontein',
    name: 'BRCSA Bloemfontein Central',
    email: 'bloemfontein@brcsa.org',
    region: 'Free State (FS)',
    members: 95
  },
  {
    id: 'brcsa-welkom',
    name: 'BRCSA Welkom',
    email: 'welkom@brcsa.org',
    region: 'Free State (FS)',
    members: 75
  },
  {
    id: 'brcsa-kimberley',
    name: 'BRCSA Kimberley',
    email: 'kimberley@brcsa.org',
    region: 'Northern Cape (NC)',
    members: 65
  },
  {
    id: 'brcsa-upington',
    name: 'BRCSA Upington',
    email: 'upington@brcsa.org',
    region: 'Northern Cape (NC)',
    members: 45
  },
  {
    id: 'brcsa-mahikeng',
    name: 'BRCSA Mahikeng',
    email: 'mahikeng@brcsa.org',
    region: 'North West (NW)',
    members: 85
  },
  {
    id: 'brcsa-rustenburg',
    name: 'BRCSA Rustenburg',
    email: 'rustenburg@brcsa.org',
    region: 'North West (NW)',
    members: 90
  },
  {
    id: 'brcsa-potchefstroom',
    name: 'BRCSA Potchefstroom',
    email: 'potchefstroom@brcsa.org',
    region: 'North West (NW)',
    members: 70
  }
];

interface EmailComposeProps {
  groupName: string;
  trigger?: React.ReactNode;
}

export const EmailCompose = ({ groupName, trigger }: EmailComposeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChurches, setSelectedChurches] = useState<string[]>([]);
  const [emailData, setEmailData] = useState({
    subject: '',
    message: '',
    senderName: '',
    senderEmail: ''
  });
  const [isSending, setIsSending] = useState(false);

  const handleChurchSelection = (churchId: string, checked: boolean) => {
    if (checked) {
      setSelectedChurches(prev => [...prev, churchId]);
    } else {
      setSelectedChurches(prev => prev.filter(id => id !== churchId));
    }
  };

  const selectAllChurches = () => {
    setSelectedChurches(churchEmails.map(church => church.id));
  };

  const clearAllSelections = () => {
    setSelectedChurches([]);
  };

  const handleSendEmail = async () => {
    if (!emailData.subject || !emailData.message || selectedChurches.length === 0) {
      toast.error("Please fill in all required fields and select at least one church");
      return;
    }

    setIsSending(true);
    
    // Simulate sending email
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success(`Email sent successfully to ${selectedChurches.length} church(es)!`);
    setIsSending(false);
    setIsOpen(false);
    
    // Reset form
    setEmailData({
      subject: '',
      message: '',
      senderName: '',
      senderEmail: ''
    });
    setSelectedChurches([]);
  };

  const selectedChurchesData = churchEmails.filter(church => 
    selectedChurches.includes(church.id)
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Mail className="h-4 w-4 mr-2" />
            Send Email to Churches
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Mail className="h-5 w-5 mr-2 text-primary" />
            Send Email Communication
          </DialogTitle>
          <DialogDescription>
            Send your event announcements or letters directly to other BRCSA churches
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Church Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Church className="h-5 w-5 mr-2 text-primary" />
                Select Churches
              </CardTitle>
              <CardDescription>
                Choose which churches to send your communication to
              </CardDescription>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={selectAllChurches}
                  className="text-xs"
                >
                  Select All
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearAllSelections}
                  className="text-xs"
                >
                  Clear All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 max-h-64 overflow-y-auto">
              {churchEmails.map((church) => (
                <div 
                  key={church.id} 
                  className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    id={church.id}
                    checked={selectedChurches.includes(church.id)}
                    onCheckedChange={(checked) => 
                      handleChurchSelection(church.id, checked as boolean)
                    }
                  />
                  <div className="flex-1 min-w-0">
                    <Label 
                      htmlFor={church.id} 
                      className="font-medium text-sm cursor-pointer"
                    >
                      {church.name}
                    </Label>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {church.region}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Users className="h-3 w-3 mr-1" />
                      {church.members} members
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Email Compose */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Send className="h-5 w-5 mr-2 text-primary" />
                Compose Message
              </CardTitle>
              <CardDescription>
                Write your message to be sent to the selected churches
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="senderName">Your Name</Label>
                  <Input
                    id="senderName"
                    placeholder="Enter your name"
                    value={emailData.senderName}
                    onChange={(e) => setEmailData(prev => ({
                      ...prev,
                      senderName: e.target.value
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senderEmail">Your Email</Label>
                  <Input
                    id="senderEmail"
                    type="email"
                    placeholder="your.email@brcsa.org"
                    value={emailData.senderEmail}
                    onChange={(e) => setEmailData(prev => ({
                      ...prev,
                      senderEmail: e.target.value
                    }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="e.g., Youth Conference Invitation - NEC YCA/YMWCA"
                  value={emailData.subject}
                  onChange={(e) => setEmailData(prev => ({
                    ...prev,
                    subject: e.target.value
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Write your message here..."
                  rows={8}
                  value={emailData.message}
                  onChange={(e) => setEmailData(prev => ({
                    ...prev,
                    message: e.target.value
                  }))}
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Paperclip className="h-4 w-4 mr-2" />
                  Attach File
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <FileImage className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Churches Summary */}
        {selectedChurches.length > 0 && (
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-600" />
                Selected Recipients ({selectedChurches.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {selectedChurchesData.map((church) => (
                  <Badge key={church.id} variant="secondary" className="text-xs">
                    {church.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Send Button */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            disabled={isSending}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSendEmail}
            disabled={isSending || selectedChurches.length === 0}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Email
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};