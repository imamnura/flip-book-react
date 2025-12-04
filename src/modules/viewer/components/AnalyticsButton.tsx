import React, { useState } from "react";
import { analytics } from "@/shared/lib/analytics";
import { Button } from "@/shared/ui";
import { Modal } from "@/shared/ui/Modal";
import { useDisclosure } from "@/shared/hooks/useDisclosure";

export const AnalyticsButton: React.FC = () => {
  const { isOpen, open, close } = useDisclosure();
  const [stats, setStats] = useState<ReturnType<
    typeof analytics.getAnalytics
  > | null>(null);

  const handleOpen = () => {
    const data = analytics.getAnalytics();
    setStats(data);
    open();
  };

  const handleExport = () => {
    const jsonData = analytics.export();
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `flipbook-analytics-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear all analytics data?")) {
      analytics.clear();
      setStats(analytics.getAnalytics());
    }
  };

  if (!stats) {
    return (
      <Button onClick={handleOpen} variant="ghost" size="sm">
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        Analytics
      </Button>
    );
  }

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const topPages = Object.entries(stats.popularPages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <>
      <Button onClick={handleOpen} variant="ghost" size="sm">
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        Analytics
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={close}
        title="Viewing Analytics"
        size="lg"
      >
        <div className="space-y-6">
          {/* Overview */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {stats.sessions.length}
              </div>
              <div className="text-sm text-gray-600">Sessions</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {stats.totalViews}
              </div>
              <div className="text-sm text-gray-600">Page Views</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {formatDuration(stats.totalTimeSpent)}
              </div>
              <div className="text-sm text-gray-600">Total Time</div>
            </div>
          </div>

          {/* Popular Pages */}
          {topPages.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Most Viewed Pages</h3>
              <div className="space-y-2">
                {topPages.map(([pageNum, views]) => (
                  <div
                    key={pageNum}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded"
                  >
                    <span className="font-medium">Page {pageNum}</span>
                    <span className="text-gray-600">{views} views</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Sessions */}
          {stats.sessions.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Recent Sessions</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {stats.sessions
                  .slice(-5)
                  .reverse()
                  .map((session) => (
                    <div
                      key={session.sessionId}
                      className="p-3 bg-gray-50 rounded text-sm"
                    >
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {new Date(session.startTime).toLocaleString()}
                        </span>
                        <span className="text-gray-600">
                          {session.pageViews.length} pages viewed
                        </span>
                      </div>
                      {session.endTime && (
                        <div className="text-gray-500 mt-1">
                          Duration:{" "}
                          {formatDuration(session.endTime - session.startTime)}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={handleExport} variant="outline" size="sm">
              Export JSON
            </Button>
            <Button onClick={handleClear} variant="danger" size="sm">
              Clear Data
            </Button>
            <div className="flex-1" />
            <Button onClick={close} variant="primary" size="sm">
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
