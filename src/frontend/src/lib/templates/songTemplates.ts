export interface SongTemplate {
  name: string;
  description: string;
  structure: string;
}

export const songTemplates: SongTemplate[] = [
  {
    name: 'Verse-Chorus-Verse',
    description: 'Classic pop structure',
    structure: `[Verse 1]


[Chorus]


[Verse 2]


[Chorus]


[Bridge]


[Chorus]`,
  },
  {
    name: 'Rap Structure',
    description: 'Hip-hop verse structure',
    structure: `[Intro]


[Verse 1]


[Hook]


[Verse 2]


[Hook]


[Verse 3]


[Hook]


[Outro]`,
  },
  {
    name: 'Ballad',
    description: 'Emotional storytelling',
    structure: `[Verse 1]


[Pre-Chorus]


[Chorus]


[Verse 2]


[Pre-Chorus]


[Chorus]


[Bridge]


[Final Chorus]`,
  },
  {
    name: 'Simple Song',
    description: 'Basic verse-chorus',
    structure: `[Verse]


[Chorus]


[Verse]


[Chorus]`,
  },
];
