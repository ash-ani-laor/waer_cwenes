//src\utils\dateUtils.js
import { DateTime } from "luxon";
import { XoggRune } from "./xoggrune";
const xoggRune = new XoggRune();

export const WeekendStyles = {
  weekend: {
    color: "red", // Цвет для выходных
  },
};

const WAER_HOURS_PER_DAY = 33;
const WAER_MINUTES_PER_HOUR = 33;
const WAER_SECONDS_PER_MINUTE = 33;
const WAER_PARTS_PER_SECOND = 12 ** 3; // 1728 parts per second

export const waerMonths = [
  "Эрåθ",
  "Ωти",
  "Ɂэер",
  "Я-На",
  "Зера",
  "Акξа",
  "Åɂå",
  "Мокг",
  "Ξерɂ",
  "Га",
  "Кwомп",
  "Тωв",
  "Вåжа",
];

export const gregorianMonths = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

export const convertToWaerDate = (date) => {
  if (!date.isValid) {
    console.error("Invalid date:", date);
    return { waerYear: NaN, waerMonth: NaN, waerDay: NaN };
  }

  const waerYear = date.year - 1875;
  const startOfYear = DateTime.fromObject({
    year: date.year,
    month: 3,
    day: 20,
  });

  let waerMonth, waerDay;

  if (date < startOfYear) {
    const prevYearStart = DateTime.fromObject({
      year: date.year - 1,
      month: 3,
      day: 20,
    });
    const diffInDays = Math.floor(date.diff(prevYearStart, "days").days);

    if (diffInDays >= 364) {
      waerMonth = 13;
      waerDay = diffInDays - 335; // Adjust for the last 29/30 days
    } else {
      waerMonth = Math.floor(diffInDays / 28) + 1;
      waerDay = (diffInDays % 28) + 1;
    }

    return { waerYear: waerYear - 1, waerMonth, waerDay };
  } else {
    const diffInDays = Math.floor(date.diff(startOfYear, "days").days);

    if (diffInDays >= 364) {
      waerMonth = 13;
      waerDay = diffInDays - 335;
    } else {
      waerMonth = Math.floor(diffInDays / 28) + 1;
      waerDay = (diffInDays % 28) + 1;
    }

    return { waerYear, waerMonth, waerDay };
  }
};

export const convertToWaerTime = (date) => {
  if (!date || !date.isValid) {
    console.error("Invalid date:", date);
    return { waerHour: 0, waerMinute: 0, waerSecond: 0, waerPart: 0 };
  }

  // Total milliseconds in a Gregorian day
  const totalGregorianMillisecondsInDay = 24 * 60 * 60 * 1000; // 86400000 milliseconds

  // Total subseconds in a Waer day
  const totalWaerSubsecondsInDay =
    WAER_HOURS_PER_DAY *
    WAER_MINUTES_PER_HOUR *
    WAER_SECONDS_PER_MINUTE *
    WAER_PARTS_PER_SECOND; // 33 * 33 * 33 * 1728 = 62270208 subseconds

  // Calculate the total milliseconds since midnight in Gregorian time
  const gregorianMillisecondsSinceMidnight =
    date.hour * 60 * 60 * 1000 + // hours to milliseconds
    date.minute * 60 * 1000 + // minutes to milliseconds
    date.second * 1000 + // seconds to milliseconds
    date.millisecond; // milliseconds

  // Convert Gregorian milliseconds to Waer subseconds
  const waerSubsecondsSinceMidnight =
    (gregorianMillisecondsSinceMidnight / totalGregorianMillisecondsInDay) *
    totalWaerSubsecondsInDay;

  // Calculate Waer hours, minutes, seconds, and subseconds
  const waerHour =
    Math.floor(
      waerSubsecondsSinceMidnight /
        (WAER_MINUTES_PER_HOUR *
          WAER_SECONDS_PER_MINUTE *
          WAER_PARTS_PER_SECOND)
    ) % WAER_HOURS_PER_DAY;
  const waerMinute =
    Math.floor(
      waerSubsecondsSinceMidnight /
        (WAER_SECONDS_PER_MINUTE * WAER_PARTS_PER_SECOND)
    ) % WAER_MINUTES_PER_HOUR;
  const waerSecond =
    Math.floor(waerSubsecondsSinceMidnight / WAER_PARTS_PER_SECOND) %
    WAER_SECONDS_PER_MINUTE;
  const waerPart =
    Math.floor(waerSubsecondsSinceMidnight) % WAER_PARTS_PER_SECOND;

  return { waerHour, waerMinute, waerSecond, waerPart };
};

// Функция для конвертации ваэрской даты в григорианскую
export const convertFromWaerDate = (waerYear, waerMonth, waerDay) => {
  // Григорианский год = ваэрский год + 1875
  const gregorianYear = waerYear + 1875;

  // Начало ваэрского года (20 марта)
  const startOfYear = DateTime.fromObject({
    year: gregorianYear,
    month: 3, // Март
    day: 20,
  });

  if (!startOfYear.isValid) {
    console.error("Invalid startOfYear:", startOfYear);
    return null;
  }

  // Проверка границ
  if (waerMonth < 1 || waerMonth > 13) {
    console.error("Invalid waerMonth:", waerMonth);
    return null;
  }

  // Вычисляем количество дней с начала года до начала текущего месяца
  let daysToMonth = (waerMonth - 1) * 28;

  // Если это последний месяц, добавляем дополнительные дни в зависимости от високосности
  if (waerMonth === 13) {
    daysToMonth += isLeapYear(waerYear) ? 29 : 30;
  }

  // Добавляем дни для текущего месяца
  const date = startOfYear.plus({ days: daysToMonth + (waerDay - 1) });

  if (!date.isValid) {
    console.error("Invalid date:", date);
    return null;
  }

  return date;
};

export const convertFromWaerTime = (
  waerHour,
  waerMinute,
  waerSecond,
  waerPart
) => {
  // Total subseconds in a Waer day
  const totalWaerSubsecondsInDay =
    WAER_HOURS_PER_DAY *
    WAER_MINUTES_PER_HOUR *
    WAER_SECONDS_PER_MINUTE *
    WAER_PARTS_PER_SECOND; // 33 * 33 * 33 * 1728 = 62270208 subseconds

  // Total milliseconds in a Gregorian day
  const totalGregorianMillisecondsInDay = 24 * 60 * 60 * 1000; // 86400000 milliseconds

  // Calculate total Waer subseconds since midnight
  const waerSubsecondsSinceMidnight =
    waerHour *
      WAER_MINUTES_PER_HOUR *
      WAER_SECONDS_PER_MINUTE *
      WAER_PARTS_PER_SECOND + // hours to subseconds
    waerMinute * WAER_SECONDS_PER_MINUTE * WAER_PARTS_PER_SECOND + // minutes to subseconds
    waerSecond * WAER_PARTS_PER_SECOND + // seconds to subseconds
    waerPart; // subseconds

  // Convert Waer subseconds to Gregorian milliseconds
  const gregorianMillisecondsSinceMidnight =
    (waerSubsecondsSinceMidnight / totalWaerSubsecondsInDay) *
    totalGregorianMillisecondsInDay;

  // Calculate Gregorian hours, minutes, seconds, and milliseconds
  const hour =
    Math.floor(gregorianMillisecondsSinceMidnight / (60 * 60 * 1000)) % 24;
  const minute = Math.floor(
    (gregorianMillisecondsSinceMidnight % (60 * 60 * 1000)) / (60 * 1000)
  );
  const second = Math.floor(
    (gregorianMillisecondsSinceMidnight % (60 * 1000)) / 1000
  );
  const millisecond = Math.floor(gregorianMillisecondsSinceMidnight % 1000);

  return { hour, minute, second, millisecond };
};

const isLeapYear = (year) => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};
// Функция для получения недель для григорианского календаря
export const getWeeksInMonth = (date) => {
  const firstDayOfMonth = date.startOf("month");
  const lastDayOfMonth = date.endOf("month");
  const weeks = [];

  let currentDay = firstDayOfMonth.startOf("week");
  while (currentDay <= lastDayOfMonth) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(currentDay);
      currentDay = currentDay.plus({ days: 1 });
    }
    weeks.push(week);
  }

  return weeks;
};

export const getWaerMonthDays = (date) => {
  const waerDate = convertToWaerDate(date);
  if (isNaN(waerDate.waerYear)) {
    console.error("Invalid waerDate:", waerDate);
    return [];
  }

  // Determine the start of the Waer year (March 20th)
  let startOfYear;
  if (date < DateTime.fromObject({ year: date.year, month: 3, day: 20 })) {
    // If the current date is before March 20th, the Waer year starts in the previous Gregorian year
    startOfYear = DateTime.fromObject({
      year: date.year - 1,
      month: 3,
      day: 20,
    });
  } else {
    // Otherwise, the Waer year starts in the current Gregorian year
    startOfYear = DateTime.fromObject({
      year: date.year,
      month: 3,
      day: 20,
    });
  }

  if (!startOfYear.isValid) {
    console.error("Invalid startOfYear:", startOfYear);
    return [];
  }

  // Start of the current Waer month
  const startOfMonth = startOfYear.plus({
    days: (waerDate.waerMonth - 1) * 28,
  });

  if (!startOfMonth.isValid) {
    console.error("Invalid startOfMonth:", startOfMonth);
    return [];
  }

  // Number of days in the Waer month
  const daysInMonth =
    waerDate.waerMonth === 13 ? (isLeapYear(waerDate.waerYear) ? 29 : 30) : 28;

  // Generate the days of the Waer month
  const days = [];
  for (let i = 0; i < daysInMonth; i++) {
    const day = startOfMonth.plus({ days: i });
    if (day.isValid) {
      days.push(day);
    } else {
      console.error("Invalid day:", day);
    }
  }

  // Ensure the 19th of March is included in the 13th month of the current Waer year
  if (waerDate.waerMonth === 13) {
    const lastDayOfMonth = days[days.length - 1];
    if (lastDayOfMonth.toFormat("dd-MM") === "18-03") {
      // Add the 19th of March to the 13th month
      const nextDay = lastDayOfMonth.plus({ days: 1 });
      if (nextDay.toFormat("dd-MM") === "19-03") {
        days.push(nextDay);
      }
    }
  }

  // Ensure the 20th of March is not included in the 13th month
  const lastDay = days[days.length - 1];
  if (lastDay && lastDay.toFormat("dd-MM") === "20-03") {
    // Remove the 20th of March from the 13th month
    days.pop();
  }

  return days;
};

// Функция для форматирования ваэрской даты и времени
export const formatWaerDateTime = (date) => {
  const waerDate = convertToWaerDate(date);
  const waerTime = convertToWaerTime(date);

  return {
    date: `${waerDate.waerDay.toString().padStart(2, "0")}-${waerDate.waerMonth
      .toString()
      .padStart(2, "0")}-${waerDate.waerYear}`,
    time: `${waerTime.waerHour
      .toString()
      .padStart(2, "0")}:${waerTime.waerMinute
      .toString()
      .padStart(2, "0")}:${waerTime.waerSecond.toString().padStart(2, "0")}`,
  };
};

// Функция для получения пересекающихся месяцев
export const getIntersectingMonths = (date, isWaer) => {
  const waerDate = convertToWaerDate(date);
  const gregorianMonth = gregorianMonths[date.month - 1];
  const waerMonth = waerMonths[waerDate.waerMonth - 1];

  if (isWaer) {
    // Для ваэрского календаря
    // Определяем начало и конец текущего ваэрского месяца
    const startOfWaerMonth = convertFromWaerDate(
      waerDate.waerYear,
      waerDate.waerMonth,
      1
    );
    const endOfWaerMonth = convertFromWaerDate(
      waerDate.waerYear,
      waerDate.waerMonth,
      waerDate.waerMonth === 13 ? (isLeapYear(waerDate.waerYear) ? 29 : 30) : 28
    );

    // Определяем григорианские месяцы для начала и конца ваэрского месяца
    const startGregorianMonth = gregorianMonths[startOfWaerMonth.month - 1];
    const endGregorianMonth = gregorianMonths[endOfWaerMonth.month - 1];

    // Проверяем, пересекает ли ваэрский месяц границу григорианского года
    if (startOfWaerMonth.year !== endOfWaerMonth.year) {
      // Если пересекает, добавляем годы
      return `${waerMonth} (${startGregorianMonth} ${startOfWaerMonth.year}/${endGregorianMonth} ${endOfWaerMonth.year})`;
    } else {
      // Если не пересекает, отображаем только месяцы
      return `${waerMonth} (${startGregorianMonth}/${endGregorianMonth})`;
    }
  } else {
    // Для григорианского календаря
    const startOfMonth = date.startOf("month");
    const endOfMonth = date.endOf("month");

    // Определяем ваэрские месяцы для начала и конца григорианского месяца
    const startWaerDate = convertToWaerDate(startOfMonth);
    const endWaerDate = convertToWaerDate(endOfMonth);

    const startWaerMonth = waerMonths[startWaerDate.waerMonth - 1];
    const endWaerMonth = waerMonths[endWaerDate.waerMonth - 1];

    if (startWaerDate.waerYear !== endWaerDate.waerYear) {
      // Если григорианский месяц пересекает границу ваэрского года
      return `${gregorianMonth} (${startWaerMonth} ${startWaerDate.waerYear}/${endWaerMonth} ${endWaerDate.waerYear})`;
    } else {
      // Если григорианский месяц пересекает границу ваэрских месяцев
      return `${gregorianMonth} (${startWaerMonth}/${endWaerMonth})`;
    }
  }
};

export const getWaerDayOfYear = (luxonDate) => {
  const gregorianYear = luxonDate.year;
  let waerYearStart = DateTime.fromObject({
    year: gregorianYear,
    month: 3,
    day: 20,
  });

  if (luxonDate < waerYearStart) {
    waerYearStart = DateTime.fromObject({
      year: gregorianYear - 1,
      month: 3,
      day: 20,
    });
  }

  const diffInDays = Math.floor(luxonDate.diff(waerYearStart, "days").days) + 1;
  return xoggRune.Decimal2XoggvaNumber(diffInDays, 2);
};

export const getWaerDateTimeString = (luxonDate) => {
  if (!luxonDate || !luxonDate.isValid) {
    return {
      waerDay: "00",
      waerMonth: "Ошибка",
      waerYear: "0000",
      waerDayOfYear: "00",
      waerTime: "00:00:00", // Обновили формат по умолчанию
    };
  }

  const { waerYear, waerMonth, waerDay } = convertToWaerDate(luxonDate);
  const { waerHour, waerMinute, waerSecond } = convertToWaerTime(luxonDate); // Добавили waerSecond

  const waerDayStr = xoggRune.Decimal2XoggvaNumber(waerDay, 2);
  const waerYearStr = xoggRune.Decimal2XoggvaNumber(waerYear, 2);
  const waerMonthStr = xoggRune.ChangeTextEncoding(
    waerMonths[waerMonth - 1].toLowerCase(),
    2,
    1
  );
  const waerDayOfYear = getWaerDayOfYear(luxonDate);
  const waerHourStr = xoggRune.Decimal2XoggvaNumber(waerHour, 2);
  const waerMinuteStr = xoggRune.Decimal2XoggvaNumber(waerMinute, 2);
  const waerSecondStr = xoggRune.Decimal2XoggvaNumber(waerSecond, 2); // Преобразуем секунды
  const waerTimeStr = `${waerHourStr}:${waerMinuteStr}:${waerSecondStr}`; // Добавили секунды

  return {
    waerDay: waerDayStr,
    waerMonth: waerMonthStr,
    waerYear: waerYearStr,
    waerDayOfYear: waerDayOfYear,
    waerTime: waerTimeStr,
  };
};
