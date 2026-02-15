/**
 * Audio file validation utilities
 * Validates files using MIME type when available, falling back to extension checks
 */

const AUDIO_EXTENSIONS = [
  '.mp3',
  '.wav',
  '.m4a',
  '.aac',
  '.ogg',
  '.flac',
  '.webm',
  '.opus',
  '.wma',
];

const NON_AUDIO_EXTENSIONS = [
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.bmp',
  '.svg',
  '.webp',
  '.pdf',
  '.doc',
  '.docx',
  '.txt',
  '.zip',
  '.rar',
  '.mp4',
  '.avi',
  '.mov',
  '.mkv',
];

/**
 * Validates if a file should be treated as an audio file
 * @param file - The file to validate
 * @returns null if valid, or an error message string if invalid
 */
export function validateAudioFile(file: File): string | null {
  // Check MIME type if available
  if (file.type) {
    if (file.type.startsWith('audio/')) {
      return null; // Valid audio MIME type
    }
    // If MIME type is present but not audio, check if it's clearly non-audio
    if (
      file.type.startsWith('image/') ||
      file.type.startsWith('video/') ||
      file.type === 'application/pdf' ||
      file.type.startsWith('text/')
    ) {
      return 'Please select an audio file';
    }
  }

  // Fallback to extension check
  const fileName = file.name.toLowerCase();
  
  // Check if it's a known audio extension
  const hasAudioExtension = AUDIO_EXTENSIONS.some((ext) => fileName.endsWith(ext));
  if (hasAudioExtension) {
    return null; // Valid audio extension
  }

  // Check if it's a known non-audio extension
  const hasNonAudioExtension = NON_AUDIO_EXTENSIONS.some((ext) => fileName.endsWith(ext));
  if (hasNonAudioExtension) {
    return 'Please select an audio file';
  }

  // If we can't determine, allow it (benefit of the doubt)
  // This handles edge cases where MIME type is missing and extension is uncommon
  return null;
}

/**
 * Gets the accept attribute value for audio file inputs
 * Includes both MIME type and explicit extensions for better browser support
 */
export function getAudioAcceptAttribute(): string {
  return `audio/*,${AUDIO_EXTENSIONS.join(',')}`;
}
