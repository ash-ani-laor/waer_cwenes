//src\utils\isopsephia.js
import { XoggRune } from "./xoggrune";

export class WaerIsopsephia extends XoggRune {
  textToDecimal(strText) {
    return this.DecimalWaerIsopsephia(strText).toString();
  }

  textToHexadecimal(strText) {
    return this.DecimalWaerIsopsephia(strText).toString(12);
  }

  textToBeautiful(strText) {
    return this.CyrillicToXoggvaNumber(strText, 1);
  }

  textToUnicode(strText) {
    return this.CyrillicToXoggvaNumber(strText);
  }
}
