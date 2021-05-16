// [0,255] to [00, FF]
export const componentToHex = c => {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
};

//rgb color to hexa color (e.g. #002F02)
export const rgbToHex = color => {
  return (
    "#" +
    componentToHex(color.r) +
    componentToHex(color.g) +
    componentToHex(color.b)
  );
};

//rgb color to 2D position
export const rgb2xy = (r, g, b) => {
  let radius = 50;

  let hsv = rgb2hsv(r, g, b);

  let theta = deg2rad(hsv.h);

  let distance2center = hsv.s * radius;

  // console.log(
  //   "hsv: ",
  //   hsv,
  //   "theta: " + theta,
  //   "distance2center: " + distance2center
  // );

  let position = polar2xy(distance2center, theta);

  return { x: Math.floor(position.x), y: Math.floor(position.y) };
};

//degrees to radians
export function deg2rad(degrees) {
  var pi = Math.PI;
  return degrees * (pi / 180);
}

//distance to center, theta in radians
//return {x:, y:}
export function polar2xy(distance, theta) {
  // Convert polar to cartesian
  let posX = distance * Math.cos(theta);
  let posY = distance * Math.sin(theta);
  return { x: posX, y: posY };
}

// hue in range [0, 360]
// saturation, value in range [0,1]
// return [r,g,b] each in range [0,255]
export function hsv2rgb(hue, saturation, value) {
  let chroma = value * saturation;
  let hue1 = hue / 60;
  let x = chroma * (1 - Math.abs((hue1 % 2) - 1));
  let r1, g1, b1;
  if (hue1 >= 0 && hue1 <= 1) {
    [r1, g1, b1] = [chroma, x, 0];
  } else if (hue1 >= 1 && hue1 <= 2) {
    [r1, g1, b1] = [x, chroma, 0];
  } else if (hue1 >= 2 && hue1 <= 3) {
    [r1, g1, b1] = [0, chroma, x];
  } else if (hue1 >= 3 && hue1 <= 4) {
    [r1, g1, b1] = [0, x, chroma];
  } else if (hue1 >= 4 && hue1 <= 5) {
    [r1, g1, b1] = [x, 0, chroma];
  } else if (hue1 >= 5 && hue1 <= 6) {
    [r1, g1, b1] = [chroma, 0, x];
  }

  let m = value - chroma;
  let [r, g, b] = [r1 + m, g1 + m, b1 + m];
  return [255 * r, 255 * g, 255 * b];
}

// r,g,b in range [0, 255]
// return {h: deg ,s: [0, 1],v: [0, 1]}
export function rgb2hsv(r, g, b) {
  let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
  rabs = r / 255;
  gabs = g / 255;
  babs = b / 255;
  v = Math.max(rabs, gabs, babs);
  diff = v - Math.min(rabs, gabs, babs);
  diffc = c => (v - c) / 6 / diff + 1 / 2;
  percentRoundFn = num => Math.round(num * 100) / 100;
  if (diff == 0) {
    h = s = 0;
  } else {
    s = diff / v;
    rr = diffc(rabs);
    gg = diffc(gabs);
    bb = diffc(babs);

    if (rabs === v) {
      h = bb - gg;
    } else if (gabs === v) {
      h = 1 / 3 + rr - bb;
    } else if (babs === v) {
      h = 2 / 3 + gg - rr;
    }
    if (h < 0) {
      h += 1;
    } else if (h > 1) {
      h -= 1;
    }
  }
  return {
    h: Math.round(h * 360),
    s: percentRoundFn(s),
    v: percentRoundFn(v)
  };
}
