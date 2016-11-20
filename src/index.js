import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
//app.get('/', (req, res) => {
//  res.json({
//    hello: 'JS World',
//  });
//});

app.get('/', (req, res) => {
  try {

    console.log('req.query.color=', req.query.color);
    //let regInv = new RegExp('[#_\/\s]', g);
    let regHex = new RegExp('[^0-9a-fA-F]');
    let regRgb = new RegExp('[rgb()]');

    let strColor = req.query.color.replace(/[\s]/g, '').toLowerCase();
    let arrColor = [];
    let resColor = '#';

    //console.log('rgb()=', strColor + ';');
    console.log('strColor=', strColor);
    if (strColor.indexOf('hsl(') == 0){
      strColor = strColor.slice(4, strColor.length - 1);
      //strColor = strColor.replace(/\%/g, '');
      console.log('hsl strColor=', strColor);
      //arrColor == strColor.split(/,/);
      resColor = hslToHex(strColor);
    } else {
      if (strColor.indexOf('rgb(') == 0){
        //let arrColor = strColor.replace(/[rgb()]/, '').split(/,/);
        strColor = strColor.slice(4);
        strColor = strColor.replace(/\)/, '');
        console.log('rgb strColor=', strColor);
        arrColor = strColor.split(/,/);
        if (arrColor.length != 3) {
          resColor = 'Invalid color';
        } else {
          for (let i in arrColor){
            console.log('arrColor[i]=', i, ' ', arrColor[i]);
            if (+arrColor[i] >= 0 && +arrColor[i] < 256) {
              resColor = resColor + ('00' + Number(arrColor[i]).toString(16)).slice(-2);
            } else {
              resColor = 'Invalid color';
            }
          };
        };
      } else {
        strColor = strColor.replace(/#/, '');
        if (strColor === '' || ((strColor.length != 3) && (strColor.length != 6)) || regHex.test(strColor)) {
          resColor = 'Invalid color';
        } else {
          if (strColor.length == 6) {
            resColor = resColor + strColor; //.toLowerCase();
          } else {
            resColor = resColor + strColor.charAt(0) + strColor.charAt(0)
                           + strColor.charAt(1) + strColor.charAt(1)
                           + strColor.charAt(2) + strColor.charAt(2);
            //resColor = resColor.toLowerCase();
          }
        }
      }
    }

    console.log('resColor=', resColor);
    res.send(resColor);
  } catch (err) {
    console.log('Invalid color ' + err);
    res.send('Invalid color');
  }

});


app.listen(3000, () => {
  console.log('Your app listening on port 3000!');
});

//function rgb(r, g, b){
//  if (r >=0 && r < 256 && g >=0 && g < 256 && b >=0 && b < 256) {
//    return '#' + Number(r).toString(16) + Number(g).toString(16) + Number(b).toString(16);
//  } else {
//    return 'Invalid color';
//  };
//};

function hslToHex(pstrColor) {
  let r, g, b;
  let h, s, l;
  let arrColor = pstrColor.split(/,/);
  for (let i in arrColor){
    console.log('arrColor[i]=', i, ' ', arrColor[i]);
    if (arrColor[i].indexOf('%') == 0 ){
      arrColor[i] = arrColor[i].slice(3);
    };
    //arrColor[i] = arrColor[i].replace(/%/);
  };
  console.log('arrColor=', arrColor);
  if (arrColor[1].indexOf('%') == -1 || arrColor[2].indexOf('%') == -1 ) {
    return 'Invalid color';
  };
  h = arrColor[0]/360;
  s = arrColor[1].slice(0, arrColor[1].length - 1)/100;
  l = arrColor[2].slice(0, arrColor[2].length - 1)/100;
  console.log(' 11 h,s,l:', h, ',', s, ',', l);

  if ( h >=0 && h <= 1 && l >=0 && l <= 1 && s >=0 && s <= 1 ) {
//    h = arrColor[0]/360;
//    s = arrColor[1].slice(-1) == '%' ? arrColor[1]/100 : arrColor[1];
//    l = arrColor[2].slice(-1) == '%' ? arrColor[2]/100 : arrColor[2];
    console.log('h,s,l', h, ',', s, ',', l);
    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    console.log('r,g,b', r, ',', g, ',', b);

    //return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    return '#' + ('00' + Math.round(r * 255).toString(16)).slice(-2) +
           ('00' + Math.round(g * 255).toString(16)).slice(-2) +
           ('00' + Math.round(b * 255).toString(16)).slice(-2);
  } else {
    return 'Invalid color';
  }
};
