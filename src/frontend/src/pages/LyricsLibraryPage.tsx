import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useGetUserLyrics } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import AuthGate from '../components/auth/AuthGate';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Plus, FileText, Clock } from 'lucide-react';

export default function LyricsLibraryPage() {
  const { identity } = useInternetIdentity();
  const { data: lyrics, isLoading } = useGetUserLyrics();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredLyrics = lyrics?.filter((lyric) => {
    const query = searchQuery.toLowerCase();
    return (
      lyric.title.toLowerCase().includes(query) ||
      lyric.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Lyrics</h1>
        <AuthGate fallback={null}>
          <Button 
            className="gap-2"
            onClick={() => navigate({ to: '/lyrics/$lyricId', params: { lyricId: 'new' } })}
          >
            <Plus className="h-4 w-4" />
            New Lyric
          </Button>
        </AuthGate>
      </div>

      <AuthGate>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lyrics by title or tag..."
            className="pl-10"
          />
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : filteredLyrics && filteredLyrics.length > 0 ? (
          <div className="space-y-3">
            {filteredLyrics.map((lyric) => (
              <Card 
                key={lyric.title} 
                className="hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => navigate({ to: '/lyrics/$lyricId', params: { lyricId: encodeURIComponent(lyric.title) } })}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-start justify-between gap-2">
                    <span className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary shrink-0" />
                      {lyric.title}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {lyric.content || 'No content yet...'}
                  </p>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex flex-wrap gap-1">
                      {lyric.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDate(lyric.updated)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No lyrics yet</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'No lyrics match your search.' : 'Start writing your first lyric!'}
              </p>
              {!searchQuery && (
                <Button onClick={() => navigate({ to: '/lyrics/$lyricId', params: { lyricId: 'new' } })}>
                  Create Your First Lyric
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </AuthGate>
    </div>
  );
}
