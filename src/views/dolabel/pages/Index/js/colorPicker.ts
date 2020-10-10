

const util = {
  css: function(elem: HTMLElement, obj: any) {
    for (const i in obj) {
      const sty = elem.style as any;
      sty[i] = obj[i];
    }
  },
  hasClass: function(elem: HTMLElement, classN: string) {
    const className = elem.getAttribute('class') + '';
    return className.indexOf(classN) !== -1;
  }
};

class RGBA {
  r= 0;
  g= 0;
  b= 0;
  a= 1;
}

class HSB {
  h= 0;
  s= 100;
  b= 100;
}

export class Colorpicker {
  declare bindElem: HTMLElement; // 绑定的元素
  declare elem_wrap: HTMLElement; // 最外层容器
  declare fixedBg: HTMLDivElement; // 拾色器后面固定定位的透明div 用于点击隐藏拾色器
  declare elem_colorPancel: HTMLDivElement; // 色彩面板
  declare elem_picker: HTMLDivElement ; // 拾色器色块按钮
  declare elem_barPicker1: HTMLDivElement ; // 颜色条
  declare elem_barPicker2: HTMLDivElement;// 透明条
  declare elem_showColor: HTMLDivElement; // 显示当前颜色
  declare elem_hexInput: HTMLInputElement;// 显示hex的表单
  declare elem_showModeBtn: HTMLDivElement;// 切换输入框模式按钮
  declare elem_inputWrap: HTMLDivElement;// 输入框外层容器
  declare elem_opacityPancel: HTMLDivElement; // 透明度背景元素

  declare pancel_width: number;
  declare pancel_height: number;

  pancelLeft = 0;
  pancelTop = 0;

  downX = 0;
  downY = 0;
  moveX = 0;
  moveY = 0;

  pointLeft = 0;
  pointTop = 0;

  current_mode = 'hex'; // input框当前的模式

  rgba: RGBA = {
    r: 0,
    g: 0,
    b: 0,
    a: 1,
  };

  hsb: HSB = {
    h: 0,
    s: 100,
    b: 100
  };

  constructor(elem: HTMLElement) {
    this.bindElem = elem;
    this.init();
  }
/*
    var default = {
        elem:obj,
        cards:['#000','#fff'],
        afterCreat : fn
    }
*/
Opt: { [key: string]: any } = {
  'bindClass': '',
  'initColor': 'rgb(255,0,0)',
  'allMode': ['hex', 'rgb']
};



render() {
  let tpl = '<div style="position: fixed; top: 0px; right: 0px; bottom: 0px; left: 0px;"></div>' +
              '<div style="position: inherit; z-index: 100;">' +
                '<div class="colorPicker-pancel" style="background: rgb(255, 255, 255); border-radius: 2px; box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 2px, rgba(0, 0, 0, 0.3) 0px 4px 8px; box-sizing: initial; width: 225px; font-family: Menlo;"><div style="width: 100%; padding-bottom: 55%; position: relative; border-radius: 2px 2px 0px 0px; overflow: hidden;">' +
                  '<div class="color-pancel" style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px; background: rgb(' + this.rgba.r + ',' + this.rgba.g + ',' + this.rgba.b + ')">' +
                    '<style>' +
                    '.saturation-white {background: -webkit-linear-gradient(to right, #fff, rgba(255,255,255,0));background: linear-gradient(to right, #fff, rgba(255,255,255,0));}' +
                    '.saturation-black {background: -webkit-linear-gradient(to top, #000, rgba(0,0,0,0));background: linear-gradient(to top, #000, rgba(0,0,0,0));}' +
                  '</style>' +
                  '<div class="saturation-white" style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px;">' +
                    '<div class="saturation-black" style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px;"></div>' +
                    '<div class="pickerBtn" style="position: absolute; top: 0%; left: 100%; cursor: default;">' +
                      '<div style="width: 12px; height: 12px; border-radius: 6px; box-shadow: rgb(255, 255, 255) 0px 0px 0px 1px inset; transform: translate(-6px, -6px);"></div>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</div>' +
              '<div style="padding: 16px 16px 12px;">' +
                '<div class="flexbox-fix" style="display: flex;">' +
                  '<div style="width: 32px;">' +
                    '<div style="margin-top: 6px; width: 16px; height: 16px; border-radius: 8px; position: relative; overflow: hidden;">' +
                      '<div class="colorPicker-showColor" style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px; border-radius: 8px; box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 0px 1px inset; background:rgb(' + this.rgba.r + ',' + this.rgba.g + ',' + this.rgba.b + '); z-index: 2;"></div>' +
                      '<div class="" style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px; background: url(&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==&quot;) left center;"></div></div></div><div style="-webkit-box-flex: 1; flex: 1 1 0%;"><div style="height: 10px; position: relative; margin-bottom: 8px;"><div style="position: absolute; top: 0px;' + 'right: 0px; bottom: 0px; left: 0px;"><div class="hue-horizontal" style="padding: 0px 2px; position: relative; height: 100%;">' +
                      '<style>' +
                      '.hue-horizontal {background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);background: -webkit-linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);}' +
                      '.hue-vertical {background: linear-gradient(to top, #f00 0%, #ff0 17%, #0f0 33%,#0ff 50%, #00f 67%, #f0f 83%, #f00 100%);background: -webkit-linear-gradient(to top, #f00 0%, #ff0 17%,#0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);}' +
                    '</style>' +
                    '<div  class="colorBar-color-picker" style="position: absolute; left: 0%;">' +
                      '<div style="width: 12px; height: 12px; border-radius: 6px; transform: translate(-6px, -1px); background-color: rgb(248, 248, 248); box-shadow: rgba(0, 0, 0, 0.37) 0px 1px 4px 0px;">' +
                      '</div>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</div>' +
              '<div style="height: 10px; position: relative;">' +
                '<div style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px;">' +
                  '<div style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px; overflow: hidden;">' +
                    '<div style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px; background: url(&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==&quot;) left center;"></div>' +
                  '</div>' +
                  '<div style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px; background: linear-gradient(to right, rgba(' + this.rgba.r + ',' + this.rgba.g + ',' + this.rgba.b + ',0) 0%, rgb(' + this.rgba.r + ',' + this.rgba.g + ',' + this.rgba.b + ') 100%);"></div>' +
                  '<div style="position: relative; height: 100%; margin: 0px 3px;">' +
                        '<div class="colorBar-opacity-picker" style="position: absolute; left: 100%;">' +
                          '<div style="width: 12px; height: 12px; border-radius: 6px; transform: translate(-6px, -1px); background-color: rgb(248, 248, 248); box-shadow: rgba(0, 0, 0, 0.37) 0px 1px 4px 0px;"></div>' +
                        '</div>' +
                      '</div>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</div>' +
              '<div class="flexbox-fix" style="padding-top: 16px; display: flex;">' +
                '<div class="flexbox-fix colorPicker-inputWrap" style="-webkit-box-flex: 1; flex: 1 1 0%; display: flex; margin-left: -6px;">';

  tpl += this.getInputTpl();
  tpl += '</div>' +
                '<div class="colorPicker-showModeBtn" style="width: 32px; text-align: right; position: relative;">' +
                      '<div style="margin-right: -4px;  cursor: pointer; position: relative;">' +
                        '<svg viewBox="0 0 24 24" style="width: 24px; height: 24px; border: 1px solid transparent; border-radius: 5px;"><path fill="#333" d="M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z"></path><path fill="#333" d="M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15Z"></path></svg>' +
                      '</div>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</div>' +
          '</div>';

  return tpl;
}
getInputTpl() {
  let current_mode_html = '';
  switch (this.current_mode) {
    case 'hex':
    {
      const hex = '#' + this.rgbToHex(this.HSBToRGB(this.hsb));
      current_mode_html += '<div style="padding-left: 6px; width: 100%;">' +
                  '<div style="position: relative;">' +
                    '<input class="colorPicker-hexInput" value="' + hex + '" spellcheck="false" style="font-size: 11px; color: rgb(51, 51, 51); width: 100%; border-radius: 2px; border: none; box-shadow: rgb(218, 218, 218) 0px 0px 0px 1px inset; height: 21px; text-align: center;">' +
                    '<span style="text-transform: uppercase; font-size: 11px; line-height: 11px; color: rgb(150, 150, 150); text-align: center; display: block; margin-top: 12px;">hex</span>' +
                  '</div>' +
                '</div>';
      break;
    }
    case 'rgb': {
      for (let i = 0; i < 3; i++) {
        const rgb = 'rgb'[i];
        const v = (this.rgba as any)[rgb];
        current_mode_html += '<div style="padding-left: 6px; width: 100%;">' +
                    '<div style="position: relative;">' +
                      '<input class="colorPicker-hexInput" value="' + v + '" spellcheck="false" style="font-size: 11px; color: rgb(51, 51, 51); width: 100%; border-radius: 2px; border: none; box-shadow: rgb(218, 218, 218) 0px 0px 0px 1px inset; height: 21px; text-align: center;">' +
                      '<span style="text-transform: uppercase; font-size: 11px; line-height: 11px; color: rgb(150, 150, 150); text-align: center; display: block; margin-top: 12px;">' + ('rgb'[i]) + '</span>' +
                    '</div>' +
                  '</div>';
      }
      break;
    }
    default:
    {
      break;
    }

  }
  return current_mode_html;
}
init() {
  let _this: any = null;
  _this = this;
  const initColor = this.Opt.initColor;
  const rgb = initColor.slice(4, -1).split(',');

  this.rgba.r = parseInt(rgb[0]);
  this.rgba.g = parseInt(rgb[1]);
  this.rgba.b = parseInt(rgb[2]);

  const body = document.getElementsByTagName('body')[0];
  const div = document.createElement('div') as HTMLDivElement;
  div.className = 'colorDiv';

  div.innerHTML = this.render();
  body.appendChild(div);

  this.elem_wrap = div;
  this.fixedBg = div.children[0] as HTMLDivElement;
  this.elem_colorPancel = div.getElementsByClassName('color-pancel')[0] as HTMLDivElement;
  this.pancel_width = this.elem_colorPancel.offsetWidth;
  this.pancel_height = this.elem_colorPancel.offsetHeight;
  this.elem_picker = div.getElementsByClassName('pickerBtn')[0] as HTMLDivElement;
  this.elem_showColor = div.getElementsByClassName('colorPicker-showColor')[0] as HTMLDivElement;
  this.elem_barPicker1 = div.getElementsByClassName('colorBar-color-picker')[0] as HTMLDivElement;
  this.elem_barPicker2 = div.getElementsByClassName('colorBar-opacity-picker')[0] as HTMLDivElement;
  this.elem_hexInput = div.getElementsByClassName('colorPicker-hexInput')[0] as HTMLInputElement;
  this.elem_showModeBtn = div.getElementsByClassName('colorPicker-showModeBtn')[0] as HTMLDivElement;
  this.elem_inputWrap = div.getElementsByClassName('colorPicker-inputWrap')[0] as HTMLDivElement;
  // if (this.elem_barPicker2){
  this.elem_opacityPancel = (this.elem_barPicker2 as any).parentNode.parentNode.children[1] as HTMLDivElement;
  // }
  // var rect = this.bindElem.getBoundingClientRect();
  let elem: any = this.bindElem;
  let top = elem.offsetTop;
  let left = elem.offsetLeft;
  while (elem.offsetParent) {
    top += (elem.offsetParent as any).offsetTop;
    left += (elem.offsetParent as any).offsetLeft;
    elem = elem.offsetParent;
  }

  this.pancelLeft = left;
  this.pancelTop = top + this.bindElem.offsetHeight;
  util.css(div, {
    'position': 'absolute',
    'z-index': 9999999,
    'display': 'none',
    'left': left + 'px',
    'top': this.pancelTop + 10 + 'px'
  });

  this.bindMove(this.elem_colorPancel, this.setPosition, true);
  this.bindMove(this.elem_barPicker1.parentNode as any, this.setBar, false);
  this.bindMove(this.elem_barPicker2.parentNode as any, this.setBar, false);

  this.bindElem.addEventListener('click', function() {
    _this.show();
  }, false);

  /* eslint-disable */ 
    this.fixedBg.addEventListener('click', function(e) {
      _this.hide();
    }, false);
   /* eslint-enable */
  this.elem_showModeBtn.addEventListener('click', function() {
    _this.switch_current_mode();
  }, false);

  this.elem_wrap.addEventListener('input', function(e: any) {
    const target = e.target as HTMLInputElement;
    const value = target.value;

    _this.setColorByInput(value);
  }, false);
}
setPosition(x: number, y: number) {
  const LEFT = parseInt(x - this.pancelLeft + '');
  const TOP = parseInt(y - this.pancelTop + '');

  this.pointLeft = Math.max(0, Math.min(LEFT, this.pancel_width));
  this.pointTop = Math.max(0, Math.min(TOP, this.pancel_height));

  util.css(this.elem_picker, {
    left: this.pointLeft + 'px',
    top: this.pointTop + 'px'
  });
  this.hsb.s = parseInt((100 * this.pointLeft / this.pancel_width) + '');
  this.hsb.b = parseInt((100 * (this.pancel_height - this.pointTop) / this.pancel_height) + '');

  this.setShowColor();
  this.setValue(this.rgba);

}
setBar(elem: HTMLElement, x: number) {
  const elem_bar = elem.getElementsByTagName('div')[0];
  const rect = elem.getBoundingClientRect();
  const elem_width = elem.offsetWidth;
  const X = Math.max(0, Math.min(x - rect.x, elem_width));

  if (elem_bar === this.elem_barPicker1) {
    util.css(elem_bar, {
      left: X + 'px'
    });
    this.hsb.h = parseInt((360 * X / elem_width) + '');
  } else {
    util.css(elem_bar, {
      left: X + 'px'
    });
    this.rgba.a = X / elem_width;
  }

  this.setPancelColor(this.hsb.h);
  this.setShowColor();
  this.setValue(this.rgba);

}
setPancelColor(h: number) {
  const rgb = this.HSBToRGB({ h: h, s: 100, b: 100 });

  util.css(this.elem_colorPancel, {
    background: 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + this.rgba.a + ')'
  });
}
setShowColor() {
  const rgb = this.HSBToRGB(this.hsb);

  this.rgba.r = rgb.r;
  this.rgba.g = rgb.g;
  this.rgba.b = rgb.b;

  util.css(this.elem_showColor, {
    background: 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + this.rgba.a + ')'
  });

  util.css(this.elem_opacityPancel, {
    background: 'linear-gradient(to right, rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0) 0%, rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',1))'
  });
}
setValue(rgb: RGBA) {
  const hex = '#' + this.rgbToHex(rgb);
  this.elem_inputWrap.innerHTML = this.getInputTpl();
  // this.bindElem.setAttribute("colorpickerOfColor",'#'+hex);
  // util.css(this.bindElem,{
  //     background:"#"+hex
  // })
  this.Opt.change(this.bindElem, hex, rgb);

}
setColorByInput(value: any) {
  // const _this = this;
  switch (this.current_mode) {
    case 'hex': {
      value = value.slice(1);
      if (value.length === 3) {
        value = '#' + value[0] + value[0] + value[1] + value[1] + value[2] + value[2];
        this.hsb = this.hexToHsb(value);
      } else if (value.length === 6) {
        this.hsb = this.hexToHsb(value);
      }
      break;
    }
    case 'rgb': {
      const inputs = this.elem_wrap.getElementsByTagName('input');
      const rgb = {
        r: inputs[0].value ? parseInt(inputs[0].value) : 0,
        g: inputs[1].value ? parseInt(inputs[1].value) : 0,
        b: inputs[2].value ? parseInt(inputs[2].value) : 0
      };
      this.hsb = this.rgbToHsb(rgb);
    }
  }

  this.changeViewByHsb();
}
changeViewByHsb() {
  this.pointLeft = parseInt((this.hsb.s * this.pancel_width / 100) + '');
  this.pointTop = parseInt(((100 - this.hsb.b) * this.pancel_height / 100) + '');
  util.css(this.elem_picker, {
    left: this.pointLeft + 'px',
    top: this.pointTop + 'px'
  });

  this.setPancelColor(this.hsb.h);
  this.setShowColor();
  util.css(this.elem_barPicker1, {
    left: this.hsb.h / 360 * ((this.elem_barPicker1 as any).parentNode.offsetWidth) + 'px'
  });

  const hex = '#' + this.rgbToHex(this.HSBToRGB(this.hsb));
  this.Opt.change(this.bindElem, hex);
  // this.bindElem.setAttribute("colorpickerOfColor",hex);
  // util.css(this.bindElem,{
  //     background:hex
  // })
}
switch_current_mode() {
  this.current_mode = this.current_mode === 'hex' ? 'rgb' : 'hex';
  this.elem_inputWrap.innerHTML = this.getInputTpl();
}
bindMove(elem: HTMLElement, fn: Function, bool: boolean) {
  let _this: any = null; // eslint bug path
  _this = this;

  elem.addEventListener('mousedown', function(e: MouseEvent) {
    _this.downX = e.pageX;
    _this.downY = e.pageY;
    bool ? fn.call(_this, _this.downX, _this.downY) : fn.call(_this, elem, _this.downX, _this.downY);

    function mousemove(e: MouseEvent) {
      _this.moveX = e.pageX;
      _this.moveY = e.pageY;
      bool ? fn.call(_this, _this.moveX, _this.moveY) : fn.call(_this, elem, _this.moveX, _this.moveY);
      e.preventDefault();
    }
    /* eslint-disable */ 
      function mouseup(e:MouseEvent) {
        document.removeEventListener('mousemove', mousemove, false);
        document.removeEventListener('mouseup', mouseup, false);
      }
      /* eslint-enable */
    document.addEventListener('mousemove', mousemove, false);
    document.addEventListener('mouseup', mouseup, false);
  }, false);
}
show() {
  util.css(this.elem_wrap, {
    'display': 'block'
  });
}
hide() {
  util.css(this.elem_wrap, {
    'display': 'none'
  });
}
HSBToRGB(hsb: any) {
  const rgb = new RGBA();
  let h = Math.round(hsb.h);
  const s = Math.round(hsb.s * 255 / 100);
  const v = Math.round(hsb.b * 255 / 100);

  if (s === 0) {
    rgb.r = rgb.g = rgb.b = v;
  } else {
    const t1 = v;
    const t2 = (255 - s) * v / 255;
    const t3 = (t1 - t2) * (h % 60) / 60;

    if (h === 360) h = 0;

    if (h < 60) { rgb.r = t1; rgb.b = t2; rgb.g = t2 + t3; } else if (h < 120) { rgb.g = t1; rgb.b = t2; rgb.r = t1 - t3; } else if (h < 180) { rgb.g = t1; rgb.r = t2; rgb.b = t2 + t3; } else if (h < 240) { rgb.b = t1; rgb.r = t2; rgb.g = t1 - t3; } else if (h < 300) { rgb.b = t1; rgb.g = t2; rgb.r = t2 + t3; } else if (h < 360) { rgb.r = t1; rgb.g = t2; rgb.b = t1 - t3; } else { rgb.r = 0; rgb.g = 0; rgb.b = 0; }
  }

  return { r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b) };
}
rgbToHex(rgb: any) {
  const hex = [
    rgb.r.toString(16),
    rgb.g.toString(16),
    rgb.b.toString(16)
  ];
  hex.map(function(str, i) {
    if (str.length === 1) {
      hex[i] = '0' + str;
    }
  });

  return hex.join('');
}
hexToRgb(hex: any) {
  const hex1 = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);
  return { r: hex1 >> 16, g: (hex1 & 0x00FF00) >> 8, b: (hex1 & 0x0000FF) };
}
hexToHsb(hex: any) {
  return this.rgbToHsb(this.hexToRgb(hex));
}
rgbToHsb(rgb: any) {
  const hsb = { h: 0, s: 0, b: 0 };
  const min = Math.min(rgb.r, rgb.g, rgb.b);
  const max = Math.max(rgb.r, rgb.g, rgb.b);
  const delta = max - min;
  hsb.b = max;
  hsb.s = max !== 0 ? 255 * delta / max : 0;
  if (hsb.s !== 0) {
    if (rgb.r === max) hsb.h = (rgb.g - rgb.b) / delta;
    else if (rgb.g === max) hsb.h = 2 + (rgb.b - rgb.r) / delta;
    else hsb.h = 4 + (rgb.r - rgb.g) / delta;
  } else hsb.h = -1;
  hsb.h *= 60;
  if (hsb.h < 0) hsb.h += 360;
  hsb.s *= 100 / 255;
  hsb.b *= 100 / 255;
  return hsb;
}

  // window.Colorpicker = Colorpicker;

}


export default function ColorpickerCreate(option: any): void {
  const Opt: any = {
    bindClass: '',
    initColor: 'rgb(255,0,0)',
    allMode: ['hex', 'rgb']
  };

  for (const prop in option) {
    Opt[prop] = option[prop];
  }

  const elemArr = document.getElementsByClassName(Opt.bindClass) as HTMLCollectionOf<HTMLElement>;
  for (let i = 0; i < elemArr.length; i++) {
    (elemArr[i] as any).colorpicker = new Colorpicker(elemArr[i]);
    // elemArr[i].colorpicker = new Colorpicker(elemArr[i]);
  }
}
