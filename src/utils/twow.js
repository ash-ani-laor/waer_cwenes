import { XoggRune } from "./mruw";

export class Twow extends XoggRune {
  constructor() {
    super();
    this.ReloadTwowX(); //initializers
    this.ReloadTwowR(); // -----------
  }

  ReloadTwowX() {
    this.quantity_xoggvas_left_in_Twow = 33;
    this.xoggvas_currently_in_Twow = this.Symbols[0].slice(0, 33);
  }
  ReloadTwowR() {
    this.quantity_runes_left_in_Twow = 23;
    this.runes_currently_in_Twow = this.Symbols[4].slice(0, 23);
  }

  TakeXoggvaFromTwow() {
    let ndx = Math.floor(Math.random() * this.quantity_xoggvas_left_in_Twow);
    this.quantity_xoggvas_left_in_Twow--;
    let ret = this.xoggvas_currently_in_Twow.splice(ndx, 1)[0];
    return ret;
  }

  TakeRuneFromTwow() {
    let ndx = Math.floor(Math.random() * this.quantity_runes_left_in_Twow);
    this.quantity_runes_left_in_Twow--;
    let ret = this.runes_currently_in_Twow.splice(ndx, 1)[0];
    return ret;
  }

  GiMegXoggva(put_back = false, script_type = 2, whole_name = false) {
    if (!put_back)
      if (this.quantity_xoggvas_left_in_Twow === 0)
        throw new Error(`GiMegXoggva: no more xoggvas in Twow`);

    let ret = this.TakeXoggvaFromTwow();
    let ndx = this._PositionInWaerByCyrillic(ret);

    if (whole_name)
      ret = this.ChangeTextEncoding(
        this.__xoggvas_full_names[ndx],
        script_type
      );
    else ret = this.Symbols[script_type][ndx];

    if (put_back)
      //one never puts back one xoggva, all the spread returns to the Twow!
      this.ReloadTwowX();
    return ret;
  }

  GiMegRune(put_back = false, whole_name = false) {
    if (!put_back)
      if (this.quantity_runes_left_in_Twow === 0)
        throw new Error(`GiMegRune: no more runes in Twow`);

    let ret = this.TakeRuneFromTwow();

    if (whole_name) ret = this.__runes_full_names[this.__runes.indexOf(ret)];

    if (put_back)
      //one never puts back one rune, all the spread returns to the Twow!
      this.ReloadTwowR();
    return ret;
  }

  /**
   * This function needs full Twow, but it doesn't demand returning the symbols back at once.
   * @returns 8 symbol hoggrune
   */
  _Hoggrune8() {
    this.ReloadTwowX();
    this.ReloadTwowR();

    let Actor = this.GiMegXoggva();
    let Rune = this.GiMegRune();
    let Force = this.GiMegXoggva();
    let Exiting = this.GiMegXoggva();
    let FourthX = this.GiMegXoggva();
    let FourthR = this.GiMegRune();
    let FifthX = this.GiMegXoggva();
    let FifthR = this.GiMegRune();

    // let Hoggrune8_Body = `
    // __${FourthX}___${FifthX}__
    // __${FourthR}___${FifthR}__
    // ____${Actor}____
    // ____${Rune}____
    // __${Force}___${Exiting}__
    // `;
    let Hoggrune8_Body = [
      `__${FourthX}___${FifthX}__`,
      `__${FourthR}___${FifthR}__`,
      `____${Actor}____`,
      `____${Rune}____`,
      `__${Force}___${Exiting}__`,
    ];
    return Hoggrune8_Body;
  }

  /**
   * This function needs full Twow, but it doesn't demand returning the symbols back at once.
   * @returns 4 symbol hoggrune
   */
  _Hoggrune4(goes_after = false) {
    if (!goes_after) {
      this.ReloadTwowX();
      this.ReloadTwowR();
    }

    let Actor = this.GiMegXoggva();
    let Rune = this.GiMegRune();
    let Force = this.GiMegXoggva();
    let Exiting = this.GiMegXoggva();

    // let Hoggrune4_Body = `
    // ____${Actor}____
    // ____${Rune}____
    // __${Force}___${Exiting}__
    // `;
    let Hoggrune4_Body = [
      `____${Actor}____`,
      `____${Rune}____`,
      `__${Force}___${Exiting}__`,
    ];
    return Hoggrune4_Body;
  }
}
