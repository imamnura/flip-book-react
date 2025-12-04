/**
 * Local Analytics tracking for flipbook viewer
 * Tracks views, time spent, and page popularity
 */

interface PageView {
  pageNumber: number;
  timestamp: number;
  duration: number;
}

interface SessionData {
  sessionId: string;
  startTime: number;
  endTime?: number;
  totalPages: number;
  viewedPages: Set<number>;
  pageViews: PageView[];
}

interface AnalyticsData {
  sessions: SessionData[];
  totalViews: number;
  totalTimeSpent: number;
  popularPages: Record<number, number>; // pageNumber -> view count
  lastUpdated: number;
}

const STORAGE_KEY = "flipbook_analytics";

class FlipbookAnalytics {
  private currentSession: SessionData | null = null;
  private currentPageStartTime: number = 0;
  private currentPage: number = 0;

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Start a new session
   */
  startSession(totalPages: number): string {
    const sessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    this.currentSession = {
      sessionId,
      startTime: Date.now(),
      totalPages,
      viewedPages: new Set(),
      pageViews: [],
    };

    return sessionId;
  }

  /**
   * End the current session
   */
  endSession() {
    if (!this.currentSession) return;

    this.currentSession.endTime = Date.now();
    this.saveSession();
    this.currentSession = null;
  }

  /**
   * Track page view
   */
  trackPageView(pageNumber: number) {
    if (!this.currentSession) return;

    // Save previous page duration
    if (this.currentPage !== 0 && this.currentPageStartTime > 0) {
      const duration = Date.now() - this.currentPageStartTime;

      this.currentSession.pageViews.push({
        pageNumber: this.currentPage,
        timestamp: this.currentPageStartTime,
        duration,
      });
    }

    // Start tracking new page
    this.currentPage = pageNumber;
    this.currentPageStartTime = Date.now();
    this.currentSession.viewedPages.add(pageNumber);
  }

  /**
   * Get analytics data
   */
  getAnalytics(): AnalyticsData {
    const data = this.loadFromStorage();

    // Calculate popular pages
    const popularPages: Record<number, number> = {};
    data.sessions.forEach((session) => {
      session.pageViews.forEach((view) => {
        popularPages[view.pageNumber] =
          (popularPages[view.pageNumber] || 0) + 1;
      });
    });

    // Calculate total time spent
    const totalTimeSpent = data.sessions.reduce((total, session) => {
      const sessionDuration = session.endTime
        ? session.endTime - session.startTime
        : Date.now() - session.startTime;
      return total + sessionDuration;
    }, 0);

    return {
      ...data,
      popularPages,
      totalTimeSpent,
      totalViews: data.sessions.reduce((sum, s) => sum + s.pageViews.length, 0),
    };
  }

  /**
   * Clear all analytics data
   */
  clear() {
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * Export analytics as JSON
   */
  export(): string {
    const analytics = this.getAnalytics();
    return JSON.stringify(analytics, null, 2);
  }

  private saveSession() {
    if (!this.currentSession) return;

    const data = this.loadFromStorage();
    data.sessions.push(this.currentSession);
    data.lastUpdated = Date.now();

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  private loadFromStorage(): { sessions: SessionData[]; lastUpdated: number } {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return { sessions: [], lastUpdated: 0 };
      }

      const data = JSON.parse(stored);
      // Convert viewedPages from array to Set
      data.sessions = data.sessions.map((session: any) => ({
        ...session,
        viewedPages: new Set(session.viewedPages),
      }));

      return data;
    } catch (error) {
      console.error("Failed to load analytics:", error);
      return { sessions: [], lastUpdated: 0 };
    }
  }
}

// Singleton instance
export const analytics = new FlipbookAnalytics();

/**
 * React hook for using analytics
 */
export const useAnalytics = (totalPages: number) => {
  const startTracking = () => {
    analytics.startSession(totalPages);
  };

  const stopTracking = () => {
    analytics.endSession();
  };

  const trackPage = (pageNumber: number) => {
    analytics.trackPageView(pageNumber);
  };

  const getStats = () => {
    return analytics.getAnalytics();
  };

  const clearData = () => {
    analytics.clear();
  };

  const exportData = () => {
    return analytics.export();
  };

  return {
    startTracking,
    stopTracking,
    trackPage,
    getStats,
    clearData,
    exportData,
  };
};
