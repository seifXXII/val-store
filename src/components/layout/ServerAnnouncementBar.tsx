/**
 * Server-side Announcement Bar
 *
 * Fetches announcement config on the server.
 * Uses caching for 60-second revalidation.
 * Uses a client wrapper for dismiss functionality.
 */

import { getCachedAnnouncementSection } from "@/lib/cache";
import { AnnouncementBarClient } from "./AnnouncementBarClient";

interface AnnouncementContent {
  messages?: Array<{ text: string; link?: string } | string>;
  rotateInterval?: number;
  backgroundColor?: string;
  textColor?: string;
  dismissible?: boolean;
  linkUrl?: string;
  linkText?: string;
}

export async function ServerAnnouncementBar() {
  try {
    // Fetch announcement config with caching
    const announcement = await getCachedAnnouncementSection();

    // Don't render if not active
    if (!announcement?.isActive) {
      return null;
    }

    // Parse content
    const content = announcement.parsedContent as AnnouncementContent;

    if (!content) {
      return null;
    }

    const messages = content.messages || [];
    if (messages.length === 0) {
      return null;
    }

    // Pass data to client component for interactivity
    return (
      <AnnouncementBarClient
        messages={messages}
        rotateInterval={content.rotateInterval || 5000}
        backgroundColor={content.backgroundColor || "#000"}
        textColor={content.textColor || "#fff"}
        dismissible={content.dismissible ?? true}
        linkUrl={content.linkUrl}
        linkText={content.linkText}
      />
    );
  } catch (error) {
    console.error(
      "[ServerAnnouncementBar] Failed to fetch announcement:",
      error
    );
    // Don't crash the page - just don't show the announcement bar
    return null;
  }
}
