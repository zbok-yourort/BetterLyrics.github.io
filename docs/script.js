window.docsify = {
  name: 'BetterLyrics',
  repo: 'https://github.com/jayfunc/BetterLyrics', // 记得替换你的链接
  
  // 核心配置
  loadSidebar: true,     // 加载 _sidebar.md
  subMaxLevel: 2,        // 生成目录层级
  auto2top: true,        // 切换页面回顶部
  
  // 搜索配置
  search: {
    placeholder: {
      '/': 'Search',
      '/zh-cn/': '搜索文档'
    },
    noData: {
      '/': 'No Results',
      '/zh-cn/': '未找到结果'
    }
  },

  // 路由映射 (可选)
  nameLink: {
    '/zh-cn/': '#/zh-cn/',
    '/': '#/'
  }
}; // <--- 这里的 JS 文件结尾，分号加不加都行，但语法一定要对