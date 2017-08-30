/*
 * Title: Jmooth
 * Description: A native javascript smooth scroll experience experiment
 * Author: Juskteez
 * Contact: juskteez@gmail.com
 * Version: 1.0.1
 */

var content    = document.getElementById('content'),
  scrlBar      = document.createElement('DIV'),
  scrlPrg      = document.createElement('DIV'),
  blockIMGs    = document.getElementsByClassName('block-image'),
  $body        = document.body,
  cStyle       = content.style,
  sStyle       = scrlBar.style,
  pStyle       = scrlPrg.style,
  scrollYaxis  = 0, // default scroll position
  scrollXaxis  = 0, // default horizontal scroll position
  scrollPos    = 0, // default scroll value
  scrBarPos    = 0, // default scrollbar pos
  scrProgess   = 0, // default scrollbar progress
  prlxPos      = 0, // default parallax position
  loaded       = false,
  theAxis      = false,
  progress     = true,
  //demo        = document.getElementById('demo'), // log element
  //otY         = document.getElementById('otY'), // log element
  //mxY         = document.getElementById('mxY'), // log element
  //mnY         = document.getElementById('mnY'), // log element
  //ocY         = document.getElementById('ocY'); // log element
  trF, scF, bodyH, wdH, vsbH, bodyW, wdW, vsbW, scrPrcs, clearScroll,i;

if (content.classList.contains('horizontal')) theAxis = true;

scrlBar.setAttribute('id', 'jmooth_scrollbar');
$body.appendChild(scrlBar);

if (progress) {
  scrlPrg.setAttribute('id', 'jmooth_scrollprogress');
  $body.appendChild(scrlPrg);
}

var firefox = navigator.userAgent.indexOf('Firefox') > -1;

// SETTINGS
var scrollSpeed = 2, // scroll speed by divide. lower, faster
  FFscrlSpeed = 0.15 / scrollSpeed, // scroll speed multiply for Firefox
  scrollStep = 200, // pixel scrolled by arrow keys
  prlSpeed = 5, // parallax speed
  prlSpaceY = prlSpeed / 2.85, // parallax space ratio
  ease = 0.075; // easing time

if (firefox) scrollSpeed = FFscrlSpeed;

var addEvent = function(object, type, callback) {
  if (object == null || typeof(object) == 'undefined') return;
  if (object.addEventListener) {
    object.addEventListener(type, callback, false);
  } else if (object.attachEvent) {
    object.attachEvent('on' + type, callback);
  } else {
    object['on' + type] = callback;
  }
};

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

var scrollRecall = debounce(function() {
  //console.log('resized!');

  if (!theAxis) {
    bodyH = content.offsetHeight, //recall content Height
    wdH = window.innerHeight, //recall window Height
    vsbH = bodyH - wdH, // recalculate visible height
    scrPrcs = wdH - scrlBar.offsetHeight; // recalculate scroll length

    scrollYaxis = Math.max(vsbH * -1, scrollYaxis);

    trF = 'translate3d(0px,' + scrollPos + 'px,0)';
    scF = 'translate3d(0px,' + (scrBarPos * -1) + 'px,0)';
  } else {
    bodyW = content.offsetWidth, //recall content Height
    wdW = window.innerWidth, //recall window Height
    vsbW = bodyW - wdW, // recalculate visible height
    scrPrcs = wdW - scrlBar.offsetWidth; // recalculate scroll length

    scrollXaxis = Math.max(vsbW * -1, scrollXaxis);

    trF = 'translate3d(' + scrollPos + 'px,0,0)';
    scF = 'translate3d(' + (scrBarPos * -1) + 'px,0,0)';
  }

  cStyle['-webkit-transform'] = trF;
  cStyle['transform'] = trF;
  sStyle['-webkit-transform'] = scF;
  sStyle['transform'] = scF;

}, 0);

window.onload = function() {


  if (!theAxis) {
    bodyH = content.offsetHeight, // body Height
    wdH = window.innerHeight, // window Height
    vsbH = bodyH - wdH, // visible height (bodyH - windowH)
    scrPrcs = wdH - scrlBar.offsetHeight; // total scroll length (windowH - scrollbarH)
  } else {
    bodyW = content.offsetWidth, // body Height
    wdW = window.innerWidth, // window Height
    vsbW = bodyW - wdW, // visible height (bodyH - windowH)
    scrPrcs = wdW - scrlBar.offsetWidth; // total scroll length (windowH - scrollbarH)
  }

  loaded = true;

  $body.classList.add('page_loaded');

  prlBlockImg();
  jmoothScroller();

  addEvent(window, 'resize', scrollRecall, 250);

};

/* CUSTOM FOR PARALLAX DEMO IMAGE */
function prlBlockImg() {
  for (i = 0; i < blockIMGs.length; i++) {
    if (!theAxis) {
      blockIMGs[i].style.bottom = (prlSpaceY * i) + 'vh';
    } else {
      blockIMGs[i].style.right = (prlSpeed * 1.25 * i) + 'vw';
    }
  }
}
/* END CUSTOM FOR PARALLAX DEMO IMAGE */

document.addEventListener('wheel', function(event) {
  if (loaded) {
    if ($body.classList.contains('im_scrolling')) {
      clearTimeout(clearScroll);
      clearScroll = setTimeout(closeScroll, 250);
    } else {
      $body.classList.add('im_scrolling');
    }
    if (!theAxis) {
      scrollYaxis += (event.deltaY / scrollSpeed) * -1; //otY.innerHTML = 'Original deltaY: ' + scrollYaxis;
      scrollYaxis = Math.max(vsbH * -1, scrollYaxis); //mxY.innerHTML = 'Highest deltaY: ' + scrollYaxis;
      scrollYaxis = Math.min(0, scrollYaxis); //mnY.innerHTML = 'Lowest deltaY: ' + scrollYaxis;
    } else {
      scrollXaxis += ((event.deltaY+event.deltaX) / scrollSpeed) * -1; //otY.innerHTML = 'Original deltaY: ' + scrollYaxis;
      scrollXaxis = Math.max(vsbW * -1, scrollXaxis); //mxY.innerHTML = 'Highest deltaY: ' + scrollYaxis;
      scrollXaxis = Math.min(0, scrollXaxis); //mnY.innerHTML = 'Lowest deltaY: ' + scrollYaxis;
    }
  }
});

function closeScroll() {
  $body.classList.remove('im_scrolling');
}

function jmoothScroller() {
  requestAnimationFrame(jmoothScroller);

  var scrP = 0,
    prlxVal = 0; // CUSTOM FOR PARALLAX DEMO IMAGE

  if (!theAxis) {
    scrP = scrollYaxis / vsbH * 100;
    prlxVal = scrollYaxis / prlSpeed; // CUSTOM FOR PARALLAX DEMO IMAGE
  } else {
    scrP = scrollXaxis / vsbW * 100;
    prlxVal = scrollXaxis / prlSpeed; // CUSTOM FOR PARALLAX DEMO IMAGE
  }

  var sclP = scrP * scrPrcs / 100;

  if (isNaN(sclP)) sclP = 0;

  if (!theAxis) {
    scrollPos += (scrollYaxis - scrollPos) * ease;
  } else {
    scrollPos += (scrollXaxis - scrollPos) * ease;
  }
  scrBarPos += (sclP - scrBarPos) * ease;
  if (progress) scrProgess += (scrP - scrProgess) * ease;

  prlxPos += (prlxVal - prlxPos) * ease; // CUSTOM FOR PARALLAX DEMO IMAGE

  if (!theAxis) {
    trF = 'translate3d(0px,' + scrollPos + 'px,0)';
    scF = 'translate3d(0px,' + (scrBarPos * -1) + 'px,0)';
  } else {
    trF = 'translate3d(' + scrollPos + 'px,0,0)';
    scF = 'translate3d(' + (scrBarPos * -1) + 'px,0,0)';
  }

  /* CUSTOM FOR PARALLAX DEMO IMAGE */
  for (i = 0; i < blockIMGs.length; i++) {
    if (!theAxis) {
      blockIMGs[i].style['transform'] = 'translate3d(0px,' + (prlxPos * -1) + 'px,0)';
    } else {
      blockIMGs[i].style['transform'] = 'translate3d(' + (prlxPos * 0.8 * -1) + 'px,0,0)';
    }
  }
  /* END CUSTOM FOR PARALLAX DEMO IMAGE */

  cStyle['-webkit-transform'] = trF;
  cStyle['transform'] = trF;
  sStyle['-webkit-transform'] = scF;
  sStyle['transform'] = scF;

  if (progress) pStyle.height = Math.abs(scrProgess) + '%';
}

document.addEventListener('keydown', function(event) {
  var key = event.which || event.keyCode || event.charCode;
  if (loaded && (key == 37 || key == 38 || key == 39 || key == 40)) {
    event.preventDefault();
    if ($body.classList.contains('im_scrolling')) {
      clearTimeout(clearScroll);
      clearScroll = setTimeout(closeScroll, 250);
    } else {
      $body.classList.add('im_scrolling');
    }
    if (!theAxis) {
      if (key == 38) scrollYaxis += scrollStep;
      if (key == 40) scrollYaxis -= scrollStep;
      scrollYaxis = Math.max(vsbH * -1, scrollYaxis); //mxY.innerHTML = 'Highest deltaY: ' + scrollYaxis;
      scrollYaxis = Math.min(0, scrollYaxis); //mnY.innerHTML = 'Lowest deltaY: ' + scrollYaxis;
    } else {
      if (key == 37) scrollXaxis += scrollStep;
      if (key == 39) scrollXaxis -= scrollStep;
      scrollXaxis = Math.max(vsbW * -1, scrollXaxis); //mxY.innerHTML = 'Highest deltaY: ' + scrollYaxis;
      scrollXaxis = Math.min(0, scrollXaxis); //mnY.innerHTML = 'Lowest deltaY: ' + scrollYaxis;
    }
  }
});
