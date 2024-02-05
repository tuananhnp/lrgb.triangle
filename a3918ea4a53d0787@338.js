import define1 from "./8d271c22db968ab0@160.js";

function _1(html){return(
html`<h1>Linear Interpolation along a Triangle</h1>`
)}

function _triangle_simple(DOM,bg,culori,rgb)
{
  const ctx = DOM.context2d(500, 500, 1)
  const x1 = 50;
  const y1 = 427;
  const x2 = 450;
  const y2 = y1;
  const x3 = 250;
  const y3 = 70;
  const imgData = ctx.getImageData(0, 0, 500, 500);
  const {data} = imgData;

  // change background data
  // AFAIK color inputs are guaranteed to return a hex string,
  // so I can use this quick hack to extract the values
  // (I think it's always lower-case, but have a safety
  // check for that regardless)
  const toNr = idx => {
    const cc = bg.charCodeAt(idx);
    return cc - ((cc < 58) ? 48 : (cc < 71 ? 55 : 87));
  };
  const rb = toNr(1) * 16 + toNr(2),
    gb = toNr(3) * 16 + toNr(4),
    bb = toNr(5) * 16 + toNr(6);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = rb;
    data[i+1] = gb;
    data[i+2] = bb;
    data[i+3] = 255;
  }

  const dy = y1 - y3;
  // Let's interpolate over LRGB, shall we?
  // And yes, I'm so lazy that I use culori's hex string
  // conversion and then convert that back to a number.
  const formatter = culori.formatter('hex');
  const c1 = culori.lrgb(rgb.c1);
  const c2 = culori.lrgb(rgb.c2);
  const c3 = culori.lrgb(rgb.c3);
  
  for (let y = y3; y <= y1; y++) {
    const a = (y - y3) / dy;
    const x3a = x3 * (1 - a)
    for (let x = (x3a + x1 * a) | 0, xEnd = (x3a + x2 * a) | 0; x <= xEnd; x++) {
      const w1 = ((y2 - y3)*(x-x3)+(x3 - x2)*(y - y3))/((y2-y3)*(x1-x3)+(x3-x2)*(y1-y3));
      const w2 = ((y3 - y1)*(x-x3)+(x1 - x3)*(y - y3))/((y2-y3)*(x1-x3)+(x3-x2)*(y1-y3));
      const w3 = 1 - (w1 + w2);
      
      const r = c1.r * w1 + c2.r * w2 + c3.r * w3;
      const g = c1.g * w1 + c2.g * w2 + c3.g * w3;
      const b = c1.b * w1 + c2.b * w2 + c3.b * w3;      
      const hex = formatter({r, g, b, mode: "lrgb"});

      const idx = (x + y*500)*4;
      imgData.data[idx] = +("0x" + hex.substring(1,3));
      imgData.data[idx + 1] = +("0x" + hex.substring(3, 5));
      imgData.data[idx + 2] = +("0x" + hex.substring(5, 7));
      // plain (bad) srgb interpolation
      // imgData.data[idx] = w1 * 255 | 0;
      // imgData.data[idx + 1] = w2 * 255 | 0;
      // imgData.data[idx + 2] = w3 * 255 | 0;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  return ctx.canvas
}


function _rgb(form,html){return(
form(html`<form>
<input name="c1" type='color' value='#ff0000'/>
<input name="c3" type='color' value='#ffff00'/>
<input name="c2" type='color' value='#0000ff'/>
</form>`)
)}

function _bg(Inputs){return(
Inputs.color({label: "Background color", value: "#808080"})
)}

function _culori(require){return(
require("culori@0.20.1")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("triangle_simple")).define("triangle_simple", ["DOM","bg","culori","rgb"], _triangle_simple);
  main.variable(observer("viewof rgb")).define("viewof rgb", ["form","html"], _rgb);
  main.variable(observer("rgb")).define("rgb", ["Generators", "viewof rgb"], (G, _) => G.input(_));
  main.variable(observer("viewof bg")).define("viewof bg", ["Inputs"], _bg);
  main.variable(observer("bg")).define("bg", ["Generators", "viewof bg"], (G, _) => G.input(_));
  main.variable(observer("culori")).define("culori", ["require"], _culori);
  const child1 = runtime.module(define1);
  main.import("form", child1);
  return main;
}
