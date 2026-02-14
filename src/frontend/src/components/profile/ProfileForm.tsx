import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import type { UserProfile } from '../../backend';

interface ProfileFormProps {
  initialProfile?: UserProfile | null;
  onSubmit: (profile: UserProfile) => void;
  isSubmitting: boolean;
}

export default function ProfileForm({ initialProfile, onSubmit, isSubmitting }: ProfileFormProps) {
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [genreInput, setGenreInput] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [website, setWebsite] = useState('');

  useEffect(() => {
    if (initialProfile) {
      setDisplayName(initialProfile.displayName);
      setBio(initialProfile.bio);
      setGenres(initialProfile.genres);
      setInstagram(initialProfile.socialLinks?.instagram || '');
      setTwitter(initialProfile.socialLinks?.twitter || '');
      setWebsite(initialProfile.socialLinks?.website || '');
    }
  }, [initialProfile]);

  const handleAddGenre = () => {
    const trimmed = genreInput.trim();
    if (trimmed && !genres.includes(trimmed)) {
      setGenres([...genres, trimmed]);
      setGenreInput('');
    }
  };

  const handleRemoveGenre = (genre: string) => {
    setGenres(genres.filter((g) => g !== genre));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      displayName: displayName.trim(),
      bio: bio.trim(),
      genres,
      socialLinks: instagram || twitter || website ? {
        instagram: instagram.trim() || undefined,
        twitter: twitter.trim() || undefined,
        website: website.trim() || undefined,
      } : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="displayName">Display Name *</Label>
        <Input
          id="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Your artist name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us about yourself..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="genres">Genres</Label>
        <div className="flex gap-2">
          <Input
            id="genres"
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
        {genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {genres.map((genre) => (
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
        <Label htmlFor="instagram">Instagram</Label>
        <Input
          id="instagram"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          placeholder="@username"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="twitter">Twitter/X</Label>
        <Input
          id="twitter"
          value={twitter}
          onChange={(e) => setTwitter(e.target.value)}
          placeholder="@username"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://..."
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Profile'}
      </Button>
    </form>
  );
}
