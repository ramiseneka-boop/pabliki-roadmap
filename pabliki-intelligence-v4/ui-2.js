window.__PABLIKI_UI=window.__PABLIKI_UI||[];window.__PABLIKI_UI.push(String.raw`    <section id="campaignsView" class="view">
      <div class="selection-builder">
        <section class="filters-card"><div class="filters-frame">
          <div class="filters-header"><div class="filters-icon">⌕</div><div class="filters-copy"><h2>Фильтры для подбора пабликов</h2><p>Найдите площадки по географии, тематике, бюджету и ожидаемой эффективности.</p></div></div>
          <div class="filters-grid">
            <div class="filter-field"><div class="field-title">Поиск</div><div class="filter-control selection-search"><span>⌕</span><input id="selectionSearch" placeholder="@username, город или тематика" /></div></div>
            <div class="filter-field"><div class="field-title">Города</div><select id="selectionCity" class="filter-select"><option value="all">Все города</option></select></div>
            <div class="filter-field"><div class="field-title">Тематики</div><select id="selectionCategory" class="filter-select"><option value="all">Все тематики</option></select></div>
            <div class="filter-field"><div class="field-title">Формат</div><select id="selectionFormat" class="filter-select"><option value="reels">Reels</option><option value="post">Post</option><option value="stories">Stories</option></select></div>
            <div class="filter-field"><div class="field-title">CPM</div><input id="selectionMaxCpm" class="filter-input" type="number" min="0" placeholder="CPM до, ₸" /></div>
            <div class="filter-field"><div class="field-title">Просмотры</div><input id="selectionMinViews" class="filter-input" type="number" min="0" placeholder="Просмотров от" /></div>
            <div class="filter-field"><div class="field-title">Цена клиенту</div><input id="selectionMaxPrice" class="filter-input" type="number" min="0" placeholder="Цена до, ₸" /></div>
            <div class="filter-field"><div class="field-title">Минимальная маржа</div><input id="selectionMinMargin" class="filter-input" type="number" min="0" placeholder="Маржа от, ₸" /></div>
          </div>
          <div class="filters-bottom"><div class="selection-count pretty-count" id="selectionCount"><span>Найдено: <b>0</b></span><span>•</span><span>Выбрано: <b>0</b></span></div><div class="filter-buttons"><button id="clearSelectionBtn" class="outline-action">Очистить</button><button id="selectFilteredBtn" class="selection-cta">Выбрать найденные</button></div></div>
        </div></section>

        <section class="economics-card">
          <div class="economics-head"><div><h2>Экономика подборки</h2><p>Отметьте только те расходы, которые нужно учесть в конкретной сделке.</p></div><label class="switch-line"><input type="checkbox" id="grossUpToggle" checked><span>Добавлять выбранные расходы сверху к цене клиента</span></label></div>
          <div class="economics-grid">
            <label class="economics-option"><input type="checkbox" id="ipnToggle"><span><b>ИПН</b><small>10%</small></span></label>
            <label class="economics-option"><input type="checkbox" id="kpnToggle"><span><b>КПН</b><small>20%</small></span></label>
            <label class="economics-option"><input type="checkbox" id="agentToggle"><span><b>Агентская комиссия</b><small>10%</small></span></label>
            <label class="economics-option"><input type="checkbox" id="counterpartyToggle"><span><b>Работа через другого контрагента</b><small>8%</small></span></label>
          </div>
          <div class="economics-note">ИПН и КПН взаимоисключающие. Расчёт управленческий: система считает выбранный процент от итоговой цены сделки. Фактическую налоговую базу для отчётности подтверждает бухгалтер.</div>
        </section>

        <section class="selection-meta-card"><h3>Параметры подборки</h3><p>Название и клиент попадут в PDF.</p><div class="selection-meta"><input id="selectionName" class="client-input" placeholder="Название подборки, например: KMF — Алматы / сентябрь" /><input id="clientName" class="client-input" placeholder="Клиент / бренд" /></div></section>
      </div>

      <div class="campaign-layout">
        <section class="panel"><div class="panel-head"><div><h2>Подбор пабликов</h2><p>Выберите конкретные площадки</p></div></div><div class="table-wrap"><table class="selection-table"><thead><tr><th>Паблик</th><th>Прогноз</th><th>CPM</th><th>Себестоимость</th><th>Продажа</th><th>Цена клиенту</th><th>Чистая маржа</th><th>В подборку</th></tr></thead><tbody id="selectionTable"></tbody></table></div></section>
        <section class="panel forecast-panel"><span class="pill neutral">Прогноз подборки</span><h2>Итог</h2><div class="forecast-big" id="campaignClientPrice">—</div><p>итоговая цена для клиента</p>
          <div class="forecast-lines">
            <div><span>Пабликов</span><b id="campaignPublishers">—</b></div>
            <div><span>Себестоимость</span><b id="campaignCost">—</b></div>
            <div><span>Базовая цена продажи</span><b id="campaignBaseSale">—</b></div>
            <div><span>Налоги и комиссии</span><b id="campaignCharges">—</b></div>
            <div><span>Чистая маржа</span><b id="campaignMargin">—</b></div>
            <div><span>Маржинальность</span><b id="campaignMarginPct">—</b></div>
            <div><span>Ожидаемые просмотры</span><b id="campaignViews">—</b></div>
            <div><span>CPM</span><b id="campaignCpm">—</b></div>
          </div>
          <div class="metrics-panel"><h3>Какие столбцы вывести в PDF</h3><div id="metricChecks" class="metric-checks">
            <label class="metric-check"><input type="checkbox" value="city" checked><span><b>Город</b><span>география</span></span></label>
            <label class="metric-check"><input type="checkbox" value="followers" checked><span><b>Подписчики</b><span>аудитория</span></span></label>
            <label class="metric-check"><input type="checkbox" value="views" checked><span><b>Прогноз просмотров</b><span>ожидаемый результат</span></span></label>
            <label class="metric-check"><input type="checkbox" value="er"><span><b>ER</b><span>вовлечённость</span></span></label>
            <label class="metric-check"><input type="checkbox" value="cpm" checked><span><b>CPM</b><span>стоимость 1 000 просмотров</span></span></label>
            <label class="metric-check"><input type="checkbox" value="cost"><span><b>Себестоимость</b><span>внутренняя цена</span></span></label>
            <label class="metric-check"><input type="checkbox" value="baseSale" checked><span><b>Цена продажи</b><span>базовая цена</span></span></label>
            <label class="metric-check"><input type="checkbox" value="clientPrice" checked><span><b>Цена клиенту</b><span>с надбавками</span></span></label>
            <label class="metric-check"><input type="checkbox" value="charges"><span><b>Налоги/комиссии</b><span>сумма выбранных расходов</span></span></label>
            <label class="metric-check"><input type="checkbox" value="margin"><span><b>Чистая маржа</b><span>после себестоимости и расходов</span></span></label>
            <label class="metric-check"><input type="checkbox" value="marginPct"><span><b>Маржинальность</b><span>процент от цены клиенту</span></span></label>
            <label class="metric-check"><input type="checkbox" value="risk"><span><b>Authenticity Risk</b><span>если есть данные анализа</span></span></label>
          </div><button id="downloadPdfBtn" class="primary-button pdf-button">Скачать подборку в PDF</button><div id="pdfStatus" class="audit-status"></div></div>
        </section>
      </div>
    </section>`);