import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetUserLyrics, useSaveLyric, useUpdateLyric, useDeleteLyric } from '../hooks/useQueries';
import AuthGate from '../components/auth/AuthGate';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeft, Save, Trash2, Lightbulb, BookOpen, X } from 'lucide-react';
import { toast } from 'sonner';
import { songTemplates } from '../lib/templates/songTemplates';
import { getRhymeSuggestions } from '../lib/rhyme/rhymeEngine';

export default function LyricEditorPage() {
  const { lyricId } = useParams({ from: '/lyrics/$lyricId' });
  const navigate = useNavigate();
  const { data: lyrics } = useGetUserLyrics();
  const saveLyric = useSaveLyric();
  const updateLyric = useUpdateLyric();
  const deleteLyric = useDeleteLyric();

  const isNew = lyricId === 'new';
  const existingLyric = !isNew ? lyrics?.find((l) => l.title === decodeURIComponent(lyricId)) : null;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [rhymeWord, setRhymeWord] = useState('');
  const [rhymeSuggestions, setRhymeSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (existingLyric) {
      setTitle(existingLyric.title);
      setContent(existingLyric.content);
      setTags(existingLyric.tags);
    }
  }, [existingLyric]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    try {
      if (isNew) {
        await saveLyric.mutateAsync({ title: title.trim(), content, tags });
        toast.success('Lyric saved!');
        navigate({ to: '/lyrics' });
      } else {
        await updateLyric.mutateAsync({ title: title.trim(), content, tags });
        toast.success('Lyric updated!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to save lyric');
    }
  };

  const handleDelete = async () => {
    if (!existingLyric) return;
    try {
      await deleteLyric.mutateAsync(existingLyric.title);
      toast.success('Lyric deleted');
      navigate({ to: '/lyrics' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete lyric');
    }
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleInsertTemplate = (template: string) => {
    setContent((prev) => (prev ? prev + '\n\n' + template : template));
  };

  const handleFindRhymes = () => {
    if (!rhymeWord.trim()) return;
    const suggestions = getRhymeSuggestions(rhymeWord.trim());
    setRhymeSuggestions(suggestions);
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate({ to: '/lyrics' })} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex gap-2">
          {!isNew && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this lyric?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your lyric.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      <AuthGate>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter lyric title..."
                disabled={!isNew}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Lyrics</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your lyrics here..."
                rows={15}
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add a tag..."
                />
                <Button type="button" onClick={handleAddTag} variant="secondary">
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    Templates
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Song Templates</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {songTemplates.map((template) => (
                      <Card key={template.name} className="cursor-pointer hover:bg-accent/50" onClick={() => handleInsertTemplate(template.structure)}>
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-1">{template.name}</h4>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Rhyme Assistant
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rhyme Assistant</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={rhymeWord}
                        onChange={(e) => setRhymeWord(e.target.value)}
                        placeholder="Enter a word..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleFindRhymes();
                          }
                        }}
                      />
                      <Button onClick={handleFindRhymes}>Find Rhymes</Button>
                    </div>
                    {rhymeSuggestions.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Suggestions (basic matching):
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {rhymeSuggestions.map((word) => (
                            <Badge key={word} variant="secondary">
                              {word}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Button onClick={handleSave} className="w-full gap-2" disabled={saveLyric.isPending || updateLyric.isPending}>
              <Save className="h-4 w-4" />
              {saveLyric.isPending || updateLyric.isPending ? 'Saving...' : 'Save Lyric'}
            </Button>
          </CardContent>
        </Card>
      </AuthGate>
    </div>
  );
}
