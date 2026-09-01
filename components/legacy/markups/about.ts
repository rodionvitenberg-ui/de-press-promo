/**
 * Based on the original page snapshot (technical foundation).
 * Content is being replaced with de-press.co's own; do not ship the original as-is.
 */
export const BODY_CLASS = "lock-scroll";
export const DATA_THEME = "about";
export const DATA_PAGE = "about";
export const PAGE_TITLE = "О проекте — de-press";
export const MARKUP = `<!-- Wrapper -->
    <div class="site-wrapper">
              <div class="site-header">
  <div class="site-header-title">
    <a href="/" class="site-header-logo" title="На главную — de-press">
      <span class="dp-logo">de-press<span class="dp-logo-tld">.co</span></span>
    </a>
  </div>

  <a href="/safety/" class="site-header-posts">  <span class="svg svg-caret-left">
  	<svg width="6" height="11">
    	<use xlink:href="/static/assets/spritesheet.svg#caret-left"></use> 
  	</svg>
  </span>
 Безопасность</a>
  <a href="/" class="site-header-cases">  <span class="svg svg-caret-left">
  	<svg width="6" height="11">
    	<use xlink:href="/static/assets/spritesheet.svg#caret-left"></use> 
  	</svg>
  </span>
 Как устроено</a>

  <button type="button" class="site-header-button" title="Открыть меню">
    <span class="u-visually-hidden">Открыть меню</span>
    <span class="button-bar button-bar--1"></span>
    <span class="button-bar button-bar--2"></span>
    <span class="button-bar button-bar--3"></span>
  </button>
</div>
      
              <!-- site-loader: preloader UI removed; empty stub kept because legacy main.js binds to these nodes -->
<div class="site-loader">
  <div class="site-loader-content">
    <span class="site-loader-sprite"></span>
    <div class="site-loader-progress">
      <svg>
        <circle r="67" cx="68" cy="68" class="site-loader-stroke"></circle>
        <circle r="67" cx="68" cy="68" class="site-loader-percent"></circle>
      </svg>
    </div>
  </div>
</div>
      
      <div class="scene-root">
    <div class="ruler ruler--top"></div>
  <div class="ruler ruler--bottom"></div>

    <div class="ruler ruler--1190"></div>
  <div class="ruler ruler--1024"></div>

    <div class="scene-root-inner"></div>
</div>
      
<picture class="site-menu-back">
  <source data-srcset="/static/assets/images/menu/background-xxs.png" media="(max-width: 450px)">
  <source data-srcset="/static/assets/images/menu/background-m.png" media="(max-width: 815px)">
  <source data-srcset="/static/assets/images/menu/background-l.png" media="(max-width: 1030px)">
  <img data-src="/static/assets/images/menu/background-xl.png" class="js-lazy" alt="">
</picture>

<div class="site-menu-panel"></div>

<div class="site-menu">
  <div class="center">
    <ul class="site-menu-list">
                                        
        <li class="site-menu-item"><a href="/about/" class="is-active">О проекте</a></li>
                      
        <li class="site-menu-item"><a href="/" class="">Истории</a></li>
                      
                      
        <li class="site-menu-item"><a href="/values/" class="">Принципы</a></li>
                      
        <li class="site-menu-item"><a href="/contact/" class="">Связаться</a></li>
          </ul>

    <div class="site-menu-footer">

      <div class="site-menu-content">
        <p class="site-menu-slogan">Don't cry alone</p>
        <ul>
          <li>
            <a href="https://t.me/depresscoofficial" target="_blank">
              <span class="u-from-mobile">
                  <span class="svg svg-facebook">
  	<svg width="12" height="12">
    	<use xlink:href="/static/assets/spritesheet.svg#facebook"></use> 
  	</svg>
  </span>

              </span>
              <span class="u-from-desktop">Telegram</span>
            </a>
          </li>
          <li>
            <a href="https://x.com/soshallitbe5" target="_blank">
              <span class="u-from-mobile">
                  <span class="svg svg-x">
  	<svg width="12" height="12">
    	<use xlink:href="/static/assets/spritesheet.svg#x"></use> 
  	</svg>
  </span>

              </span>
              <span class="u-from-desktop">X</span>
            </a>
          </li>
          <li>
            <a href="https://github.com/rodionvitenberg-ui/de-press.co" target="_blank">
              <span class="u-from-mobile">
                  <span class="svg svg-dribbble">
  	<svg width="12" height="12">
    	<use xlink:href="/static/assets/spritesheet.svg#dribbble"></use> 
  	</svg>
  </span>

              </span>
              <span class="u-from-desktop">GitHub</span>
            </a>
          </li>
          <li>
            <a href="mailto:hello@de-press.co" target="_blank">
              <span class="u-from-mobile">
                  <span class="svg svg-twitter">
  	<svg width="12" height="12">
    	<use xlink:href="/static/assets/spritesheet.svg#twitter"></use> 
  	</svg>
  </span>

              </span>
              <span class="u-from-desktop">E-mail</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
      
      <div class="site-container" data-router-wrapper>
          <main data-router-view="about" role="main">
    <picture class="about-background js-in-view appear-fade">
      <source data-srcset="/static/assets/images/about/background-xxs.png" media="(max-width: 450px)">
      <source data-srcset="/static/assets/images/about/background-m.png" media="(max-width: 815px)">
      <source data-srcset="/static/assets/images/about/background-l.png" media="(max-width: 1030px)">
      <img data-src="/static/assets/images/about/background-xl.png" class="js-lazy" alt="">
    </picture>

    <div class="center">
      <header class="about-header about-header--1 js-in-view">
        <h1 class="u-visually-hidden">Мы строим тихую гавань — без лайков и рейтингов</h1>


        <p class="about-headline about-headline--blue appear-fade-up">Наше обязательство</p>
        <p class="about-title about-title--large fx-parent">
<!--DP:FX:about-intro-->
</p>
      </header>

      <div class="about-item about-item--1 js-in-view">
        <p class="about-headline appear-fade-up">Для начала</p>
        <p class="about-tagline appear-fade-up appear-delay--2">de-press — эмпатичная платформа для эмоциональной поддержки. Наша миссия — исследовать, как тишина, истории и контроль автора заменяют механику лайков и рейтингов.</p>
      </div>

      <div class="about-item about-item--2 js-in-view">
        
        <p class="about-title about-title--small appear-fade-up">И что это значит?</p>
        <div class="about-text typeset appear-fade-up appear-delay--2">
          <p>Мы верим в силу истории и присутствия: «Я слышу тебя» заменяет лайк, тихая фраза — комментарий, а решение всегда за автором истории.</p>
          <p>Устал читать одинаковые описания проектов, которые притворяются другими?<br> Хорошая новость: мы тоже. Поэтому сразу к делу — как устроена помощь здесь.</p>
        </div>
      </div>

      <div class="about-products">
        <ul class="about-products-list">
          <li class="about-products-item js-in-view appear-fade-right">Нет публичных лайков и рейтингов</li>
          <li class="about-products-item js-in-view appear-fade-right">Нет публичных комментариев</li>
          <li class="about-products-item js-in-view appear-fade-right">Чат инициирует только автор</li>
          <li class="about-products-item js-in-view appear-fade-right">Открытые технологии<br><small>(открытый код, ИИ с честной меткой, WebRTC)</small></li>
          <li class="about-products-item js-in-view appear-fade-right">Эмоциональные карты — только на устройстве</li>
          <li class="about-products-item js-in-view appear-fade-right">Anti-Panic важнее ленты</li>
          <li class="about-products-item js-in-view appear-fade-right">Helper ≠ терапевт по умолчанию</li>
        </ul>
        <a href="/" class="link link--caret js-in-view">
          <span class="link--caret-text">Смотреть, как устроено</span>
            <span class="svg svg-caret-right">
  	<svg width="7" height="11">
    	<use xlink:href="/static/assets/spritesheet.svg#caret-right"></use> 
  	</svg>
  </span>

        </a>
      </div>

      <header class="about-header about-header--2 js-in-view">
        <h2 class="u-visually-hidden">Инварианты и решения. Да, снова принципы.</h2>

        <p class="about-headline appear-fade-up">Что уже решено</p>
    
        <p class="about-title fx-parent">
<!--DP:FX:about-swagger-->
</p>
      </header>

      <div class="about-item about-item--3 js-in-view appear-fade-up">
        <div class="about-text typeset">
          <p>Таблица — это наши принципы и статус проекта: что принято навсегда, что в работе, чего не будет. Не награды — обещания.</p>
        </div>
      </div>

      <div class="about-table js-in-view appear-fade-up">

        <div class="about-table-inner">
          <table cellpadding="0" cellspacing="0">
            <thead>
              <tr>
                <th>Год</th>
                <th>Решение</th>
                <th>Статус</th>
                <th>Суть</th>
                <th>Комментарий</th>
              </tr>
            </thead>

            <tbody>
                <tr>
                  <td data-after="">2024</td>
                  <td data-after="старт">Проект</td>
                  <td data-after="">Родился</td>
                  <td data-after="">de-press переосмыслен как «тихая гавань»</td>
                  <td data-after="">Некоммерческий, открытый код</td>
                </tr>
                <tr>
                  <td data-after="">2025</td>
                  <td data-after="инвариант">Лайки</td>
                  <td data-after="">Навсегда отменены</td>
                  <td data-after="">Нет публичных лайков и рейтингов страдания</td>
                  <td data-after="">Боль не собирает очки</td>
                </tr>
                <tr>
                  <td data-after="">2025</td>
                  <td data-after="инвариант">Комментарии</td>
                  <td data-after="">Навсегда отменены</td>
                  <td data-after="">Нет публичных комментариев под историей</td>
                  <td data-after="">Только тихие фразы</td>
                </tr>
                <tr>
                  <td data-after="">2025</td>
                  <td data-after="инвариант">Чат</td>
                  <td data-after="">Принято</td>
                  <td data-after="">Чат инициирует только автор</td>
                  <td data-after="">accept или Author Outreach</td>
                </tr>
                <tr>
                  <td data-after="">2025</td>
                  <td data-after="инвариант">ИИ</td>
                  <td data-after="">Принято</td>
                  <td data-after="">ИИ всегда помечен</td>
                  <td data-after="">Без диагнозов и toxic positivity</td>
                </tr>
                <tr>
                  <td data-after="">2025</td>
                  <td data-after="инвариант">Карты эмоций</td>
                  <td data-after="">Принято</td>
                  <td data-after="">Только на устройстве пользователя</td>
                  <td data-after="">ZK: сервер не видит</td>
                </tr>
                <tr>
                  <td data-after="">2025</td>
                  <td data-after="инвариант">Anti-Panic</td>
                  <td data-after="">Принято</td>
                  <td data-after="">Важнее ленты и realtime</td>
                  <td data-after="">Тишина важнее охвата</td>
                </tr>
                <tr>
                  <td data-after="">2025</td>
                  <td data-after="инвариант">Кризис</td>
                  <td data-after="">Принято</td>
                  <td data-after="">112/103 и страница /safety</td>
                  <td data-after="">Честность вместо запретов</td>
                </tr>
                <tr>
                  <td data-after="">2025</td>
                  <td data-after="инвариант">Helper</td>
                  <td data-after="">Принято</td>
                  <td data-after="">Helper ≠ терапевт</td>
                  <td data-after="">Присутствие, не лечение</td>
                </tr>
                <tr>
                  <td data-after="">2025</td>
                  <td data-after="не будет">Треды</td>
                  <td data-after="">Отменено</td>
                  <td data-after="">Публичные обсуждения историй</td>
                  <td data-after="">Приватно всё, кроме тишины</td>
                </tr>
                <tr>
                  <td data-after="">2025</td>
                  <td data-after="не будет">Карта травм</td>
                  <td data-after="">Отменено</td>
                  <td data-after="">Серверное хранение состояний</td>
                  <td data-after="">Только устройство</td>
                </tr>
                <tr>
                  <td data-after="">2025</td>
                  <td data-after="не будет">AI-peer</td>
                  <td data-after="">Отменено</td>
                  <td data-after="">Скрытые роботы-собеседники</td>
                  <td data-after="">Только помеченный ИИ</td>
                </tr>
                <tr>
                  <td data-after="">2025</td>
                  <td data-after="не будет">Open matching</td>
                  <td data-after="">Отменено</td>
                  <td data-after="">Публичный поиск собеседников</td>
                  <td data-after="">Решение за автором</td>
                </tr>
                <tr>
                  <td data-after="">2025</td>
                  <td data-after="не будет">Голосовые</td>
                  <td data-after="">Отменено</td>
                  <td data-after="">WebRTC-комнаты</td>
                  <td data-after="">Слишком шумно</td>
                </tr>
                <tr>
                  <td data-after="">2026</td>
                  <td data-after="в работе">GL-модуль</td>
                  <td data-after="">Пишется</td>
                  <td data-after="">Собственная сцена вместо бандлов</td>
                  <td data-after="">API 1:1 SceneGL</td>
                </tr>
                <tr>
                  <td data-after="">2026</td>
                  <td data-after="в работе">Сцена</td>
                  <td data-after="">Пишется</td>
                  <td data-after="">JSON-стейты: камера, сплайны, matcap</td>
                  <td data-after="">Catmull-Rom</td>
                </tr>
                <tr>
                  <td data-after="">2026</td>
                  <td data-after="в работе">Нарратив</td>
                  <td data-after="">Пишется</td>
                  <td data-after="">История проекта вместо кейсов</td>
                  <td data-after=""></td>
                </tr>
                <tr>
                  <td data-after="">2026</td>
                  <td data-after="в работе">Модель</td>
                  <td data-after="">Ищем</td>
                  <td data-after="">Собственная 3D-модель</td>
                  <td data-after=""></td>
                </tr>
                <tr>
                  <td data-after="">2026</td>
                  <td data-after="готово">/safety</td>
                  <td data-after="">Живёт</td>
                  <td data-after="">Кризисная страница 112/103</td>
                  <td data-after=""></td>
                </tr>
                <tr>
                  <td data-after="">2026</td>
                  <td data-after="в работе">Промо</td>
                  <td data-after="">Пишется</td>
                  <td data-after="">Тексты и метаданные страниц</td>
                  <td data-after=""></td>
                </tr>
                <tr>
                  <td data-after="">2026</td>
                  <td data-after="решение">Приватность</td>
                  <td data-after="">Принято</td>
                  <td data-after="">Минимум данных, без трекеров</td>
                  <td data-after="">Навсегда</td>
                </tr>
                <tr>
                  <td data-after="">2026</td>
                  <td data-after="решение">Хостинг</td>
                  <td data-after="">Принято</td>
                  <td data-after="">Без рекламы и продажи данных</td>
                  <td data-after="">Навсегда</td>
                </tr>
                <tr>
                  <td data-after="">2026</td>
                  <td data-after="в работе">Доступность</td>
                  <td data-after="">Пишется</td>
                  <td data-after="">Контраст, клавиатура, читаемость</td>
                  <td data-after=""></td>
                </tr>
                <tr>
                  <td data-after="">2026</td>
                  <td data-after="идея">Локализация</td>
                  <td data-after="">Открыто</td>
                  <td data-after="">Сначала русский, потом English</td>
                  <td data-after=""></td>
                </tr>
                <tr>
                  <td data-after="">2026</td>
                  <td data-after="открыто">Исследование</td>
                  <td data-after="">Идёт</td>
                  <td data-after="">Что помогает: слушание vs советы</td>
                  <td data-after=""></td>
                </tr>
                <tr>
                  <td data-after="">2026</td>
                  <td data-after="скоро">Пилот</td>
                  <td data-after="">2026</td>
                  <td data-after="">Закрытый пилот сообщества</td>
                  <td data-after="">Стучитесь на /contact/</td>
                </tr>
                <tr>
                  <td data-after="">2026</td>
                  <td data-after="дизайн">Hearers</td>
                  <td data-after="">Рисуем</td>
                  <td data-after="">Виден только автору облачка</td>
                  <td data-after=""></td>
                </tr>
                <tr>
                  <td data-after="">2026</td>
                  <td data-after="дизайн">Pulse</td>
                  <td data-after="">Рисуем</td>
                  <td data-after="">Пульс истории — только автору</td>
                  <td data-after=""></td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>

      <button class="about-table-more js-table-expand">Смотреть ещё   <span class="svg svg-cross">
  	<svg width="12" height="12">
    	<use xlink:href="/static/assets/spritesheet.svg#cross"></use> 
  	</svg>
  </span>
</button>

      <div class="about-item about-item--4 js-in-view">
        <p class="about-headline appear-fade-up">Для начала</p>
        <p class="about-tagline appear-fade-up appear-delay--2">Наша цель — бережные опыты, о которых хочется рассказать тихо: без лайков и рейтингов, но с реальной пользой для тех, кому сейчас трудно.</p>
      </div>

      <div class="about-item about-item--5 js-in-view">
        <h2 class="about-title about-title--small appear-fade-up">Тишина — в деталях</h2>
        <div class="about-text typeset appear-fade-up appear-delay--2">
          <p>«Будь гибкой, но держись своих принципов» — тут Элеонора права.<br> Наш уклад вырос из опыта: успехов и провалов, тихих смен и чужих историй. Чем глубже понимаешь чужую боль, тем бережнее должна быть помощь. Вот и весь принцип.</p>
        </div>
      </div>

      <div class="about-item about-item--6 js-in-view appear-fade-up">
        
        <h2 class="about-title about-title--small appear-fade-up">Как здесь устроено </h2>
        <div class="about-text typeset appear-fade-up appear-delay--2">
          <p>Мы знаем своё дело, но не твою историю — и это правильно: настоящая помощь начинается со знакомства. Работать можно только вместе: с автором, с Helper’ами и теми, кто просто рядом (даже если это ночная переписка)</p>
          <p>Прежде чем что-то делать, мы всегда начинаем со знакомства.</p>
        </div>
      </div>

      <div class="about-item about-item--7 js-in-view appear-fade-up">
        <div class="about-text typeset">
          <p>Твоя история, твои ожидания, твой темп и твои границы — всё это важно, вплоть до любимого чая.</p>
          <p>Если тебе нужен просто исполнитель задач — без доверия и разговора, честно покажем, куда идти дальше.</p>
        </div>

        <a href="/values/" class="link link--caret">
          <span class="link--caret-text">Ещё о принципах</span>
            <span class="svg svg-caret-right">
  	<svg width="7" height="11">
    	<use xlink:href="/static/assets/spritesheet.svg#caret-right"></use> 
  	</svg>
  </span>

        </a>
      </div>

      <header class="about-header about-header--3 js-in-view">
        <h2 class="u-visually-hidden">Кто с нами</h2>

        <p class="about-headline appear-fade-up">Нам доверяют истории</p>
        <p class="about-title">
<!--DP:FX:about-clients-->
</p>
      </header>

      <div class="about-clients">
                  <div class="about-clients-item js-in-view appear-fade-up">
            <img src="/app/uploads/2019/02/Group-4590.png" alt="" />
          </div>
                  <div class="about-clients-item js-in-view appear-fade-up">
            <img src="/app/uploads/2019/02/Group-4581.png" alt="" />
          </div>
                  <div class="about-clients-item js-in-view appear-fade-up">
            <img src="/app/uploads/2019/02/Group-4589.png" alt="" />
          </div>
                  <div class="about-clients-item js-in-view appear-fade-up">
            <img src="/app/uploads/2019/02/Group-4591.png" alt="" />
          </div>
                  <div class="about-clients-item js-in-view appear-fade-up">
            <img src="/app/uploads/2019/02/Group-4577.png" alt="" />
          </div>
                  <div class="about-clients-item js-in-view appear-fade-up">
            <img src="/app/uploads/2019/02/Group-4585.png" alt="" />
          </div>
                  <div class="about-clients-item js-in-view appear-fade-up">
            <img src="/app/uploads/2019/02/Group-4584.png" alt="" />
          </div>
                  <div class="about-clients-item js-in-view appear-fade-up">
            <img src="/app/uploads/2019/02/Group-4579.png" alt="" />
          </div>
                  <div class="about-clients-item js-in-view appear-fade-up">
            <img src="/app/uploads/2019/02/Group-4587.png" alt="" />
          </div>
                  <div class="about-clients-item js-in-view appear-fade-up">
            <img src="/app/uploads/2019/02/Group-4583.png" alt="" />
          </div>
                  <div class="about-clients-item js-in-view appear-fade-up">
            <img src="/app/uploads/2019/02/Group-4588.png" alt="" />
          </div>
                  <div class="about-clients-item js-in-view appear-fade-up">
            <img src="/app/uploads/2019/02/Group-4578.png" alt="" />
          </div>
                  <div class="about-clients-item js-in-view appear-fade-up">
            <img src="/app/uploads/2019/02/Group-4582.png" alt="" />
          </div>
                  <div class="about-clients-item js-in-view appear-fade-up">
            <img src="/app/uploads/2019/02/Group-4580.png" alt="" />
          </div>
                  <div class="about-clients-item js-in-view appear-fade-up">
            <img src="/app/uploads/2019/02/Group-4586.png" alt="" />
          </div>
              </div>
    </div>
  </main>
      </div>

      <div class="site-cookie js-cookie">
  <p class="site-cookie__text">
    Здесь нет рекламных трекеров и аналитики. Работает только необходимое — без этого сайт не откроется. Продолжая, ты соглашаешься с этим. <a href="/values/" target="_blank">Подробнее о приватности</a>.
  </p>

  <div class="site-cookie__buttons">
    <button type="button" class="site-cookie__button js-cookie-accept">Хорошо</button>
    <button type="button" class="site-cookie__button js-cookie-deny">Отклонить</button>
  </div>
</div>

              

<div class="site-footer js-in-view">
  <div class="center">
    <div class="site-footer-top">
      <div class="site-footer-block site-footer-block--address appear-fade-up">
        <h3>Тишина <b>.</b></h3>
              </div>

      <div class="site-footer-block site-footer-block--address appear-fade-up appear-delay--1">
        <h3>Эмпатия <b>.</b></h3>
              </div>

      <div class="site-footer-block site-footer-block--address appear-fade-up appear-delay--2">
        <h3>Забота <b>.</b></h3>
              </div>

      
      
      <div class="site-footer-block site-footer-block--social appear-fade-up appear-delay--3">
        <h2 class="site-footer-title">
          <span class="u-visually-hidden">Написать нам</span><span class="site-footer-slogan">Don't cry alone</span>
        </h2>

        <ul>
          <li>
            <a href="https://t.me/depresscoofficial" target="_blank">
              <span class="u-from-mobile">
                  <span class="svg svg-facebook">
  	<svg width="12" height="12">
    	<use xlink:href="/static/assets/spritesheet.svg#facebook"></use> 
  	</svg>
  </span>

              </span>
              <span class="u-from-desktop">Tg</span>
            </a>
          </li>
          <li>
            <a href="https://x.com/soshallitbe5" target="_blank">
              <span class="u-from-mobile">
                  <span class="svg svg-x">
  	<svg width="12" height="12">
    	<use xlink:href="/static/assets/spritesheet.svg#x"></use> 
  	</svg>
  </span>

              </span>
              <span class="u-from-desktop">X</span>
            </a>
          </li>
          <li>
            <a href="https://github.com/rodionvitenberg-ui/de-press.co" target="_blank">
              <span class="u-from-mobile">
                  <span class="svg svg-dribbble">
  	<svg width="12" height="12">
    	<use xlink:href="/static/assets/spritesheet.svg#dribbble"></use> 
  	</svg>
  </span>

              </span>
              <span class="u-from-desktop">Gh</span>
            </a>
          </li>
          <li>
            <a href="mailto:hello@de-press.co" target="_blank">
              <span class="u-from-mobile">
                  <span class="svg svg-twitter">
  	<svg width="12" height="12">
    	<use xlink:href="/static/assets/spritesheet.svg#twitter"></use> 
  	</svg>
  </span>

              </span>
              <span class="u-from-desktop">@</span>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div class="site-footer-bottom">
      <p class="site-footer-contact appear-fade-up">
        Хочешь помочь проекту — напиши:
        <a href="mailto:hello@de-press.co">hello@de-press.co</a>
      </p>

      <div class="site-footer-right">
        <p class="site-footer-newsletter appear-fade-up appear-delay--4">
          <a href="/values/" target="_blank">
            Приватность
                      </a>
        </p>

        <div class="site-footer-languages appear-fade-up appear-delay--5">
          Язык:

                                <!--DP:LANGS-->
                  </div>
      </div>
    </div>
  </div>
</div>
          </div>

        






<!-- Support -->`;
