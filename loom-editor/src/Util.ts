/**
 * Given a color, determines if it is dark or light.
 * This can be used to change i.e. font color to be readable against different backgrounds.
 *
 * @param colorString String of color to determine darkness of; accepts both rgb(a) and hex
 * @returns true if the color is dark, false if it is light
 */
export const isDark = (colorString: string): boolean => {
  // adapted from https://awik.io/determine-color-bright-dark-using-javascript/

  let r: number;
  let g: number;
  let b: number;

  // Check the format of the color, HEX or RGB?
  if (colorString.match(/^rgb/)) {
    // If RGB --> store the red, green, blue values in separate variables
    const parsed = colorString.match(
      /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
    );

    r = Number.parseFloat(parsed![1]);
    g = Number.parseFloat(parsed![2]);
    b = Number.parseFloat(parsed![3]);
  } else {
    // from https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    const parsed = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
      colorString
    );
    r = Number.parseInt(parsed![1], 16);
    g = Number.parseInt(parsed![2], 16);
    b = Number.parseInt(parsed![3], 16);
  }

  // HSP equation from http://alienryderflex.com/hsp.html
  const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

  // Using the HSP value, determine whether the color is light or dark
  return hsp <= 127.5;
};
