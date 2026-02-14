import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { UserProfile, ArtistProfile, LyricDocument, VoiceNote, SongSnippet, Message } from '../backend';
import { Principal } from '@dfinity/principal';
import { ExternalBlob } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useUpdateArtistProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (profile: ArtistProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateArtistProfile(profile);
    },
    onSuccess: () => {
      if (identity) {
        queryClient.invalidateQueries({ queryKey: ['artistProfile', identity.getPrincipal().toString()] });
      }
    },
  });
}

export function useGetArtistProfile(artistId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ArtistProfile | null>({
    queryKey: ['artistProfile', artistId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getArtistProfile(Principal.fromText(artistId));
    },
    enabled: !!actor && !actorFetching && !!artistId,
  });
}

export function useGetUserLyrics(userId?: string) {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const targetUser = userId || identity?.getPrincipal().toString();

  return useQuery<LyricDocument[]>({
    queryKey: ['lyrics', targetUser],
    queryFn: async () => {
      if (!actor || !targetUser) return [];
      return actor.getUserLyrics(Principal.fromText(targetUser));
    },
    enabled: !!actor && !actorFetching && !!targetUser,
  });
}

export function useSaveLyric() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async ({ title, content, tags }: { title: string; content: string; tags: string[] }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveLyric(title, content, tags);
    },
    onSuccess: () => {
      if (identity) {
        queryClient.invalidateQueries({ queryKey: ['lyrics', identity.getPrincipal().toString()] });
      }
    },
  });
}

export function useUpdateLyric() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async ({ title, content, tags }: { title: string; content: string; tags: string[] }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateLyric(title, content, tags);
    },
    onSuccess: () => {
      if (identity) {
        queryClient.invalidateQueries({ queryKey: ['lyrics', identity.getPrincipal().toString()] });
      }
    },
  });
}

export function useDeleteLyric() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (title: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteLyric(title);
    },
    onSuccess: () => {
      if (identity) {
        queryClient.invalidateQueries({ queryKey: ['lyrics', identity.getPrincipal().toString()] });
      }
    },
  });
}

export function useGetUserVoiceNotes(userId?: string) {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const targetUser = userId || identity?.getPrincipal().toString();

  return useQuery<VoiceNote[]>({
    queryKey: ['voiceNotes', targetUser],
    queryFn: async () => {
      if (!actor || !targetUser) return [];
      return actor.getUserVoiceNotes(Principal.fromText(targetUser));
    },
    enabled: !!actor && !actorFetching && !!targetUser,
  });
}

export function useSaveVoiceNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async ({ title, audio, linkedLyric }: { title: string; audio: ExternalBlob; linkedLyric: string | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveVoiceNote(title, audio, linkedLyric);
    },
    onSuccess: () => {
      if (identity) {
        queryClient.invalidateQueries({ queryKey: ['voiceNotes', identity.getPrincipal().toString()] });
      }
    },
  });
}

export function useGetUserSongSnippets(userId?: string) {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const targetUser = userId || identity?.getPrincipal().toString();

  return useQuery<SongSnippet[]>({
    queryKey: ['songSnippets', targetUser],
    queryFn: async () => {
      if (!actor || !targetUser) return [];
      return actor.getUserSongSnippets(Principal.fromText(targetUser));
    },
    enabled: !!actor && !actorFetching && !!targetUser,
  });
}

export function usePublishSongSnippet() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async ({ title, description, genres, audio }: { title: string; description: string; genres: string[]; audio: ExternalBlob }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.publishSongSnippet(title, description, genres, audio);
    },
    onSuccess: () => {
      if (identity) {
        queryClient.invalidateQueries({ queryKey: ['songSnippets', identity.getPrincipal().toString()] });
      }
    },
  });
}

export function useGetConversation(participantId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Message[]>({
    queryKey: ['conversation', participantId],
    queryFn: async () => {
      if (!actor || !participantId) return [];
      return actor.getConversation(Principal.fromText(participantId));
    },
    enabled: !!actor && !actorFetching && !!participantId,
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ recipient, content }: { recipient: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendMessage(Principal.fromText(recipient), content);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['conversation', variables.recipient] });
    },
  });
}
