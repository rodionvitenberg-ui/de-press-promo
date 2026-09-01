/**
 * Based on the original page snapshot (technical foundation).
 * Content is being replaced with de-press.co's own; do not ship the original as-is.
 */
export const BODY_CLASS = "lock-scroll";
export const DATA_THEME = "values";
export const DATA_PAGE = "values";
export const PAGE_TITLE = "Принципы — de-press";
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
                      
        <li class="site-menu-item"><a href="/about/" class="">О проекте</a></li>
                      
        <li class="site-menu-item"><a href="/" class="">Истории</a></li>
                      
                                        
        <li class="site-menu-item"><a href="/values/" class="is-active">Принципы</a></li>
                      
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
          <main data-router-view="values" role="main">
    <h1 class="u-visually-hidden">Принципы</h1>

        <section class="values-hero">
  <h2 class="u-visually-hidden">Потому что культура — это не фича в роадмапе</h2>

  
  <div class="center">
    <header class="values-hero-header js-in-view">
      <p class="values-headline appear-fade-up">Во что мы верим</p>
      <p class="values-title fx-parent">
<!--DP:FX:values-culture-->
</p>
    </header>

        <div class="values-hero-content js-in-view">
      <p class="values-headline appear-fade-up">Для начала</p>
      <p class="values-text appear-fade-up appear-delay--2">Всё, что мы строим, проходит через десять принципов. Через «не надо» и «зачем». Через тишину и уважение.</p>
    </div>
  </div>
</section>

        <section class="values-list">

  <div class="center">
    <header class="values-list-header js-in-view">
      <h2 class="u-visually-hidden">Нет, это не правила ради правил...</h2>

      <img data-src="/static/assets/images/values/background-leaves-1.png" class="leaves leaves--1 js-lazy" />

      <p class="values-title fx-parent">
<!--DP:FX:values-tgif-->
</p>

      <p class="values-subtitle appear-fade appear-delay--7">Дальше — сами принципы...</p>
    </header>

    <div class="values-list-items">
      <img data-src="/static/assets/images/values/background-leaves-2.png" class="leaves leaves--2 js-lazy" />

      <div class="values-list-row js-in-view">
        <article class="values-item values-item--1 appear-fade-up appear-delay--1">
  <header class="values-item-header">
    <p class="values-item-index"><span class="values-item-cross"></span> 01 /</p>
    <h3 class="values-item-title">Расти<br /> вместе с людьми,<br /> а не с лентой</h3>
  </header>

  <p class="values-item-text">Боль не собирает очки. Мы убираем механики, которые превращают чужую историю в соревнование.</p>
</article>

        <article class="values-item values-item--2 appear-fade-up appear-delay--2">
  <header class="values-item-header">
    <p class="values-item-index"><span class="values-item-cross"></span> 02 /</p>
    <h3 class="values-item-title">Каждый отвечает<br /> за свою<br /> тишину</h3>
  </header>

  <p class="values-item-text">Под чужой историей не место спорам. Только тихие фразы и резонанс — всё остальное приватно.</p>
</article>
      </div>

      <div class="values-list-row js-in-view">
        <article class="values-item values-item--3 appear-fade-up appear-delay--1">
  <header class="values-item-header">
    <p class="values-item-index"><span class="values-item-cross"></span> 03 /</p>
    <h3 class="values-item-title">Гибко —<br /> и по-человечески<br /> бережно</h3>
  </header>

  <p class="values-item-text">Диалог — это приглашение, а не вторжение. Автор решает, кому ответить: accept или Author Outreach.</p>
</article>

        <article class="values-item values-item--4 appear-fade-up appear-delay--2">
  <header class="values-item-header">
    <p class="values-item-index"><span class="values-item-cross"></span> 04 /</p>
    <h3 class="values-item-title">Всегда<br /> рядом — онлайн</h3>
  </header>

  <p class="values-item-text">Без скрытых роботов-собеседников, без диагнозов, без toxic positivity. Помощь машины — только с честной меткой.</p>
</article>
      </div>

      <div class="values-list-row js-in-view">
        <article class="values-item values-item--5 appear-fade-up appear-delay--1">
  <header class="values-item-header">
    <p class="values-item-index"><span class="values-item-cross"></span> 05 /</p>
    <h3 class="values-item-title">В помощь верь,<br /> но проверяй</h3>
  </header>

  <p class="values-item-text">Эмоциональные карты живут на устройстве пользователя (ZK). Сервер не видит и не хранит карту твоих состояний.</p>
</article>

        <article class="values-item values-item--6 appear-fade-up appear-delay--2">
  <header class="values-item-header">
    <p class="values-item-index"><span class="values-item-cross"></span> 06 /</p>
    <h3 class="values-item-title">Без привязки<br /> к платформе —<br /> открытый код</h3>
  </header>

  <p class="values-item-text">Когда плохо — не время охватов. Режим тишины и путь к /safety всегда важнее любого realtime.</p>
</article>

        <article class="values-item values-item--7 appear-fade-up appear-delay--3">
  <header class="values-item-header">
    <p class="values-item-index"><span class="values-item-cross"></span> 07 /</p>
    <h3 class="values-item-title">Развиваемся<br /> тихо и постоянно</h3>
  </header>

  <p class="values-item-text">Мы не экстренная служба. При кризисе — 112, 103 и страница /safety. Это не отговорка, это честность.</p>
</article>
      </div>

      <div class="values-list-row values-list-row--right js-in-view">
        <article class="values-item values-item--8 appear-fade-up appear-delay--1">
  <header class="values-item-header">
    <p class="values-item-index"><span class="values-item-cross"></span> 08 /</p>
    <h3 class="values-item-title">Ценим долгие<br /> и тихие истории</h3>
  </header>

  <p class="values-item-text">Helper — слушающий человек, а не врач. Мы не заменяем терапию и не притворяемся, что заменяем.</p>
</article>

        <article class="values-item values-item--9 appear-fade-up appear-delay--2">
  <header class="values-item-header">
    <p class="values-item-index"><span class="values-item-cross"></span> 09 /</p>
    <h3 class="values-item-title">Всё решает честный<br /> разговор</h3>
  </header>

  <p class="values-item-text">Прозрачность — основа.<br /> Никаких скрытых механик, тёмных паттернов и невидимых манипуляторов: как работает платформа, видно всем. Открытость — это и есть помощь.</p>
</article>
      </div>

      <div class="values-list-row values-list-row--center js-in-view">
        <article class="values-item values-item--10 appear-fade-up appear-delay--1">
  <header class="values-item-header">
    <p class="values-item-index"><span class="values-item-cross"></span> 10 /</p>
    <h3 class="values-item-title">Мы слышим<br /> тебя</h3>
  </header>

  <p class="values-item-text">Не на каждое сообщение нужен ответ. Присутствие без слов — тоже поддержка. Всё в заголовке.</p>
</article>
      </div>
    </div>

    <footer class="values-list-footer js-in-view">
      <h2 class="u-visually-hidden">Мы всегда рады тем, кто умеет слышать</h2>

      <img data-src="/static/assets/images/values/background-leaves-3.png" class="leaves leaves--3 js-lazy" />

      <p class="values-title fx-parent">
<!--DP:FX:values-hiring-->
</p>

      <a href="mailto:hello@de-press.co" class="values-link link link--under" title="Как помогать">
        <span class="link-label">Как помогать</span>
        <span class="link-line"></span>
        <span class="link-line--anim"></span>
      </a>
    </footer>
  </div>
</section>
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
