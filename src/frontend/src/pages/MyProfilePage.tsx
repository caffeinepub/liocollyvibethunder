import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useGetCallerUserProfile, useUpdateArtistProfile, useGetUserSongSnippets, usePublishSongSnippet } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import AuthGate from '../components/auth/AuthGate';
import ProfileForm from '../components/profile/ProfileForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { User, Music, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../backend';
import type { ArtistProfile } from '../backend';
import { validateAudioFile, getAudioAcceptAttribute } from '../utils/audioFileValidation';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function MyProfilePage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const updateProfile = useUpdateArtistProfile();
  const { data: snippets, isLoading: snippetsLoading } = useGetUserSongSnippets();
  const publishSnippet = usePublishSongSnippet();

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [snippetTitle, setSnippetTitle] = useState('');
  const [snippetDescription, setSnippetDescription] = useState('');
  const [snippetGenres, setSnippetGenres] = useState<string[]>([]);
  const [genreInput, setGenreInput] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleProfileSubmit = async (profile: ArtistProfile) => {
    try {
      await updateProfile.mutateAsync(profile);
      toast.success('Profile updated!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size must be under 10MB');
      return;
    }

    const validationError = validateAudioFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setAudioFile(file);
  };

  const handleUploadSnippet = async () => {
    if (!snippetTitle.trim() || !audioFile) {
      toast.error('Please provide a title and audio file');
      return;
    }

    try {
      const arrayBuffer = await audioFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      await publishSnippet.mutateAsync({
        title: snippetTitle.trim(),
        description: snippetDescription.trim(),
        genres: snippetGenres,
        audio: blob,
      });

      toast.success('Snippet uploaded!');
      setUploadDialogOpen(false);
      setSnippetTitle('');
      setSnippetDescription('');
      setSnippetGenres([]);
      setGenreInput('');
      setAudioFile(null);
      setUploadProgress(0);
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload snippet');
    }
  };

  const handleAddGenre = () => {
    const trimmed = genreInput.trim();
    if (trimmed && !snippetGenres.includes(trimmed)) {
      setSnippetGenres([...snippetGenres, trimmed]);
      setGenreInput('');
    }
  };

  const handleRemoveGenre = (genre: string) => {
    setSnippetGenres(snippetGenres.filter((g) => g !== genre));
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-3xl font-bold">My Profile</h1>

      <AuthGate>
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="snippets">Snippets</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Edit Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profileLoading ? (
                  <p className="text-muted-foreground">Loading...</p>
                ) : (
                  <ProfileForm
                    initialProfile={userProfile}
                    onSubmit={handleProfileSubmit}
                    isSubmitting={updateProfile.isPending}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="snippets" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">My Snippets</h2>
              <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Snippet
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Song Snippet</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="snippetTitle">Title *</Label>
                      <Input
                        id="snippetTitle"
                        value={snippetTitle}
                        onChange={(e) => setSnippetTitle(e.target.value)}
                        placeholder="Snippet title..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="snippetDescription">Description</Label>
                      <Textarea
                        id="snippetDescription"
                        value={snippetDescription}
                        onChange={(e) => setSnippetDescription(e.target.value)}
                        placeholder="Describe your snippet..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="snippetGenres">Genres</Label>
                      <div className="flex gap-2">
                        <Input
                          id="snippetGenres"
                          value={genreInput}
                          onChange={(e) => setGenreInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddGenre();
                            }
                          }}
                          placeholder="Add a genre..."
                        />
                        <Button type="button" onClick={handleAddGenre} variant="secondary">
                          Add
                        </Button>
                      </div>
                      {snippetGenres.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {snippetGenres.map((genre) => (
                            <Badge key={genre} variant="secondary" className="gap-1">
                              {genre}
                              <button
                                type="button"
                                onClick={() => handleRemoveGenre(genre)}
                                className="ml-1 hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="audioFile">Audio File * (Max 10MB)</Label>
                      <Input
                        id="audioFile"
                        type="file"
                        accept={getAudioAcceptAttribute()}
                        onChange={handleFileChange}
                      />
                    </div>
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <Progress value={uploadProgress} />
                    )}
                    <Button
                      onClick={handleUploadSnippet}
                      disabled={publishSnippet.isPending || !snippetTitle.trim() || !audioFile}
                      className="w-full"
                    >
                      {publishSnippet.isPending ? 'Uploading...' : 'Upload Snippet'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {snippetsLoading ? (
              <p className="text-muted-foreground">Loading snippets...</p>
            ) : snippets && snippets.length > 0 ? (
              <div className="space-y-3">
                {snippets.map((snippet) => (
                  <Card key={snippet.title}>
                    <CardContent className="pt-6 space-y-3">
                      <div>
                        <h3 className="font-semibold">{snippet.title}</h3>
                        {snippet.description && (
                          <p className="text-sm text-muted-foreground mt-1">{snippet.description}</p>
                        )}
                      </div>
                      {snippet.genres.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {snippet.genres.map((genre) => (
                            <Badge key={genre} variant="secondary" className="text-xs">
                              {genre}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <audio controls className="w-full" src={snippet.audio.getDirectURL()} />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No snippets yet</h3>
                  <p className="text-muted-foreground">Upload your first song snippet to share with others!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </AuthGate>
    </div>
  );
}
