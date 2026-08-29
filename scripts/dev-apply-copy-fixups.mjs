import fs from "node:fs";
const M = "components/legacy/markups";
const F = (f) => `${M}/${f}.ts`;
const S = [];
const r = (f, find, to, mode = "all") => S.push({ f, find, to, mode });
const once = (f, find, to) => r(f, find, to, 1);
const soft = (f, find, to) => S.push({ f, find, to, mode: "all", soft: true });

/* ---------- COMMON leftovers (all 5) ---------- */
for (const f of ["home", "studio", "careers", "values", "contact"]) {
  soft(f, "Close showreel", "Закрыть манифест");
  soft(f, ">Newsletter<", ">Рассылка<");
  soft(f, 'title="English"', 'title="Русский"');
  soft(f, 'title="Español"', 'title="English"');
  soft(f, "English\n", "Русский\n");
  soft(f, "Español\n", "English\n");
}

/* ---------- HOME ---------- */
once("home", ">Featured projects<", ">Истории<");
once("home", ">Discover our values<", ">Принципы<");

/* ---------- STUDIO ---------- */
once("about", '<a href="/studio/" class="is-active">The Studio</a>', '<a href="/about/" class="is-active">О проекте</a>');
r("studio", "Are you tired of reading the same descriptions about those company claiming they’re different from another but really they’re not?<br> Fine!  Because we’re tired too, so why don’t we directly skip to the part where you understand how we can help you?",
  "Устал читать одинаковые описания проектов, которые притворяются другими?<br> Хорошая новость: мы тоже. Поэтому сразу к делу — как устроена помощь здесь.");
once("about", "Emerging Technologies<br><small>(You know... AR, VR, AI etc...)</small>",
  "Открытые технологии<br><small>(открытый код, ИИ с честной меткой, WebRTC)</small>");
once("about", "Browse more", "Смотреть ещё");
once("about", ">To start with<", ">Для начала<");
r("studio", "Our goal is to deliver amazing experiences that make people talk, and build strategic value for brands, tech, entertainment, arts & culture.",
  "Наша цель — бережные опыты, о которых хочется рассказать тихо: без лайков и рейтингов, но с реальной пользой для тех, кому сейчас трудно.");
once("about", ">Dog is in the details<", ">Тишина — в деталях<");
r("studio", "Eleanor said, “Be flexible, but stick to your principles”, and she was damn right.<br> Over the years, we built our own mindset, born from our past experiences, both in success and failures, but all inspired by the same backbone : the more you get in the details of every layer of a brand, product or experience, and the more you’re likely to leave a strong mark on your audience. Peace.",
  "«Будь гибкой, но держись своих принципов» — тут Элеонора права.<br> Наш уклад вырос из опыта: успехов и провалов, тихих смен и чужих историй. Чем глубже понимаешь чужую боль, тем бережнее должна быть помощь. Вот и весь принцип.");
once("about", "This is how we roll ", "Как здесь устроено ");
r("studio", "We know our business, but we surely don’t know yours, but it’s great, because we also strongly believe amazing work comes from great relationships and we’re convinced our full potential can only be released when we all work together, inside and outside the company (or during buzzed late-night discussions)",
  "Мы знаем своё дело, но не твою историю — и это правильно: настоящая помощь начинается со знакомства. Работать можно только вместе: с автором, с Helper’ами и теми, кто просто рядом (даже если это ночная переписка)");
r("studio", "Before collaborating on anything, we always start with getting to know each other.",
  "Прежде чем что-то делать, мы всегда начинаем со знакомства.");
r("studio", "Your needs, your goals, your expectations, your story, your team, and even, hopefully maybe your taste in Belgian beers.",
  "Твоя история, твои ожидания, твой темп и твои границы — всё это важно, вплоть до любимого чая.");
r("studio", "Now, you’re looking for a team to produce whatever you want without taking the time to get to know us, and thoroughly tell us more about your situation? Well...here’s the way out.",
  "Если тебе нужен просто исполнитель задач — без доверия и разговора, честно покажем, куда идти дальше.");
once("about", ">More of our values<", ">Ещё о принципах<");
once("about", ">Selected clients<", ">Кто с нами<");
once("about", ">They trust us<", ">Нам доверяют истории<");

/* ---------- CAREERS ---------- */
r("careers", "hello@dogstudio.co", "hello@de-press.co");
once("careers", ">Careers<", ">Помогать<");
once("careers", "\n          Times\n        </h3>", "\n          Раз\n        </h3>");
once("careers", "\n          Calories\n        </h3>", "\n          Лайков\n        </h3>");
once("careers", "\n          Times\n        </h3>", "\n          Шуток\n        </h3>");
once("careers", "\n          Times\n        </h3>", "\n          Номер\n        </h3>");
once("careers", "\n          Languages\n        </h3>", "\n          Пометок\n        </h3>");
once("careers", "\n          Yearly planes\n        </h3>", "\n          Ноль\n        </h3>");
r("careers", "Is the number of times people asked us why we were called Dogstudio.<br/>Believe us, it’s not that interesting",
  "Сколько раз нас спрашивали, почему мы называемся de-press.<br/>Поверь, история совсем не интересная");
r("careers", "Is the number of times we laughed at your « dog-centered » jokes.<br/>Writing « lol » after them in your mail isn’t making it any better. Sorry.",
  "Сколько раз мы слышали шутки про «ну это же просто лента».<br/>«Lol» в конце письма не делает их смешнее. Правда.");
once("careers", "<figcaption>Sometimes we write shit on paper</figcaption>", "<figcaption>Иногда мы пишем от руки</figcaption>");
once("careers", "<figcaption>Pirates</figcaption>", "<figcaption>Тихая комната</figcaption>");
once("careers", "<figcaption>Isn't he cute ?</figcaption>", "<figcaption>Просто портрет</figcaption>");
once("careers", "<figcaption>Faster Thierry, Faster !!</figcaption>", "<figcaption>Спокойнее, не спеши</figcaption>");
once("careers", "<figcaption>When temperatures go agove 25°c for the first time of the year, we’re throwing a BBQ. That’s right.</figcaption>",
  "<figcaption>Когда становится тепло, мы просто гуляем. Без повода.</figcaption>");
once("careers", "<figcaption>Fancy Christmas diner night</figcaption>", "<figcaption>Тихий вечер вместе</figcaption>");
once("careers", "<figcaption>Barbecue²</figcaption>", "<figcaption>Ужин²</figcaption>");
once("careers", "<figcaption>Chicago Tourist mode: enabled</figcaption>", "<figcaption>Прогулка по городу: включена</figcaption>");
once("careers", "<figcaption>We can also build with Lego bricks</figcaption>", "<figcaption>Строим из простых кубиков</figcaption>");
once("careers", "<figcaption>The Chicago lads in Canada</figcaption>", "<figcaption>Команда в дороге</figcaption>");
once("careers", "<figcaption>Sometimes we give some talks</figcaption>", "<figcaption>Иногда мы просто слушаем</figcaption>");
once("careers", "<figcaption>We also won a Mario Kart competition</figcaption>", "<figcaption>И даже играем вместе</figcaption>");
once("careers", "<figcaption>Focused team</figcaption>", "<figcaption>Сосредоточенная тишина</figcaption>");
once("careers", "<figcaption>Fancy Christmas diner night²</figcaption>", "<figcaption>Тихий вечер вместе²</figcaption>");
once("careers", "<figcaption>Transporting weirdly-green suitcases in airport, what could be in there ?</figcaption>",
  "<figcaption>Странные зелёные чемоданы в аэропорту. Что там, как думаешь?</figcaption>");

/* ---------- VALUES ---------- */
once("values", "Наши принципы", "Принципы");
once("values", ">Our Values<", ">Принципы<");
r("values", "hello@dogstudio.co", "hello@de-press.co");
once("values", ">Apply now<", ">Как помогать<");
once("values", "Growing<br /> together through<br /> collaboration", "Расти<br /> вместе с людьми,<br /> а не с лентой");
once("values", "We are all<br /> accountable for<br /> our own work", "Каждый отвечает<br /> за свою<br /> тишину");
once("values", "We are both<br /> agile and<br /> human-centered", "Гибко —<br /> и по-человечески<br /> бережно");
once("values", "Constantly<br /> working globally", "Всегда<br /> рядом — онлайн");
once("values", "In thy Dog you<br /> shall trust", "В помощь верь,<br /> но проверяй");
once("values", "Being platform<br /> agnostic is the<br /> only way", "Без привязки<br /> к платформе —<br /> открытый код");
once("values", "Keep evolving<br /> baby!", "Развиваемся<br /> тихо и постоянно");
once("values", "We love long-term<br /> relationships", "Ценим долгие<br /> и тихие истории");
once("values", "It’s all about honest<br /> communication", "Всё решает честный<br /> разговор");
r("values", "We like transparency.<br /> We mean...why not? So many brands and clients have been abused for too long with dark and hidden overhead costs and invisible puppet masters. Working with us means opening up transparent discussions. This is how good shit gets done",
  "Прозрачность — основа.<br /> Никаких скрытых механик, тёмных паттернов и невидимых манипуляторов: как работает платформа, видно всем. Открытость — это и есть помощь.");
once("values", "We Make<br /> Good Shit", "Мы слышим<br /> тебя");

/* ---------- CONTACT ---------- */
once("contact", "Chicago <b>.</b>", "Тишина <b>.</b>");
once("contact", "Amsterdam <b>.</b>", "Эмпатия <b>.</b>");
once("contact", "Paris <b>.</b>", "Забота <b>.</b>");
once("contact", ">Contact<", ">Связаться<");

/* ---------------- APPLY (all-or-nothing) ---------------- */
const files = [...new Set(S.map((e) => e.f))];
const contents = Object.fromEntries(files.map((f) => [f, fs.readFileSync(F(f), "utf8")]));

let misses = 0;
for (const e of S) {
  const src = contents[e.f];
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

for (const f of files) {
  const left = contents[f].match(/[Dd]ogstudio/g);
  if (left) console.log(`LEFT  ${f}: ${left.length} x dogstudio`);
}

if (misses) {
  console.log(`\n${misses} miss(es) — nothing written.`);
  process.exit(1);
}
for (const f of files) fs.writeFileSync(F(f), contents[f]);
console.log("\nFixups applied.");
