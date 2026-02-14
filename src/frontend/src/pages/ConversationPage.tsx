import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetConversation, useSendMessage, useGetArtistProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import AuthGate from '../components/auth/AuthGate';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function ConversationPage() {
  const { participantId } = useParams({ from: '/messages/$participantId' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: messages, isLoading } = useGetConversation(participantId);
  const { data: participantProfile } = useGetArtistProfile(participantId);
  const sendMessage = useSendMessage();
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (participantProfile && messages && messages.length > 0) {
      const stored = localStorage.getItem('recentConversations');
      let recent = stored ? JSON.parse(stored) : [];
      const lastMessage = messages[messages.length - 1];
      
      recent = recent.filter((r: any) => r.id !== participantId);
      recent.unshift({
        id: participantId,
        name: participantProfile.displayName,
        lastMessage: lastMessage.content,
      });
      
      localStorage.setItem('recentConversations', JSON.stringify(recent.slice(0, 20)));
    }
  }, [participantId, participantProfile, messages]);

  const handleSend = async () => {
    if (!messageText.trim()) return;

    try {
      await sendMessage.mutateAsync({
        recipient: participantId,
        content: messageText.trim(),
      });
      setMessageText('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
    }
  };

  const formatTime = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="border-b border-border px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/messages' })}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="font-semibold">{participantProfile?.displayName || 'Loading...'}</h2>
      </div>

      <AuthGate>
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {isLoading ? (
            <p className="text-muted-foreground text-center">Loading messages...</p>
          ) : messages && messages.length > 0 ? (
            <>
              {messages.map((message, index) => {
                const isMe = message.sender.toString() === identity?.getPrincipal().toString();
                return (
                  <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <Card className={`max-w-[80%] ${isMe ? 'bg-primary text-primary-foreground' : ''}`}>
                      <CardContent className="p-3">
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <p className="text-muted-foreground text-center">No messages yet. Start the conversation!</p>
          )}
        </div>

        <div className="border-t border-border px-4 py-3">
          <div className="flex gap-2">
            <Input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type a message..."
            />
            <Button onClick={handleSend} disabled={sendMessage.isPending || !messageText.trim()} className="gap-2">
              <Send className="h-4 w-4" />
              Send
            </Button>
          </div>
        </div>
      </AuthGate>
    </div>
  );
}
