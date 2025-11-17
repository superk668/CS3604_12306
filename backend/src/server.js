const app = require('./app');
const { testConnection, syncDatabase } = require('./models');
const { seedData } = require('./scripts/seedData');

const PORT = process.env.PORT || 3000;

(async () => {
  const server = app.listen(PORT, async () => {
    console.log(`🚄 12306 API Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}${process.env.API_PREFIX || '/api/v1'}`);

    try {
      await testConnection();
      if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        await syncDatabase(false);
        await seedData();
      }
    } catch (e) {
      console.error('服务器启动初始化失败:', e.message);
    }
  });

  // 优雅关闭
  const shutdown = () => {
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
})();