/**
 * Based on the original page snapshot (technical foundation).
 * Content is being replaced with de-press.co's own; do not ship the original as-is.
 */
export const BODY_CLASS = "lock-scroll";
export const DATA_THEME = "home";
export const DATA_PAGE = "home";
export const PAGE_TITLE = "de-press — тебя услышат";
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
          <main data-router-view="home" role="main">
    <h1 class="u-visually-hidden">de-press</h1>

    <picture class="home-background js-in-view appear-fade">
      <source data-srcset="/static/assets/images/home/background-xxs.png" media="(max-width: 450px)">
      <source data-srcset="/static/assets/images/home/background-m.png" media="(max-width: 815px)">
      <source data-srcset="/static/assets/images/home/background-l.png" media="(max-width: 1030px)">
      <img data-src="/static/assets/images/home/background-xl.png" class="js-lazy" alt="">
    </picture>

        
<section class="home-hero js-in-view">
  <h2 class="u-visually-hidden">Тебя услышат</h2>

  <div class="center">

    <p class="home-hero-title fx-parent">
<!--DP:FX:home-hero-->
</p>


    <div class="home-hero-content">
      <p class="lead">
        <span>de-press — тихая гавань</span>
        <span>для тех, кому сейчас</span>
        <span>эмоционально тяжело.</span>
      </p>

      <p>
        <span>Вместо лайков, рейтингов и публичных реакций —</span>
        <span>тишина, истории и человек рядом, который скажет:</span>
        <span>«Я слышу тебя».</span>
      </p>
      <a href="https://app.de-press.co" target="_blank" class="home-app-link link link--under">
        <span class="link-label">Открыть приложение</span>
        <span class="link-line"></span>
        <span class="link-line--anim"></span>
      </a>
      <ul>
        <li><a href="https://t.me/depresscoofficial" target="_blank">Telegram</a></li>
        <li><a href="https://x.com/soshallitbe5" target="_blank">X</a></li>
        <li><a href="https://github.com/rodionvitenberg-ui/de-press.co" target="_blank">GitHub</a></li>
        <li><a href="mailto:hello@de-press.co" target="_blank">E-mail</a></li>
      </ul>
    </div>
  </div>
</section>

        
<section class="home-cases">
  <div class="center">
    <h2 class="home-cases-title js-in-view appear-fade-up">Истории</h2>


    <ul class="home-cases-list js-cases-list">
              <li class="js-in-view appear-fade-up"><a href="/about/" data-theme="tomorrowland" data-matcap="18, 18"><span>Публичное</span> Монолог</a></li>
              <li class="js-in-view appear-fade-up"><a href="/about/" data-theme="navy-pier" data-matcap="7, 7"><span>Публичное</span> Я слышу тебя</a></li>
              <li class="js-in-view appear-fade-up"><a href="/about/" data-theme="msi-chicago" data-matcap="8, 8"><span>Публичное</span> Тихие фразы</a></li>
              <li class="js-in-view appear-fade-up"><a href="/about/" data-theme="this-was-louises-phone" data-matcap="11, 11"><span>Публичное</span> Похожая история</a></li>
              <li class="js-in-view appear-fade-up"><a href="/about/" data-theme="kikk-18" data-matcap="9, 9"><span>Автору</span> Pulse</a></li>
              <li class="js-in-view appear-fade-up"><a href="/about/" data-theme="the-kennedy-center" data-matcap="10, 10"><span>Автору</span> Hearers</a></li>
              <li class="js-in-view appear-fade-up"><a href="/about/" data-theme="orw" data-matcap="12, 12"><span>Безопасность</span> Anti-Panic</a></li>
          </ul>
  </div>

  <div class="home-cases-scenes">
          <div class="home-cases-scene home-cases-scene--tomorrowland">
        <h3 class="u-visually-hidden">Монолог</h3>

        <div class="inner">
          <a href="/about/" class="home-cases-link"><span class="u-visually-hidden">Монолог</span></a>

          <div class="home-cases-content">
                          <p class="home-cases-headline">Облачко</p>
            
            <p class="home-cases-name">Монолог</p>
            <p class="home-cases-text">
                            
                              <span class="home-cases-line">Твоя история — без лайков,</span>
                              <span class="home-cases-line">
без оценок и без гонки</span>
                              <span class="home-cases-line">
за вниманием.</span>
                          </p>
            <p class="link link--caret">
              <span class="link--caret-text">Подробнее</span>
                <span class="svg svg-caret-right">
  	<svg width="7" height="11">
    	<use xlink:href="/static/assets/spritesheet.svg#caret-right"></use> 
  	</svg>
  </span>

            </p>
          </div>

          <picture class="home-cases-picture">
            <source data-srcset="/static/assets/images/cases/tomorrowland/background-450.png" media="(max-width: 450px)">
            <source data-srcset="/static/assets/images/cases/tomorrowland/background-815.png" media="(max-width: 815px)">
            <source data-srcset="/static/assets/images/cases/tomorrowland/background-1015.png" media="(max-width: 1030px)">
            <img data-src="/static/assets/images/cases/tomorrowland/background-1440.png" alt="" class="js-lazy">
          </picture>
        </div>
      </div>
          <div class="home-cases-scene home-cases-scene--navy-pier">
        <h3 class="u-visually-hidden">Я слышу тебя</h3>

        <div class="inner">
          <a href="/about/" class="home-cases-link"><span class="u-visually-hidden">Я слышу тебя</span></a>

          <div class="home-cases-content">
                          <p class="home-cases-headline">Реакция</p>
            
            <p class="home-cases-name">Я слышу тебя</p>
            <p class="home-cases-text">
                            
                              <span class="home-cases-line">Единственная реакция здесь —</span>
                              <span class="home-cases-line">
не лайк, а присутствие:</span>
                              <span class="home-cases-line">
«я рядом, я услышал».</span>
                          </p>
            <p class="link link--caret">
              <span class="link--caret-text">Подробнее</span>
                <span class="svg svg-caret-right">
  	<svg width="7" height="11">
    	<use xlink:href="/static/assets/spritesheet.svg#caret-right"></use> 
  	</svg>
  </span>

            </p>
          </div>

          <picture class="home-cases-picture">
            <source data-srcset="/static/assets/images/cases/navy-pier/background-450.png" media="(max-width: 450px)">
            <source data-srcset="/static/assets/images/cases/navy-pier/background-815.png" media="(max-width: 815px)">
            <source data-srcset="/static/assets/images/cases/navy-pier/background-1015.png" media="(max-width: 1030px)">
            <img data-src="/static/assets/images/cases/navy-pier/background-1440.png" alt="" class="js-lazy">
          </picture>
        </div>
      </div>
          <div class="home-cases-scene home-cases-scene--msi-chicago">
        <h3 class="u-visually-hidden">Тихие фразы</h3>

        <div class="inner">
          <a href="/about/" class="home-cases-link"><span class="u-visually-hidden">Тихие фразы</span></a>

          <div class="home-cases-content">
                          <p class="home-cases-headline">Поддержка</p>
            
            <p class="home-cases-name">Тихие фразы</p>
            <p class="home-cases-text">
                            
                              <span class="home-cases-line">Короткие слова поддержки. </span>
                              <span class="home-cases-line">
Бережно, без споров </span>
                              <span class="home-cases-line">
и без публичных тредов.</span>
                          </p>
            <p class="link link--caret">
              <span class="link--caret-text">Подробнее</span>
                <span class="svg svg-caret-right">
  	<svg width="7" height="11">
    	<use xlink:href="/static/assets/spritesheet.svg#caret-right"></use> 
  	</svg>
  </span>

            </p>
          </div>

          <picture class="home-cases-picture">
            <source data-srcset="/static/assets/images/cases/msi-chicago/background-450.png" media="(max-width: 450px)">
            <source data-srcset="/static/assets/images/cases/msi-chicago/background-815.png" media="(max-width: 815px)">
            <source data-srcset="/static/assets/images/cases/msi-chicago/background-1015.png" media="(max-width: 1030px)">
            <img data-src="/static/assets/images/cases/msi-chicago/background-1440.png" alt="" class="js-lazy">
          </picture>
        </div>
      </div>
          <div class="home-cases-scene home-cases-scene--this-was-louises-phone">
        <h3 class="u-visually-hidden">Похожая история</h3>

        <div class="inner">
          <a href="/about/" class="home-cases-link"><span class="u-visually-hidden">Похожая история</span></a>

          <div class="home-cases-content">
                          <p class="home-cases-headline">Резонанс</p>
            
            <p class="home-cases-name">Похожая история</p>
            <p class="home-cases-text">
                            
                              <span class="home-cases-line">Чужой опыт, похожий на твой. </span>
                              <span class="home-cases-line">
Связь через резонанс, </span>
                              <span class="home-cases-line">
а не обсуждение.</span>
                          </p>
            <p class="link link--caret">
              <span class="link--caret-text">Подробнее</span>
                <span class="svg svg-caret-right">
  	<svg width="7" height="11">
    	<use xlink:href="/static/assets/spritesheet.svg#caret-right"></use> 
  	</svg>
  </span>

            </p>
          </div>

          <picture class="home-cases-picture">
            <source data-srcset="/static/assets/images/cases/this-was-louises-phone/background-450.png" media="(max-width: 450px)">
            <source data-srcset="/static/assets/images/cases/this-was-louises-phone/background-815.png" media="(max-width: 815px)">
            <source data-srcset="/static/assets/images/cases/this-was-louises-phone/background-1015.png" media="(max-width: 1030px)">
            <img data-src="/static/assets/images/cases/this-was-louises-phone/background-1440.png" alt="" class="js-lazy">
          </picture>
        </div>
      </div>
          <div class="home-cases-scene home-cases-scene--kikk-18">
        <h3 class="u-visually-hidden">Pulse</h3>

        <div class="inner">
          <a href="/about/" class="home-cases-link"><span class="u-visually-hidden">Pulse</span></a>

          <div class="home-cases-content">
                          <p class="home-cases-headline">Автору</p>
            
            <p class="home-cases-name">Pulse</p>
            <p class="home-cases-text">
                            
                              <span class="home-cases-line">Тихий пульс истории: её слышат — и это видно только тебе.</span>
                          </p>
            <p class="link link--caret">
              <span class="link--caret-text">Подробнее</span>
                <span class="svg svg-caret-right">
  	<svg width="7" height="11">
    	<use xlink:href="/static/assets/spritesheet.svg#caret-right"></use> 
  	</svg>
  </span>

            </p>
          </div>

          <picture class="home-cases-picture">
            <source data-srcset="/static/assets/images/cases/kikk-18/background-450.png" media="(max-width: 450px)">
            <source data-srcset="/static/assets/images/cases/kikk-18/background-815.png" media="(max-width: 815px)">
            <source data-srcset="/static/assets/images/cases/kikk-18/background-1015.png" media="(max-width: 1030px)">
            <img data-src="/static/assets/images/cases/kikk-18/background-1440.png" alt="" class="js-lazy">
          </picture>
        </div>
      </div>
          <div class="home-cases-scene home-cases-scene--the-kennedy-center">
        <h3 class="u-visually-hidden">Hearers</h3>

        <div class="inner">
          <a href="/about/" class="home-cases-link"><span class="u-visually-hidden">Hearers</span></a>

          <div class="home-cases-content">
                          <p class="home-cases-headline">Автору</p>
            
            <p class="home-cases-name">Hearers</p>
            <p class="home-cases-text">
                            
                              <span class="home-cases-line">Те, кто услышал историю.</span>
                              <span class="home-cases-line">
Список виден</span>
                              <span class="home-cases-line">
только её автору.</span>
                          </p>
            <p class="link link--caret">
              <span class="link--caret-text">Подробнее</span>
                <span class="svg svg-caret-right">
  	<svg width="7" height="11">
    	<use xlink:href="/static/assets/spritesheet.svg#caret-right"></use> 
  	</svg>
  </span>

            </p>
          </div>

          <picture class="home-cases-picture">
            <source data-srcset="/static/assets/images/cases/the-kennedy-center/background-450.png" media="(max-width: 450px)">
            <source data-srcset="/static/assets/images/cases/the-kennedy-center/background-815.png" media="(max-width: 815px)">
            <source data-srcset="/static/assets/images/cases/the-kennedy-center/background-1015.png" media="(max-width: 1030px)">
            <img data-src="/static/assets/images/cases/the-kennedy-center/background-1440.png" alt="" class="js-lazy">
          </picture>
        </div>
      </div>
          <div class="home-cases-scene home-cases-scene--orw">
        <h3 class="u-visually-hidden">Anti-Panic</h3>

        <div class="inner">
          <a href="/about/" class="home-cases-link"><span class="u-visually-hidden">Anti-Panic</span></a>

          <div class="home-cases-content">
                          <p class="home-cases-headline">Безопасность</p>
            
            <p class="home-cases-name">Anti-Panic</p>
            <p class="home-cases-text">
                            
                              <span class="home-cases-line">Режим тишины, когда всё</span>
                              <span class="home-cases-line">
слишком. Лента и уведомления</span>
                              <span class="home-cases-line">
молчат, помощь — рядом.</span>
                          </p>
            <p class="link link--caret">
              <span class="link--caret-text">Подробнее</span>
                <span class="svg svg-caret-right">
  	<svg width="7" height="11">
    	<use xlink:href="/static/assets/spritesheet.svg#caret-right"></use> 
  	</svg>
  </span>

            </p>
          </div>

          <picture class="home-cases-picture">
            <source data-srcset="/static/assets/images/cases/orw/background-450.png" media="(max-width: 450px)">
            <source data-srcset="/static/assets/images/cases/orw/background-815.png" media="(max-width: 815px)">
            <source data-srcset="/static/assets/images/cases/orw/background-1015.png" media="(max-width: 1030px)">
            <img data-src="/static/assets/images/cases/orw/background-1440.png" alt="" class="js-lazy">
          </picture>
        </div>
      </div>
      </div>
</section>

        <section class="home-about js-in-view">
  <h2 class="u-visually-hidden">Мы делаем место, где не бывает оценок</h2>

  <picture class="home-about-background js-in-view appear-fade">
    <source data-srcset="/static/assets/images/home/about-xxs.png" media="(max-width: 450px)">
    <source data-srcset="/static/assets/images/home/about-m.png" media="(max-width: 815px)">
    <source data-srcset="/static/assets/images/home/about-l.png" media="(max-width: 1030px)">
    <img data-src="/static/assets/images/home/about-xl.png" class="js-lazy" alt="">
  </picture>

  <div class="center">
    <header class="home-about-header js-in-view">
      <p class="home-about-headline appear-fade-up">Так это устроено</p>
      <p class="home-about-title fx-parent">
<!--DP:FX:home-about-->
</p>
    </header>

    <div class="home-about-content js-in-view">

      <div class="home-about-text typeset">
        <p class="appear-fade-up appear-delay--3">de-press — некоммерческая эмпатичная платформа.<br> Мы против токсичных механик соцсетей: вместо лайков, рейтингов и публичных комментариев здесь тишина, истории и бережная поддержка.</p>
        <p class="appear-fade-up appear-delay--4">Проект живёт на энтузиазме волонтёров и открытом коде. Мы верим: просить о помощи — нормально, а слышать друг друга — навык, которому можно учиться.</p>
      </div>

      <a href="/values/" class="home-about-link link link--under" title="Читать принципы">
        <span class="link-label">Принципы</span>
        <span class="link-line"></span>
        <span class="link-line--anim"></span>
      </a>
    </div>
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
