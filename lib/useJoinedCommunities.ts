"use client";

import { useCallback, useEffect, useState } from "react";
import { communityService, JOINED_EVENT } from "@/lib/communityService";

export function useJoinedCommunities() {
  const [joined, setJoined] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setJoined(communityService.getJoinedSlugs());
    sync();
    window.addEventListener(JOINED_EVENT, sync); // same tab
    window.addEventListener("storage", sync); // arko tab
    return () => {
      window.removeEventListener(JOINED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const isJoined = useCallback((slug: string) => joined.includes(slug), [joined]);
  const toggle = useCallback((slug: string) => communityService.toggleJoin(slug), []);

  return { joined, isJoined, toggle };
}