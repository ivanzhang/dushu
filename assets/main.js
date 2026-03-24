(function () {
  const data = window.NovelSiteData || { books: [], ranking: [], chapters: [], chapterContent: [] };

  const STORAGE_KEYS = {
    tier: "novel-subscription-tier",
    updatedAt: "novel-subscription-updated-at",
    orders: "novel-orders"
  };

  const PLAN_FREE = { id: "free", name: "免费用户", level: 0, price: 0, desc: "可阅读公开章节" };
  const SUBSCRIPTION_PLANS = [
    {
      id: "starter",
      name: "轻享会员",
      level: 1,
      price: 20,
      desc: "解锁会员章节、基础无广告阅读",
      perks: ["会员章节解锁", "阅读主题扩展", "优先更新提醒"]
    },
    {
      id: "plus",
      name: "进阶会员",
      level: 2,
      price: 50,
      desc: "适合高频阅读用户",
      perks: ["轻享全部权益", "独家番外优先读", "专属书单推荐"]
    },
    {
      id: "pro",
      name: "旗舰会员",
      level: 3,
      price: 100,
      desc: "完整阅读权益与活动资格",
      perks: ["进阶全部权益", "活动资格优先", "客服绿色通道"]
    }
  ];

  const PLAN_MAP = SUBSCRIPTION_PLANS.reduce(
    (acc, item) => {
      acc[item.id] = item;
      return acc;
    },
    { free: PLAN_FREE }
  );

  function formatNum(n) {
    if (n >= 10000) {
      return `${(n / 10000).toFixed(1)} 万`;
    }
    return `${n}`;
  }

  function currentPage() {
    return document.body.dataset.page || "";
  }

  function toReadableDate(value) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString();
  }

  function getCurrentPlan() {
    const tier = localStorage.getItem(STORAGE_KEYS.tier) || "free";
    return PLAN_MAP[tier] || PLAN_FREE;
  }

  function setCurrentPlan(tier) {
    localStorage.setItem(STORAGE_KEYS.tier, tier);
    localStorage.setItem(STORAGE_KEYS.updatedAt, new Date().toISOString());
  }

  function canAccess(requiredLevel) {
    return getCurrentPlan().level >= requiredLevel;
  }

  function readOrders() {
    const raw = localStorage.getItem(STORAGE_KEYS.orders);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function writeOrders(orders) {
    localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
  }

  function addOrder(order) {
    const orders = readOrders();
    orders.unshift(order);
    writeOrders(orders);
  }

  function findOrder(orderId) {
    if (!orderId) return null;
    return readOrders().find((order) => order.id === orderId) || null;
  }

  function makeOrderId() {
    return `ORD${Date.now()}${Math.floor(Math.random() * 900 + 100)}`;
  }

  function createOrder(plan, status, paymentMethod) {
    return {
      id: makeOrderId(),
      planId: plan.id,
      planName: plan.name,
      amount: plan.price,
      currency: "USD",
      status,
      paymentMethod,
      createdAt: new Date().toISOString()
    };
  }

  function injectCommerceNav() {
    document.querySelectorAll(".nav-list").forEach((menu) => {
      const loginNode = menu.querySelector('[data-page="login"]');
      const loginLi = loginNode ? loginNode.closest("li") : null;

      if (!menu.querySelector('[data-page="subscription"]')) {
        const subLi = document.createElement("li");
        subLi.innerHTML = '<a class="nav-link" data-page="subscription" href="./subscription.html">订阅</a>';
        if (loginLi) {
          menu.insertBefore(subLi, loginLi);
        } else {
          menu.appendChild(subLi);
        }
      }

      if (!menu.querySelector('[data-page="orders"]')) {
        const orderLi = document.createElement("li");
        orderLi.innerHTML = '<a class="nav-link" data-page="orders" href="./orders.html">订单</a>';
        if (loginLi) {
          menu.insertBefore(orderLi, loginLi);
        } else {
          menu.appendChild(orderLi);
        }
      }
    });
  }

  function renderMembershipBadge() {
    const host = document.querySelector(".topbar-inner");
    if (!host) return;
    const existing = document.querySelector("#membership-pill");
    if (existing) existing.remove();

    const plan = getCurrentPlan();
    const badge = document.createElement("span");
    badge.id = "membership-pill";
    badge.className = "status-pill";
    badge.textContent = `会员：${plan.name}`;
    host.appendChild(badge);
  }

  function bindNav() {
    injectCommerceNav();

    const toggle = document.querySelector(".nav-toggle");
    const menu = document.querySelector(".nav-list");
    if (toggle && menu) {
      toggle.addEventListener("click", function () {
        menu.classList.toggle("open");
      });
    }

    const page = currentPage();
    document.querySelectorAll(".nav-link").forEach((el) => {
      if (el.dataset.page === page) {
        el.classList.add("active");
      }
    });

    renderMembershipBadge();
  }

  function bookCard(book) {
    const tags = book.tags.map((tag) => `<span class="tag">${tag}</span>`).join("");
    return `
      <article class="book-card reveal" data-category="${book.category}">
        <img class="book-cover" src="${book.cover}" alt="${book.title} 封面" />
        <div class="book-body">
          <h3 class="book-title">${book.title}</h3>
          <p class="book-meta">${book.author} · ${book.category} · ${book.status}</p>
          <div class="book-tags">${tags}</div>
          <div class="card-foot">
            <span>热度 ${formatNum(book.hot)}</span>
            <span>评分 ${book.rating}</span>
          </div>
        </div>
      </article>
    `;
  }

  function renderFeatured() {
    const container = document.querySelector("#featured-grid");
    if (!container) return;
    container.innerHTML = data.books.slice(0, 4).map(bookCard).join("");
  }

  function renderNewBooks() {
    const container = document.querySelector("#new-grid");
    if (!container) return;
    container.innerHTML = data.books.slice(2).map(bookCard).join("");
  }

  function renderCategoryBooks() {
    const container = document.querySelector("#category-grid");
    if (!container) return;
    container.innerHTML = data.books.map(bookCard).join("");

    const chips = document.querySelectorAll("[data-filter]");
    chips.forEach((chip) => {
      chip.addEventListener("click", function () {
        chips.forEach((el) => el.classList.remove("active"));
        chip.classList.add("active");
        const filter = chip.dataset.filter;
        Array.from(container.children).forEach((item) => {
          if (filter === "全部" || item.dataset.category === filter) {
            item.style.display = "block";
          } else {
            item.style.display = "none";
          }
        });
      });
    });
  }

  function renderHeroRanking() {
    const list = document.querySelector("#hero-ranking");
    if (!list) return;
    list.innerHTML = data.ranking.map((item) => `<li>${item}</li>`).join("");
  }

  function renderBookDetail() {
    const book = data.books[0];
    const wrap = document.querySelector("#book-detail");
    if (!wrap || !book) return;

    wrap.innerHTML = `
      <img src="${book.cover}" alt="${book.title} 封面" />
      <div>
        <h1 class="book-title-lg">${book.title}</h1>
        <div class="stats-inline">
          <span>${book.author}</span>
          <span>${book.category}</span>
          <span>${book.words}</span>
          <span>${book.status}</span>
          <span>评分 ${book.rating}</span>
        </div>
        <p class="book-summary">${book.summary}</p>
        <div class="chip-row">
          ${book.tags.map((tag) => `<span class="chip">${tag}</span>`).join("")}
        </div>
        <div class="hero-actions" style="margin-top:18px;">
          <a class="btn btn-primary" href="./reader.html">立即阅读</a>
          <button class="btn btn-secondary" type="button">加入书架</button>
          <a class="btn btn-secondary" href="./subscription.html">开通会员</a>
        </div>
      </div>
    `;

    const catalog = document.querySelector("#catalog-list");
    if (catalog) {
      const unlock = canAccess(1);
      catalog.innerHTML = data.chapters
        .map((chapter, idx) => {
          const locked = idx >= 6;
          if (locked && !unlock) {
            return `<li class="catalog-item"><span>${chapter}</span><small class="text-danger">会员专享</small></li>`;
          }
          return `<li class="catalog-item"><span>${chapter}</span><small>${idx < 3 ? "今天" : "本周"} 更新</small></li>`;
        })
        .join("");

      if (!unlock) {
        const note = document.createElement("div");
        note.className = "notice";
        note.innerHTML =
          '第 7 章起为会员章节，开通 <strong>$20</strong> 起订阅后可继续阅读。 <a href="./subscription.html">去开通</a>';
        catalog.parentElement.appendChild(note);
      }
    }
  }

  function renderBookshelf() {
    const list = document.querySelector("#bookshelf-list");
    if (!list) return;
    list.innerHTML = data.books
      .slice(0, 5)
      .map(
        (book) => `
          <article class="bookshelf-item reveal">
            <img src="${book.cover}" alt="${book.title} 封面" />
            <div>
              <h3 style="margin:0 0 6px;">${book.title}</h3>
              <p class="book-meta" style="margin:0 0 8px;">${book.author} · ${book.update}</p>
              <div class="progress"><span style="width:${book.progress}%"></span></div>
              <small style="color:var(--ink-500);">已读进度 ${book.progress}%</small>
            </div>
            <button class="btn btn-secondary" type="button">继续阅读</button>
          </article>
        `
      )
      .join("");

    const membershipHint = document.querySelector("#bookshelf-membership");
    if (membershipHint) {
      const plan = getCurrentPlan();
      membershipHint.innerHTML =
        plan.level > 0
          ? `当前订阅：<strong>${plan.name}</strong>（$${plan.price}/月）`
          : '当前为免费用户，会员可解锁更多章节。<a href="./subscription.html">查看套餐</a>';
    }
  }

  function applyReaderState(reader, state, refs) {
    reader.style.fontSize = `${state.fontSize}px`;
    reader.style.lineHeight = String(state.lineHeight);
    if (refs.fontRange) refs.fontRange.value = String(state.fontSize);
    if (refs.lineRange) refs.lineRange.value = String(state.lineHeight * 100);
    if (refs.progressRange) refs.progressRange.value = String(state.progress);
    if (refs.progressBar) refs.progressBar.style.width = `${state.progress}%`;

    document.body.classList.remove("reader-theme-sepia", "reader-theme-dark");
    if (state.theme === "sepia") document.body.classList.add("reader-theme-sepia");
    if (state.theme === "dark") document.body.classList.add("reader-theme-dark");
  }

  function mountReaderPaywall() {
    const chapter = document.querySelector("#chapter-content");
    if (!chapter) return;

    const status = document.querySelector("#reader-access-status");
    const unlocked = canAccess(1);
    if (unlocked) {
      if (status) status.textContent = "会员章节已解锁";
      return;
    }

    const paragraphs = Array.from(chapter.querySelectorAll("p"));
    paragraphs.forEach((p, idx) => {
      if (idx >= 2) {
        p.classList.add("locked-blur");
      }
    });

    const wall = document.createElement("div");
    wall.className = "paywall";
    wall.innerHTML = `
      <h3>后续章节为会员内容</h3>
      <p>开通订阅即可解锁完整阅读。套餐价格：<strong>$20 / $50 / $100</strong>。</p>
      <a class="btn btn-primary" href="./subscription.html">去开通会员</a>
    `;
    chapter.appendChild(wall);
    if (status) status.textContent = "当前为试读模式";
  }

  function bindReader() {
    const reader = document.querySelector("#reader-content");
    if (!reader) return;

    const chapter = document.querySelector("#chapter-content");
    if (chapter) {
      chapter.innerHTML = data.chapterContent.map((line) => `<p>${line}</p>`).join("");
    }

    const refs = {
      fontRange: document.querySelector("#font-range"),
      lineRange: document.querySelector("#line-range"),
      progressRange: document.querySelector("#progress-range"),
      progressBar: document.querySelector("#chapter-progress")
    };

    const state = {
      fontSize: Number(localStorage.getItem("reader-font-size") || 20),
      lineHeight: Number(localStorage.getItem("reader-line-height") || 1.85),
      progress: Number(localStorage.getItem("reader-progress") || 22),
      theme: localStorage.getItem("reader-theme") || "default"
    };

    if (refs.fontRange) {
      refs.fontRange.addEventListener("input", function () {
        state.fontSize = Number(refs.fontRange.value);
        localStorage.setItem("reader-font-size", String(state.fontSize));
        applyReaderState(reader, state, refs);
      });
    }

    if (refs.lineRange) {
      refs.lineRange.addEventListener("input", function () {
        state.lineHeight = Number(refs.lineRange.value) / 100;
        localStorage.setItem("reader-line-height", String(state.lineHeight));
        applyReaderState(reader, state, refs);
      });
    }

    if (refs.progressRange) {
      refs.progressRange.addEventListener("input", function () {
        state.progress = Number(refs.progressRange.value);
        localStorage.setItem("reader-progress", String(state.progress));
        applyReaderState(reader, state, refs);
      });
    }

    document.querySelectorAll(".theme-dot").forEach((dot) => {
      dot.addEventListener("click", function () {
        state.theme = dot.dataset.theme;
        localStorage.setItem("reader-theme", state.theme);
        applyReaderState(reader, state, refs);
      });
    });

    applyReaderState(reader, state, refs);
    mountReaderPaywall();
  }

  function bindAuthTabs() {
    const tabs = document.querySelectorAll(".tab");
    const title = document.querySelector("#auth-title");
    const hint = document.querySelector("#auth-hint");
    const submit = document.querySelector("#auth-submit");
    const extra = document.querySelector("#register-only");
    if (!tabs.length || !title || !hint || !submit || !extra) return;

    tabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        const mode = tab.dataset.mode;
        if (mode === "login") {
          title.textContent = "欢迎回来";
          hint.textContent = "继续追更，系统会自动同步阅读进度。";
          submit.textContent = "立即登录";
          extra.style.display = "none";
        } else {
          title.textContent = "创建新账号";
          hint.textContent = "注册后可收藏作品、同步书架和阅读偏好。";
          submit.textContent = "注册账号";
          extra.style.display = "block";
        }
      });
    });
  }

  function renderSubscriptionPage() {
    const statusBox = document.querySelector("#subscription-status");
    const plansGrid = document.querySelector("#subscription-plans");
    if (!statusBox || !plansGrid) return;

    const current = getCurrentPlan();
    const updatedAt = localStorage.getItem(STORAGE_KEYS.updatedAt);

    statusBox.innerHTML = `
      <h2 style="margin:0 0 6px;">当前订阅：${current.name}</h2>
      <p class="section-sub" style="margin:0;">最近变更时间：${toReadableDate(updatedAt)}</p>
      <div class="hero-actions" style="margin-top:12px;">
        <a class="btn btn-secondary" href="./orders.html">查看订单记录</a>
        <button class="btn btn-secondary" id="cancel-subscription" type="button">恢复免费版</button>
      </div>
    `;

    plansGrid.innerHTML = SUBSCRIPTION_PLANS.map((plan) => {
      const active = plan.id === current.id;
      return `
        <article class="plan-card ${active ? "active" : ""}">
          <h3>${plan.name}</h3>
          <p class="plan-price"><strong>$${plan.price}</strong><span>/月</span></p>
          <p class="section-sub">${plan.desc}</p>
          <ul class="plan-list">
            ${plan.perks.map((item) => `<li>${item}</li>`).join("")}
          </ul>
          <button class="btn ${active ? "btn-secondary" : "btn-primary"} plan-cta" data-checkout="${plan.id}" type="button" ${
            active ? "disabled" : ""
          }>
            ${active ? "当前套餐" : "去结算"}
          </button>
        </article>
      `;
    }).join("");

    plansGrid.querySelectorAll("[data-checkout]").forEach((btn) => {
      btn.addEventListener("click", function () {
        const tier = btn.dataset.checkout;
        if (!PLAN_MAP[tier]) return;
        window.location.href = `./checkout.html?plan=${tier}`;
      });
    });

    const cancelBtn = document.querySelector("#cancel-subscription");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", function () {
        setCurrentPlan("free");
        renderSubscriptionPage();
        renderMembershipBadge();
      });
    }
  }

  function renderCheckoutPage() {
    const wrap = document.querySelector("#checkout-wrap");
    if (!wrap) return;

    const params = new URLSearchParams(window.location.search);
    const planId = params.get("plan") || "";
    const plan = PLAN_MAP[planId];
    if (!plan || plan.id === "free") {
      wrap.innerHTML = `
        <div class="notice">
          套餐参数无效，请从 <a href="./subscription.html">订阅中心</a> 重新选择。
        </div>
      `;
      return;
    }

    wrap.innerHTML = `
      <section class="panel panel-body reveal" style="display:grid; gap:16px;">
        <h1 class="section-title" style="margin:0;">确认订阅套餐</h1>
        <div class="checkout-summary">
          <div>
            <strong>${plan.name}</strong>
            <p class="section-sub" style="margin:4px 0 0;">${plan.desc}</p>
          </div>
          <p class="plan-price" style="margin:0;"><strong>$${plan.price}</strong><span>/月</span></p>
        </div>
        <div class="payment-methods">
          <label class="method-option"><input type="radio" name="pay-method" value="信用卡" checked /> 信用卡</label>
          <label class="method-option"><input type="radio" name="pay-method" value="PayPal" /> PayPal</label>
          <label class="method-option"><input type="radio" name="pay-method" value="Apple Pay" /> Apple Pay</label>
        </div>
        <div class="hero-actions">
          <button class="btn btn-primary" id="pay-success" type="button">模拟支付成功</button>
          <button class="btn btn-secondary" id="pay-fail" type="button">模拟支付失败</button>
          <a class="btn btn-secondary" href="./subscription.html">返回套餐</a>
        </div>
      </section>
    `;

    function handlePay(status) {
      const methodEl = document.querySelector('input[name="pay-method"]:checked');
      const method = methodEl ? methodEl.value : "信用卡";
      const order = createOrder(plan, status, method);
      addOrder(order);

      if (status === "paid") {
        setCurrentPlan(plan.id);
        renderMembershipBadge();
        window.location.href = `./payment-success.html?order=${order.id}`;
      } else {
        window.location.href = `./payment-failed.html?order=${order.id}`;
      }
    }

    const successBtn = document.querySelector("#pay-success");
    const failBtn = document.querySelector("#pay-fail");
    if (successBtn) {
      successBtn.addEventListener("click", function () {
        handlePay("paid");
      });
    }
    if (failBtn) {
      failBtn.addEventListener("click", function () {
        handlePay("failed");
      });
    }
  }

  function renderPaymentSuccessPage() {
    const box = document.querySelector("#payment-success");
    if (!box) return;

    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("order") || "";
    const order = findOrder(orderId);

    if (!order) {
      box.innerHTML = '<div class="notice">未找到订单记录，请前往 <a href="./orders.html">订单页</a> 查看。</div>';
      return;
    }

    box.innerHTML = `
      <div class="result-banner success reveal">
        <h1>支付成功</h1>
        <p>订单号：${order.id}</p>
        <p>套餐：${order.planName} · 金额：$${order.amount} ${order.currency}</p>
        <p>支付方式：${order.paymentMethod}</p>
        <p>支付时间：${toReadableDate(order.createdAt)}</p>
        <div class="hero-actions" style="margin-top:12px;">
          <a class="btn btn-primary" href="./reader.html">去阅读</a>
          <a class="btn btn-secondary" href="./orders.html">查看订单</a>
        </div>
      </div>
    `;
  }

  function renderPaymentFailedPage() {
    const box = document.querySelector("#payment-failed");
    if (!box) return;

    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("order") || "";
    const order = findOrder(orderId);

    if (!order) {
      box.innerHTML = '<div class="notice">未找到失败订单，请返回 <a href="./checkout.html?plan=starter">结算页</a> 重试。</div>';
      return;
    }

    box.innerHTML = `
      <div class="result-banner failed reveal">
        <h1>支付未完成</h1>
        <p>订单号：${order.id}</p>
        <p>套餐：${order.planName} · 金额：$${order.amount} ${order.currency}</p>
        <p>状态：支付失败（模拟）</p>
        <div class="hero-actions" style="margin-top:12px;">
          <a class="btn btn-primary" href="./checkout.html?plan=${order.planId}">重新支付</a>
          <a class="btn btn-secondary" href="./orders.html">查看订单</a>
        </div>
      </div>
    `;
  }

  function renderOrdersPage() {
    const body = document.querySelector("#orders-body");
    const summary = document.querySelector("#orders-summary");
    if (!body || !summary) return;

    const orders = readOrders();
    if (!orders.length) {
      summary.innerHTML = '<div class="notice">暂无订单，先去 <a href="./subscription.html">订阅中心</a> 下单。</div>';
      body.innerHTML = "";
      return;
    }

    const paidCount = orders.filter((order) => order.status === "paid").length;
    const paidAmount = orders
      .filter((order) => order.status === "paid")
      .reduce((sum, order) => sum + Number(order.amount || 0), 0);

    summary.innerHTML = `
      <div class="stat"><strong>${orders.length}</strong><span>订单总数</span></div>
      <div class="stat"><strong>${paidCount}</strong><span>支付成功</span></div>
      <div class="stat"><strong>$${paidAmount}</strong><span>累计实付</span></div>
      <button id="clear-orders" class="btn btn-secondary" type="button">清空订单记录</button>
    `;

    body.innerHTML = orders
      .map((order) => {
        const statusLabel = order.status === "paid" ? "已支付" : "支付失败";
        const statusClass = order.status === "paid" ? "success" : "failed";
        return `
          <tr>
            <td>${order.id}</td>
            <td>${order.planName}</td>
            <td>$${order.amount} ${order.currency}</td>
            <td>${order.paymentMethod}</td>
            <td>${toReadableDate(order.createdAt)}</td>
            <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
          </tr>
        `;
      })
      .join("");

    const clearBtn = document.querySelector("#clear-orders");
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        writeOrders([]);
        renderOrdersPage();
      });
    }
  }

  bindNav();
  renderHeroRanking();
  renderFeatured();
  renderNewBooks();
  renderCategoryBooks();
  renderBookDetail();
  renderBookshelf();
  bindReader();
  bindAuthTabs();
  renderSubscriptionPage();
  renderCheckoutPage();
  renderPaymentSuccessPage();
  renderPaymentFailedPage();
  renderOrdersPage();
})();
