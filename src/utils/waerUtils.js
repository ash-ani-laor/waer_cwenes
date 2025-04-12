// src/utils/waerUtils.js
import { DateTime } from "luxon";
import { convertToWaerDate, convertToWaerTime, waerMonths } from "./dateUtils";
import { XoggRune } from "./xoggrune";
import { mysticalSeeder } from "./mysticalSeeder"; // Добавляем импорт
import { GodsAskingToolset } from "../constants/godsAskingToolset";

// Экземпляр XoggRune для конвертации
const xoggRune = new XoggRune();

// Расчёт дня ваэрского года
const getWaerDayOfYear = (luxonDate) => {
  // Определяем начало ваэрского года
  const gregorianYear = luxonDate.year;
  let waerYearStart = DateTime.fromObject({
    year: gregorianYear,
    month: 3,
    day: 20,
  });

  // Если дата до 20 марта, берём прошлый год
  if (luxonDate < waerYearStart) {
    waerYearStart = DateTime.fromObject({
      year: gregorianYear - 1,
      month: 3,
      day: 20,
    });
  }

  // Разница в днях + 1 (включая текущий день)
  const diffInDays = Math.floor(luxonDate.diff(waerYearStart, "days").days) + 1;
  return xoggRune.Decimal2XoggvaNumber(diffInDays, 2);
};

export const getWaerDateTimeString = (luxonDate) => {
  if (!luxonDate || !luxonDate.isValid) {
    console.error("Invalid luxonDate in getWaerDateTimeString:", luxonDate);
    return {
      waerDay: "00",
      waerMonth: "Ошибка",
      waerYear: "0000",
      waerDayOfYear: "00",
      waerTime: "00:00",
    };
  }

  const { waerYear, waerMonth, waerDay } = convertToWaerDate(luxonDate);
  const { waerHour, waerMinute } = convertToWaerTime(luxonDate);

  // Проверка на валидность waerMonth
  const monthIndex = waerMonth - 1;
  const monthName =
    monthIndex >= 0 && monthIndex < waerMonths.length
      ? waerMonths[monthIndex]
      : "Неизвестно";

  const waerDayStr = xoggRune.Decimal2XoggvaNumber(waerDay, 2);
  const waerYearStr = xoggRune.Decimal2XoggvaNumber(waerYear, 2);
  const waerMonthStr = xoggRune.ChangeTextEncoding(
    monthName.toLowerCase(),
    2,
    1
  );
  const waerDayOfYear = getWaerDayOfYear(luxonDate);
  const waerHourStr = xoggRune.Decimal2XoggvaNumber(waerHour, 2);
  const waerMinuteStr = xoggRune.Decimal2XoggvaNumber(waerMinute, 2);
  const waerTimeStr = `${waerHourStr}:${waerMinuteStr}`;

  return {
    waerDay: waerDayStr,
    waerMonth: waerMonthStr,
    waerYear: waerYearStr,
    waerDayOfYear: waerDayOfYear,
    waerTime: waerTimeStr,
  };
};

export const sortOrShuffleSymbols = (symbols, question, isProtocolMode) => {
  const symbolsInDeck = symbols.filter((sym) => !sym.drawn);
  const symbolsInLayout = symbols.filter((sym) => sym.drawn);

  let updatedSymbolsInDeck;
  if (isProtocolMode) {
    // В режиме "протокола" сортируем по id
    updatedSymbolsInDeck = [...symbolsInDeck].sort((a, b) => a.id - b.id);
  } else {
    // В режиме "дивинации" перемешиваем
    const reshuffleDateTime = DateTime.now().toISO();
    const shuffledIndices = mysticalSeeder(question, reshuffleDateTime);
    updatedSymbolsInDeck = shuffledIndices
      .map((index) => {
        const toolsetItem = GodsAskingToolset.find(
          (item) => item.indexInJar === index
        );
        return symbolsInDeck.find((s) => s.id === toolsetItem.id);
      })
      .filter(Boolean);
  }

  return [...symbolsInLayout, ...updatedSymbolsInDeck];
};
