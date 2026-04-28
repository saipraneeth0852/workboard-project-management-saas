"use client";

import { boardDataService, boardService } from "@/lib/services";
import { useAuthUser } from "@/lib/auth";
import { Board } from "@/lib/supabase/models";
import { useSupabase } from "@/providers/SupabaseProvider";
import { useEffect, useState } from "react";

export function useBoards() {
  const { user } = useAuthUser();
  const { supabase, isLoaded } = useSupabase();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && isLoaded && supabase) {
      loadBoards();
      return;
    }

    if (isLoaded) {
      setLoading(false);
    }
  }, [user, isLoaded, supabase]);

  async function loadBoards() {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const data = await boardService.getBoards(supabase!, user.id);
      setBoards(data);
    } catch (err) {
      console.log(err);
      setError(err instanceof Error ? err.message : "Failed to load boards.");
    } finally {
      setLoading(false);
    }
  }

  async function createBoard(boardData: {
    title: string;
    description?: string;
    color?: string;
  }) {
    if (!user) throw new Error("User not authenticated");

    try {
      const newBoard = await boardDataService.createBoardWithDefaultColumns(
        supabase!,
        {
          ...boardData,
          userId: user.id,
        }
      );
      setBoards((prev) => [newBoard, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create board.");
    }
  }

  const refetch = () => {
    loadBoards();
  };

  return { boards, loading, error, createBoard, refetch };
}
