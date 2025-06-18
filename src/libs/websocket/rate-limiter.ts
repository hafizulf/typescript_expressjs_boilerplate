export class RateLimiter {
  private rateLimitMap: Map<string, { count: number; lastRequestTime: number }>;
  private maxRequests: number;
  private timeWindow: number;

  constructor(maxRequests: number, timeWindow: number) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow * 1000; // Convert to milliseconds
    this.rateLimitMap = new Map();
  }

  async checkRateLimit(key: string): Promise<boolean> {
    const currentTime = Date.now();
    const lastRequestData = this.rateLimitMap.get(key);

    if (lastRequestData) {
      const { count, lastRequestTime } = lastRequestData;

      if (currentTime - lastRequestTime < this.timeWindow) { // If the time window has not passed yet
        if (count >= this.maxRequests) {
          console.log('Rate limit exceeded');
          return false; // Exceeded rate limit
        }
        this.rateLimitMap.set(key, { count: count + 1, lastRequestTime });
      } else {
        // Reset the count if the time window has passed
        this.rateLimitMap.set(key, { count: 1, lastRequestTime: currentTime });
      }
    } else {
      this.rateLimitMap.set(key, { count: 1, lastRequestTime: currentTime });
    }

    return true; // Allow the request
  }
}
