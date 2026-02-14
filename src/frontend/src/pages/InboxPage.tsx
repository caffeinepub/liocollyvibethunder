import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import AuthGate from '../components/auth/AuthGate';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, User } from 'lucide-react';

interface RecentParticipant {
  id: string;
  name: string;
  lastMessage: string;
}

export default function InboxPage() {
  const [recentParticipants, setRecentParticipants] = useState<RecentParticipant[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('recentConversations');
    if (stored) {
      try {
        setRecentParticipants(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse recent conversations', e);
      }
    }
  }, []);

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-3xl font-bold">Messages</h1>

      <AuthGate>
        {recentParticipants.length > 0 ? (
          <div className="space-y-2">
            {recentParticipants.map((participant) => (
              <Card 
                key={participant.id} 
                className="hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => navigate({ to: '/messages/$participantId', params: { participantId: participant.id } })}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{participant.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{participant.lastMessage}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
              <p className="text-muted-foreground">
                Start a conversation by visiting an artist's profile and clicking "Message"
              </p>
            </CardContent>
          </Card>
        )}
      </AuthGate>
    </div>
  );
}
