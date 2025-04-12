//src\utils\xoggrune.js
export class XoggRune {
  static SYMBOLS_CYRILLIC = 0;
  static SYMBOLS_BEAUTIFUL = 1;
  static SYMBOLS_UNICODE = 2;

  constructor() {
    this.__xoggvas_beautiful =
      "э ω I я з а å м ξ г к т в у щ б о ρ ш л с ё р ж й п х е и w д θ н э ы å ф ˉ ˉ ⁝ ⁅ ⁆ ⁝ͱ ⁝|⁝ ео ".split(
        " "
      );
    this.__xoggvas_beautiful.push(" ");

    this.__xoggvas_full_names = [
      "эРъц",
      "ыти",
      "ьэер",
      "яна",
      "зера",
      "акча",
      "ъьъ",
      "мокг",
      "черь",
      "га",
      "кВомп",
      "тыв",
      "въжа",
      "учсъ",
      "щит",
      "бйер",
      "ог",
      "РуВ",
      "шелй",
      "лъу",
      "селй",
      "ёжа",
      "реда",
      "жеоз",
      "йяр",
      "печц",
      "хуВ",
      "егх",
      "иасен",
      "Вян",
      "дыъ",
      "цегх",
      "на",
      "афа",
    ];

    this.__xoggvas_utf8 =
      "⅄ ͱ ɾ q ʌ p չ ↷ m ϙ I C ʙ ʜ O Ƒ ɯ ϵ ʞ d ψ Ξ ʀ Պ b Ʋ ⊥ է T Ɣ Δ փ n Y Ӻ = ᛋ ˉ ˉ ⁝ ⁅ ⁆ ⁝ͱ ⁝|⁝ Ϣ ".split(
        " "
      );
    this.__xoggvas_utf8.push(" "); //ꙈꙉƕʎըϯʞѦŦ

    this.__xoggvas_cyr_keyboard =
      "э ы ь я з а ъ м ч г к т в у щ б о Р ш л с ё р ж й п х е и В д ц н Э Ы Ъ ф – - _ ( ) ? ! ео ".split(
        " "
      );
    this.__xoggvas_cyr_keyboard.push(" ");

    this.__xoggvas_IPA =
      "ɛ ω ʔ æ z ʌ ɔ m ʀ̥ g k t v u ç b ɔ̝ ɾ ʃ ʟ s ø̞ ɹ ʒ ʝ p x e i β d̪ θ n @ @ @ f – - _ ( ) ? ! @ ".split(
        " "
      );
    this.__xoggvas_IPA.push(" "); //ŋ y h q ɣ ð

    this.__xoggva_numeric_values = [
      1, //э
      2, //ы
      3, //ь
      4, //я
      5, //з
      6, //а
      7, //ъ
      8, //м
      9, //ч
      10, //г
      11, //к
      1 * 12, //т
      2 * 12, //в
      3 * 12, //у
      4 * 12, //щ
      5 * 12, //б
      6 * 12, //о
      7 * 12, //р
      8 * 12, //ш
      9 * 12, //л
      10 * 12, //с
      11 * 12, //ё
      1 * 144, //р
      2 * 144, //ж
      3 * 144, //й
      4 * 144, //п
      5 * 144, //х
      6 * 144, //е
      7 * 144, //и
      8 * 144, //В
      9 * 144, //д
      10 * 144, //ц
      11 * 144, //н
      1, // 9*12+3*144+3*12+5*12+6*12+10*12+2*12+6*144+1*12
      2, //
      3, //
      4 * 144 * 2, //ф
      0, //
      0, //
      10 * 144, //
      0, //
      0, //
      0, //
      0, //
      0, //
      936, //
      0, //
    ];

    this.__runes_runic = [
      "ᚠ",
      "ᚢ",
      "ᚦ",
      "ᚨ",
      "ᚱ",
      "ᚲ",
      "ᚷ",
      "ᚹ", // Fehu, Uruz, Thurisaz, Ansuz, Raidho, Kenaz, Gebo, Wunjo
      "ᚺ",
      "ᚾ",
      "ᛁ",
      "ᛃ",
      "ᛇ",
      "ᛈ",
      "ᛉ",
      "ϟ", // Hagalaz, Nauthiz, Isa, Jera, Eihwaz, Perthro, Algiz, Sowilo
      "ᛏ",
      "ᛒ",
      "ᛖ",
      "ᛗ",
      "ᛚ",
      "ᛜ",
      "ᛟ",
      "ᛞ", // Tiwaz, Berkano, Ehwaz, Mannaz, Laguz, Ingwaz, Othala, Dagaz
      "⮽", // Blank rune (U+2BBD Ballot Box with Light X)
    ];

    this.__xoggvas_short_names =
      "уо эр ье яа зо ак ъь ме чэ га кВ тВ въ уч щь бй оо Ру ше лэ се ёж ре же йа пи ху ее ии Вя дw цу на".split(
        " "
      );

    this.__xoggvas_numbers_names = [
      "фа",
      "эр ω Iэ я зе аз åI мо ξе га кω".split(" "),
      "та вå ξcå же бйе оо".split(" "),
    ];

    this.__runes = "F U Þ A R C G W H N I J Y P Z S T B E M L Ŋ O Ð".split(" ");
    this.__runes_full_names =
      "Fryja Urz Þorn Ans Ryð Cen Gyf Wen Hagl Nauð Is Jear Ywas Perþ Elcaz Sowel Teiv Birca Ecv Mann Lag iŊ Oðal Ðag".split(
        " "
      );
    this.__runes_numeric_values = [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      1 * 8,
      2 * 8,
      3 * 8,
      4 * 8,
      5 * 8,
      6 * 8,
      7 * 8,
      8 * 8,
      1 * 8 * 8,
      2 * 8 * 8,
      3 * 8 * 8,
      4 * 8 * 8,
      5 * 8 * 8,
      6 * 8 * 8,
      7 * 8 * 8,
      8 * 8 * 8,
    ];

    this.Symbols = [
      this.__xoggvas_cyr_keyboard, //0
      this.__xoggvas_beautiful, //1
      this.__xoggvas_utf8, //2
      this.__xoggvas_IPA, //3

      this.__runes, //4
      this.__runes_runic, // Updated to runic runes
    ];
  }

  CapitalizeFirstSymbol(str) {
    return str.replace(/^\w/, (c) => c.toUpperCase());
  }

  _PositionInWaerByCyrillic(cyr) {
    return this.__xoggvas_cyr_keyboard.findIndex((x) => x === cyr);
  }

  _PositionInWaerByXoggva(xog) {
    return this.__xoggvas_utf8.findIndex((x) => x === xog);
  }

  _IsXoggva(cyr) {
    return this._PositionInWaerByCyrillic(cyr) >= 0 ? true : false;
  }

  Decimal2XoggvaNumber(decimal_num, script_type = 2) {
    var unicode_xoggvas = this.Symbols[script_type].slice(0, 33);
    decimal_num = parseInt(decimal_num);
    if (decimal_num === 0) return this.Symbols[script_type][33]; // "ϟ";
    var xognums = this.__xoggva_numeric_values.slice(0, 33);
    ///////////////////////////////////////////////
    var rest = 0,
      ret = "",
      arr = [];
    do {
      rest = Math.floor(decimal_num / 12 ** 3);
      decimal_num = decimal_num % 12 ** 3;
      var counter = decimal_num;
      for (let i = xognums.length - 1; i >= 0; i--) {
        if (xognums[i] <= counter) {
          ret += unicode_xoggvas[i];
          counter -= xognums[i];
        }
      }
      arr.unshift(ret);
      decimal_num = rest;
      if (decimal_num > 0) {
        ret = "";
      }
    } while (rest > 0);
    return arr.length > 1 ? arr.join(".") : arr[0];
  }

  XoggvaIsopsephiaToDecimalInt(hog, utf = false) {
    if (hog === (utf ? "ϟ" : "ф")) return 0;
    var xogNumbers = this.Symbols[utf ? 2 : 1].slice(0, 33);

    var num_registers = hog.split(".");
    var res = 0;
    for (let i = num_registers.length - 1; i >= 0; i--) {
      //this is the counter of powers of twelve
      var ai = num_registers.length - i - 1;
      var digit = num_registers[i].split("");
      for (let j = digit.length - 1; j >= 0; j--) {
        //this is the counter of the digits in 3-groups
        var ndx = xogNumbers.indexOf(digit[j]);
        if (ndx >= 0) {
          res += (12 ** 3) ** ai * this.__xoggva_numeric_values[ndx];
        }
      }
    }
    return res;
  }

  XoggvaIsopsephiaToDecimalInt2(hog, format = XoggRune.SYMBOLS_BEAUTIFUL) {
    let inputString = hog;

    if (format === XoggRune.SYMBOLS_CYRILLIC) {
      inputString = this.ChangeTextEncoding(
        hog,
        XoggRune.SYMBOLS_BEAUTIFUL,
        XoggRune.SYMBOLS_CYRILLIC
      );
    } else if (
      format === XoggRune.SYMBOLS_BEAUTIFUL ||
      format === XoggRune.SYMBOLS_UNICODE
    ) {
      inputString = hog;
    } else {
      return "Неподдерживаемый формат: используйте кириллицу, beautiful или unicode";
    }

    if (inputString === (format === XoggRune.SYMBOLS_UNICODE ? "ϟ" : "ф"))
      return 0;

    const xogNumbers =
      format === XoggRune.SYMBOLS_UNICODE
        ? this.Symbols[2].slice(0, 33)
        : this.Symbols[1].slice(0, 33);
    const numRegisters = inputString.split(".");
    let res = 0;

    for (let i = numRegisters.length - 1; i >= 0; i--) {
      const ai = numRegisters.length - 1 - i;
      const digit = numRegisters[i].split("");

      for (let j = 0; j < digit.length; j++) {
        const ndx = xogNumbers.indexOf(digit[j]);
        if (ndx >= 0) {
          res += this.__xoggva_numeric_values[ndx] * Math.pow(12 ** 3, ai);
        } else {
          return `Некорректный символ '${digit[j]}' в записи`;
        }
      }
    }

    return res;
  }

  ChangeTextEncoding(str, script_type = 1, source_script_type = 0) {
    let single_letters = str.split("");
    let input_alphabet = this.Symbols[source_script_type];
    let output_alphabet = this.Symbols[script_type];
    let output_string = [];

    for (var i = 0; i < single_letters.length; i++) {
      let pos = input_alphabet.indexOf(single_letters[i]);
      if (pos === -1) {
        if (single_letters[i] === " ") {
          output_string[i] = " ";
        } else {
          output_string[i] = "" + single_letters[i] + "";
        }
      } else {
        output_string[i] = output_alphabet[pos];
      }
    }
    let ret = output_string.join("");
    let isFullXoggvaName = this.__xoggvas_full_names.indexOf(str) !== -1;
    if (script_type === 1 && isFullXoggvaName)
      ret = this.CapitalizeFirstSymbol(ret);
    return ret;
  }

  /**
   * Function returns decimal sum of letter values in cyrillic string
   * @param {string} cyrillic_str string of this.__xoggvas_cyr_keyboard
   * @returns integer (decimal)
   */
  DecimalWaerIsopsephia(cyrillic_str) {
    if (cyrillic_str === "") return 0;
    let ret = -1;
    for (let letter of cyrillic_str) {
      let index = this._PositionInWaerByCyrillic(letter);
      if (index >= 0) ret += this.__xoggva_numeric_values[index];
    }
    return ret === -1 ? ret : ret + 1;
  }

  CyrillicToXoggvaNumber = (cyrillic_str, script_type = 2) =>
    this.Decimal2XoggvaNumber(
      this.DecimalWaerIsopsephia(cyrillic_str),
      script_type
    );

  // Новая функция для преобразования исландского текста в руны Старшего Футарка
  normalizeIcelandicToRunes(text) {
    // Приводим к нижнему регистру и убираем пробелы
    let normalized = text.toLowerCase().replace(/\s+/g, "");

    // Преобразование исландских букв в базовые
    const replacements = {
      á: "a",
      é: "e",
      í: "i",
      ó: "o",
      ú: "u",
      ý: "u", // ý часто заменяется на u в Старшем Футарке
      ö: "o",
      æ: "a", // æ → a
      þ: "th", // þ → th
      ð: "d", // ð → d
    };

    for (const [key, value] of Object.entries(replacements)) {
      normalized = normalized.replace(new RegExp(key, "g"), value);
    }

    // Убираем удвоенные буквы (например, ll → l)
    normalized = normalized.replace(/(.)\1+/g, "$1");

    // Преобразуем в руны Старшего Футарка
    const runeMap = {
      a: "ᚨ",
      b: "ᛒ",
      d: "ᛞ",
      e: "ᛖ",
      f: "ᚠ",
      g: "ᚷ",
      h: "ᚺ",
      i: "ᛁ",
      j: "ᛃ",
      k: "ᚲ",
      l: "ᛚ",
      m: "ᛗ",
      n: "ᚾ",
      o: "ᛟ",
      p: "ᛈ",
      r: "ᚱ",
      s: "ᛋ",
      t: "ᛏ",
      u: "ᚢ",
      w: "ᚹ",
      z: "ᛉ",
      th: "ᚦ", // для þ
    };

    let runeText = "";
    let i = 0;
    while (i < normalized.length) {
      if (i + 1 < normalized.length && normalized.slice(i, i + 2) === "th") {
        runeText += runeMap["th"] || "";
        i += 2;
      } else {
        const char = normalized[i];
        runeText += runeMap[char] || "";
        i++;
      }
    }

    return runeText;
  }
}
