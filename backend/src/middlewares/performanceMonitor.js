/**
 * Performance Monitoring Middleware
 * Tracks API response times and logs slow queries
 */

const SLOW_QUERY_THRESHOLD = 1000; // 1 second

/**
 * Performance monitoring middleware
 * Logs response times and identifies slow queries
 */
const performanceMonitor = (req, res, next) => {
  const startTime = Date.now();
  const originalSend = res.send;

  res.send = function (data) {
    const duration = Date.now() - startTime;

    // Log request details
    const logData = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    };

    // Warn about slow queries
    if (duration > SLOW_QUERY_THRESHOLD) {
      console.warn('⚠️  SLOW QUERY DETECTED:', logData);
    } else if (process.env.LOG_LEVEL === 'debug') {
      console.log('📊 Request:', logData);
    }

    // Set performance header
    res.setHeader('X-Response-Time', `${duration}ms`);

    return originalSend.call(this, data);
  };

  next();
};

/**
 * Memory usage monitor
 * Logs memory usage periodically
 */
const monitorMemoryUsage = () => {
  const used = process.memoryUsage();
  const usage = {
    rss: `${Math.round(used.rss / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)}MB`,
    heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)}MB`,
    external: `${Math.round(used.external / 1024 / 1024)}MB`,
  };

  console.log('💾 Memory Usage:', usage);

  // Warn if heap usage is over 80%
  const heapUsedPercentage = (used.heapUsed / used.heapTotal) * 100;
  if (heapUsedPercentage > 80) {
    console.warn(`⚠️  High memory usage: ${heapUsedPercentage.toFixed(2)}%`);
  }
};

/**
 * Start periodic memory monitoring
 * @param {number} intervalMs - Monitoring interval in milliseconds (default: 5 minutes)
 */
const startMemoryMonitoring = (intervalMs = 5 * 60 * 1000) => {
  if (process.env.NODE_ENV === 'production') {
    setInterval(monitorMemoryUsage, intervalMs);
    console.log('✅ Memory monitoring started');
  }
};

/**
 * Database query performance tracker
 * Wraps mongoose queries to track execution time
 */
const trackQueryPerformance = (mongoose) => {
  // Track slow queries
  mongoose.set('debug', (collectionName, method, query, doc) => {
    const startTime = Date.now();

    // Log the query
    setImmediate(() => {
      const duration = Date.now() - startTime;
      if (duration > SLOW_QUERY_THRESHOLD) {
        console.warn('⚠️  SLOW DB QUERY:', {
          collection: collectionName,
          method: method,
          duration: `${duration}ms`,
          query: JSON.stringify(query),
        });
      }
    });
  });
};

/**
 * API statistics tracker
 */
class APIStats {
  constructor() {
    this.stats = {
      totalRequests: 0,
      totalErrors: 0,
      totalDuration: 0,
      endpoints: {},
    };
  }

  /**
   * Record a request
   */
  record(method, url, statusCode, duration) {
    this.stats.totalRequests++;
    this.stats.totalDuration += duration;

    if (statusCode >= 400) {
      this.stats.totalErrors++;
    }

    const endpoint = `${method} ${url}`;
    if (!this.stats.endpoints[endpoint]) {
      this.stats.endpoints[endpoint] = {
        count: 0,
        errors: 0,
        totalDuration: 0,
        avgDuration: 0,
        minDuration: Infinity,
        maxDuration: 0,
      };
    }

    const endpointStats = this.stats.endpoints[endpoint];
    endpointStats.count++;
    endpointStats.totalDuration += duration;
    endpointStats.avgDuration = endpointStats.totalDuration / endpointStats.count;
    endpointStats.minDuration = Math.min(endpointStats.minDuration, duration);
    endpointStats.maxDuration = Math.max(endpointStats.maxDuration, duration);

    if (statusCode >= 400) {
      endpointStats.errors++;
    }
  }

  /**
   * Get statistics summary
   */
  getSummary() {
    return {
      ...this.stats,
      avgResponseTime:
        this.stats.totalRequests > 0
          ? Math.round(this.stats.totalDuration / this.stats.totalRequests)
          : 0,
      errorRate:
        this.stats.totalRequests > 0
          ? ((this.stats.totalErrors / this.stats.totalRequests) * 100).toFixed(2) + '%'
          : '0%',
    };
  }

  /**
   * Reset statistics
   */
  reset() {
    this.stats = {
      totalRequests: 0,
      totalErrors: 0,
      totalDuration: 0,
      endpoints: {},
    };
  }
}

const apiStats = new APIStats();

/**
 * Middleware to track API statistics
 */
const trackAPIStats = (req, res, next) => {
  const startTime = Date.now();
  const originalSend = res.send;

  res.send = function (data) {
    const duration = Date.now() - startTime;
    apiStats.record(req.method, req.route?.path || req.path, res.statusCode, duration);
    return originalSend.call(this, data);
  };

  next();
};

/**
 * Log statistics periodically
 */
const startStatsLogging = (intervalMs = 60 * 60 * 1000) => {
  // Log every hour
  setInterval(() => {
    const summary = apiStats.getSummary();
    console.log('📈 API Statistics (last hour):', {
      totalRequests: summary.totalRequests,
      avgResponseTime: `${summary.avgResponseTime}ms`,
      errorRate: summary.errorRate,
      topEndpoints: Object.entries(summary.endpoints)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 5)
        .map(([endpoint, stats]) => ({
          endpoint,
          count: stats.count,
          avgDuration: `${Math.round(stats.avgDuration)}ms`,
        })),
    });
    apiStats.reset();
  }, intervalMs);
};

module.exports = {
  performanceMonitor,
  monitorMemoryUsage,
  startMemoryMonitoring,
  trackQueryPerformance,
  trackAPIStats,
  startStatsLogging,
  apiStats,
};
