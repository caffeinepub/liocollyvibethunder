import Array "mo:core/Array";
import List "mo:core/List";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // --- Authorization ---
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // --- Storage ---
  include MixinStorage();

  // --- Data Types ---
  public type UserProfile = {
    displayName : Text;
    bio : Text;
    genres : [Text];
    socialLinks : ?{
      instagram : ?Text;
      twitter : ?Text;
      website : ?Text;
    };
  };

  type ArtistProfile = {
    displayName : Text;
    bio : Text;
    genres : [Text];
    socialLinks : ?{
      instagram : ?Text;
      twitter : ?Text;
      website : ?Text;
    };
  };

  type LyricDocument = {
    author : Principal;
    title : Text;
    content : Text;
    created : Time.Time;
    updated : Time.Time;
    tags : [Text];
  };

  type VoiceNote = {
    creator : Principal;
    title : Text;
    audio : Storage.ExternalBlob;
    linkedLyric : ?Text;
    created : Time.Time;
  };

  type SongSnippet = {
    uploader : Principal;
    title : Text;
    description : Text;
    genres : [Text];
    audio : Storage.ExternalBlob;
    published : Time.Time;
  };

  type Message = {
    sender : Principal;
    content : Text;
    timestamp : Time.Time;
  };

  type Conversation = {
    participants : [Principal];
    messages : List.List<Message>;
  };

  module LyricDocument {
    public func compareByUpdated(l1 : LyricDocument, l2 : LyricDocument) : Order.Order {
      Int.compare(l1.updated, l2.updated);
    };
  };

  // --- Persistent State ---
  let userProfiles = Map.empty<Principal, UserProfile>();
  let artistMap = Map.empty<Principal, ArtistProfile>();
  let lyricMap = Map.empty<Text, LyricDocument>();
  let voiceNoteMap = Map.empty<Text, VoiceNote>();
  let songSnippetMap = Map.empty<Text, SongSnippet>();
  let conversationMap = Map.empty<Text, Conversation>();

  // --- User Profile Management (Required by Frontend) ---
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // --- Artist Profile CRUD ---
  public shared ({ caller }) func updateArtistProfile(profile : ArtistProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update artist profiles");
    };
    artistMap.add(caller, profile);
  };

  public query func getArtistProfile(artist : Principal) : async ?ArtistProfile {
    artistMap.get(artist);
  };

  // --- Lyric Document Management ---
  public shared ({ caller }) func saveLyric(title : Text, content : Text, tags : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save lyrics");
    };

    let now = Time.now();

    let newLyric = {
      author = caller;
      title;
      content;
      created = now;
      updated = now;
      tags;
    };

    lyricMap.add(title, newLyric);
  };

  public shared ({ caller }) func updateLyric(title : Text, content : Text, tags : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update lyrics");
    };

    switch (lyricMap.get(title)) {
      case (?existing) {
        if (existing.author != caller) {
          Runtime.trap("Unauthorized: Only authors can update their own lyrics");
        };
        let updatedLyric = {
          author = caller;
          title;
          content;
          created = existing.created;
          updated = Time.now();
          tags;
        };
        lyricMap.add(title, updatedLyric);
      };
      case (null) { Runtime.trap("Lyric does not exist") };
    };
  };

  public shared ({ caller }) func deleteLyric(title : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete lyrics");
    };

    switch (lyricMap.get(title)) {
      case (?lyric) {
        if (lyric.author != caller) {
          Runtime.trap("Unauthorized: Only author can delete own lyrics");
        };
        lyricMap.remove(title);
      };
      case (null) { Runtime.trap("Lyric does not exist") };
    };
  };

  public query func getUserLyrics(user : Principal) : async [LyricDocument] {
    let results = List.empty<LyricDocument>();
    for ((_, lyricDoc) in lyricMap.entries()) {
      if (lyricDoc.author == user) { results.add(lyricDoc) };
    };
    results.toArray().sort(LyricDocument.compareByUpdated);
  };

  // --- Voice Note Management ---
  public shared ({ caller }) func saveVoiceNote(title : Text, audio : Storage.ExternalBlob, linkedLyric : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save voice notes");
    };

    let voiceNote = {
      creator = caller;
      title;
      audio;
      linkedLyric;
      created = Time.now();
    };

    voiceNoteMap.add(title, voiceNote);
  };

  public query func getUserVoiceNotes(user : Principal) : async [VoiceNote] {
    let results = List.empty<VoiceNote>();
    for ((_, note) in voiceNoteMap.entries()) {
      if (note.creator == user) { results.add(note) };
    };
    results.toArray();
  };

  // --- Song Snippet Management ---
  public shared ({ caller }) func publishSongSnippet(title : Text, description : Text, genres : [Text], audio : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can publish song snippets");
    };

    let snippet = {
      uploader = caller;
      title;
      description;
      genres;
      audio;
      published = Time.now();
    };

    songSnippetMap.add(title, snippet);
  };

  public query func getUserSongSnippets(user : Principal) : async [SongSnippet] {
    let results = List.empty<SongSnippet>();
    for ((_, snippet) in songSnippetMap.entries()) {
      if (snippet.uploader == user) { results.add(snippet) };
    };
    results.toArray();
  };

  // --- Messaging ---
  public shared ({ caller }) func sendMessage(recipient : Principal, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };

    let conversationKey = createConversationKey(caller, recipient);

    let newMessage = {
      sender = caller;
      content;
      timestamp = Time.now();
    };

    switch (conversationMap.get(conversationKey)) {
      case (?conversation) {
        conversation.messages.add(newMessage);
      };
      case (null) {
        let newConversation = {
          participants = [caller, recipient];
          messages = List.fromArray<Message>([newMessage]);
        };
        conversationMap.add(conversationKey, newConversation);
      };
    };
  };

  public query ({ caller }) func getConversation(participant : Principal) : async [Message] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view conversations");
    };

    let conversationKey = createConversationKey(caller, participant);

    switch (conversationMap.get(conversationKey)) {
      case (?conversation) {
        // Verify caller is a participant in this conversation
        let isParticipant = conversation.participants.find(
          func(p : Principal) : Bool { p == caller }
        );
        switch (isParticipant) {
          case (?_) { conversation.messages.toArray() };
          case (null) {
            Runtime.trap("Unauthorized: You are not a participant in this conversation");
          };
        };
      };
      case (null) { [] };
    };
  };

  func createConversationKey(p1 : Principal, p2 : Principal) : Text {
    let (pk1, pk2) = if (p1.toText() < p2.toText()) { (p1, p2) } else {
      (p2, p1);
    };
    pk1.toText() # "-" # pk2.toText();
  };
};
