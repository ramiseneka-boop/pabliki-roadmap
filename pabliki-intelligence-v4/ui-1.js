window.__PABLIKI_UI=window.__PABLIKI_UI||[];window.__PABLIKI_UI.push(String.raw`<div class="app-shell">
  <aside class="sidebar">
    <div class="brand"><div class="brand-mark">P</div><div><strong>Pabliki</strong><span>Intelligence</span></div></div>
    <nav class="nav">
      <button class="nav-item active" data-view="dashboard"><span>◈</span> Обзор</button>
      <button class="nav-item" data-view="publishers"><span>▦</span> Паблики</button>
      <button class="nav-item" data-view="campaigns"><span>↗</span> Подборки</button>
      <button class="nav-item" data-view="audit"><span>⌁</span> Проверка пабликов</button>
      <button class="nav-item" data-view="imports"><span>⇧</span> Импорт базы</button>
      <button class="nav-item" data-view="methodology"><span>◎</span> Методика</button>
    </nav>
    <div class="sidebar-note"><span class="dot live"></span><div><b>Боевой расчёт</b><small>Импортированные данные и экономика сохраняются в этом браузере. Тестовые показатели не генерируются.</small></div></div>
  </aside>

  <main class="main">
    <header class="topbar">
      <div><p class="eyebrow">Аналитика рекламных пабликов</p><h1 id="pageTitle">Обзор базы</h1></div>
      <div class="top-actions"><button class="ghost-button" id="recalcBtn">Пересчитать</button><button class="primary-button" id="importBtn">+ Импортировать базу</button></div>
    </header>

    <section id="dashboardView" class="view active-view">
      <div id="emptyNotice" class="notice hidden"><b>База пока пустая.</b> Загрузите Excel/CSV — после импорта здесь появятся реальные паблики и экономика размещений.</div>
      <div class="stats-grid">
        <article class="stat-card"><span>Пабликов в базе</span><strong id="totalPublishers">0</strong><small>уникальных аккаунтов</small></article>
        <article class="stat-card"><span>Себестоимость по базе</span><strong id="dashCost">—</strong><small>по текущему формату</small></article>
        <article class="stat-card"><span>Цена продажи по базе</span><strong id="dashSale">—</strong><small>базовая цена</small></article>
        <article class="stat-card"><span>Чистая маржа по базе</span><strong id="dashMargin">—</strong><small>с учётом настроек экономики</small></article>
      </div>
      <div class="panel-grid">
        <section class="panel wide"><div class="panel-head"><div><h2>Паблики в базе</h2><p>Реальные импортированные данные</p></div><button class="text-button" data-jump="publishers">Открыть все →</button></div><div class="table-wrap"><table><thead><tr><th>Паблик</th><th>Подписчики</th><th>Себестоимость</th><th>Цена продажи</th><th>Цена клиенту</th><th>Чистая маржа</th></tr></thead><tbody id="dashboardTable"></tbody></table></div></section>
        <section class="panel"><div class="panel-head"><div><h2>Текущая экономика</h2><p>Применяется к подборкам и PDF</p></div></div><div id="economicsSummary" class="signal-list"></div></section>
      </div>
    </section>

    <section id="publishersView" class="view">
      <div class="toolbar">
        <div class="search-box"><span>⌕</span><input id="searchInput" placeholder="Поиск по @username, городу или тематике" /></div>
        <select id="cityFilter"><option value="all">Все города</option></select>
        <select id="formatFilter" class="format-selector"><option value="reels">Reels</option><option value="post">Post</option><option value="stories">Stories</option></select>
        <select id="sortSelect"><option value="username">По названию</option><option value="followers-desc">По подписчикам</option><option value="margin-desc">По чистой марже</option><option value="cpm-asc">По выгодному CPM</option></select>
      </div>
      <div class="panel"><div class="table-wrap"><table class="publishers-table"><thead><tr><th>Паблик</th><th>Подписчики</th><th>Прогноз просмотров</th><th>ER</th><th>CPM</th><th>Себестоимость</th><th>Цена продажи</th><th>Цена клиенту</th><th>Маржа</th><th></th></tr></thead><tbody id="publishersTable"></tbody></table></div></div>
    </section>`);