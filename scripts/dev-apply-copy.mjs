/*
 * One-shot dev script: applies the de-press copy replacements (stage B2)
 * to the 5 legacy markups. All-or-nothing: writes files only if every
 * entry matched. Run: node scripts/dev-apply-copy.mjs
 */
import fs from "node:fs";
import path from "node:path";

const F = (f) => path.resolve("components/legacy/markups", `${f}.ts`);
const S = [];

const r = (f, find, to, mode = "all") => S.push({ f, find, to, mode });
const once = (f, find, to) => r(f, find, to, 1);
const soft = (f, find, to) => S.push({ f, find, to, mode: "all", soft: true });
const tb = (f, rows) => S.push({ f, tb: rows });

/* ---------------- HOME ---------------- */
r("home", 'export const PAGE_TITLE = "Dogstudio. Multidisciplinary Creative Studio.";',
  'export const PAGE_TITLE = "de-press — тебя услышат";');
r("home", "We Make Good Shit", "Тебя услышат");
once("home", "Dogstudio is a multidisciplinary", "de-press — тихая гавань");
once("home", "creative studio at the intersection", "для тех, кому сейчас");
once("home", "of art, design and technology.", "эмоционально тяжело.");
once("home", "Our goal is to deliver amazing experiences that make",
  "Вместо лайков, рейтингов и публичных реакций —");
once("home", "people talk, and build strategic value for brands, tech,",
  "тишина, истории и человек рядом, который скажет:");
once("home", "entertainment, arts & culture.", "«Я слышу тебя».");
r("home", "We're crafting emotional experiences aimed at improving results",
  "Мы делаем место, где не бывает оценок");
once("home", "This is how we do it", "Так это устроено");
once("home", "Our Showreel", "Манифест");
once("home", '<span>2020 - Ongoing</span>', "<span>Публичное</span>");
once("home", '<span>2018 - Today</span>', "<span>Публичное</span>");
once("home", '<span>2015 - Today</span>', "<span>Публичное</span>");
once("home", '<span>2016</span>', "<span>Публичное</span>");
once("home", '<span>2012 - Today</span>', "<span>Автору</span>");
once("home", '<span>2017</span>', "<span>Автору</span>");
once("home", '<span>2016 - Ongoing</span>', "<span>Безопасность</span>");
r("home", 'href="/cases/tomorrowland/"', 'href="/studio/"');
r("home", 'href="/cases/navy-pier/"', 'href="/studio/"');
r("home", 'href="/cases/msi-chicago/"', 'href="/studio/"');
r("home", 'href="/cases/voo/"', 'href="/studio/"');
r("home", 'href="/cases/kikk-festival-2018/"', 'href="/studio/"');
r("home", 'href="/cases/the-kennedy-center/"', 'href="/studio/"');
r("home", 'href="/cases/royal-opera-of-wallonia/"', 'href="/studio/"');

r("home", "Dogstudio is a design & technology firm working globally from our offices based in Belgium and Chicago.<br> Our strong focus on producing high quality & emotional brandings, digital products and experiences became a signature.",
  "de-press — некоммерческая эмпатичная платформа.<br> Мы против токсичных механик соцсетей: вместо лайков, рейтингов и публичных комментариев здесь тишина, истории и бережная поддержка.");
r("home", "We’re passionate about moving people and solving problems for the likes of Microsoft, The Museum of Science And Industry Of Chicago, The Kennedy Center of Washington, Dragone, Quanta Magazine, and many more.",
  "Проект живёт на энтузиазме волонтёров и открытом коде. Мы верим: просить о помощи — нормально, а слышать друг друга — навык, которому можно учиться.");
once("home", "Discover our values", "Читать принципы");
r("home", "Tomorrowland", "Монолог");
r("home", "Navy Pier", "Я слышу тебя");
r("home", "MSI Chicago", "Тихие фразы");
r("home", "This Was Louise’s Phone", "Похожая история");
r("home", "KIKK Festival 2018", "Pulse");
r("home", "The Kennedy Center", "Hearers");
r("home", "Royal Opera Of Wallonia", "Anti-Panic");
once("home", ">Web<", ">Облачко<");
once("home", ">Strategy<", ">Реакция<");
once("home", ">Strategy<", ">Поддержка<");
once("home", ">Design<", ">Резонанс<");
once("home", ">Design<", ">Автору<");
once("home", ">Design<", ">Автору<");
once("home", ">Design<", ">Безопасность<");
r("home", "Building a new kind of", "Твоя история — без лайков,");
r("home", "immersive experience for", "без оценок и без гонки");
r("home", "the famous music festival", "за вниманием.");
r("home", "&quot;Enchanted Waters&quot; is an immersive", "Единственная реакция здесь —");
r("home", "and uplifting reflection on Chicago’s", "не лайк, а присутствие:");
r("home", "relationship with Lake Michigan", "«я рядом, я услышал».");
r("home", "Rethinking, redesigning and improving", "Короткие слова поддержки.");
r("home", "the website of the great &amp; famous", "Бережно, без споров");
r("home", "Museum of Science and Industry of Chicago", "и без публичных тредов.");
r("home", "Creating a heart-moving immersive", "Чужой опыт, похожий на твой.");
r("home", "experience to educate people about", "Связь через резонанс,");
r("home", "the hell of cyber-bullying", "а не обсуждение.");
r("home", "Another KIKK Festival yearly revamp: The “Species and Beyond” edition",
  "Тихий пульс истории: её слышат — и это видно только тебе.");
r("home", "Building an immersive website", "Те, кто услышал историю.");
r("home", "to celebrate the memory of the", "Список виден");
r("home", "unforgettable John F. Kennedy", "только её автору.");
r("home", "Imagining and designing an oniric", "Режим тишины, когда всё");
r("home", "universe to promote the upcoming", "слишком. Лента и уведомления");
r("home", "season of a renown Belgian opera house", "молчат, помощь — рядом.");
r("home", ">Discover<", ">Подробнее<");

/* ---------------- STUDIO ---------------- */
r("studio", 'export const PAGE_TITLE = "The Studio. We are Dogstudio.";',
  'export const PAGE_TITLE = "О проекте — de-press";');
r("studio", "We're just making Good Shit like it's 1996",
  "Мы строим тихую гавань — без лайков и рейтингов");
once("studio", "Our commitment", "Наше обязательство");
once("studio", "To start with", "Для начала");
once("studio", "Dogstudio is a multidisciplinary creative studio at the intersection of art, design and technology. We are on a mission to explore, create meaning and provoke emotions through design and storytelling.",
  "de-press — эмпатичная платформа для эмоциональной поддержки. Наша миссия — исследовать, как тишина, истории и контроль автора заменяют механику лайков и рейтингов.");
once("studio", "Soo... What?", "И что это значит?");
once("studio", "We believe in the power of leveraging design, stories and emotions  to help small & major brands, organisations and businesses engage human beings on any kind of medium.",
  "Мы верим в силу истории и присутствия: «Я слышу тебя» заменяет лайк, тихая фраза — комментарий, а решение всегда за автором истории.");
once("studio", "Are you tired of reading the same descriptions about those company claiming they’re different from another but really they’re not? Fine!  Because we’re tired too, so why don’t we directly skip to the part where you understand how we can help you?",
  "Устали от лент, где каждое чувство оценивают? Здесь не оценивают. Листайте дальше — покажем, как это устроено.");
once("studio", "Brand Strategy", "Нет публичных лайков и рейтингов");
once("studio", "Branding & Art Direction", "Нет публичных комментариев");
once("studio", "Digital Products", "Чат инициирует только автор");
once("studio", "Emerging Technologies(You know... AR, VR, AI etc...)",
  "ИИ всегда помечен — без диагнозов");
once("studio", "Interactive Installations", "Эмоциональные карты — только на устройстве");
once("studio", "Visual Design", "Anti-Panic важнее ленты");
once("studio", "Animation & Illustration", "Helper ≠ терапевт по умолчанию");
once("studio", "Check our projects", "Смотреть, как устроено");
once("studio", "Our Swagger, Ho we're sorry. Awards, right ?",
  "Инварианты и решения. Да, снова принципы.");
once("studio", "It's time to shine", "Что уже решено");
once("studio", "Well, this is more or less a list of the stuff we won (and hopefully earned a bit), the places we talked at, and the publications we weirdly got into. Let’s not get awkward about it... Here’s the thing",
  "Таблица — это наши принципы и статус проекта: что принято навсегда, что в работе, чего не будет. Не награды — обещания.");
tb("studio", [
  ["2024", "Проект", "старт", "Родился", "de-press переосмыслен как «тихая гавань»", "Некоммерческий, открытый код"],
  ["2025", "Лайки", "инвариант", "Навсегда отменены", "Нет публичных лайков и рейтингов страдания", "Боль не собирает очки"],
  ["2025", "Комментарии", "инвариант", "Навсегда отменены", "Нет публичных комментариев под историей", "Только тихие фразы"],
  ["2025", "Чат", "инвариант", "Принято", "Чат инициирует только автор", "accept или Author Outreach"],
  ["2025", "ИИ", "инвариант", "Принято", "ИИ всегда помечен", "Без диагнозов и toxic positivity"],
  ["2025", "Карты эмоций", "инвариант", "Принято", "Только на устройстве пользователя", "ZK: сервер не видит"],
  ["2025", "Anti-Panic", "инвариант", "Принято", "Важнее ленты и realtime", "Тишина важнее охвата"],
  ["2025", "Кризис", "инвариант", "Принято", "112/103 и страница /safety", "Честность вместо запретов"],
  ["2025", "Helper", "инвариант", "Принято", "Helper ≠ терапевт", "Присутствие, не лечение"],
  ["2025", "Треды", "не будет", "Отменено", "Публичные обсуждения историй", "Приватно всё, кроме тишины"],
  ["2025", "Карта травм", "не будет", "Отменено", "Серверное хранение состояний", "Только устройство"],
  ["2025", "AI-peer", "не будет", "Отменено", "Скрытые роботы-собеседники", "Только помеченный ИИ"],
  ["2025", "Open matching", "не будет", "Отменено", "Публичный поиск собеседников", "Решение за автором"],
  ["2025", "Голосовые", "не будет", "Отменено", "WebRTC-комнаты", "Слишком шумно"],
  ["2026", "GL-модуль", "в работе", "Пишется", "Собственная сцена вместо бандлов", "API 1:1 window.DogGL"],
  ["2026", "Сцена", "в работе", "Пишется", "JSON-стейты: камера, сплайны, matcap", "Catmull-Rom"],
  ["2026", "Нарратив", "в работе", "Пишется", "История проекта вместо кейсов", ""],
  ["2026", "Модель", "в работе", "Ищем", "3D-модель вместо собаки", ""],
  ["2026", "/safety", "готово", "Живёт", "Кризисная страница 112/103", ""],
  ["2026", "Промо", "в работе", "Пишется", "Тексты и метаданные страниц", ""],
  ["2026", "Приватность", "решение", "Принято", "Минимум данных, без трекеров", "Навсегда"],
  ["2026", "Хостинг", "решение", "Принято", "Без рекламы и продажи данных", "Навсегда"],
  ["2026", "Доступность", "в работе", "Пишется", "Контраст, клавиатура, читаемость", ""],
  ["2026", "Локализация", "идея", "Открыто", "Сначала русский, потом English", ""],
  ["2026", "Исследование", "открыто", "Идёт", "Что помогает: слушание vs советы", ""],
  ["2026", "Пилот", "скоро", "2026", "Закрытый пилот сообщества", "Стучитесь на /careers/"],
  ["2026", "Hearers", "дизайн", "Рисуем", "Виден только автору облачка", ""],
  ["2026", "Pulse", "дизайн", "Рисуем", "Пульс истории — только автору", ""],
]);
once("studio", ">Year<", ">Год<");
once("studio", ">Organization<", ">Решение<");
once("studio", ">Type<", ">Статус<");
once("studio", ">Project<", ">Суть<");
once("studio", ">Location<", ">Комментарий<");

/* ---------------- CAREERS ---------------- */
r("careers", 'export const PAGE_TITLE = "Careers - Dogstudio";',
  'export const PAGE_TITLE = "Помогать — de-press";');
r("careers", "Wanna join the greatest band of misfits around these parts?",
  "Хочешь быть тем, кто слышит?");
once("careers", "Before anything", "Для начала");
once("careers", "We do pretty amazing shit from our offices in Belgium and Chicago, and for the record, we’re being modest you know. Just sayin’, JS. Now, we guess you don’t know where Belgium is, hu?",
  "de-press — некоммерческий проект волонтёров. Мы не лечим и не ставим диагнозов: Helper — не терапевт. Наша работа — присутствие: услышать, ответить тихой фразой, быть рядом.");
once("careers", "Caesar was right, Belgians are the bravest and we’re all on a mission to make a difference. For you, for us, for your mom, your neighbours, for the rich, for the poor., for the curious, for the reluctant, for everyone. If you love us, you can strongly recommend us to the people you love, and if you hate us, you can strongly recommend us to the people you hate.",
  "Принимать чужую боль непросто — поэтому у каждого Helper’а есть Anti-Panic, супервизия и право не отвечать. Границы здесь часть культуры, а не слабость.");
once("careers", "Sometimes we write shit on paper", "Иногда мы пишем от руки");
once("careers", "Pirates", "Тихая комната");
once("careers", "Isn't he cute ?", "Кружка чая");
once("careers", "Faster Thierry, Faster !!", "Первый монолог");
once("careers", "When temperatures go agove 25°c for the first time of the year, we’re throwing a BBQ. That’s right.",
  "Когда за окном дождь — завариваем чай и слушаем.");
once("careers", "Fancy Christmas diner night", "Вечер супервизии");
once("careers", "Barbecue²", "Тихие фразы²");
once("careers", "Chicago Tourist mode: enabled", "Режим тишины: включён");
once("careers", "We can also build with Lego bricks", "Мы тоже собираем слова по кусочкам");
once("careers", "The Chicago lads in Canada", "Helper’ы на разборе кейса");
once("careers", "Sometimes we give some talks", "Иногда мы просто молчим вместе");
once("careers", "We also won a Mario Kart competition", "Наша Anti-Panic комната");
once("careers", "Focused team", "Сфокусированное слушание");
once("careers", "Fancy Christmas diner night²", "Вечер супервизии²");
once("careers", "Transporting weirdly-green suitcases in airport, what could be in there ?",
  "Тихие планы на пилот — что там внутри?");
once("careers", 'Now, our famous never-seen-on-tv "Seven Reasons Why"', "Семь причин стать Helper’ом");
once("careers", "A new blockbuster", "Маленький манифест");

once("careers", "We like that you tame unicorns at night, we love that you drive for hours listening to country music, we already crave you crazy motherf…WE SAID NO CURSING. We are always looking for new talent and we were expecting you. Time to apply, buddy!",
  "Мы всегда рады людям, которые умеют слушать без оценок. Если это про тебя — время откликнуться, друг.");
once("careers", "Reason N°", "Причина №");
once("careers", "You get to join an amazing band of Pirates with a capital P.",
  "Ты научишься слышать так, что людям станет легче.");
once("careers", "You get your very own dog name. That’ll remind you of your summer camp days.",
  "Ты войдёшь в сообщество, где границы уважают, а тишину не считают пустотой.");
once("careers", "We believe in family-time before anything. We’re not into crazy late-night hours.",
  "Помощь — не ночной созвон. Свои часы, свой темп.");
once("careers", "We’re part on-location / part-remote, because life doesn’t always happen where we decide it should.",
  "Часть смен онлайн, часть офлайн — жизнь случается там, где ты есть.");
once("careers", "Because we heard it was mandatory to have a « facts » section, we decided to have one. You’re in for a treat with those totally irrelevant facts about us.",
  "А ещё у нас есть раздел «фактов». Обещаем: только честные цифры про то, как устроена тишина.");
once("careers", "Enjoy !", "Поехали!");
once("careers", ">543<", ">1<");
once("careers", ">Times<", ">реакция<");
once("careers", "Is the number of times people asked us why we were called Dogstudio.Believe us, it’s not that interesting",
  "Единственная публичная реакция — «Я слышу тебя». Это не лайк: ничего не оценивает.");
once("careers", ">2K<", ">0<");
once("careers", ">Calories<", ">лайков<");
once("careers", "Is around the number of calories you’ll ingest if you decide to follow team members going for a « fat » lunch.",
  "Ровно ноль лайков и рейтингов страдания. Здесь не соревнуются в боли.");
once("careers", ">Times<", ">Anti-Panic<");
once("careers", "Is the number of times we laughed at your « dog-centered » jokes.Writing « lol » after them in your mail isn’t making it any better. Sorry.",
  "Когда становится слишком — лента и уведомления затихают. Тишина важнее охвата.");
once("careers", ">Times<", ">112<");
once("careers", "Is the number of times Mathieu rolled on the floor of the office when he learned we won a site of the year with Dragone.",
  "Номер, который мы напоминаем при кризисе — вместе с 103. И страница /safety всегда рядом.");
once("careers", ">Languages<", ">100 %<");
once("careers", "Is the number of official languages in Belgium, so, to make it simpler, we’re speaking both French and English.",
  "ИИ-ответы всегда помечены: без скрытых роботов-собеседников и без диагнозов.");
once("careers", ">32<", ">ZK<");
once("careers", "Freaks & geeks", "карты эмоций");
once("careers", "Is around the number of freaks & geeks we are, give or take.",
  "Эмоциональные карты живут только на устройстве пользователя — сервер их не видит.");
once("careers", ">16<", ">0 ₽<");
once("careers", ">Yearly planes<", ">и навсегда<");
once("careers", "Is the number of yearly planes taken by Nico to meet with our clients from all over the United States.",
  "Проект некоммерческий: без рекламы, без продажи данных, без подписок за внимание.");
once("careers", "You get paid to make people’s life easier and more exciting. Isn’t that great?",
  "Ты помогаешь людям почувствовать, что они не одни. Разве это не лучшая причина?");
once("careers", "Independence is everything. We’re adults, right? We’ll treat you like one.",
  "Самостоятельность — всё. Мы работаем со взрослыми людьми и уважаем их границы.");
once("careers", "Female, transgender, male, gay, straight, POC, white, human or alien, however your identities intersect, we welcome your difference here.",
  "Кем бы ты ни был(а) и как бы ни определял(а) себя — здесь рады твоей особенности. Тишина принимает всех.");
r("careers", "Let me apply now !", "Откликнуться");

once("careers", "Jean Claude Van Damme", "Тихий час");
once("careers", ">Chicago<", ">Онлайн<");
once("careers", "Midwest is best", "Слушание — это навык");
once("careers", "Open positions in", "Роль: Helper (слушающий)");
once("careers", "Because we wanted to retain our small-town charm, we chose the lovely neighborhood of Lincoln Park to be our Chicagoan landmark, and we must say that so far, we love every part of it. All it needs now is you, in there.",
  "Проводишь тихие смены в inbox: читаешь монологи, отвечаешь «Я слышу тебя» и тихими фразами. Обучение и супервизия — прилагаются. Терапевтом быть не придётся, обещаем.");
once("careers", ">Netherlands<", ">Пилот<");
once("careers", "Bikes and Bitterballen", "Меньше шума — больше смысла");
once("careers", "Open positions in", "Роль: Модератор тишины");
once("careers", "Who has ever been in Amsterdam can recognize at least two things: 1) It's such an exciting and active city, and 2) watch where you step or you'll crash into a biker. Let's say we couldn't get enough \"Bitterballen\" and decided to give it a shot.",
  "Следишь, чтобы инварианты работали: без лайков, без оценок, без toxic positivity. Мягко и по правилам, которые открыты всем.");
once("careers", ">Mexico<", ">Продукт<");
once("careers", "Te gusta la Cerveza?", "Код — тоже забота");
once("careers", "Open positions in", "Роль: Разработчик");
once("careers", "We love Mexico, how vibrant it is, and how much it seems to align with our values and interest for great people, food, design and art scene. Don't hesitate to drop by even to say hi... we love meeting new people.",
  "Помогаешь строить платформу и собственный GL-модуль промо. Открытый код, спокойный темп, никакой гонки фич.");
once("careers", ">Namur<", ">История<");
once("careers", "Where it all began", "Там, где всё началось");
once("careers", "Open positions in", "Роль: Автор");
once("careers", "Our headquarters are located in Namur, where, a while ago, it all started. You know the extra good news though? It's that twice a week, if you want it, you get to work from Brussels or Liege. Isn’t it cool? First you gotta apply though. JS. Just sayin’.",
  "Пишешь монологи и тихие фразы, ведёшь манифест и историю проекта. Твой опыт может стать чьей-то «похожей историей».");

/* ---------------- VALUES ---------------- */
r("values", 'export const PAGE_TITLE = "Values. What we believe in at Dogstudio.";',
  'export const PAGE_TITLE = "Принципы — de-press";');
once("values", "Because company culture is more than a ping pong table",
  "Потому что культура — это не фича в роадмапе");
once("values", "What we believe in", "Во что мы верим");
once("values", "Before anything", "Для начала");
once("values", "Collaborating with dogstudio, both on a career and on a client level means being aligned with our ten core values. Through thick and thin, over and over again.",
  "Всё, что мы строим, проходит через десять принципов. Через «не надо» и «зачем». Через тишину и уважение.");
once("values", "No. It is not your tgif happy hour either...",
  "Нет, это не правила ради правил...");
once("values", "Stop trying. It's embarassing...", "Дальше — сами принципы...");
once("values", "Growing together through collaboration", "Никаких публичных лайков");
once("values", "We strongly believe in the power of collaboration and we’re convinced our full potential can only be released when we all work together, inside and outside the company (or during buzzed late-night discussions)",
  "Боль не собирает очки. Мы убираем механики, которые превращают чужую историю в соревнование.");
once("values", "We are all accountable for our own work", "Никаких публичных комментариев");
once("values", "Doing things right is awesome, but being on first-line to explain why and how we did it is even better. How often did you face the actual people involved in your project for an effective and straight explanation of the accomplished work? Not often hu?",
  "Под чужой историей не место спорам. Только тихие фразы и резонанс — всё остальное приватно.");
once("values", "We are both agile and human-centered", "Чат начинает только автор");
once("values", "We are human, you are human and our clients are human as well so isn’t it logical to base our approach on making them the center of our strategy?",
  "Диалог — это приглашение, а не вторжение. Автор решает, кому ответить: accept или Author Outreach.");
once("values", "Constantly working globally", "ИИ всегда помечен");
once("values", "Although the company currently has offices in Belgium and Chicago, we truly believe in the power of technology as the biggest communication facilitator we have ever known. As for today and tomorrow, there’s no excuse not to work with us even",
  "Без скрытых роботов-собеседников, без диагнозов, без toxic positivity. Помощь машины — только с честной меткой.");
once("values", "In thy Dog you shall trust", "Эмоции — только на устройстве");
once("values", "We know you’re willing to spend money on a project and you want to do it with us. Great, then it means we’re all getting on a trust-based relationship, but it also means we’re not afraid to be who we are and certainly not to tell you when we think we’re getting off track. Relationships, remember?",
  "Эмоциональные карты живут на устройстве пользователя (ZK). Сервер не видит и не хранит карту твоих состояний.");
once("values", "Being platform agnostic is the only way", "Anti-Panic важнее ленты");
once("values", "We’re truly driven by the idea that our future will be composed of an endless multiplicity of digital touchpoints, and we’re definitely the guys to help you build this future.",
  "Когда плохо — не время охватов. Режим тишины и путь к /safety всегда важнее любого realtime.");
once("values", "Keep evolving baby!", "Кризис → 112/103");
once("values", "Think, build, look back and improve. We’ve been in the business for a while and if there’s something we have learned so far, it’s that nothing lasts forever and our capacity to evolve and adapt is the best asset we have.",
  "Мы не экстренная служба. При кризисе — 112, 103 и страница /safety. Это не отговорка, это честность.");
once("values", "We love long-term relationships", "Helper ≠ терапевт");
once("values", "We never really liked OPS or one-project stands. We truly believe that the real potential of a collaboration can only be unleashed when we envision partnerships on the long-term, not only to get to know and understand the products and the relationship we build, but also because we can get to improve everything we build.",
  "Helper — слушающий человек, а не врач. Мы не заменяем терапию и не притворяемся, что заменяем.");
once("values", "It’s all about honest communication", "Контроль у автора");
once("values", "We like transparency. We mean...why not? So many brands and clients have been abused for too long with dark and hidden overhead costs and invisible puppet masters. Working with us means opening up transparent discussions. This is how good shit gets done",
  "Приватные облачка, inbox, outreach, Hearers — всё смотрит автор. Публичность — его решение, а не алгоритма.");
once("values", "We Make Good Shit", "Тишина — это ответ");
once("values", "Well...everything is in the title isn’t it? We always devoted ourselves to get the highest expectations and the lowest satisfaction so that we can only try to reach for the stars.",
  "Не на каждое сообщение нужен ответ. Присутствие без слов — тоже поддержка. Всё в заголовке.");
once("values", "We’re constantly hiring new talent", "Мы всегда рады тем, кто умеет слышать");
once("values", "Apply now", "Как помогать");

/* ---------------- CONTACT ---------------- */
r("contact", 'export const PAGE_TITLE = "Contact. Drop a line to Dogstudio.";',
  'export const PAGE_TITLE = "Связаться — de-press";');
once("contact", "Contact Us", "Написать нам");
once("contact", "If you want to make good shit, drop us a line", "Если тебе тоже тесно в лентах — напиши нам");
once("contact", "If you like burritos, drop us a line", "Если хочешь помогать слышать — напиши нам");
once("contact", "If you like dogs, drop us a line", "Если умеешь слушать без советов — напиши нам");
once("contact", "If you wanna say hi, drop us a line", "Если хочешь в пилот — напиши нам");
once("contact", "If you like to party, drop us a line", "Если можешь поддержать проект — напиши нам");
once("contact", "If you drank too much tequila, drop us a line", "Если умеешь кодить — напиши нам");
once("contact", "If the roof is on fire, drop us a line", "Если умеешь рисовать облачка — напиши нам");
once("contact", "If you can’t touch this, drop us a line", "Если видишь дыру в приватности — напиши нам");
once("contact", "If you’re aware, drop us a line", "Если хочешь переводить тишины — напиши нам");
once("contact", "If you run for president, drop us a line", "Если умеешь писать бережно — напиши нам");
once("contact", "If you are Snoop Dog, drop it like it's hot", "Если просто хочешь сказать привет — напиши нам");
once("contact", "If you’re a virgin, drop us a line", "Если тебе плохо прямо сейчас — открой /safety");
once("contact", "If you have your driver license, drop us a line", "Если кризис — сразу 112 или 103");
once("contact", "If you’re a farmer, drop us a line", "Если хочешь модерировать тишину — напиши нам");
once("contact", "If you’re an opera singer, drop us a line", "Если веришь, что помощь без лайков возможна — напиши нам");
once("contact", "If you stalk people on facebook, drop us a line", "Если устал от токсичной позитивности — напиши нам");
once("contact", "If you like knock knock jokes, drop us a line", "Если хочешь тестировать Anti-Panic — напиши нам");
once("contact", "If you know why 42, drop us a line", "Если умеешь делать доступно — напиши нам");
once("contact", "If you’re brewing your own beer, drop us a line", "Если знаешь, как звучит «Я слышу тебя» на твоём языке — напиши нам");
once("contact", "If you’re hot, drop us a line", "Если у тебя есть похожая история — напиши нам");
once("contact", "If you're not famous, drop us a line", "Если хочешь стать Helper’ом — напиши нам");
once("contact", "If you’re just curious, drop us a line", "Если умеешь слышать молчание — напиши нам");
once("contact", "If you don’t like cats, drop us a line", "Если тебя тошнит от рейтингов — напиши нам");
once("contact", "If you are a superhero at night, drop us a line", "Если хочешь помочь с открытым кодом — напиши нам");
once("contact", "If you used to be a girl, drop us a line", "Если умеешь рисовать сцены — напиши нам");
once("contact", "If you’re a doctor for pretend, drop us a line", "Если пишешь тексты, от которых легче — напиши нам");
once("contact", "If you're an ex movie star, drop us a line", "Если хочешь в команду исследования — напиши нам");
once("contact", "If you believe in yourself, drop us a line", "Если умеешь считать честные метрики — напиши нам");
once("contact", "If you're hitting on grandmas, drop us a line", "Если задумался о приватности данных — напиши нам");
once("contact", "If you're a loser, drop us a line", "Если хочешь просто почитать — начни с /values/");
once("contact", "If you read all those messages, drop us a line", "Если дочитал до конца — точно напиши нам");
once("contact", "If you like Orval beer, drop us a line", "Если не знаешь, что написать — просто «привет»");
once("contact", "If you secretly love us, drop us a line", "Если завтра будет тяжело — /safety рядом");
once("contact", "If you are waiting for this to end, drop us a line", "Если готов(а) — напиши нам");
once("contact", ">Medium<", ">Дайджест<");
r("contact", "1 S Wacker Dr. Suite 2250 Chicago, IL 60606, USA",
  "Тишина: здесь нет лент и рейтингов. Облачко — монолог, «Я слышу тебя», тихие фразы и похожая история.");
r("contact", "Generaal Vetterstraat 66, 1059 BW Amsterdam, Netherlands",
  "Эмпатия: Helper’ы читают и слышат. Чат начинает только автор. ИИ помечен всегда.");
r("contact", "5 rue Moret, 75011 Paris, France",
  "Забота: при кризисе — 112, 103 и страница /safety. Это не медицина, и мы честно об этом говорим.");

/* ---------------- COMMON (all 5 markups) ---------------- */
for (const f of ["home", "studio", "careers", "values", "contact"]) {
  once(f, '<a href="/studio/" class="">The Studio</a>', '<a href="/studio/" class="">О проекте</a>');
  once(f, '<a href="/cases/" class="">Our Cases</a>', '<a href="/" class="">Истории</a>');
  once(f, '<a href="/careers/" class="">Careers</a>', '<a href="/careers/" class="">Помогать</a>');
  once(f, '<a href="/values/" class="">Our Values</a>', '<a href="/values/" class="">Принципы</a>');
  once(f, '<a href="/contact/" class="">Contact</a>', '<a href="/contact/" class="">Связаться</a>');
  r(f, 'href="/news/"', 'href="/safety/"');
  once(f, " All our news</a>", " Безопасность</a>");
  r(f, 'href="/cases/"', 'href="/"');
  once(f, " All our cases</a>", " Как устроено</a>");
  r(f, "Toggle menu", "Открыть меню");
  r(f, "Toggle sound", "Звук");
  r(f, '<span class="u-visually-hidden">Dogstudio</span>', '<span class="u-visually-hidden">de-press</span>');
  once(f, "Return to Dogstudio's homepage", "На главную — de-press");
  r(f, 'aria-label="dogstudio"', 'aria-label="de-press"');
  once(f, " Watch our Showreel</a>", " Манифест</a>");
  once(f, ">Dogstudio<", ">de-press<");
  r(f, 'href="https://www.facebook.com/dogstudio/"', 'href="https://t.me/depressco"');
  r(f, 'href="https://www.instagram.com/dogstudio.co/"', 'href="https://youtube.com/@depressco"');
  r(f, 'href="https://dribbble.com/dogstudio"', 'href="https://github.com/de-press"');
  r(f, 'href="https://twitter.com/Dogstudio"', 'href="mailto:hello@de-press.co"');
  r(f, ">Facebook<", ">Telegram<");
  r(f, ">Instagram<", ">YouTube<");
  r(f, ">Dribbble<", ">GitHub<");
  r(f, ">Twitter<", ">E-mail<");
  r(f, ">Fb<", ">Tg<");
  r(f, ">Ins<", ">Yt<");
  r(f, ">Dri<", ">Gh<");
  r(f, ">Tw<", ">@<");
  once(f, ">Newsletter<", ">Рассылка<");
  once(f, "Chicago <b>.</b>", "Тишина <b>.</b>");
  once(f, "Amsterdam <b>.</b>", "Эмпатия <b>.</b>");
  once(f, "Paris <b>.</b>", "Забота <b>.</b>");
  once(f, "Contact us", "Написать нам");
  r(f, "We'd love to hear from you", "Хочешь помочь проекту — напиши:");
  r(f, "biz@dogstudio.be", "hello@de-press.co");
  once(f, "Privacy Policy", "Приватность");
  r(f, 'href="https://www.deptagency.com/en-nl/privacy-policy/"', 'href="/values/"');
  once(f, "Language:", "Язык:");
  once(f, 'title="English"', 'title="Русский"');
  once(f, 'title="Español"', 'title="English"');
  once(f, "English\n", "Русский\n");
  once(f, "Español\n", "English\n");
  once(f, "Close showreel", "Закрыть манифест");
  r(f, "We use functional cookies to make the website work properly and analytical cookies to measure your behavior. We collect data on how you use our website to make our website easier to use. By clicking accept you agree to this. More information? ",
    "Здесь нет рекламных трекеров и аналитики. Работает только необходимое — без этого сайт не откроется. Продолжая, ты соглашаешься с этим. ");
  once(f, "Read our cookie policy", "Подробнее о приватности");
  once(f, ">Accept<", ">Хорошо<");
  once(f, ">Deny<", ">Отклонить<");
  if (f === "careers") once("careers", "Careers", "Помогать");
  if (f === "values") once("values", "Our Values", "Наши принципы");
  soft(f, 'href="https://inside.dogstudio.be/"', 'href="/values/"');
}

/* ---------------- APPLY ---------------- */
const files = [...new Set(S.map((e) => e.f))];
const contents = Object.fromEntries(files.map((f) => [f, fs.readFileSync(F(f), "utf8")]));

let misses = 0;
for (const e of S) {
  let src = contents[e.f];
  if (e.tb) {
    const body = e.tb
      .map(
        ([y, org, mark, status, what, note]) =>
          `                <tr>\n                  <td data-after="">${y}</td>\n` +
          `                  <td data-after="${mark}">${org}</td>\n` +
          `                  <td data-after="">${status}</td>\n` +
          `                  <td data-after="">${what}</td>\n` +
          `                  <td data-after="">${note}</td>\n                </tr>`,
      )
      .join("\n");
    const next = src.replace(/<tbody>[\s\S]*<\/tbody>/, `<tbody>\n${body}\n            </tbody>`);
    if (next === src) {
      console.log(`MISS  ${e.f}  <tbody>`);
      misses++;
    } else {
      contents[e.f] = next;
      console.log(`OK    ${e.f}  <tbody> ${e.tb.length} rows`);
    }
    continue;
  }
  const n = e.mode === "all" ? src.split(e.find).length - 1 : Number(e.mode);
  if (n === 0) {
    if (e.soft) {
      console.log(`SOFT  ${e.f}  (absent) ${JSON.stringify(e.find.slice(0, 60))}`);
      continue;
    }
    console.log(`MISS  ${e.f}  ${JSON.stringify(e.find.slice(0, 72))}`);
    misses++;
    continue;
  }
  let out = src;
  for (let i = 0; i < n; i++) out = out.replace(e.find, e.to);
  contents[e.f] = out;
  console.log(`OK(${n}) ${e.f}  ${JSON.stringify(e.find.slice(0, 60))}`);
}

// leftover report: any dogstudio mentions left in visible copy
for (const f of files) {
  const left = contents[f].match(/[Dd]ogstudio/g);
  if (left) console.log(`LEFT  ${f}: ${left.length} x dogstudio`);
}

if (misses) {
  console.log(`\n${misses} miss(es) — nothing written.`);
  process.exit(1);
}
for (const f of files) fs.writeFileSync(F(f), contents[f]);
console.log("\nAll replacements applied.");
