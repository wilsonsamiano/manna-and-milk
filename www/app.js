"use strict";

var KEY = "sunny-abc-v1";
var SVGNS = "http://www.w3.org/2000/svg";
var TRACE_RADIUS = 38;
var TRACE_NEED = 0.5;

var LETTER_RANGES = [
  { id: "A-E", label: "A to E", from: 0, to: 4 },
  { id: "F-J", label: "F to J", from: 5, to: 9 },
  { id: "K-O", label: "K to O", from: 10, to: 14 },
  { id: "P-T", label: "P to T", from: 15, to: 19 },
  { id: "U-Z", label: "U to Z", from: 20, to: 25 },
  { id: "A-Z", label: "All letters", from: 0, to: 25 },
];

var NUMBER_RANGES = [
  { id: "1-5", label: "1 to 5", from: 1, to: 5 },
  { id: "1-10", label: "1 to 10", from: 1, to: 10 },
  { id: "11-20", label: "11 to 20", from: 11, to: 20 },
  { id: "21-40", label: "21 to 40", from: 21, to: 40 },
  { id: "41-70", label: "41 to 70", from: 41, to: 70 },
  { id: "71-100", label: "71 to 100", from: 71, to: 100 },
];

var ONES = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];
var TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

function L(ch, lower, word, sound, say, strokes) {
  return { ch: ch, lower: lower, word: word, sound: sound, say: say, strokes: strokes };
}

var LETTERS = [
  L("A", "a", "apple", "ah", "A says ah. Apple.", ["M100 32 L46 188", "M100 32 L154 188", "M68 122 H132"]),
  L("B", "b", "ball", "buh", "B says buh. Ball.", [
    "M54 34 V188",
    "M54 34 H98 C148 34 152 54 152 74 C152 104 126 112 54 112",
    "M54 112 H104 C162 114 168 140 168 160 C168 188 138 188 54 188",
  ]),
  L("C", "c", "cat", "kuh", "C says kuh. Cat.", ["M158 52 C120 24 40 40 40 110 C40 180 120 198 158 168"]),
  L("D", "d", "dog", "duh", "D says duh. Dog.", [
    "M56 32 V188",
    "M56 32 H100 C158 32 170 70 170 110 C170 158 158 188 100 188 H56",
  ]),
  L("E", "e", "egg", "eh", "E says eh. Egg.", ["M56 32 V188", "M56 32 H150", "M56 110 H128", "M56 188 H150"]),
  L("F", "f", "fish", "fff", "F says fff. Fish.", ["M56 32 V188", "M56 32 H150", "M56 110 H128"]),
  L("G", "g", "goat", "guh", "G says guh. Goat.", [
    "M150 62 C112 28 36 38 36 110 C36 182 112 196 156 160",
    "M156 118 H102",
  ]),
  L("H", "h", "hat", "huh", "H says huh. Hat.", ["M52 32 V188", "M148 32 V188", "M52 110 H148"]),
  L("I", "i", "igloo", "ih", "I says ih. Igloo.", ["M100 32 V188", "M62 32 H138", "M62 188 H138"]),
  L("J", "j", "juice", "juh", "J says juh. Juice.", ["M78 32 H156", "M124 32 V146 C124 188 46 188 46 146"]),
  L("K", "k", "kite", "kuh", "K says kuh. Kite.", ["M56 32 V188", "M150 32 L56 116", "M84 96 L154 188"]),
  L("L", "l", "leaf", "lll", "L says lll. Leaf.", ["M64 32 V188", "M64 188 H156"]),
  L("M", "m", "moon", "mmm", "M says mmm. Moon.", ["M36 188 V36", "M36 36 L100 120", "M100 120 L164 36", "M164 36 V188"]),
  L("N", "n", "nest", "nnn", "N says nnn. Nest.", ["M48 188 V32", "M48 32 L152 188", "M152 188 V32"]),
  L("O", "o", "octopus", "aw", "O says aw. Octopus.", [
    "M100 32 C152 32 172 68 172 110 C172 160 152 190 100 190 C48 190 28 160 28 110 C28 68 48 32 100 32",
  ]),
  L("P", "p", "pig", "puh", "P says puh. Pig.", [
    "M56 32 V188",
    "M56 32 H102 C154 32 162 64 162 82 C162 118 142 128 56 128",
  ]),
  L("Q", "q", "queen", "kwuh", "Q says kwuh. Queen.", [
    "M100 32 C152 32 172 68 172 110 C172 160 152 190 100 190 C48 190 28 160 28 110 C28 68 48 32 100 32",
    "M146 156 L184 206",
  ]),
  L("R", "r", "rainbow", "ruh", "R says ruh. Rainbow.", [
    "M56 32 V188",
    "M56 32 H102 C154 32 162 64 162 82 C162 118 142 128 56 128",
    "M100 124 L158 188",
  ]),
  L("S", "s", "sun", "sss", "S says sss. Sun.", ["M150 58 C142 28 48 26 46 66 C44 100 156 96 154 142 C152 186 52 194 44 160"]),
  L("T", "t", "tree", "tuh", "T says tuh. Tree.", ["M100 32 V188", "M36 32 H164"]),
  L("U", "u", "umbrella", "uh", "U says uh. Umbrella.", ["M46 32 V128 C46 186 154 186 154 128 V32"]),
  L("V", "v", "van", "vvv", "V says vvv. Van.", ["M36 32 L100 188", "M164 32 L100 188"]),
  L("W", "w", "whale", "wuh", "W says wuh. Whale.", ["M28 32 L62 188", "M62 188 L100 84", "M100 84 L138 188", "M138 188 L172 32"]),
  L("X", "x", "xylophone", "ks", "X says ks. Xylophone.", ["M40 32 L160 188", "M160 32 L40 188"]),
  L("Y", "y", "yo-yo", "yuh", "Y says yuh. Yo-yo.", ["M40 32 L100 112", "M160 32 L100 112", "M100 112 V188"]),
  L("Z", "z", "zebra", "zzz", "Z says zzz. Zebra.", ["M40 32 H160", "M160 32 L40 188", "M40 188 H160"]),
];

var save = loadSave();
var ui = {
  screen: "home",
  mode: "look",
  back: "home",
  choiceKey: "",
  choices: [],
  findSolved: false,
  saidWrong: false,
  nudge: "",
  countTapped: {},
  countValue: 0,
  countDone: false,
};
var trace = {
  drawing: false,
  pointerId: null,
  moved: false,
  blockClick: false,
  strokes: [],
  samples: [],
  done: [],
  finished: false,
  guides: null,
  ink: null,
  line: null,
};
var voices = [];
var liveUtterance = null;
var audioCtx = null;
var holdTimer = 0;
var holdEl = null;

function rangeById(list, id) {
  var i;
  for (i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
  return null;
}

function defaults() {
  return {
    v: 1,
    voice: true,
    theme: "auto",
    letterRange: "A-E",
    numberRange: "1-10",
    letterIndex: 0,
    numberIndex: 1,
  };
}

function loadSave() {
  var d = defaults();
  try {
    var raw = localStorage.getItem(KEY);
    if (raw) {
      var p = JSON.parse(raw);
      if (p && typeof p === "object") {
        if (p.voice === false) d.voice = false;
        if (p.theme === "light" || p.theme === "dark" || p.theme === "auto") d.theme = p.theme;
        if (rangeById(LETTER_RANGES, p.letterRange)) d.letterRange = p.letterRange;
        if (rangeById(NUMBER_RANGES, p.numberRange)) d.numberRange = p.numberRange;
        if (typeof p.letterIndex === "number") d.letterIndex = p.letterIndex | 0;
        if (typeof p.numberIndex === "number") d.numberIndex = p.numberIndex | 0;
      }
    }
  } catch (err) {}
  var lr = rangeById(LETTER_RANGES, d.letterRange);
  if (d.letterIndex < lr.from || d.letterIndex > lr.to) d.letterIndex = lr.from;
  var nr = rangeById(NUMBER_RANGES, d.numberRange);
  if (d.numberIndex < nr.from || d.numberIndex > nr.to) d.numberIndex = nr.from;
  return d;
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(save));
  } catch (err) {}
}

function currentLetterRange() {
  return rangeById(LETTER_RANGES, save.letterRange) || LETTER_RANGES[0];
}

function currentNumberRange() {
  return rangeById(NUMBER_RANGES, save.numberRange) || NUMBER_RANGES[1];
}

function currentLetter() {
  var r = currentLetterRange();
  if (save.letterIndex < r.from || save.letterIndex > r.to) save.letterIndex = r.from;
  return LETTERS[save.letterIndex];
}

function currentNumber() {
  var r = currentNumberRange();
  if (save.numberIndex < r.from || save.numberIndex > r.to) save.numberIndex = r.from;
  return save.numberIndex;
}

function numberWord(n) {
  if (n === 100) return "one hundred";
  if (n < 20) return ONES[n];
  var t = Math.floor(n / 10);
  var o = n % 10;
  return o ? TENS[t] + "-" + ONES[o] : TENS[t];
}

function placeCaption(n) {
  if (n === 100) return "10 tens";
  var t = Math.floor(n / 10);
  var o = n % 10;
  var tens = t === 1 ? "1 ten" : t + " tens";
  if (!o) return tens;
  return tens + " and " + (o === 1 ? "1 one" : o + " ones");
}

function shuffle(list) {
  var a = list.slice();
  var i, j, tmp;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
}

function makeLetterChoices(index) {
  var r = currentLetterRange();
  var pool = [];
  var i;
  for (i = r.from; i <= r.to; i++) if (i !== index) pool.push(i);
  if (pool.length < 2) {
    for (i = 0; i < LETTERS.length; i++) if (i !== index && pool.indexOf(i) === -1) pool.push(i);
  }
  pool = shuffle(pool);
  return shuffle([index, pool[0], pool[1]]);
}

function makeNumberChoices(n) {
  var r = currentNumberRange();
  var pool = [];
  var i;
  for (i = r.from; i <= r.to; i++) if (i !== n) pool.push(i);
  pool.sort(function (a, b) {
    return Math.abs(a - n) - Math.abs(b - n);
  });
  var near = shuffle(pool.slice(0, Math.min(6, pool.length)));
  return shuffle([n, near[0], near[1]]);
}

function pic(word) {
  var src = window.PIC_DATA && PIC_DATA[word] ? PIC_DATA[word] : "pics/" + word + ".jpg";
  return '<img class="pic" alt="" draggable="false" src="' + src + '">';
}

function speakerIcon() {
  return '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 9h4l5-4v14l-5-4H4z"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M16 9.5a3.5 3.5 0 010 5M18.5 7a7 7 0 010 10"/></svg>';
}

function houseIcon() {
  return '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 11 L12 4 L20 11 V20 H15 V14 H9 V20 H4 Z"/></svg>';
}

function sunIcon() {
  return '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="currentColor"/><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5 5l1.6 1.6M17.4 17.4L19 19M19 5l-1.6 1.6M6.6 17.4L5 19"/></g></svg>';
}

function chevron(dir) {
  var d = dir === "left" ? "M14 5 L7 12 L14 19" : "M10 5 L17 12 L10 19";
  return (
    '<svg class="ico ico-lg" viewBox="0 0 24 24" aria-hidden="true"><path d="' +
    d +
    '" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  );
}

function modeIcon(kind) {
  if (kind === "look") {
    return '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M2 12s4-6.5 10-6.5S22 12 22 12s-4 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="2.6" fill="currentColor"/></svg>';
  }
  if (kind === "find") {
    return '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="5.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M14.8 14.8 L20 20" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';
  }
  if (kind === "trace") {
    return '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 16c4-1 6-8 8-12 1.5 4 3.2 7 8 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M14 6l2.2-2.2L19 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  return '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="6.5" cy="13" r="3" fill="currentColor"/><circle cx="13" cy="8.5" r="3" fill="currentColor"/><circle cx="17.5" cy="15" r="3" fill="currentColor"/></svg>';
}

function header(withHome) {
  var home = withHome
    ? '<button class="icon-btn" data-action="home" aria-label="Home">' + houseIcon() + "</button>"
    : "";
  return (
    '<header class="top' +
    (withHome ? " with-home" : "") +
    '">' +
    home +
    '<button class="icon-btn sun-btn" data-action="grownups" aria-label="Grown-ups. Hold to open.">' +
    sunIcon() +
    "</button></header>"
  );
}

function nav(modes) {
  var i;
  var html = "";
  for (i = 0; i < modes.length; i++) {
    var m = modes[i];
    var on = ui.mode === m.id;
    html +=
      '<button class="mode-btn' +
      (on ? " on" : "") +
      '" data-action="mode" data-mode="' +
      m.id +
      '" aria-pressed="' +
      (on ? "true" : "false") +
      '">' +
      m.icon +
      "<span>" +
      m.label +
      "</span></button>";
  }
  var nextLabel = ui.screen === "numbers" ? "Next number" : "Next letter";
  var prevLabel = ui.screen === "numbers" ? "Previous number" : "Previous letter";
  return (
    '<nav class="nav"><button class="nav-btn" data-action="prev" aria-label="' +
    prevLabel +
    '">' +
    chevron("left") +
    '</button><div class="modes">' +
    html +
    '</div><button class="nav-btn next" data-action="next" aria-label="' +
    nextLabel +
    '">' +
    chevron("right") +
    "</button></nav>"
  );
}

function againBtn() {
  return '<button class="again" data-action="again">Try again</button>';
}

function wordHtml(word) {
  return '<span class="word"><span class="word-first">' + word.charAt(0) + "</span>" + word.slice(1) + "</span>";
}

function quantityHtml(n, interactive) {
  var i;
  var html = "";
  if (n <= 10) {
    html = '<div class="dots">';
    var lg = n <= 5 ? " dot-lg" : "";
    for (i = 0; i < n; i++) {
      var on = !interactive || ui.countTapped["d" + i];
      if (interactive) {
        html +=
          '<button class="dot' +
          lg +
          (on ? " on" : "") +
          '" data-action="dot" data-i="' +
          i +
          '" aria-label="Dot ' +
          (i + 1) +
          '"></button>';
      } else {
        html += '<span class="dot' + lg + ' on"></span>';
      }
    }
    return html + "</div>";
  }
  var tens = Math.floor(n / 10);
  var ones = n % 10;
  if (!interactive) html += '<p class="place">' + placeCaption(n) + "</p>";
  html += '<div class="bars">';
  var sm = tens >= 8 ? " ten-sm" : "";
  for (i = 0; i < tens; i++) {
    var ton = !interactive || ui.countTapped["t" + i];
    var inner = '<span class="ten-pips"></span><span class="ten-label">10</span>';
    if (interactive) {
      html +=
        '<button class="ten' +
        sm +
        (ton ? " on" : "") +
        '" data-action="ten" data-i="' +
        i +
        '" aria-label="Ten">' +
        inner +
        "</button>";
    } else {
      html += '<div class="ten' + sm + ' on">' + inner + "</div>";
    }
  }
  html += "</div>";
  if (ones) {
    html += '<div class="dots dots-ones">';
    for (i = 0; i < ones; i++) {
      var oon = !interactive || ui.countTapped["o" + i];
      if (interactive) {
        html +=
          '<button class="dot' +
          (oon ? " on" : "") +
          '" data-action="one" data-i="' +
          i +
          '" aria-label="One"></button>';
      } else {
        html += '<span class="dot on"></span>';
      }
    }
    html += "</div>";
  }
  return html;
}

function renderHome() {
  var lr = currentLetterRange();
  var nr = currentNumberRange();
  return (
    '<main class="screen" data-screen="home">' +
    header(false) +
    '<div class="home-main"><h1 class="brand">Sunny ABC</h1><p class="lede">Letters and numbers</p><div class="pick">' +
    '<button class="pick-card" data-action="letters"><span class="pair pair-card"><span class="upper">A</span><span class="lower">a</span></span><span class="pick-label">Letters</span></button>' +
    '<button class="pick-card" data-action="numbers"><span class="num">123</span><span class="pick-label">Numbers</span></button>' +
    "</div></div>" +
    '<p class="hint">Now: ' +
    lr.label +
    " · " +
    nr.label +
    "<br>Hold the sun for grown-ups</p></main>"
  );
}

function renderLetterLook(item) {
  return (
    '<div class="stage"><div class="look">' +
    '<button class="letter-hit" data-action="hear" aria-label="Hear ' +
    item.ch +
    '"><span class="pair"><span class="upper">' +
    item.ch +
    '</span><span class="lower">' +
    item.lower +
    "</span></span>" +
    wordHtml(item.word) +
    '<span class="sound">' +
    speakerIcon() +
    " says " +
    item.sound +
    "</span></button>" +
    '<button class="pic-card" data-action="hear" aria-label="' +
    item.word +
    '">' +
    pic(item.word) +
    "</button></div></div>"
  );
}

function renderLetterFind(item) {
  var html = "";
  var i;
  for (i = 0; i < ui.choices.length; i++) {
    var id = ui.choices[i];
    var choice = LETTERS[id];
    var cls = "choice";
    if (ui.findSolved && id === save.letterIndex) cls += " is-right";
    else if (ui.findSolved) cls += " is-dim";
    if (ui.nudge === String(id)) cls += " nudge";
    html +=
      '<button class="' +
      cls +
      '" data-action="pick" data-id="' +
      id +
      '" aria-label="' +
      choice.word +
      '">' +
      pic(choice.word) +
      '<span class="choice-word">' +
      choice.word +
      "</span></button>";
  }
  var feedback = ui.findSolved ? "Yes! " + item.word : ui.saidWrong ? "Let's look again" : "";
  return (
    '<div class="stage"><div class="find"><p class="prompt"><span class="prompt-ch">' +
    item.ch +
    "</span> Find the " +
    item.word +
    '</p><div class="choices">' +
    html +
    '</div><p class="feedback" role="status">' +
    feedback +
    "</p>" +
    againBtn() +
    "</div></div>"
  );
}

function renderTrace(item) {
  var paths = "";
  var i;
  for (i = 0; i < item.strokes.length; i++) {
    paths += '<path class="guide" d="' + item.strokes[i] + '"></path>';
  }
  return (
    '<div class="stage"><div class="trace-wrap"><p class="prompt">Trace <span class="prompt-ch">' +
    item.ch +
    '</span> <span class="lower">' +
    item.lower +
    '</span></p><div class="trace-card"><svg class="trace-board" viewBox="0 0 200 220" role="img" aria-label="Trace the letter ' +
    item.ch +
    '"><g class="guides">' +
    paths +
    '</g><g class="arrows"></g><g class="ink"></g><g class="steps"></g></svg></div><p class="feedback" role="status">Follow the arrows</p>' +
    againBtn() +
    "</div></div>"
  );
}

function renderNumberLook(n) {
  return (
    '<div class="stage"><div class="look"><button class="letter-hit" data-action="hear" aria-label="Hear ' +
    numberWord(n) +
    '"><span class="num">' +
    n +
    '</span><span class="word">' +
    numberWord(n) +
    '</span><span class="sound">' +
    speakerIcon() +
    ' hear it</span></button><div class="qty">' +
    quantityHtml(n, false) +
    "</div></div></div>"
  );
}

function renderCount(n) {
  var tally = ui.countValue > 0 ? String(ui.countValue) : "–";
  var feedback = ui.countDone ? "Yes! " + numberWord(n) : "";
  return (
    '<div class="stage"><div class="count-wrap"><p class="prompt">' +
    (n <= 10 ? "Tap each dot" : "Tap each block") +
    '</p><p class="tally" aria-live="polite">' +
    tally +
    '</p><div class="qty">' +
    quantityHtml(n, true) +
    '</div><p class="feedback" role="status">' +
    feedback +
    "</p>" +
    againBtn() +
    "</div></div>"
  );
}

function renderNumberFind(n) {
  var html = "";
  var i;
  for (i = 0; i < ui.choices.length; i++) {
    var val = ui.choices[i];
    var cls = "choice choice-num";
    if (ui.findSolved && val === n) cls += " is-right";
    else if (ui.findSolved) cls += " is-dim";
    if (ui.nudge === String(val)) cls += " nudge";
    html +=
      '<button class="' +
      cls +
      '" data-action="pick" data-id="' +
      val +
      '" aria-label="' +
      numberWord(val) +
      '">' +
      val +
      "</button>";
  }
  var feedback = ui.findSolved ? "Yes! " + numberWord(n) : ui.saidWrong ? "Let's look again" : "";
  return (
    '<div class="stage"><div class="find"><p class="prompt">Find</p><p class="num num-mid">' +
    n +
    '</p><div class="choices">' +
    html +
    '</div><p class="feedback" role="status">' +
    feedback +
    "</p>" +
    againBtn() +
    "</div></div>"
  );
}

function chips(list, current, action) {
  var i;
  var html = "";
  for (i = 0; i < list.length; i++) {
    var item = list[i];
    var on = item.id === current;
    html +=
      '<button class="chip' +
      (on ? " on" : "") +
      '" data-action="' +
      action +
      '" data-id="' +
      item.id +
      '" aria-pressed="' +
      (on ? "true" : "false") +
      '">' +
      item.label +
      "</button>";
  }
  return html;
}

function themeChip(id, label) {
  var on = (save.theme || "auto") === id;
  return (
    '<button class="chip' +
    (on ? " on" : "") +
    '" data-action="theme" data-value="' +
    id +
    '" aria-pressed="' +
    (on ? "true" : "false") +
    '">' +
    label +
    "</button>"
  );
}

function wantsDark() {
  var mode = save.theme || "auto";
  if (mode === "dark") return true;
  if (mode === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme() {
  var dark = wantsDark();
  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", dark ? "#1b2430" : "#FFF4E4");
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "sunny-theme", dark: dark }, window.location.origin);
    }
  } catch (err) {}
}

function renderGrown() {
  return (
    '<main class="screen" data-screen="grownups">' +
    header(true) +
    '<div class="grown-body"><h1 class="g-title">For grown-ups</h1>' +
    "<p class=\"g-note\">Pick a small set. Look comes first. Find, trace, and count are there when you want them. Nothing is timed, and there is no score.</p>" +
    '<section class="g-sec"><h2 class="g-label">Letters</h2><div class="chips">' +
    chips(LETTER_RANGES, save.letterRange, "letter-range") +
    "</div></section>" +
    '<section class="g-sec"><h2 class="g-label">Numbers</h2><div class="chips">' +
    chips(NUMBER_RANGES, save.numberRange, "number-range") +
    "</div></section>" +
    '<section class="g-sec"><h2 class="g-label">Sound</h2><div class="chips">' +
    '<button class="chip' +
    (save.voice ? " on" : "") +
    '" data-action="voice" data-value="on" aria-pressed="' +
    (save.voice ? "true" : "false") +
    '">On</button>' +
    '<button class="chip' +
    (!save.voice ? " on" : "") +
    '" data-action="voice" data-value="off" aria-pressed="' +
    (!save.voice ? "true" : "false") +
    '">Off</button></div>' +
    "<p class=\"g-note\">On uses this tablet's own voice, even offline. Off keeps the room quiet. The words stay on the screen either way.</p>" +
    "</section>" +
    '<section class="g-sec"><h2 class="g-label">Appearance</h2><div class="chips">' +
    themeChip("auto", "Auto") +
    themeChip("light", "Light") +
    themeChip("dark", "Dark") +
    "</div>" +
    '<p class="g-note">Auto follows this tablet. Light and Dark stay put.</p>' +
    "</section></div>" +
    '<div class="grown-foot">' +
    (window.SUNNY_SINGLE
      ? ""
      : '<p class="g-note"><a href="sunny-abc.html" download="Sunny-ABC.html">Download the one-file page</a></p>') +
    '<p class="coffee"><a href="https://buymeacoffee.com/wilsonsamiano" target="_blank" rel="noopener noreferrer">Buy me a coffee</a></p><button class="done" data-action="done">Done</button></div></main>'
  );
}

function renderPlay() {
  var stage;
  var modes;
  if (ui.screen === "letters") {
    var item = currentLetter();
    modes = [
      { id: "look", label: "Look", icon: modeIcon("look") },
      { id: "find", label: "Find", icon: modeIcon("find") },
      { id: "trace", label: "Trace", icon: modeIcon("trace") },
    ];
    if (ui.mode === "find") stage = renderLetterFind(item);
    else if (ui.mode === "trace") stage = renderTrace(item);
    else stage = renderLetterLook(item);
  } else {
    var n = currentNumber();
    modes = [
      { id: "look", label: "Look", icon: modeIcon("look") },
      { id: "count", label: "Count", icon: modeIcon("count") },
      { id: "find", label: "Find", icon: modeIcon("find") },
    ];
    if (ui.mode === "count") stage = renderCount(n);
    else if (ui.mode === "find") stage = renderNumberFind(n);
    else stage = renderNumberLook(n);
  }
  return (
    '<main class="screen" data-screen="' +
    ui.screen +
    '" data-mode="' +
    ui.mode +
    '">' +
    header(true) +
    stage +
    nav(modes) +
    "</main>"
  );
}

function activityKey() {
  if (ui.screen === "letters") return "L:" + ui.mode + ":" + save.letterIndex + ":" + save.letterRange;
  if (ui.screen === "numbers") return "N:" + ui.mode + ":" + save.numberIndex + ":" + save.numberRange;
  return "";
}

function ensureActivity() {
  var key = activityKey();
  if (!key || key === ui.choiceKey) return;
  ui.choiceKey = key;
  ui.findSolved = false;
  ui.saidWrong = false;
  ui.nudge = "";
  ui.countTapped = {};
  ui.countValue = 0;
  ui.countDone = false;
  ui.choices = [];
  if (ui.screen === "letters" && ui.mode === "find") ui.choices = makeLetterChoices(save.letterIndex);
  if (ui.screen === "numbers" && ui.mode === "find") ui.choices = makeNumberChoices(save.numberIndex);
}

function setTitle() {
  var t = "Sunny ABC";
  if (ui.screen === "letters") t = "Sunny ABC · " + currentLetter().ch;
  else if (ui.screen === "numbers") t = "Sunny ABC · " + currentNumber();
  else if (ui.screen === "grownups") t = "Sunny ABC · Grown-ups";
  document.title = t;
}

function render() {
  ensureActivity();
  var app = document.getElementById("app");
  var html = "";
  if (ui.screen === "home") html = renderHome();
  else if (ui.screen === "grownups") html = renderGrown();
  else html = renderPlay();
  app.innerHTML = html;
  setTitle();
  if (ui.screen === "letters" && ui.mode === "trace") setupTrace();
}

function pickVoice(list) {
  var en = [];
  var i;
  for (i = 0; i < list.length; i++) {
    var lang = (list[i].lang || "").toLowerCase();
    if (lang.indexOf("en") === 0) en.push(list[i]);
  }
  for (i = 0; i < en.length; i++) {
    if (en[i].localService && (en[i].lang || "").toLowerCase().indexOf("en-us") === 0) return en[i];
  }
  for (i = 0; i < en.length; i++) {
    if ((en[i].lang || "").toLowerCase().indexOf("en-us") === 0) return en[i];
  }
  return en.length ? en[0] : null;
}

function warmVoices() {
  if (!window.speechSynthesis) return;
  try {
    voices = window.speechSynthesis.getVoices() || [];
    window.speechSynthesis.onvoiceschanged = function () {
      voices = window.speechSynthesis.getVoices() || [];
    };
  } catch (err) {}
}

var spoken = null;
var chimeUrl = "";
var chimeAudio = null;
var advanceTimer = 0;

function clearAdvance() {
  if (advanceTimer) window.clearTimeout(advanceTimer);
  advanceTimer = 0;
}

function happyChimeUrl() {
  if (chimeUrl) return chimeUrl;
  var sr = 16000;
  var dur = 0.82;
  var n = Math.floor(sr * dur);
  var notes = [
    { f: 1046, t: 0, d: 0.2 },
    { f: 1318, t: 0.12, d: 0.2 },
    { f: 1568, t: 0.24, d: 0.22 },
    { f: 2093, t: 0.38, d: 0.4 },
  ];
  var samples = new Float32Array(n);
  var i;
  var k;
  for (i = 0; i < n; i++) {
    var tt = i / sr;
    var s = 0;
    for (k = 0; k < notes.length; k++) {
      var note = notes[k];
      var local = tt - note.t;
      if (local < 0 || local > note.d) continue;
      var amp = local < 0.015 ? local / 0.015 : 1;
      var tail = (note.d - local) / 0.12;
      if (tail < 1) amp *= tail > 0 ? tail : 0;
      s += Math.sin(2 * Math.PI * note.f * local) * amp;
      s += Math.sin(2 * Math.PI * note.f * 2 * local) * amp * 0.18;
    }
    if (s > 1) s = 1;
    if (s < -1) s = -1;
    samples[i] = s * 0.72;
  }
  var buffer = new ArrayBuffer(44 + n * 2);
  var view = new DataView(buffer);
  function write(offset, text) {
    var c;
    for (c = 0; c < text.length; c++) view.setUint8(offset + c, text.charCodeAt(c));
  }
  write(0, "RIFF");
  view.setUint32(4, 36 + n * 2, true);
  write(8, "WAVE");
  write(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sr, true);
  view.setUint32(28, sr * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  write(36, "data");
  view.setUint32(40, n * 2, true);
  for (i = 0; i < n; i++) view.setInt16(44 + i * 2, samples[i] * 32767, true);
  var bytes = new Uint8Array(buffer);
  var bin = "";
  var chunk = 4096;
  for (i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  chimeUrl = "data:audio/wav;base64," + btoa(bin);
  return chimeUrl;
}

function chime() {
  if (!save.voice) return;
  try {
    if (!chimeAudio) {
      chimeAudio = new Audio(happyChimeUrl());
      chimeAudio.preload = "auto";
    }
    chimeAudio.volume = 1;
    try {
      chimeAudio.currentTime = 0;
    } catch (err) {}
    var play = chimeAudio.play();
    if (play && play.catch) play.catch(function () {});
  } catch (err) {}
}

function scheduleAdvance() {
  clearAdvance();
  var screen = ui.screen;
  var mode = ui.mode;
  var letter = save.letterIndex;
  var number = save.numberIndex;
  advanceTimer = window.setTimeout(function () {
    advanceTimer = 0;
    if (ui.screen !== screen || ui.mode !== "find" || mode !== "find") return;
    if (screen === "letters" && save.letterIndex !== letter) return;
    if (screen === "numbers" && save.numberIndex !== number) return;
    if (!ui.findSolved) return;
    step(1);
  }, 2800);
}

function speak(text) {
  if (!save.voice || !text) return;
  if (window.CLIPS && CLIPS[text]) {
    if (spoken) {
      try {
        spoken.pause();
      } catch (err) {}
    }
    var src = CLIPS[text];
    if (src.indexOf("data:") !== 0) src = "voice/" + src;
    spoken = new Audio(src);
    spoken.volume = 1;
    var play = spoken.play();
    if (play && play.catch) play.catch(function () {});
    return;
  }
  if (!window.speechSynthesis) return;
  try {
    var syn = window.speechSynthesis;
    var u = new SpeechSynthesisUtterance(text);
    liveUtterance = u;
    u.rate = 0.86;
    u.pitch = 1.04;
    u.lang = "en-US";
    u.volume = 1;
    var v = pickVoice(voices.length ? voices : syn.getVoices() || []);
    if (v && v.localService !== false) u.voice = v;
    try {
      syn.resume();
    } catch (err) {}
    if (syn.speaking || syn.pending) syn.cancel();
    syn.speak(u);
    try {
      syn.resume();
    } catch (err) {}
  } catch (err) {}
}

function speakCurrent() {
  if (ui.screen === "letters") {
    var item = currentLetter();
    if (ui.mode === "find") speak("Find the " + item.word + ".");
    else if (ui.mode === "trace") speak("Trace " + item.ch + ".");
    else speak(item.say);
  } else if (ui.screen === "numbers") {
    var n = currentNumber();
    var word = numberWord(n);
    if (ui.mode === "find") speak("Find " + word + ".");
    else if (ui.mode === "count") speak(n <= 10 ? "Tap each dot." : "Tap each block.");
    else speak(word + ".");
  }
}

function goHome() {
  clearAdvance();
  ui.screen = "home";
  render();
}

function goLetters() {
  ui.screen = "letters";
  ui.mode = "look";
  ui.choiceKey = "";
  render();
  speakCurrent();
}

function goNumbers() {
  ui.screen = "numbers";
  ui.mode = "look";
  ui.choiceKey = "";
  render();
  speakCurrent();
}

function setMode(mode) {
  if (!mode) return;
  clearAdvance();
  if (ui.mode === mode) {
    speakCurrent();
    return;
  }
  ui.mode = mode;
  ui.choiceKey = "";
  render();
  speakCurrent();
}

function step(dir) {
  clearAdvance();
  if (ui.screen === "letters") {
    var r = currentLetterRange();
    var i = save.letterIndex + dir;
    if (i > r.to) i = r.from;
    if (i < r.from) i = r.to;
    save.letterIndex = i;
  } else if (ui.screen === "numbers") {
    var nr = currentNumberRange();
    var n = save.numberIndex + dir;
    if (n > nr.to) n = nr.from;
    if (n < nr.from) n = nr.to;
    save.numberIndex = n;
  } else return;
  persist();
  ui.choiceKey = "";
  render();
  speakCurrent();
}

function onAgain() {
  clearAdvance();
  ui.choiceKey = "";
  render();
}

function onDone() {
  ui.screen = ui.back && ui.back !== "grownups" ? ui.back : "home";
  ui.choiceKey = "";
  render();
}

function openGrownups() {
  if (ui.screen !== "grownups") ui.back = ui.screen;
  ui.screen = "grownups";
  if (window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch (err) {}
  }
  render();
}

function setLetterRange(id) {
  var r = rangeById(LETTER_RANGES, id);
  if (!r) return;
  save.letterRange = id;
  save.letterIndex = r.from;
  ui.choiceKey = "";
  persist();
  render();
}

function setNumberRange(id) {
  var r = rangeById(NUMBER_RANGES, id);
  if (!r) return;
  save.numberRange = id;
  save.numberIndex = r.from;
  ui.choiceKey = "";
  persist();
  render();
}

function setTheme(mode) {
  if (mode !== "light" && mode !== "dark" && mode !== "auto") return;
  save.theme = mode;
  persist();
  applyTheme();
  render();
}

function setVoice(on) {
  save.voice = on;
  persist();
  if (!on && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch (err) {}
  }
  render();
}

function onPick(raw) {
  var id = Number(raw);
  var correct = ui.screen === "letters" ? save.letterIndex : save.numberIndex;
  if (ui.findSolved) {
    if (id === correct) speakCurrent();
    return;
  }
  if (id === correct) {
    ui.findSolved = true;
    ui.nudge = "";
    render();
    chime();
    scheduleAdvance();
  } else {
    ui.nudge = String(id);
    var first = !ui.saidWrong;
    ui.saidWrong = true;
    render();
    ui.nudge = "";
    if (first) speak("Let's look again.");
  }
}

function afterCount(add) {
  if (ui.countDone) return;
  ui.countValue += add;
  var target = currentNumber();
  var done = ui.countValue >= target;
  if (done) ui.countDone = true;
  render();
  speak(numberWord(ui.countValue) + ".");
  if (done) chime();
}

function onDot(raw) {
  if (ui.countDone) return;
  var key = "d" + raw;
  if (ui.countTapped[key]) return;
  ui.countTapped[key] = true;
  afterCount(1);
}

function onTen(raw) {
  if (ui.countDone) return;
  var key = "t" + raw;
  if (ui.countTapped[key]) return;
  ui.countTapped[key] = true;
  afterCount(10);
}

function onOne(raw) {
  if (ui.countDone) return;
  var key = "o" + raw;
  if (ui.countTapped[key]) return;
  ui.countTapped[key] = true;
  afterCount(1);
}

function onClick(e) {
  if (trace.blockClick) {
    trace.blockClick = false;
    return;
  }
  var btn = e.target.closest ? e.target.closest("[data-action]") : null;
  if (!btn) return;
  var action = btn.getAttribute("data-action");
  if (action === "grownups") return;
  if (action === "home") goHome();
  else if (action === "letters") goLetters();
  else if (action === "numbers") goNumbers();
  else if (action === "done") onDone();
  else if (action === "next") step(1);
  else if (action === "prev") step(-1);
  else if (action === "mode") setMode(btn.getAttribute("data-mode"));
  else if (action === "hear") speakCurrent();
  else if (action === "again") onAgain();
  else if (action === "pick") onPick(btn.getAttribute("data-id"));
  else if (action === "dot") onDot(btn.getAttribute("data-i"));
  else if (action === "ten") onTen(btn.getAttribute("data-i"));
  else if (action === "one") onOne(btn.getAttribute("data-i"));
  else if (action === "letter-range") setLetterRange(btn.getAttribute("data-id"));
  else if (action === "number-range") setNumberRange(btn.getAttribute("data-id"));
  else if (action === "voice") setVoice(btn.getAttribute("data-value") === "on");
  else if (action === "theme") setTheme(btn.getAttribute("data-value"));
}

function clearHold() {
  if (holdTimer) window.clearTimeout(holdTimer);
  holdTimer = 0;
  if (holdEl) holdEl.classList.remove("holding");
  holdEl = null;
}

function startHold(el, e) {
  clearHold();
  holdEl = el;
  el.classList.add("holding");
  if (e && e.preventDefault) e.preventDefault();
  holdTimer = window.setTimeout(function () {
    holdTimer = 0;
    holdEl = null;
    openGrownups();
  }, 700);
}

function localPoint(svg, event) {
  var pt = svg.createSVGPoint();
  pt.x = event.clientX;
  pt.y = event.clientY;
  var ctm = svg.getScreenCTM();
  if (!ctm) return null;
  var p = pt.matrixTransform(ctm.inverse());
  return { x: p.x, y: p.y };
}

function samplePath(path, step) {
  var len = path.getTotalLength();
  var out = [];
  if (!len) return out;
  var d;
  for (d = 0; d <= len; d += step) out.push(path.getPointAtLength(Math.min(d, len)));
  return out;
}

function coverage(samples, points) {
  if (!samples.length || !points.length) return 0;
  var hit = 0;
  var i, j;
  var r2 = TRACE_RADIUS * TRACE_RADIUS;
  for (i = 0; i < samples.length; i++) {
    var s = samples[i];
    for (j = 0; j < points.length; j++) {
      var dx = points[j].x - s.x;
      var dy = points[j].y - s.y;
      if (dx * dx + dy * dy <= r2) {
        hit++;
        break;
      }
    }
  }
  return hit / samples.length;
}

function paintTraceGuides() {
  if (!trace.guides) return;
  var i;
  var active = -1;
  for (i = 0; i < trace.guides.length; i++) {
    if (!trace.done[i] && active < 0) active = i;
  }
  for (i = 0; i < trace.guides.length; i++) {
    var cls = "guide";
    if (trace.done[i]) cls += " ok";
    else if (i === active) cls += " on";
    trace.guides[i].setAttribute("class", cls);
  }
}

function addArrow(group, path) {
  if (!group) return;
  var len = path.getTotalLength();
  if (len < 12) return;
  var d = Math.min(len * 0.42, len - 6);
  var p = path.getPointAtLength(d);
  var p2 = path.getPointAtLength(Math.min(d + 10, len));
  var ang = (Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI;
  var poly = document.createElementNS(SVGNS, "polygon");
  poly.setAttribute("points", "-8,-7 12,0 -8,7");
  poly.setAttribute("transform", "translate(" + p.x + " " + p.y + ") rotate(" + ang + ")");
  poly.setAttribute("fill", "var(--coral-deep)");
  poly.setAttribute("stroke", "var(--ink)");
  poly.setAttribute("stroke-width", "1.5");
  poly.setAttribute("stroke-linejoin", "round");
  group.appendChild(poly);
}

function addStep(group, path, num, placed) {
  if (!group) return;
  var p = path.getPointAtLength(0);
  var x = p.x;
  var y = p.y;
  var tries = 0;
  var k;
  while (tries < 6) {
    var ok = true;
    for (k = 0; k < placed.length; k++) {
      var dx = placed[k].x - x;
      var dy = placed[k].y - y;
      if (dx * dx + dy * dy < 26 * 26) ok = false;
    }
    if (ok) break;
    y += 18;
    tries++;
  }
  x = Math.max(14, Math.min(186, x));
  y = Math.max(14, Math.min(206, y));
  placed.push({ x: x, y: y });
  var c = document.createElementNS(SVGNS, "circle");
  c.setAttribute("cx", x);
  c.setAttribute("cy", y);
  c.setAttribute("r", "12");
  c.setAttribute("fill", "var(--sun)");
  c.setAttribute("stroke", "var(--ink)");
  c.setAttribute("stroke-width", "2");
  var t = document.createElementNS(SVGNS, "text");
  t.setAttribute("x", x);
  t.setAttribute("y", y);
  t.setAttribute("dy", "0.35em");
  t.setAttribute("text-anchor", "middle");
  t.setAttribute("font-size", "15");
  t.setAttribute("font-weight", "700");
  t.setAttribute("font-family", "sans-serif");
  t.setAttribute("fill", "var(--ink)");
  t.textContent = String(num);
  group.appendChild(c);
  group.appendChild(t);
}

function setupTrace() {
  var svg = document.querySelector(".trace-board");
  trace.drawing = false;
  trace.pointerId = null;
  trace.strokes = [];
  trace.samples = [];
  trace.done = [];
  trace.finished = false;
  trace.guides = null;
  trace.ink = null;
  trace.line = null;
  if (!svg) return;
  var guides = svg.querySelectorAll("path.guide");
  var arrows = svg.querySelector(".arrows");
  var steps = svg.querySelector(".steps");
  var placed = [];
  var i;
  trace.guides = guides;
  trace.ink = svg.querySelector(".ink");
  for (i = 0; i < guides.length; i++) {
    trace.samples.push(samplePath(guides[i], 12));
    trace.done.push(false);
    addArrow(arrows, guides[i]);
    addStep(steps, guides[i], i + 1, placed);
  }
  paintTraceGuides();
}

function tracePoints() {
  var out = [];
  var i;
  var j;
  for (i = 0; i < trace.strokes.length; i++) {
    for (j = 0; j < trace.strokes[i].length; j++) out.push(trace.strokes[i][j]);
  }
  return out;
}

function beginStroke() {
  var stroke = [];
  var line = document.createElementNS(SVGNS, "polyline");
  trace.strokes.push(stroke);
  line.setAttribute("class", "draw-line");
  line.setAttribute("points", "");
  if (trace.ink) trace.ink.appendChild(line);
  trace.line = line;
  return stroke;
}

function paintLine() {
  if (!trace.line || !trace.strokes.length) return;
  var pts = trace.strokes[trace.strokes.length - 1];
  var i;
  var s = "";
  for (i = 0; i < pts.length; i++) {
    if (i) s += " ";
    s += Math.round(pts[i].x) + "," + Math.round(pts[i].y);
  }
  trace.line.setAttribute("points", s);
}

function traceProgress() {
  if (!trace.samples.length || trace.finished) return;
  var i;
  var all = trace.samples.length > 0;
  for (i = 0; i < trace.samples.length; i++) {
    if (!trace.done[i] && coverage(trace.samples[i], tracePoints()) >= TRACE_NEED) trace.done[i] = true;
    if (!trace.done[i]) all = false;
  }
  paintTraceGuides();
  if (all && tracePoints().length > 6) {
    trace.finished = true;
    var note = document.querySelector(".feedback");
    if (note) note.textContent = "Yes! Nice tracing.";
    chime();
    speak("Nice tracing.");
  }
}

function startDraw(e, svg) {
  if (e.button && e.button !== 0) return;
  if (trace.drawing) endDraw();
  beginStroke();
  trace.drawing = true;
  trace.pointerId = e.pointerId;
  trace.moved = false;
  try {
    svg.setPointerCapture(e.pointerId);
  } catch (err) {}
  if (e.preventDefault) e.preventDefault();
  addPoint(e, svg);
}

function addPoint(e, svg) {
  var p = localPoint(svg, e);
  if (!p) return;
  if (!trace.strokes.length) beginStroke();
  var pts = trace.strokes[trace.strokes.length - 1];
  if (pts.length) {
    var last = pts[pts.length - 1];
    var dx = p.x - last.x;
    var dy = p.y - last.y;
    var dist = dx * dx + dy * dy;
    if (dist < 4) return;
    if (dist > 1600) {
      pts = beginStroke();
    } else if (dist > 16) trace.moved = true;
  }
  pts.push(p);
  if (tracePoints().length > 1500) trace.strokes.splice(0, 1);
  paintLine();
  if (pts.length % 3 === 0) traceProgress();
}

function onDown(e) {
  var grown = e.target.closest ? e.target.closest("[data-action='grownups']") : null;
  if (grown) {
    startHold(grown, e);
    return;
  }
  if (ui.screen === "letters" && ui.mode === "trace") {
    var svg = e.target.closest ? e.target.closest(".trace-board") : null;
    if (svg) startDraw(e, svg);
  }
}

function onMove(e) {
  if (!trace.drawing || e.pointerId !== trace.pointerId) return;
  if (e.pointerType !== "touch" && !e.buttons) {
    endDraw(e);
    return;
  }
  var svg = document.querySelector(".trace-board");
  if (!svg) return;
  if (e.preventDefault) e.preventDefault();
  addPoint(e, svg);
}

function endDraw(e) {
  if (!trace.drawing) return;
  if (e && e.pointerId != null && trace.pointerId != null && e.pointerId !== trace.pointerId) return;
  var svg = document.querySelector(".trace-board");
  var id = trace.pointerId;
  trace.drawing = false;
  trace.pointerId = null;
  if (svg && id != null) {
    try {
      svg.releasePointerCapture(id);
    } catch (err) {}
  }
  if (trace.moved) {
    trace.blockClick = true;
    window.setTimeout(function () {
      trace.blockClick = false;
    }, 350);
  }
  traceProgress();
}

function onUp(e) {
  clearHold();
  endDraw(e);
}

function onKey(e) {
  if (e.key === "Escape" && ui.screen === "grownups") {
    onDone();
    return;
  }
  if (e.key === "ArrowRight") {
    e.preventDefault();
    step(1);
  } else if (e.key === "ArrowLeft") {
    e.preventDefault();
    step(-1);
  }
}

function registerWorker() {
  if (window.SUNNY_SINGLE) return;
  if (!("serviceWorker" in navigator)) return;
  var host = location.hostname;
  if (location.protocol.indexOf("http") !== 0) return;
  if (host === "localhost" || host === "127.0.0.1") return;
  navigator.serviceWorker.register("sw.js").catch(function () {});
}

function init() {
  var app = document.getElementById("app");
  app.addEventListener("click", onClick);
  app.addEventListener("pointerdown", onDown);
  app.addEventListener("pointermove", onMove);
  document.addEventListener("pointerup", onUp);
  document.addEventListener("pointercancel", onUp);
  document.addEventListener("lostpointercapture", onUp);
  document.addEventListener("touchend", onUp, { passive: true });
  document.addEventListener("touchcancel", onUp, { passive: true });
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });
  document.addEventListener("keydown", onKey);
  document.addEventListener("visibilitychange", function () {
    if (document.hidden || !window.speechSynthesis) return;
    try {
      if (window.speechSynthesis.paused) window.speechSynthesis.resume();
    } catch (err) {}
  });
  warmVoices();
  applyTheme();
  var themeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  if (themeQuery.addEventListener) {
    themeQuery.addEventListener("change", function () {
      if ((save.theme || "auto") === "auto") applyTheme();
    });
  }
  registerWorker();
  render();
}

init();
