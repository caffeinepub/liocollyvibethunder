import { useState, useRef } from 'react';
import { useGetUserVoiceNotes, useSaveVoiceNote } from '../hooks/useQueries';
import AuthGate from '../components/auth/AuthGate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Mic, Square, Play, Pause, Music } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../backend';

const MAX_DURATION_SECONDS = 120; // 2 minutes

export default function VoiceNotesPage() {
  const { data: voiceNotes, isLoading } = useGetUserVoiceNotes();
  const saveVoiceNote = useSaveVoiceNote();
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= MAX_DURATION_SECONDS) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      toast.error('Failed to access microphone');
      console.error(error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleSave = async () => {
    if (!noteTitle.trim() || !audioBlob) {
      toast.error('Please provide a title');
      return;
    }

    try {
      const arrayBuffer = await audioBlob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(uint8Array);

      await saveVoiceNote.mutateAsync({
        title: noteTitle.trim(),
        audio: blob,
        linkedLyric: null,
      });

      toast.success('Voice note saved!');
      setDialogOpen(false);
      setNoteTitle('');
      setAudioBlob(null);
      setAudioUrl(null);
      setRecordingTime(0);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save voice note');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Voice Notes</h1>
        <AuthGate fallback={null}>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Mic className="h-4 w-4" />
                Record
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Voice Note</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-4 py-6">
                  {!isRecording && !audioUrl && (
                    <Button onClick={startRecording} size="lg" className="h-20 w-20 rounded-full">
                      <Mic className="h-8 w-8" />
                    </Button>
                  )}
                  {isRecording && (
                    <>
                      <div className="text-2xl font-mono">{formatTime(recordingTime)}</div>
                      <Button onClick={stopRecording} size="lg" variant="destructive" className="h-20 w-20 rounded-full">
                        <Square className="h-8 w-8" />
                      </Button>
                      <p className="text-sm text-muted-foreground">Max: {formatTime(MAX_DURATION_SECONDS)}</p>
                    </>
                  )}
                  {audioUrl && !isRecording && (
                    <>
                      <audio controls src={audioUrl} className="w-full" />
                      <Button onClick={startRecording} variant="outline">
                        Record Again
                      </Button>
                    </>
                  )}
                </div>
                {audioUrl && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="noteTitle">Title *</Label>
                      <Input
                        id="noteTitle"
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                        placeholder="Name your voice note..."
                      />
                    </div>
                    <Button onClick={handleSave} disabled={saveVoiceNote.isPending} className="w-full">
                      {saveVoiceNote.isPending ? 'Saving...' : 'Save Voice Note'}
                    </Button>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </AuthGate>
      </div>

      <AuthGate>
        {isLoading ? (
          <p className="text-muted-foreground">Loading voice notes...</p>
        ) : voiceNotes && voiceNotes.length > 0 ? (
          <div className="space-y-3">
            {voiceNotes.map((note) => (
              <Card key={note.title}>
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{note.title}</h3>
                      <p className="text-sm text-muted-foreground">{formatDate(note.created)}</p>
                    </div>
                    {note.linkedLyric && (
                      <Badge variant="secondary" className="text-xs">
                        Linked to lyric
                      </Badge>
                    )}
                  </div>
                  <audio controls className="w-full" src={note.audio.getDirectURL()} />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No voice notes yet</h3>
              <p className="text-muted-foreground">Record your first melody idea!</p>
            </CardContent>
          </Card>
        )}
      </AuthGate>
    </div>
  );
}
