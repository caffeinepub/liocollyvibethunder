import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetArtistProfile, useGetUserSongSnippets } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MessageCircle, Music, Instagram, Twitter, Globe } from 'lucide-react';
import { SiInstagram, SiX } from 'react-icons/si';

export default function ArtistProfilePage() {
  const { artistId } = useParams({ from: '/artist/$artistId' });
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useGetArtistProfile(artistId);
  const { data: snippets, isLoading: snippetsLoading } = useGetUserSongSnippets(artistId);

  const handleMessage = () => {
    navigate({ to: `/messages/${artistId}` });
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
      <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      {profileLoading ? (
        <p className="text-muted-foreground">Loading profile...</p>
      ) : profile ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{profile.displayName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.bio && <p className="text-muted-foreground">{profile.bio}</p>}
              
              {profile.genres.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.genres.map((genre) => (
                      <Badge key={genre} variant="secondary">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {profile.socialLinks && (
                <div>
                  <h3 className="text-sm font-semibold mb-2">Social Links</h3>
                  <div className="flex gap-3">
                    {profile.socialLinks.instagram && (
                      <a
                        href={`https://instagram.com/${profile.socialLinks.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <SiInstagram className="h-5 w-5" />
                      </a>
                    )}
                    {profile.socialLinks.twitter && (
                      <a
                        href={`https://x.com/${profile.socialLinks.twitter.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <SiX className="h-5 w-5" />
                      </a>
                    )}
                    {profile.socialLinks.website && (
                      <a
                        href={profile.socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Globe className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              <Button onClick={handleMessage} className="w-full gap-2">
                <MessageCircle className="h-4 w-4" />
                Message {profile.displayName}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5 text-primary" />
                Song Snippets
              </CardTitle>
            </CardHeader>
            <CardContent>
              {snippetsLoading ? (
                <p className="text-muted-foreground">Loading snippets...</p>
              ) : snippets && snippets.length > 0 ? (
                <div className="space-y-3">
                  {snippets.map((snippet) => (
                    <div key={snippet.title} className="space-y-2">
                      <div>
                        <h4 className="font-semibold">{snippet.title}</h4>
                        {snippet.description && (
                          <p className="text-sm text-muted-foreground">{snippet.description}</p>
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
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No snippets yet</p>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Profile not found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
