//props to @ruicarest
import { hsv2rgb } from "./unitConvertUtils";

export const drawCircleOnCanvas = circleCanvas => {
  let ctx = circleCanvas.getContext("2d");

  function drawCircle() {
    let radius = 50;
    let image = ctx.createImageData(2 * radius, 2 * radius);
    let data = image.data;
    let rowLength = 2 * radius;
    let pixelWidth = 4; // each pixel requires 4 slots in the data array

    for (let x = -radius; x < radius; x++) {
      for (let y = -radius; y < radius; y++) {
        let [r, phi] = xy2polar(x, y);

        if (r > radius) {
          // skip all (x,y) coordinates that are outside of the circle
          continue;
        }

        let deg = rad2deg(phi);

        // Figure out the starting index of this pixel in the image data array.
        let adjustedX = x + radius; // convert x from [-50, 50] to [0, 100] (the coordinates of the image data array)
        let adjustedY = y + radius; // convert y from [-50, 50] to [0, 100] (the coordinates of the image data array)

        let index = (adjustedX + adjustedY * rowLength) * pixelWidth;

        let hue = deg;
        let saturation = r / radius;
        let value = 1.0;

        let [red, green, blue] = hsv2rgb(hue, saturation, value);

        let alpha = 255;

        data[index] = red;
        data[index + 1] = green;
        data[index + 2] = blue;
        data[index + 3] = alpha;
      }
    }
    ctx.putImageData(image, 0, 0);
  }

  function xy2polar(x, y) {
    let r = Math.sqrt(x * x + y * y);
    let phi = Math.atan2(y, x);
    return [r, phi];
  }

  // rad in [-π, π] range
  // return degree in [0, 360] range
  function rad2deg(rad) {
    return ((rad + Math.PI) / (2 * Math.PI)) * 360;
  }

  drawCircle();

  return circleCanvas;
};
