/**
 * Real-time Activity Logs Hook
 * Subscribes to live activity updates from Supabase
 */

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { ActivityLog } from "@/types/user";
import type { Database } from "@/integrations/supabase/types";

type ActivityLogRow = Database["public"]["Tables"]["activity_logs"]["Row"];

interface UseRealtimeActivityLogsOptions {
  enabled?: boolean;
  onInsert?: (log: ActivityLog) => void;
}

export function useRealtimeActivityLogs(options: UseRealtimeActivityLogsOptions = {}) {
  const { enabled = true, onInsert } = options;
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const channel = supabase
      .channel("activity-logs-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "activity_logs"
        },
        (payload) => {
          const newLog = transformActivityLogRow(payload.new as ActivityLogRow);
          console.log("Real-time activity log:", newLog);
          onInsert?.(newLog);
        }
      )
      .subscribe((status) => {
        console.log("Real-time activity logs subscription status:", status);
        setIsConnected(status === "SUBSCRIBED");
      });

    return () => {
      console.log("Unsubscribing from activity-logs-changes channel");
      supabase.removeChannel(channel);
      setIsConnected(false);
    };
  }, [enabled, onInsert]);

  return { isConnected };
}

/**
 * Transform database row to ActivityLog type
 */
function transformActivityLogRow(row: ActivityLogRow): ActivityLog {
  return {
    id: row.id,
    userId: row.user_id,
    action: row.action,
    resource: row.resource,
    resourceId: row.resource_id || undefined,
    details: row.details || undefined,
    metadata: (row.metadata as Record<string, any>) || undefined,
    ipAddress: row.ip_address || undefined,
    userAgent: row.user_agent || undefined,
    timestamp: row.created_at
  };
}