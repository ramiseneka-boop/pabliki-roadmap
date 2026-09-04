window.__PABLIKI_UI=window.__PABLIKI_UI||[];window.__PABLIKI_UI.push(String.raw`    <section id="auditView" class="view">
      <div class="audit-layout"><section class="panel audit-entry"><div class="panel-head"><div><h2>Проверка конкретных пабликов</h2><p>Один аккаунт или список</p></div></div><textarea id="auditInput" class="audit-textarea" placeholder="@almaty.suntimes&#10;@typical.almaty"></textarea><div class="audit-help">Проверка работает по реальной загруженной базе. Неизвестные аккаунты не получают выдуманные показатели — система покажет, что данных нет.</div><div class="audit-actions"><button id="runAuditBtn" class="primary-button">Проверить</button><button id="clearAuditBtn" class="ghost-button">Очистить</button></div><div id="auditStatus" class="audit-status">Введите один или несколько аккаунтов</div></section><section><div id="auditResults" class="audit-results"><div class="audit-empty">Результаты проверки появятся здесь.</div></div></section></div>
    </section>

    <section id="importsView" class="view">
      <div class="import-grid">
        <section class="panel import-card"><div class="upload-icon">⇧</div><h2>Загрузить базу пабликов</h2><p>Поддерживаются CSV, XLS и XLSX. Система читает первый лист, нормализует username, обновляет существующие паблики и не создаёт дубли.</p><label class="primary-button file-button">Выбрать Excel / CSV<input id="fileInput" type="file" accept=".csv,.xls,.xlsx" hidden /></label><button id="downloadTemplateBtn" class="ghost-button template-button">Скачать шаблон Excel</button><div id="importStatus" class="import-status"></div><button id="clearBaseBtn" class="danger-link">Очистить локальную базу</button></section>
        <section class="panel"><div class="panel-head"><div><h2>Столбцы Excel</h2><p>Названия можно писать точно как ниже — тогда импорт проходит без ручного сопоставления.</p></div></div><div class="columns-list">
          <div><b>Обязательно</b><span>Instagram / username</span></div>
          <div><b>Справочники</b><span>Регион · Город · Тематика · Язык · Подписчики</span></div>
          <div><b>Reels</b><span>Себестоимость Reels, ₸ · Цена продажи Reels, ₸</span></div>
          <div><b>Post</b><span>Себестоимость Post, ₸ · Цена продажи Post, ₸</span></div>
          <div><b>Stories</b><span>Себестоимость Stories, ₸ · Цена продажи Stories, ₸</span></div>
          <div><b>Статистика</b><span>Средние просмотры Reels · Средние лайки · Средние комментарии</span></div>
          <div><b>Дополнительно</b><span>Примечание</span></div>
        </div><div class="soft-warning">Если статистики просмотров нет, экономика работает полностью, но CPM и прогноз просмотров будут показываться как «нет данных» — никаких искусственных цифр система не подставляет.</div></section>
      </div>
    </section>

    <section id="methodologyView" class="view"><div class="method-grid">
      <article class="panel method-card"><span>01</span><h3>Общая оценка</h3><p>Появляется только когда достаточно фактических данных для расчёта. Без данных система не выдумывает оценку.</p></article>
      <article class="panel method-card"><span>02</span><h3>Authenticity Risk</h3><p>Риск искусственной активности оценивается только по реальным сигналам: просмотрам, лайкам, комментариям, стабильности и истории.</p></article>
      <article class="panel method-card"><span>03</span><h3>Прогноз просмотров</h3><p>При импорте средних просмотров система строит диапазон. Позже его заменит модель на истории рекламных размещений.</p></article>
      <article class="panel method-card"><span>04</span><h3>CPM — стоимость 1 000 просмотров</h3><p>Считается от итоговой цены клиенту и ожидаемых просмотров.</p></article>
      <article class="panel method-card"><span>05</span><h3>Экономика</h3><p>Себестоимость, цена продажи, налоги и комиссии считаются по выбранному формату и настройкам конкретной сделки.</p></article>
      <article class="panel method-card"><span>06</span><h3>Чистая маржа</h3><p>Итоговая цена клиенту минус налоги/комиссии минус себестоимость.</p></article>
    </div></section>
  </main>
</div>
<div id="drawerBackdrop" class="drawer-backdrop"></div><aside id="publisherDrawer" class="drawer" aria-hidden="true"><button id="closeDrawer" class="drawer-close">×</button><div id="drawerContent"></div></aside>`);