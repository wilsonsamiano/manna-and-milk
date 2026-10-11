"use strict";

var KEY = "sunny-abc-v1";
var SVGNS = "http://www.w3.org/2000/svg";
var TRACE_RADIUS = 40;
var TRACE_NEED = 0.7;

var LETTER_RANGES = [
  { id: "A-Z", label: "All letters", from: 0, to: 25 },
  { id: "A-E", label: "A to E", from: 0, to: 4 },
  { id: "F-J", label: "F to J", from: 5, to: 9 },
  { id: "K-O", label: "K to O", from: 10, to: 14 },
  { id: "P-T", label: "P to T", from: 15, to: 19 },
  { id: "U-Z", label: "U to Z", from: 20, to: 25 },
];

var NUMBER_RANGES = [
  { id: "1-5", label: "1 to 5", from: 1, to: 5 },
  { id: "1-10", label: "1 to 10", from: 1, to: 10 },
  { id: "1-50", label: "1 to 50", from: 1, to: 50 },
  { id: "1-100", label: "1 to 100", from: 1, to: 100 },
  { id: "11-20", label: "11 to 20", from: 11, to: 20 },
  { id: "21-40", label: "21 to 40", from: 21, to: 40 },
  { id: "41-70", label: "41 to 70", from: 41, to: 70 },
  { id: "71-100", label: "71 to 100", from: 71, to: 100 },
];

var SHAPE_RANGES = [
  { id: "all", label: "All shapes", from: 0, to: 7 },
  { id: "first", label: "Circle to rectangle", from: 0, to: 3 },
  { id: "last", label: "Star to diamond", from: 4, to: 7 },
];

var COLOR_RANGES = [
  { id: "all", label: "All colors", from: 0, to: 7 },
  { id: "first", label: "Red to green", from: 0, to: 3 },
  { id: "last", label: "Orange to brown", from: 4, to: 7 },
];

function shapeItem(name, d) {
  var say = name.charAt(0).toUpperCase() + name.slice(1) + ".";
  return { name: name, say: say, find: "Find the " + name + ".", trace: "Trace the " + name + ".", d: d, strokes: [d] };
}

var SHAPES = [
  shapeItem("circle", "M100 36 C140.8 36 174 69.2 174 110 C174 150.8 140.8 184 100 184 C59.2 184 26 150.8 26 110 C26 69.2 59.2 36 100 36 Z"),
  shapeItem("square", "M48 46 H152 V150 H48 Z"),
  shapeItem("triangle", "M100 38 L168 168 L32 168 Z"),
  shapeItem("rectangle", "M28 62 H172 V150 H28 Z"),
  shapeItem("star", "M100 30 L118 86 L176 86 L130 120 L148 176 L100 144 L52 176 L70 120 L24 86 L82 86 Z"),
  shapeItem("heart", "M100 172 C46 128 30 86 58 64 C78 48 98 62 100 78 C102 62 122 48 142 64 C170 86 154 128 100 172"),
  shapeItem("oval", "M100 48 C156 48 176 78 176 110 C176 150 156 176 100 176 C44 176 24 150 24 110 C24 78 44 48 100 48"),
  shapeItem("diamond", "M100 32 L170 110 L100 188 L30 110 Z"),
];

function colorItem(name, hex) {
  var say = name.charAt(0).toUpperCase() + name.slice(1) + ".";
  return { name: name, hex: hex, say: say, find: "Find " + name + "." };
}

var COLORS = [
  colorItem("red", "#E23B3B"),
  colorItem("blue", "#3B6FE2"),
  colorItem("yellow", "#F0C429"),
  colorItem("green", "#3EAA5A"),
  colorItem("orange", "#F08A2A"),
  colorItem("purple", "#8A4FD0"),
  colorItem("pink", "#F08AB0"),
  colorItem("brown", "#8A5A32"),
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
  L("W", "w", "whale", "wuh", "Double. U says wuh. Whale.", ["M28 32 L62 188", "M62 188 L100 84", "M100 84 L138 188", "M138 188 L172 32"]),
  L("X", "x", "xylophone", "ks", "X says ks. Xylophone.", ["M40 32 L160 188", "M160 32 L40 188"]),
  L("Y", "y", "yo-yo", "yuh", "Y says yuh. Yo-yo.", ["M40 32 L100 112", "M160 32 L100 112", "M100 112 V188"]),
  L("Z", "z", "zebra", "zzz", "Z says zzz. Zebra.", ["M40 32 H160", "M160 32 L40 188", "M40 188 H160"]),
];

var SMALL_STROKES = [
  ["M132 148 C132 112 58 112 58 148 C58 184 132 184 132 148", "M132 112 V188"],
  ["M62 28 V188", "M62 118 C62 100 150 100 150 146 C150 192 62 192 62 148"],
  ["M150 124 C112 98 46 110 46 150 C46 192 112 206 150 176"],
  ["M68 148 C68 112 148 112 148 148 C148 184 68 184 68 148", "M148 28 V188"],
  ["M52 150 H142", "M142 150 C142 108 46 108 46 150 C46 194 118 206 150 176"],
  ["M146 52 C118 28 78 36 78 70 V188", "M48 108 H122"],
  ["M68 136 C68 102 148 102 148 136 C148 170 68 170 68 136", "M148 108 V176 C148 210 68 214 66 180"],
  ["M62 28 V188", "M62 128 C62 104 148 104 148 140 V188"],
  ["M100 40 C110 40 110 56 100 56 C90 56 90 40 100 40", "M100 78 V188"],
  ["M118 40 C128 40 128 56 118 56 C108 56 108 40 118 40", "M118 78 V170 C118 204 58 208 54 176"],
  ["M62 28 V188", "M142 108 L62 150", "M92 136 L148 188"],
  ["M96 28 V168 C96 198 156 198 162 172"],
  ["M40 188 V112", "M40 132 C40 108 92 108 92 142 V188", "M92 132 C92 108 144 108 144 142 V188"],
  ["M56 188 V112", "M56 132 C56 108 148 108 148 142 V188"],
  ["M100 112 C152 112 166 132 166 154 C166 188 138 206 100 206 C62 206 34 188 34 154 C34 132 48 112 100 112"],
  ["M62 112 V208", "M62 136 C62 108 156 108 156 148 C156 188 62 188 62 150"],
  ["M148 136 C148 108 54 108 54 148 C54 188 148 188 148 150", "M148 112 V208"],
  ["M64 188 V112", "M64 128 C64 106 146 106 152 128"],
  ["M144 126 C132 102 56 106 54 134 C52 158 148 146 146 176 C144 204 54 208 46 178"],
  ["M100 48 V168 C100 198 158 198 164 172", "M58 100 H142"],
  ["M48 112 V152 C48 190 152 190 152 152 V112"],
  ["M40 112 L100 188", "M160 112 L100 188"],
  ["M32 112 L64 188", "M64 188 L100 128", "M100 128 L136 188", "M136 188 L168 112"],
  ["M44 112 L156 188", "M156 112 L44 188"],
  ["M44 112 L100 168", "M156 112 L100 168", "M100 168 V204 C100 220 68 222 60 200"],
  ["M44 112 H156", "M156 112 L44 188", "M44 188 H156"],
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
  traceCase: "big",
  pinMode: "",
  pinNext: "",
  pinEntry: "",
  pinDraft: "",
  pinNote: "",
  pinBack: "",
  talking: false,
  introStep: 0,
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
var holdKind = "";

function rangeById(list, id) {
  var i;
  for (i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
  return null;
}

function defaults() {
  return {
    v: 2,
    voice: true,
    theme: "auto",
    letterRange: "A-Z",
    numberRange: "1-10",
    letterIndex: 0,
    numberIndex: 1,
    letterForm: "both",
    shapeRange: "all",
    colorRange: "all",
    shapeIndex: 0,
    colorIndex: 0,
    pin: "",
    introDone: false,
    seenNotes: "",
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
        if ((p.v || 1) < 2 && d.letterRange === "A-E") d.letterRange = "A-Z";
        if (rangeById(NUMBER_RANGES, p.numberRange)) d.numberRange = p.numberRange;
        if (rangeById(SHAPE_RANGES, p.shapeRange)) d.shapeRange = p.shapeRange;
        if (rangeById(COLOR_RANGES, p.colorRange)) d.colorRange = p.colorRange;
        if (typeof p.letterIndex === "number") d.letterIndex = p.letterIndex | 0;
        if (typeof p.numberIndex === "number") d.numberIndex = p.numberIndex | 0;
        if (typeof p.shapeIndex === "number") d.shapeIndex = p.shapeIndex | 0;
        if (typeof p.colorIndex === "number") d.colorIndex = p.colorIndex | 0;
        if (p.letterForm === "big" || p.letterForm === "small" || p.letterForm === "both") d.letterForm = p.letterForm;
        if (/^\d{4}$/.test(p.pin || "")) d.pin = p.pin;
        if (p.introDone === true) d.introDone = true;
        if (typeof p.seenNotes === "string") d.seenNotes = p.seenNotes;
      }
    }
  } catch (err) {}
  var lr = rangeById(LETTER_RANGES, d.letterRange);
  if (d.letterIndex < lr.from || d.letterIndex > lr.to) d.letterIndex = lr.from;
  var nr = rangeById(NUMBER_RANGES, d.numberRange);
  if (d.numberIndex < nr.from || d.numberIndex > nr.to) d.numberIndex = nr.from;
  var sr = rangeById(SHAPE_RANGES, d.shapeRange);
  if (d.shapeIndex < sr.from || d.shapeIndex > sr.to) d.shapeIndex = sr.from;
  var cr = rangeById(COLOR_RANGES, d.colorRange);
  if (d.colorIndex < cr.from || d.colorIndex > cr.to) d.colorIndex = cr.from;
  try {
    localStorage.setItem(KEY, JSON.stringify(d));
  } catch (err) {}
  return d;
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(save));
  } catch (err) {}
}

function syncTabletLock() {
  if (!window.SunnyLock) return;
  try {
    if (save.pin) SunnyLock.pinApp();
    else SunnyLock.unpinApp();
  } catch (err) {}
}

function currentLetterRange() {
  return rangeById(LETTER_RANGES, save.letterRange) || LETTER_RANGES[0];
}

function currentNumberRange() {
  return rangeById(NUMBER_RANGES, save.numberRange) || NUMBER_RANGES[1];
}

function currentShapeRange() {
  return rangeById(SHAPE_RANGES, save.shapeRange) || SHAPE_RANGES[0];
}

function currentColorRange() {
  return rangeById(COLOR_RANGES, save.colorRange) || COLOR_RANGES[0];
}

function currentShape() {
  var r = currentShapeRange();
  if (save.shapeIndex < r.from || save.shapeIndex > r.to) save.shapeIndex = r.from;
  return SHAPES[save.shapeIndex];
}

function currentColor() {
  var r = currentColorRange();
  if (save.colorIndex < r.from || save.colorIndex > r.to) save.colorIndex = r.from;
  return COLORS[save.colorIndex];
}

function currentLetter() {
  var r = currentLetterRange();
  if (save.letterIndex < r.from || save.letterIndex > r.to) save.letterIndex = r.from;
  return LETTERS[save.letterIndex];
}

function letterForm() {
  return save.letterForm === "big" || save.letterForm === "small" ? save.letterForm : "both";
}

function smallStrokes(item) {
  var i = LETTERS.indexOf(item);
  return i >= 0 && SMALL_STROKES[i] ? SMALL_STROKES[i] : item.strokes;
}

function tracingSmall() {
  var form = letterForm();
  if (form === "small") return true;
  if (form === "big") return false;
  return ui.traceCase === "small";
}

function promptLetters(item) {
  var form = letterForm();
  var html = "";
  if (form !== "small") html += '<span class="prompt-ch">' + item.ch + "</span> ";
  if (form !== "big") html += '<span class="prompt-ch lower">' + item.lower + "</span> ";
  return html;
}

function letterPair(item, card) {
  var form = letterForm();
  var html = '<span class="pair' + (card ? " pair-card" : "") + (form === "both" ? " both" : "") + '">';
  if (form !== "small") html += '<span class="upper">' + item.ch + "</span>";
  if (form !== "big") html += '<span class="lower">' + item.lower + "</span>";
  return html + "</span>";
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

function makeIndexChoices(index, list, range) {
  var pool = [];
  var i;
  for (i = range.from; i <= range.to; i++) if (i !== index) pool.push(i);
  if (pool.length < 2) {
    for (i = 0; i < list.length; i++) if (i !== index && pool.indexOf(i) === -1) pool.push(i);
  }
  pool = shuffle(pool);
  return shuffle([index, pool[0], pool[1]]);
}

function shapeSvg(shape, cls) {
  return '<svg class="shape-art ' + cls + '" viewBox="0 0 200 220" aria-hidden="true"><path d="' + shape.d + '"></path></svg>';
}

function swatchHtml(color, cls) {
  return '<span class="swatch ' + cls + '" style="background:' + color.hex + '"></span>';
}

function picSrc(word) {
  return window.PIC_DATA && PIC_DATA[word] ? PIC_DATA[word] : "pics/" + word + ".jpg";
}

function pic(word) {
  return '<img class="pic" alt="" draggable="false" src="' + picSrc(word) + '">';
}

function qtyImg(word) {
  return '<img class="qty-pic" alt="" draggable="false" src="' + picSrc(word) + '">';
}

function countWord(group) {
  var i = group;
  if (i < 0) i = 0;
  if (i > 25) i = 25;
  return LETTERS[i].word;
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

function homeLocked() {
  return !!save.pin && ui.screen !== "grownups";
}

function header(withHome) {
  var locked = homeLocked();
  var home = withHome
    ? '<button class="icon-btn home-btn' +
      (locked ? " locked" : "") +
      '" data-action="home" aria-label="' +
      (locked ? "Home is locked." : "Home. Hold to go home.") +
      '">' +
      houseIcon() +
      "</button>"
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
  var nextLabel = "Next " + lessonNoun();
  var prevLabel = "Previous " + lessonNoun();
  var prevLocked = challengeLocked("prev");
  var nextOff = nextLocked();
  return (
    '<nav class="nav"><button class="nav-btn" data-action="prev" aria-label="' +
    prevLabel +
    '"' +
    (prevLocked ? " disabled" : "") +
    ">" +
    chevron("left") +
    '</button><div class="modes">' +
    html +
    '</div><button class="nav-btn next" data-action="next" aria-label="' +
    nextLabel +
    '"' +
    (nextOff ? " disabled" : "") +
    ">" +
    chevron("right") +
    "</button></nav>"
  );
}

function lessonNoun() {
  if (ui.screen === "numbers") return "number";
  if (ui.screen === "shapes") return "shape";
  if (ui.screen === "colors") return "color";
  return "letter";
}

function challengeOn() {
  return (
    (ui.screen === "letters" && (ui.mode === "find" || ui.mode === "trace")) ||
    (ui.screen === "numbers" && (ui.mode === "find" || ui.mode === "count")) ||
    (ui.screen === "shapes" && (ui.mode === "find" || ui.mode === "trace")) ||
    (ui.screen === "colors" && ui.mode === "find")
  );
}

function challengeDone() {
  if (ui.mode === "find") return ui.findSolved;
  if (ui.mode === "count") return ui.countDone;
  if (ui.mode === "trace") return !!trace.finished;
  return false;
}

function challengeLocked(which) {
  if (!challengeOn()) return false;
  if (which === "prev") return true;
  return !challengeDone();
}

function nextLocked() {
  if (ui.talking) return true;
  return challengeLocked("next");
}

function refreshNext() {
  var btn = document.querySelector(".nav-btn.next");
  if (!btn) return;
  btn.disabled = nextLocked();
}

var talkToken = 0;

function beginTalk() {
  talkToken += 1;
  ui.talking = true;
  refreshNext();
  return talkToken;
}

function endTalk(token) {
  if (token !== talkToken) return;
  ui.talking = false;
  refreshNext();
}

function againBtn() {
  return '<button class="again" data-action="again">Try again</button>';
}

function wordHtml(word) {
  return '<span class="word"><span class="word-first">' + word.charAt(0) + "</span>" + word.slice(1) + "</span>";
}

function quantityHtml(n, interactive) {
  var i;
  var html = '<div class="qty-groups">';
  for (i = 0; i < n; i++) {
    if (i % 10 === 0) {
      if (i) html += "</div>";
      html += '<div class="qty-row' + (n <= 10 ? " qty-row-lg" : "") + '">';
    }
    var word = countWord(Math.floor(i / 10));
    var on = !interactive || ui.countTapped["d" + i];
    if (interactive) {
      html +=
        '<button class="qty-one' +
        (on ? " on" : "") +
        '" data-action="dot" data-i="' +
        i +
        '" aria-label="' +
        word +
        " " +
        (i + 1) +
        '">' +
        qtyImg(word) +
        "</button>";
    } else {
      html += '<span class="qty-one on">' + qtyImg(word) + "</span>";
    }
  }
  return html + "</div></div>";
}

function renderHome() {
  var lr = currentLetterRange();
  var nr = currentNumberRange();
  var sr = currentShapeRange();
  var cr = currentColorRange();
  return (
    '<main class="screen boxes" data-screen="home">' +
    header(false) +
    '<div class="home-main"><img class="mark" alt="" src="mark.jpg"><h1 class="brand">Manna & Milk</h1><p class="lede">Little lessons</p><div class="pick">' +
    '<button class="pick-card" data-action="letters"><span class="pair pair-card"><span class="upper">A</span><span class="lower">a</span></span><span class="pick-label">Letters</span></button>' +
    '<button class="pick-card" data-action="numbers"><span class="num">123</span><span class="pick-label">Numbers</span></button>' +
    '<button class="pick-card" data-action="shapes">' +
    shapeSvg(SHAPES[2], "pick-shape") +
    '<span class="pick-label">Shapes</span></button>' +
    '<button class="pick-card" data-action="colors"><span class="pick-dots"><i style="background:#E23B3B"></i><i style="background:#3B6FE2"></i><i style="background:#F0C429"></i></span><span class="pick-label">Colors</span></button>' +
    "</div></div>" +
    '<p class="hint">Now: ' +
    lr.label +
    " · " +
    nr.label +
    "<br>" +
    sr.label +
    " · " +
    cr.label +
    "<br>Hold the sun for grown-ups</p>" +
    updateHomeNote() +
    "</main>"
  );
}

function renderLetterLook(item) {
  return (
    '<div class="stage"><div class="look">' +
    '<button class="letter-hit" data-action="hear" aria-label="Hear ' +
    item.ch +
    '">' +
    letterPair(item) +
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
    '<div class="stage"><div class="find"><p class="prompt">' +
    promptLetters(item) +
    "Find the " +
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
  var small = item.shape ? false : tracingSmall();
  var strokes = small ? smallStrokes(item) : item.strokes;
  var glyph = small ? item.lower : item.ch;
  var title = item.shape ? "Trace the " + item.ch : 'Trace <span class="prompt-ch">' + glyph + "</span>";
  for (i = 0; i < strokes.length; i++) {
    paths += '<path class="guide" d="' + strokes[i] + '"></path>';
  }
  return (
    '<div class="stage"><div class="trace-wrap"><p class="prompt">' +
    title +
    '</p><div class="trace-card"><svg class="trace-board" viewBox="0 0 200 220" role="img" aria-label="Trace ' +
    glyph +
    '"><rect class="hit" x="0" y="0" width="200" height="220" fill="#fff" fill-opacity="0"></rect><g class="guides">' +
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
    (n <= 10 ? "Tap each apple" : "Tap each one") +
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
    "<p class=\"g-note\">Letters, numbers, shapes, and colors are the lessons so far. More will be added. All letters are on to start. Nothing is timed, and there is no score.</p>" +
    '<div class="chips"><button class="chip" data-action="show-intro">Show the tour</button></div>' +
    '<section class="g-sec"><h2 class="g-label">Letters</h2><div class="chips">' +
    chips(LETTER_RANGES, save.letterRange, "letter-range") +
    '</div></section>' +
    '<section class="g-sec"><h2 class="g-label">Big and small</h2><div class="chips">' +
    chips(
      [
        { id: "both", label: "Both" },
        { id: "big", label: "Big only" },
        { id: "small", label: "Small only" },
      ],
      letterForm(),
      "letter-form"
    ) +
    "</div></section>" +
    '<section class="g-sec"><h2 class="g-label">Numbers</h2><div class="chips">' +
    chips(NUMBER_RANGES, save.numberRange, "number-range") +
    '</div></section>' +
    '<section class="g-sec"><h2 class="g-label">Shapes</h2><div class="chips">' +
    chips(SHAPE_RANGES, save.shapeRange, "shape-range") +
    '</div></section>' +
    '<section class="g-sec"><h2 class="g-label">Colors</h2><div class="chips">' +
    chips(COLOR_RANGES, save.colorRange, "color-range") +
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
    "</section>" +
    '<section class="g-sec"><h2 class="g-label">Parent lock</h2>' +
    (save.pin
      ? '<p class="g-note">The house is locked, and so is the tablet Home button. Hold the sun, enter the PIN, then tap Go home. Turn the PIN off to unlock both.</p>' +
        (window.SunnyLock
          ? '<p class="g-note">If the tablet Home button still leaves the app, turn on Screen pinning once. On a Fire tablet that is Settings, then Security & Privacy, then Screen pinning.</p>'
          : "") +
        '<div class="chips"><button class="chip" data-action="go-home">Go home</button><button class="chip" data-action="pin-change">Change PIN</button><button class="chip" data-action="pin-off">Turn off</button></div>'
      : '<p class="g-note">Set a 4-digit PIN to lock the house and the tablet Home button. Until then, hold the house to go home.</p>' +
        '<div class="chips"><button class="chip on" data-action="pin-set">Set a PIN</button></div>') +
    "</section>" +
    updateSection() +
    "</div>" +
    '<div class="grown-foot">' +
    (window.SUNNY_SINGLE
      ? ""
      : '<p class="g-note"><a href="sunny-abc.html" download="Sunny-ABC.html">Download the one-file page</a></p>') +
    '<p class="coffee"><a href="https://buymeacoffee.com/wilsonsamiano" target="_blank" rel="noopener noreferrer">Buy me a coffee</a></p><button class="done" data-action="done">Done</button></div></main>'
  );
}

function renderShapeLook(shape) {
  return (
    '<div class="stage"><div class="look"><button class="letter-hit" data-action="hear" aria-label="Hear ' +
    shape.name +
    '">' +
    shapeSvg(shape, "shape-lg") +
    wordHtml(shape.name) +
    '<span class="sound">' +
    speakerIcon() +
    " hear it</span></button></div></div>"
  );
}

function renderShapeFind(shape) {
  var html = "";
  var i;
  for (i = 0; i < ui.choices.length; i++) {
    var id = ui.choices[i];
    var choice = SHAPES[id];
    var cls = "choice";
    if (ui.findSolved && id === save.shapeIndex) cls += " is-right";
    else if (ui.findSolved) cls += " is-dim";
    if (ui.nudge === String(id)) cls += " nudge";
    html +=
      '<button class="' +
      cls +
      '" data-action="pick" data-id="' +
      id +
      '" aria-label="' +
      choice.name +
      '">' +
      shapeSvg(choice, "shape-sm") +
      '<span class="choice-word">' +
      choice.name +
      "</span></button>";
  }
  var feedback = ui.findSolved ? "Yes! " + shape.name : ui.saidWrong ? "Let's look again" : "";
  return (
    '<div class="stage"><div class="find"><p class="prompt">Find the ' +
    shape.name +
    '</p><div class="choices">' +
    html +
    '</div><p class="feedback" role="status">' +
    feedback +
    "</p>" +
    againBtn() +
    "</div></div>"
  );
}

function renderColorLook(color) {
  return (
    '<div class="stage"><div class="look"><button class="letter-hit" data-action="hear" aria-label="Hear ' +
    color.name +
    '">' +
    swatchHtml(color, "swatch-lg") +
    wordHtml(color.name) +
    '<span class="sound">' +
    speakerIcon() +
    " hear it</span></button></div></div>"
  );
}

function renderColorFind(color) {
  var html = "";
  var i;
  for (i = 0; i < ui.choices.length; i++) {
    var id = ui.choices[i];
    var choice = COLORS[id];
    var cls = "choice choice-color";
    if (ui.findSolved && id === save.colorIndex) cls += " is-right";
    else if (ui.findSolved) cls += " is-dim";
    if (ui.nudge === String(id)) cls += " nudge";
    html +=
      '<button class="' +
      cls +
      '" data-action="pick" data-id="' +
      id +
      '" aria-label="' +
      choice.name +
      '">' +
      swatchHtml(choice, "swatch-sm") +
      '<span class="choice-word">' +
      choice.name +
      "</span></button>";
  }
  var feedback = ui.findSolved ? "Yes! " + color.name : ui.saidWrong ? "Let's look again" : "";
  return (
    '<div class="stage"><div class="find"><p class="prompt">Find</p><p class="color-name">' +
    color.name +
    '</p><div class="choices">' +
    html +
    '</div><p class="feedback" role="status">' +
    feedback +
    "</p>" +
    againBtn() +
    "</div></div>"
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
  } else if (ui.screen === "numbers") {
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
  if (ui.screen === "shapes") {
    var shape = currentShape();
    modes = [
      { id: "look", label: "Look", icon: modeIcon("look") },
      { id: "find", label: "Find", icon: modeIcon("find") },
      { id: "trace", label: "Trace", icon: modeIcon("trace") },
    ];
    if (ui.mode === "find") stage = renderShapeFind(shape);
    else if (ui.mode === "trace") stage = renderTrace({ ch: shape.name, lower: shape.name, strokes: shape.strokes, shape: true });
    else stage = renderShapeLook(shape);
  } else if (ui.screen === "colors") {
    var color = currentColor();
    modes = [
      { id: "look", label: "Look", icon: modeIcon("look") },
      { id: "find", label: "Find", icon: modeIcon("find") },
    ];
    if (ui.mode === "find") stage = renderColorFind(color);
    else stage = renderColorLook(color);
  }
  var guard = challengeOn() && !challengeDone() ? " boxes" : "";
  return (
    '<main class="screen' +
    guard +
    '" data-screen="' +
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
  if (ui.screen === "letters") return "L:" + ui.mode + ":" + save.letterIndex + ":" + save.letterRange + ":" + letterForm();
  if (ui.screen === "numbers") return "N:" + ui.mode + ":" + save.numberIndex + ":" + save.numberRange;
  if (ui.screen === "shapes") return "S:" + ui.mode + ":" + save.shapeIndex + ":" + save.shapeRange;
  if (ui.screen === "colors") return "C:" + ui.mode + ":" + save.colorIndex + ":" + save.colorRange;
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
  ui.traceCase = letterForm() === "small" ? "small" : "big";
  ui.choices = [];
  if (ui.screen === "letters" && ui.mode === "find") ui.choices = makeLetterChoices(save.letterIndex);
  if (ui.screen === "numbers" && ui.mode === "find") ui.choices = makeNumberChoices(save.numberIndex);
  if (ui.screen === "shapes" && ui.mode === "find") ui.choices = makeIndexChoices(save.shapeIndex, SHAPES, currentShapeRange());
  if (ui.screen === "colors" && ui.mode === "find") ui.choices = makeIndexChoices(save.colorIndex, COLORS, currentColorRange());
}

function setTitle() {
  var t = "Manna & Milk";
  if (ui.screen === "letters") t = "Manna & Milk · " + currentLetter().ch;
  else if (ui.screen === "numbers") t = "Manna & Milk · " + currentNumber();
  else if (ui.screen === "shapes") t = "Manna & Milk · " + currentShape().name;
  else if (ui.screen === "colors") t = "Manna & Milk · " + currentColor().name;
  else if (ui.screen === "grownups") t = "Manna & Milk · Grown-ups";
  else if (ui.screen === "pin") t = "Manna & Milk · PIN";
  else if (ui.screen === "intro") t = "Manna & Milk · For grown-ups";
  else if (ui.screen === "whatsnew") t = "Manna & Milk · What's new";
  document.title = t;
}

function render() {
  ensureActivity();
  var app = document.getElementById("app");
  var html = "";
  if (ui.screen === "home") html = renderHome();
  else if (ui.screen === "grownups") html = renderGrown();
  else if (ui.screen === "pin") html = renderPin();
  else if (ui.screen === "intro") html = renderIntro();
  else if (ui.screen === "whatsnew") html = renderWhatsNew();
  else html = renderPlay();
  app.innerHTML = html;
  setTitle();
  if (ui.screen === "letters" && ui.mode === "trace") setupTrace();
  if (ui.screen === "shapes" && ui.mode === "trace") setupTrace();
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

function celebrate() {
  var token = beginTalk();
  if (!save.voice) {
    endTalk(token);
    scheduleAdvance();
    return;
  }
  chime();
  var audio = chimeAudio;
  var said = false;
  function sayJob() {
    if (said || token !== talkToken) return;
    said = true;
    speak("Good job.", scheduleAdvance);
  }
  if (audio) {
    audio.addEventListener("ended", sayJob, { once: true });
    window.setTimeout(sayJob, 1400);
  } else {
    window.setTimeout(sayJob, 900);
  }
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
  var shape = save.shapeIndex;
  var color = save.colorIndex;
  advanceTimer = window.setTimeout(function () {
    advanceTimer = 0;
    if (ui.screen !== screen || ui.mode !== mode) return;
    if (mode !== "find" && mode !== "trace" && mode !== "count") return;
    if (screen === "letters" && save.letterIndex !== letter) return;
    if (screen === "numbers" && save.numberIndex !== number) return;
    if (screen === "shapes" && save.shapeIndex !== shape) return;
    if (screen === "colors" && save.colorIndex !== color) return;
    if (mode === "find" && !ui.findSolved) return;
    if (mode === "count" && !ui.countDone) return;
    if (mode === "trace" && !trace.finished) return;
    step(1);
  }, 2800);
}

function speak(text, onDone) {
  if (!save.voice || !text) {
    if (onDone) onDone();
    return;
  }
  var token = beginTalk();
  var done = false;
  function finish() {
    if (done || token !== talkToken) return;
    done = true;
    if (onDone) onDone();
    endTalk(token);
  }
  window.setTimeout(finish, 12000);
  if (window.CLIPS && CLIPS[text]) {
    if (spoken) {
      try {
        spoken.pause();
        spoken.currentTime = 0;
      } catch (err) {}
    }
    var src = CLIPS[text];
    if (src.indexOf("data:") !== 0) src = "voice/" + src + "?v=14";
    spoken = new Audio(src);
    spoken.volume = 1;
    spoken.preload = "auto";
    spoken.addEventListener("ended", finish);
    spoken.addEventListener("error", finish);
    var play = spoken.play();
    if (play && play.catch) play.catch(function () { finish(); });
    return;
  }
  if (!window.speechSynthesis) {
    finish();
    return;
  }
  try {
    var syn = window.speechSynthesis;
    var u = new SpeechSynthesisUtterance(text);
    liveUtterance = u;
    u.rate = 0.86;
    u.pitch = 1.04;
    u.lang = "en-US";
    u.volume = 1;
    u.onend = finish;
    u.onerror = finish;
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
  } catch (err) {
    finish();
  }
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
    else if (ui.mode === "count") speak(n <= 10 ? "Tap each apple." : "Tap each one.");
    else speak(word + ".");
  } else if (ui.screen === "shapes") {
    var shape = currentShape();
    if (ui.mode === "find") speak(shape.find);
    else if (ui.mode === "trace") speak(shape.trace);
    else speak(shape.say);
  } else if (ui.screen === "colors") {
    var color = currentColor();
    if (ui.mode === "find") speak(color.find);
    else speak(color.say);
  }
}

function goHome() {
  clearAdvance();
  if (save.introDone && unseenNotes()) ui.screen = "whatsnew";
  else ui.screen = "home";
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

function goShapes() {
  ui.screen = "shapes";
  ui.mode = "look";
  ui.choiceKey = "";
  render();
  speakCurrent();
}

function goColors() {
  ui.screen = "colors";
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
  } else if (ui.screen === "shapes") {
    var sr = currentShapeRange();
    var s = save.shapeIndex + dir;
    if (s > sr.to) s = sr.from;
    if (s < sr.from) s = sr.to;
    save.shapeIndex = s;
  } else if (ui.screen === "colors") {
    var cr = currentColorRange();
    var c = save.colorIndex + dir;
    if (c > cr.to) c = cr.from;
    if (c < cr.from) c = cr.to;
    save.colorIndex = c;
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

function setLetterForm(id) {
  if (id !== "both" && id !== "big" && id !== "small") return;
  save.letterForm = id;
  ui.choiceKey = "";
  ui.traceCase = id === "small" ? "small" : "big";
  persist();
  render();
}

function setShapeRange(id) {
  var r = rangeById(SHAPE_RANGES, id);
  if (!r) return;
  save.shapeRange = id;
  save.shapeIndex = r.from;
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

function setColorRange(id) {
  var r = rangeById(COLOR_RANGES, id);
  if (!r) return;
  save.colorRange = id;
  save.colorIndex = r.from;
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
  var correct = save.letterIndex;
  if (ui.screen === "numbers") correct = save.numberIndex;
  else if (ui.screen === "shapes") correct = save.shapeIndex;
  else if (ui.screen === "colors") correct = save.colorIndex;
  if (ui.findSolved) {
    if (id === correct) speakCurrent();
    return;
  }
  if (id === correct) {
    ui.findSolved = true;
    ui.nudge = "";
    render();
    celebrate();
  } else {
    ui.nudge = String(id);
    var first = !ui.saidWrong;
    ui.saidWrong = true;
    render();
    ui.nudge = "";
    if (first) speak("Let's look again.");
  }
}

function afterCount() {
  if (ui.countDone) return;
  var target = currentNumber();
  var counted = 0;
  var i;
  for (i = 0; i < target; i++) if (ui.countTapped["d" + i]) counted++;
  ui.countValue = counted;
  var done = counted === target && target > 0;
  if (done) ui.countDone = true;
  render();
  if (!done) {
    speak(numberWord(ui.countValue) + ".");
    return;
  }
  speak(numberWord(ui.countValue) + ".", function () {
    celebrate();
  });
}

function onDot(raw) {
  if (ui.countDone) return;
  var key = "d" + raw;
  if (ui.countTapped[key]) return;
  ui.countTapped[key] = true;
  afterCount();
}

function onTen(raw) {
  if (ui.countDone) return;
  var key = "d" + raw;
  if (ui.countTapped[key]) return;
  ui.countTapped[key] = true;
  afterCount();
}

function onOne(raw) {
  if (ui.countDone) return;
  var key = "d" + raw;
  if (ui.countTapped[key]) return;
  ui.countTapped[key] = true;
  afterCount();
}

function findResting(e) {
  if (ui.mode !== "find" || challengeDone()) return false;
  var node = e.target && e.target.closest ? e.target : null;
  if (node && node.closest && node.closest(".choice, [data-action='home'], [data-action='grownups']")) return false;
  if (e.preventDefault) e.preventDefault();
  if (e.stopPropagation) e.stopPropagation();
  return true;
}

function choiceBox(node) {
  if (!node || !node.closest) return null;
  return node.closest(".choice, button.qty-one, .letter-hit, .pic-card, .trace-card, .pick-card");
}

function isPalm(e) {
  var w = e.width || 0;
  var h = e.height || 0;
  if (w < 1 && h < 1 && e.touches && e.touches[0]) {
    w = (e.touches[0].radiusX || 0) * 2;
    h = (e.touches[0].radiusY || 0) * 2;
  }
  if (w < 1 && h < 1) return false;
  return Math.max(w, h) >= 46;
}

var palmIds = {};

function kidScreen() {
  return ui.screen === "home" || ui.screen === "letters" || ui.screen === "numbers" || ui.screen === "shapes" || ui.screen === "colors";
}

function palmBlocked(e) {
  if (!kidScreen() || choiceBox(e.target)) return false;
  if (isPalm(e) || palmIds[e.pointerId]) return true;
  return false;
}

function rejectPalm(e) {
  if (e.pointerId != null) {
    if (isPalm(e)) palmIds[e.pointerId] = 1;
    else delete palmIds[e.pointerId];
  }
  if (!palmBlocked(e)) return false;
  if (e.preventDefault) e.preventDefault();
  if (e.stopPropagation) e.stopPropagation();
  return true;
}

function onClick(e) {
  if (findResting(e) || rejectPalm(e)) return;
  if (trace.blockClick) {
    trace.blockClick = false;
    return;
  }
  var btn = e.target.closest ? e.target.closest("[data-action]") : null;
  if (!btn) return;
  var action = btn.getAttribute("data-action");
  if (action === "grownups" || action === "home") return;
  if (action === "letters") goLetters();
  else if (action === "numbers") goNumbers();
  else if (action === "shapes") goShapes();
  else if (action === "colors") goColors();
  else if (action === "done") onDone();
  else if (action === "next") {
    if (!nextLocked()) step(1);
  } else if (action === "prev") {
    if (!challengeLocked("prev")) step(-1);
  } else if (action === "mode") setMode(btn.getAttribute("data-mode"));
  else if (action === "hear") speakCurrent();
  else if (action === "again") onAgain();
  else if (action === "pick") onPick(btn.getAttribute("data-id"));
  else if (action === "dot") onDot(btn.getAttribute("data-i"));
  else if (action === "ten") onTen(btn.getAttribute("data-i"));
  else if (action === "one") onOne(btn.getAttribute("data-i"));
  else if (action === "letter-range") setLetterRange(btn.getAttribute("data-id"));
  else if (action === "letter-form") setLetterForm(btn.getAttribute("data-id"));
  else if (action === "number-range") setNumberRange(btn.getAttribute("data-id"));
  else if (action === "shape-range") setShapeRange(btn.getAttribute("data-id"));
  else if (action === "color-range") setColorRange(btn.getAttribute("data-id"));
  else if (action === "voice") setVoice(btn.getAttribute("data-value") === "on");
  else if (action === "theme") setTheme(btn.getAttribute("data-value"));
  else if (action === "install-update" && window.SunnyUpdate && SunnyUpdate.install) SunnyUpdate.install();
  else if (action === "check-update" && window.SunnyUpdate && SunnyUpdate.refresh) SunnyUpdate.refresh();
  else if (action === "pin-digit") onPinDigit(btn.getAttribute("data-digit"));
  else if (action === "pin-del") onPinDel();
  else if (action === "pin-cancel") closePin();
  else if (action === "pin-set") openPin("new", "");
  else if (action === "pin-change") openPin("old", "change");
  else if (action === "pin-off") openPin("old", "off");
  else if (action === "go-home") goHome();
  else if (action === "show-intro") openIntro();
  else if (action === "intro-next") introNext();
  else if (action === "intro-back") introBack();
  else if (action === "intro-close") closeIntro();
  else if (action === "notes-done") dismissNotes();
}

function clearHold() {
  if (holdTimer) window.clearTimeout(holdTimer);
  holdTimer = 0;
  if (holdEl) holdEl.classList.remove("holding");
  holdEl = null;
}

function startHold(el, e, kind) {
  clearHold();
  holdEl = el;
  holdKind = kind || "grownups";
  el.classList.add("holding");
  if (e && e.preventDefault) e.preventDefault();
  holdTimer = window.setTimeout(function () {
    var which = holdKind;
    holdTimer = 0;
    holdEl = null;
    holdKind = "";
    if (which === "home") holdHome();
    else holdGrown();
  }, 700);
}

function holdHome() {
  if (save.pin && ui.screen !== "grownups") return;
  goHome();
}

function holdGrown() {
  if (save.pin && ui.screen !== "grownups" && ui.screen !== "pin") openPin("enter", "grownups");
  else if (ui.screen !== "pin") openGrownups();
}

function openPin(mode, next) {
  ui.pinMode = mode;
  ui.pinNext = next || "";
  ui.pinEntry = "";
  ui.pinNote = "";
  if (mode === "new" || mode === "old") ui.pinDraft = "";
  ui.pinBack = ui.screen === "pin" ? ui.pinBack : ui.screen;
  ui.screen = "pin";
  render();
}

function closePin() {
  ui.pinEntry = "";
  ui.pinNote = "";
  ui.pinDraft = "";
  ui.screen = ui.pinBack && ui.pinBack !== "pin" ? ui.pinBack : "home";
  render();
}

function pinTitle() {
  if (ui.pinMode === "new" || ui.pinMode === "change-new") return "Choose 4 numbers";
  if (ui.pinMode === "confirm" || ui.pinMode === "change-confirm") return "Enter those numbers again";
  if (ui.pinMode === "old") return "Enter the current PIN";
  return "Grown-up PIN";
}

function renderPin() {
  var keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  var i;
  var html = "";
  for (i = 0; i < keys.length; i++) {
    html += '<button class="pin-key" data-action="pin-digit" data-digit="' + keys[i] + '">' + keys[i] + "</button>";
  }
  html +=
    '<button class="pin-key pin-quiet" data-action="pin-cancel">Cancel</button>' +
    '<button class="pin-key" data-action="pin-digit" data-digit="0">0</button>' +
    '<button class="pin-key pin-quiet" data-action="pin-del" aria-label="Delete">Delete</button>';
  var dots = "";
  for (i = 0; i < 4; i++) dots += '<span class="pin-dot' + (i < ui.pinEntry.length ? " on" : "") + '"></span>';
  return (
    '<main class="screen" data-screen="pin"><div class="pin-wrap"><h1 class="g-title">' +
    pinTitle() +
    '</h1><div class="pin-dots" aria-hidden="true">' +
    dots +
    '</div><p class="pin-note">' +
    (ui.pinNote || " ") +
    '</p><div class="pin-pad">' +
    html +
    "</div></div></main>"
  );
}

function onPinDigit(digit) {
  if (!digit || ui.pinEntry.length >= 4) return;
  ui.pinEntry += digit;
  ui.pinNote = "";
  if (ui.pinEntry.length < 4) {
    render();
    return;
  }
  render();
  window.setTimeout(finishPin, 140);
}

function onPinDel() {
  ui.pinEntry = ui.pinEntry.slice(0, -1);
  ui.pinNote = "";
  render();
}

function finishPin() {
  if (ui.screen !== "pin" || ui.pinEntry.length !== 4) return;
  var entered = ui.pinEntry;
  if (ui.pinMode === "enter" || ui.pinMode === "old") {
    if (entered !== save.pin) {
      ui.pinEntry = "";
      ui.pinNote = "Try again";
      render();
      return;
    }
    if (ui.pinMode === "old" && ui.pinNext === "off") {
      save.pin = "";
      persist();
      syncTabletLock();
      closePin();
      return;
    }
    if (ui.pinMode === "old") {
      ui.pinEntry = "";
      ui.pinMode = "change-new";
      ui.pinDraft = "";
      render();
      return;
    }
    var dest = ui.pinNext;
    ui.pinEntry = "";
    ui.screen = ui.pinBack && ui.pinBack !== "pin" ? ui.pinBack : "home";
    if (dest === "home") goHome();
    else openGrownups();
    return;
  }
  if (ui.pinMode === "new" || ui.pinMode === "change-new") {
    ui.pinDraft = entered;
    ui.pinEntry = "";
    ui.pinMode = ui.pinMode === "new" ? "confirm" : "change-confirm";
    render();
    return;
  }
  if (entered !== ui.pinDraft) {
    ui.pinEntry = "";
    ui.pinDraft = "";
    ui.pinMode = ui.pinMode === "confirm" ? "new" : "change-new";
    ui.pinNote = "Those didn't match. Start again.";
    render();
    return;
  }
  save.pin = entered;
  ui.pinDraft = "";
  persist();
  syncTabletLock();
  ui.pinEntry = "";
  ui.screen = "grownups";
  render();
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
  var first = -1;
  var last = -1;
  var i;
  var j;
  var r2 = TRACE_RADIUS * TRACE_RADIUS;
  for (i = 0; i < samples.length; i++) {
    var s = samples[i];
    var near = false;
    for (j = 0; j < points.length; j++) {
      var dx = points[j].x - s.x;
      var dy = points[j].y - s.y;
      if (dx * dx + dy * dy <= r2) {
        near = true;
        break;
      }
    }
    if (!near) continue;
    hit++;
    if (first < 0) first = i;
    last = i;
  }
  if (samples.length > 5 && (last - first) / (samples.length - 1) < 0.62) return 0;
  return hit / samples.length;
}

function drawnLength() {
  var total = 0;
  var i;
  var j;
  for (i = 0; i < trace.strokes.length; i++) {
    var pts = trace.strokes[i];
    for (j = 1; j < pts.length; j++) {
      var dx = pts[j].x - pts[j - 1].x;
      var dy = pts[j].y - pts[j - 1].y;
      total += Math.sqrt(dx * dx + dy * dy);
    }
  }
  return total;
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
  trace.guideLength = 0;
  if (!svg) return;
  var guides = svg.querySelectorAll("path.guide");
  var arrows = svg.querySelector(".arrows");
  var steps = svg.querySelector(".steps");
  var placed = [];
  var i;
  trace.guides = guides;
  trace.ink = svg.querySelector(".ink");
  for (i = 0; i < guides.length; i++) {
    trace.samples.push(samplePath(guides[i], 8));
    trace.done.push(false);
    trace.guideLength += guides[i].getTotalLength();
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
  if (!all || !trace.guideLength || drawnLength() < trace.guideLength * 0.5) return;
  if (ui.screen === "letters" && letterForm() === "both" && ui.traceCase !== "small") {
    ui.traceCase = "small";
    render();
    return;
  }
  trace.finished = true;
  var note = document.querySelector(".feedback");
  if (note) note.textContent = "Good job.";
  celebrate();
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
    if (dist < 1) return;
    if (dist > 6400) {
      pts = beginStroke();
    } else if (dist > 16) trace.moved = true;
  }
  pts.push(p);
  if (tracePoints().length > 1500) trace.strokes.splice(0, 1);
  paintLine();
  if (pts.length % 3 === 0) traceProgress();
}

function onDown(e) {
  if (findResting(e) || rejectPalm(e)) return;
  var home = e.target.closest ? e.target.closest("[data-action='home']") : null;
  if (home) {
    if (save.pin && ui.screen !== "grownups") return;
    startHold(home, e, "home");
    return;
  }
  var grown = e.target.closest ? e.target.closest("[data-action='grownups']") : null;
  if (grown) {
    startHold(grown, e, "grownups");
    return;
  }
  if ((ui.screen === "letters" || ui.screen === "shapes") && ui.mode === "trace") {
    var card = e.target.closest ? e.target.closest(".trace-card") : null;
    var svg = card ? card.querySelector(".trace-board") : null;
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
  var list = e.getCoalescedEvents ? e.getCoalescedEvents() : null;
  if (list && list.length) {
    var i;
    for (i = 0; i < list.length; i++) addPoint(list[i], svg);
  } else addPoint(e, svg);
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
  if (e && e.pointerId != null) delete palmIds[e.pointerId];
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
    if (!nextLocked()) step(1);
  } else if (e.key === "ArrowLeft") {
    e.preventDefault();
    if (!challengeLocked("prev")) step(-1);
  }
}

function readUpdate() {
  if (!window.SunnyUpdate || !SunnyUpdate.status) return { state: "off", version: "", current: "" };
  try {
    return JSON.parse(SunnyUpdate.status() || "{}");
  } catch (err) {
    return { state: "error", version: "", current: "" };
  }
}

var INTRO = [
  {
    title: "For grown-ups",
    body: "This short tour is only for you. She can play when you finish.",
  },
  {
    title: "Four lessons",
    body: "Letters, Numbers, Shapes, and Colors are on the first page. More lessons will be added later.",
  },
  {
    title: "How she plays",
    body: "Look is for seeing and hearing. Find, Trace, and Count wait until she finishes. Only the picture boxes respond, so a palm on the rest of the screen does nothing. Next stays off while the voice is still talking.",
  },
  {
    title: "Sun and house",
    body: "Hold the sun to open grown-ups. Hold the house to go home. A tap on the house does nothing.",
  },
  {
    title: "A PIN",
    body: "Set a PIN if you want the house and the tablet Home button locked. Turn the PIN off to unlock them.",
  },
  {
    title: "Updates",
    body: "When an update is ready, grown-ups lists what changed. Install update puts it on top of this copy. You do not uninstall.",
  },
];

function openIntro() {
  ui.introFrom = ui.screen;
  ui.introStep = 0;
  ui.screen = "intro";
  render();
}

function introBack() {
  if (ui.introStep > 0) ui.introStep -= 1;
  render();
}

function introNext() {
  if (ui.introStep < INTRO.length - 1) {
    ui.introStep += 1;
    render();
    return;
  }
  var first = !save.introDone;
  save.introDone = true;
  persist();
  if (first && unseenNotes()) ui.screen = "whatsnew";
  else if (!first) ui.screen = ui.introFrom === "grownups" ? "grownups" : "home";
  else ui.screen = "home";
  render();
}

function closeIntro() {
  ui.screen = "grownups";
  render();
}

function renderIntro() {
  var step = ui.introStep || 0;
  if (step < 0) step = 0;
  if (step >= INTRO.length) step = INTRO.length - 1;
  var page = INTRO[step];
  var last = step === INTRO.length - 1;
  var buttons = "";
  if (step > 0) buttons += '<button class="chip" data-action="intro-back">Back</button>';
  if (save.introDone) buttons += '<button class="chip" data-action="intro-close">Close</button>';
  buttons +=
    '<button class="chip on" data-action="intro-next">' + (last ? "She can play" : "Next") + "</button>";
  return (
    '<main class="screen" data-screen="intro"><div class="intro">' +
    '<img class="mark" alt="" src="mark.jpg">' +
    '<p class="intro-count">' +
    (step + 1) +
    " of " +
    INTRO.length +
    "</p>" +
    '<h1 class="g-title">' +
    page.title +
    '</h1><p class="intro-body">' +
    page.body +
    '</p><div class="chips intro-actions">' +
    buttons +
    "</div></div></main>"
  );
}

function noteItems(text) {
  var lines = String(text || "").split("\n");
  var out = [];
  var i;
  for (i = 0; i < lines.length; i++) {
    var t = lines[i].replace(/^\s+|\s+$/g, "");
    if (!t || t.charAt(0) === "#") continue;
    if (t.toLowerCase().indexOf("buy me a coffee") !== -1) continue;
    t = t.replace(/^[-*]\s+/, "");
    t = t.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
    if (!t) continue;
    out.push(t);
  }
  return out;
}

function noteList(text) {
  var items = noteItems(text);
  if (!items.length) return "";
  var html = '<ul class="notes">';
  var i;
  for (i = 0; i < items.length; i++) {
    html += "<li>" + escHtml(items[i]) + "</li>";
  }
  return html + "</ul>";
}

function escHtml(s) {
  return String(s).replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">");
}

function unseenNotes() {
  if (!save.introDone || !window.SunnyUpdate) return false;
  var info = readUpdate();
  if (!info || info.state !== "current" || !info.notes || !info.current) return false;
  return save.seenNotes !== info.current;
}

function renderWhatsNew() {
  var info = readUpdate();
  return (
    '<main class="screen" data-screen="whatsnew"><div class="intro">' +
    '<img class="mark" alt="" src="mark.jpg">' +
    '<h1 class="g-title">What\'s new</h1>' +
    '<p class="intro-body">This copy' +
    (info.current ? " is " + escHtml(info.current) + "." : ".") +
    "</p>" +
    noteList(info.notes) +
    '<div class="chips intro-actions"><button class="chip on" data-action="notes-done">Continue</button></div></div></main>'
  );
}

function dismissNotes() {
  var info = readUpdate();
  if (info.current) save.seenNotes = info.current;
  persist();
  ui.screen = "home";
  render();
}

function updateHomeNote() {
  var info = readUpdate();
  if (info.state !== "ready") return "";
  return '<p class="hint">A newer copy is ready. Hold the sun, then Install update.</p>';
}

function updateSection() {
  if (!window.SunnyUpdate) {
    return (
      '<section class="g-sec"><h2 class="g-label">Updates</h2>' +
      '<p class="g-note">In the installed app, a newer copy installs over this one. You do not uninstall first.</p></section>'
    );
  }
  var info = readUpdate();
  var note = "Looking for a newer copy…";
  if (info.state === "ready") {
    note = "Version " + info.version + " is ready. It installs over this one.";
    if (save.pin) note += " The tablet unlocks for that step, then locks again when you come back.";
  } else if (info.state === "current") note = "This is the newest copy" + (info.current ? " (" + info.current + ")." : ".");
  else if (info.state === "downloading") note = "Downloading the newer copy…";
  else if (info.state === "error") note = "Couldn't check just now. The game still works offline.";
  var btn = "";
  if (info.state === "ready") {
    btn += '<button class="chip on" data-action="install-update">Install update</button>';
  }
  btn += '<button class="chip" data-action="check-update">Check for updates</button>';
  return '<section class="g-sec"><h2 class="g-label">Updates</h2><p class="g-note">' + note + "</p>" + noteList(info.notes) + btn + "</section>";
}

window.sunnyUpdateChanged = function () {
  if (!save.introDone) return;
  if (ui.screen === "home" && unseenNotes()) {
    ui.screen = "whatsnew";
    render();
    return;
  }
  if (ui.screen === "grownups" || ui.screen === "home" || ui.screen === "whatsnew") render();
};

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
  syncTabletLock();
  if (!save.introDone) ui.screen = "intro";
  render();
}

init();
