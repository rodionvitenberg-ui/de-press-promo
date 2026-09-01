/**
 * Based on the original page snapshot (technical foundation).
 * Content is being replaced with de-press.co's own; do not ship the original as-is.
 */
export const BODY_CLASS = "lock-scroll";
export const DATA_THEME = "contact";
export const DATA_PAGE = "contact";
export const PAGE_TITLE = "Связаться — de-press";
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
                      
                      
        <li class="site-menu-item"><a href="/values/" class="">Принципы</a></li>
                                        
        <li class="site-menu-item"><a href="/contact/" class="is-active">Связаться</a></li>
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
          <main data-router-view="contact" role="main" data-sentences=''>
    <h1 class="u-visually-hidden">Написать нам</h1>

    <div class="js-sentences u-hidden">
      ["Если тебе тоже тесно в лентах — напиши нам",
"Если хочешь помогать слышать — напиши нам",
"Если умеешь слушать без советов — напиши нам",
"Если хочешь в пилот — напиши нам",
"Если можешь поддержать проект — напиши нам",
"Если умеешь кодить — напиши нам",
"Если умеешь рисовать облачка — напиши нам",
"Если видишь дыру в приватности — напиши нам",
"Если хочешь переводить тишины — напиши нам",
"Если умеешь писать бережно — напиши нам",
"Если просто хочешь сказать привет — напиши нам",
"Если тебе плохо прямо сейчас — открой /safety",
"Если кризис — сразу 112 или 103",
"Если хочешь модерировать тишину — напиши нам",
"Если веришь, что помощь без лайков возможна — напиши нам",
"Если устал от токсичной позитивности — напиши нам",
"Если хочешь тестировать Anti-Panic — напиши нам",
"Если умеешь делать доступно — напиши нам",
"Если знаешь, как звучит «Я слышу тебя» на твоём языке — напиши нам",
"Если у тебя есть похожая история — напиши нам",
"Если хочешь стать Helper’ом — напиши нам",
"Если умеешь слышать молчание — напиши нам",
"Если тебя тошнит от рейтингов — напиши нам",
"Если хочешь помочь с открытым кодом — напиши нам",
"Если умеешь рисовать сцены — напиши нам",
"Если пишешь тексты, от которых легче — напиши нам",
"Если хочешь в команду исследования — напиши нам",
"Если умеешь считать честные метрики — напиши нам",
"Если задумался о приватности данных — напиши нам",
"Если хочешь просто почитать — начни с /values/",
"Если дочитал до конца — точно напиши нам",
"Если не знаешь, что написать — просто «привет»",
"Если завтра будет тяжело — /safety рядом",
"Если готов(а) — напиши нам"]
    </div>

    <picture class="contact-background js-in-view appear-fade">
      <source data-srcset="/static/assets/images/contact/background-xxs.png" media="(max-width: 450px)">
      <source data-srcset="/static/assets/images/contact/background-m.png" media="(max-width: 815px)">
      <source data-srcset="/static/assets/images/contact/background-l.png" media="(max-width: 1030px)">
      <img data-src="/static/assets/images/contact/background-xl.png" class="js-lazy" alt="">
    </picture>

    <div class="center js-in-view">

      <p class="contact-title"><span class="js-typed"></span></p>

      <div class="contact-footer js-in-view">
        <div class="contact-footer__title">
          <a href="mailto:hello@de-press.co" class="contact-email appear-fade-up">hello@de-press.co</a>

          <ul>
            <li><a href="https://t.me/depresscoofficial" target="_blank">Telegram</a></li>
            <li><a href="https://x.com/soshallitbe5" target="_blank">X</a></li>
            <li><a href="mailto:hello@de-press.co" target="_blank">E-mail</a></li>
            <li><a href="/values/" target="_blank">Дайджест</a></li>
            <li><a href="https://github.com/rodionvitenberg-ui/de-press.co" target="_blank">GitHub</a></li>
          </ul>
        </div>

        <div class="contact-countries">
          <div class="contact-country appear-fade-up appear-delay--1">
            <a href="https://maps.app.goo.gl/QLrbQe5WPhrRh58b9" target="_blank" class="contact-country__link" aria-label="Тишина"></a>

            <div class="contact-country__text">
              <h2>Тишина <b>.</b></h2>
              <p>Тишина: здесь нет лент и рейтингов. Облачко — монолог, «Я слышу тебя», тихие фразы и похожая история.</p>
            </div>

                      </div>

          <div class="contact-country appear-fade-up appear-delay--2">
            <a href="https://maps.app.goo.gl/pFgX1QnHKBYaRA3m9" target="_blank" class="contact-country__link" aria-label="Эмпатия"></a>

            <div class="contact-country__text">
              <h2>Эмпатия <b>.</b></h2>
              <p>Эмпатия: Helper’ы читают и слышат. Чат начинает только автор. ИИ помечен всегда.</p>
            </div>

                      </div>

          <div class="contact-country appear-fade-up appear-delay--3">
            <a href="https://maps.app.goo.gl/pM9YBEdDGppzd3Po6" target="_blank" class="contact-country__link" aria-label="Забота"></a>

            <div class="contact-country__text">
              <h2>Забота <b>.</b></h2>
              <p>Забота: при кризисе — 112, 103 и страница /safety. Это не медицина, и мы честно об этом говорим.</p>
            </div>

                      </div>
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
