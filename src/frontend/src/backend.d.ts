import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface LyricDocument {
    title: string;
    created: Time;
    content: string;
    tags: Array<string>;
    author: Principal;
    updated: Time;
}
export type Time = bigint;
export interface SongSnippet {
    title: string;
    audio: ExternalBlob;
    published: Time;
    description: string;
    genres: Array<string>;
    uploader: Principal;
}
export interface Message {
    content: string;
    sender: Principal;
    timestamp: Time;
}
export interface VoiceNote {
    title: string;
    created: Time;
    creator: Principal;
    audio: ExternalBlob;
    linkedLyric?: string;
}
export interface ArtistProfile {
    bio: string;
    displayName: string;
    socialLinks?: {
        twitter?: string;
        instagram?: string;
        website?: string;
    };
    genres: Array<string>;
}
export interface UserProfile {
    bio: string;
    displayName: string;
    socialLinks?: {
        twitter?: string;
        instagram?: string;
        website?: string;
    };
    genres: Array<string>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteLyric(title: string): Promise<void>;
    getArtistProfile(artist: Principal): Promise<ArtistProfile | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getConversation(participant: Principal): Promise<Array<Message>>;
    getUserLyrics(user: Principal): Promise<Array<LyricDocument>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserSongSnippets(user: Principal): Promise<Array<SongSnippet>>;
    getUserVoiceNotes(user: Principal): Promise<Array<VoiceNote>>;
    isCallerAdmin(): Promise<boolean>;
    publishSongSnippet(title: string, description: string, genres: Array<string>, audio: ExternalBlob): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveLyric(title: string, content: string, tags: Array<string>): Promise<void>;
    saveVoiceNote(title: string, audio: ExternalBlob, linkedLyric: string | null): Promise<void>;
    sendMessage(recipient: Principal, content: string): Promise<void>;
    updateArtistProfile(profile: ArtistProfile): Promise<void>;
    updateLyric(title: string, content: string, tags: Array<string>): Promise<void>;
}
