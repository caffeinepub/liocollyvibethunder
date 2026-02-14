import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import MobileShell from './components/layout/MobileShell';
import ProfileSetupModal from './components/profile/ProfileSetupModal';
import DiscoveryPage from './pages/DiscoveryPage';
import LyricsLibraryPage from './pages/LyricsLibraryPage';
import LyricEditorPage from './pages/LyricEditorPage';
import InboxPage from './pages/InboxPage';
import ConversationPage from './pages/ConversationPage';
import MyProfilePage from './pages/MyProfilePage';
import ArtistProfilePage from './pages/ArtistProfilePage';
import VoiceNotesPage from './pages/VoiceNotesPage';
import HelpInstallPage from './pages/HelpInstallPage';

function RootComponent() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <>
      <MobileShell>
        <Outlet />
      </MobileShell>
      {showProfileSetup && <ProfileSetupModal />}
      <Toaster />
    </>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

const discoveryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DiscoveryPage,
});

const lyricsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/lyrics',
  component: LyricsLibraryPage,
});

const lyricEditorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/lyrics/$lyricId',
  component: LyricEditorPage,
});

const inboxRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/messages',
  component: InboxPage,
});

const conversationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/messages/$participantId',
  component: ConversationPage,
});

const myProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: MyProfilePage,
});

const artistProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/artist/$artistId',
  component: ArtistProfilePage,
});

const voiceNotesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/voice-notes',
  component: VoiceNotesPage,
});

const helpInstallRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/help',
  component: HelpInstallPage,
});

const routeTree = rootRoute.addChildren([
  discoveryRoute,
  lyricsRoute,
  lyricEditorRoute,
  inboxRoute,
  conversationRoute,
  myProfileRoute,
  artistProfileRoute,
  voiceNotesRoute,
  helpInstallRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
