// --- 配置与状态 ---
const i18n = {
  en: {
    nav_plugins_store: "Plugins Store",
    nav_docs: "Docs",
    title: "BetterLyrics Plugins",
    subtitle: "Discover and extend your music experience",
    searchPlaceholder: "Search plugins...",
    loading: "Loading library...",
    download: "Get", // 改短一点更像应用商店
    noPlugins: "No plugins found.",
    authorPrefix: "By",
  },
  zh: {
    nav_plugins_store: "插件商店",
    nav_docs: "文档",
    title: "BetterLyrics 插件库",
    subtitle: "发现更多功能，扩展你的音乐体验",
    searchPlaceholder: "搜索插件...",
    loading: "正在加载插件库...",
    download: "获取",
    noPlugins: "未找到相关插件。",
    authorPrefix: "作者",
  },
};

// 默认改为 Dark，除非 localStorage 明确存了 light
let currentLang = localStorage.getItem("lang") || "en";
let currentTheme = localStorage.getItem("theme") || "dark";
let allPlugins = [];

// --- 初始化 ---
document.addEventListener("DOMContentLoaded", () => {
  applyTheme(currentTheme);
  applyLanguage(currentLang);
  fetchPlugins();

  // 绑定按钮事件
  document.getElementById("btn-theme").addEventListener("click", toggleTheme);
  document.getElementById("btn-lang").addEventListener("click", toggleLanguage);
  document.getElementById("search-box").addEventListener("input", handleSearch);

  // --- 光晕特效 (Landing Page 同款) ---
  const glow = document.getElementById("glow-effect");
  if (glow) {
    document.addEventListener("mousemove", (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      const moveX = (x - 0.5) * 40;
      const moveY = (y - 0.5) * 40;
      glow.style.transform = `translateX(calc(-50% + ${moveX}px)) translateY(${moveY}px)`;
    });
  }
});

// --- 功能: 数据获取 ---
function fetchPlugins() {
  fetch("plugins.json")
    .then((res) => res.json())
    .then((data) => {
      allPlugins = data;
      const loadingEl = document.getElementById("loading");
      if (loadingEl) loadingEl.style.display = "none";
      renderPlugins(allPlugins);
    })
    .catch((err) => {
      console.error(err);
      const loadingEl = document.getElementById("loading");
      if (loadingEl) loadingEl.innerText = "Failed to load plugins.";
    });
}

function renderPlugins(plugins) {
  const container = document.getElementById("plugin-list");
  container.innerHTML = "";
  const texts = i18n[currentLang];

  if (plugins.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 40px; color:var(--text-secondary);">${texts.noPlugins}</div>`;
    return;
  }

  plugins.forEach((plugin) => {
    let desc = "";
    if (typeof plugin.description === "object") {
      desc = plugin.description[currentLang] || plugin.description["en"];
    } else {
      desc = plugin.description;
    }

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
            <div>
                <div class="plugin-name">${plugin.name}</div>
                <code class="plugin-id">${plugin.id}</code>
                
                <div class="plugin-author">${texts.authorPrefix} ${plugin.author}</div>
                <p class="plugin-desc">${desc}</p>
            </div>
            <div class="card-footer">
                <span>v${plugin.version} • ${plugin.lastUpdated}</span>
                <a href="${plugin.url}" class="btn-download" target="_blank">${texts.download}</a>
            </div>
        `;
    container.appendChild(card);
  });
}

function handleSearch(e) {
  const term = e.target.value.toLowerCase();
  const filtered = allPlugins.filter(
    (p) =>
      p.name.toLowerCase().includes(term) ||
      p.author.toLowerCase().includes(term),
  );
  renderPlugins(filtered);
}

// --- 功能: 主题切换 ---
function toggleTheme() {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  applyTheme(currentTheme);
  localStorage.setItem("theme", currentTheme);
}

function applyTheme(theme) {
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    document.querySelector(".icon-sun").style.display = "none";
    document.querySelector(".icon-moon").style.display = "inline";
  } else {
    document.documentElement.removeAttribute("data-theme"); // 默认深色
    document.querySelector(".icon-sun").style.display = "inline";
    document.querySelector(".icon-moon").style.display = "none";
  }
}

// --- 功能: 语言切换 ---
function toggleLanguage() {
  currentLang = currentLang === "en" ? "zh" : "en";
  applyLanguage(currentLang);
  localStorage.setItem("lang", currentLang);
  renderPlugins(allPlugins);
}

function applyLanguage(lang) {
  const texts = i18n[lang];

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (texts[key]) el.innerText = texts[key];
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (texts[key]) el.placeholder = texts[key];
  });

  document.getElementById("btn-lang").innerText = lang === "en" ? "中" : "En";
}
