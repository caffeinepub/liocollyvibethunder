import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Music2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DiscoveryPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden">
        <img
          src="/assets/generated/hero-banner.dim_1600x900.png"
          alt="Discover Collaborators"
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex items-end">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">Discover Collaborators</h1>
            <p className="text-muted-foreground">Connect with artists and create together</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or genre..."
          className="pl-10"
        />
      </div>

      {/* Coming Soon Message */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music2 className="h-5 w-5 text-primary" />
            Artist Discovery
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Artist discovery is coming soon! You'll be able to browse and filter collaborators by genre, connect with other creators, and start making music together.
          </p>
          <div className="space-y-2">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
