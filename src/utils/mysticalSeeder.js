//src\utils\mysticalSeeder.js
import seedrandom from "seedrandom";
import { DateTime } from "luxon";
import { GodsAskingToolset } from "../constants/godsAskingToolset";
import { XoggRune } from "./xoggrune";
import { formatWaerDateTime, waerMonths } from "./dateUtils";

const stringToUnicodeSum = (str) => {
  return str.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
};

const shuffleArray = (array, seed) => {
  const rng = seedrandom(seed.toString());
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const mysticalSeeder = (question, dateTime) => {
  const xoggRune = new XoggRune();

  const luxonDateTime = DateTime.fromISO(dateTime);
  if (!luxonDateTime.isValid) {
    throw new Error(`Invalid date: ${dateTime}`);
  }

  const waerDateTime = formatWaerDateTime(luxonDateTime);
  const waerDateStr = waerDateTime.date;
  const waerTimeStr = waerDateTime.time;

  const waerDateParts = waerDateStr.split("-");
  const waerMonthName = xoggRune.ChangeTextEncoding(
    waerMonths[parseInt(waerDateParts[1], 10) - 1].toLowerCase(),
    2,
    1
  );

  const waerDayHoggva = xoggRune.Decimal2XoggvaNumber(
    parseInt(waerDateParts[0], 10)
  );
  const waerYearHoggva = xoggRune.Decimal2XoggvaNumber(
    parseInt(waerDateParts[2], 10)
  );
  const waerHourHoggva = xoggRune.Decimal2XoggvaNumber(
    parseInt(waerTimeStr.split(":")[0], 10)
  );
  const waerMinuteHoggva = xoggRune.Decimal2XoggvaNumber(
    parseInt(waerTimeStr.split(":")[1], 10)
  );
  const waerSecondHoggva = xoggRune.Decimal2XoggvaNumber(
    parseInt(waerTimeStr.split(":")[2], 10)
  );

  const waerHoggvaDateTime = `${waerDayHoggva}-${waerMonthName}-${waerYearHoggva} ${waerHourHoggva}:${waerMinuteHoggva}:${waerSecondHoggva}`;

  const date = new Date(dateTime);
  const normalDateTime = `${date.getDate().toString().padStart(2, "0")}${String(
    date.getMonth() + 1
  ).padStart(2, "0")}${date.getFullYear()}${date
    .getHours()
    .toString()
    .padStart(2, "0")}${date.getMinutes().toString().padStart(2, "0")}${date
    .getSeconds()
    .toString()
    .padStart(2, "0")}`;

  const rawString = `${normalDateTime}${question}${waerHoggvaDateTime}`.replace(
    /[\s-:]/g,
    ""
  );
  const seed = stringToUnicodeSum(rawString);
  const transformedSeed = xoggRune.Decimal2XoggvaNumber(seed);

  // Перемешиваем только indexInJar
  const indices = GodsAskingToolset.map((item) => item.indexInJar);
  const shuffledIndices = shuffleArray(indices, transformedSeed);

  return shuffledIndices; // Возвращаем массив индексов
};
