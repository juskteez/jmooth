/*
 * Title: Jmooth
 * Description: A native javascript smooth scroll experience experiment
 * Author: Juskteez
 * Contact: juskteez@gmail.com
 * Version: 1.0.2
 */

var scroll_Content         = document.getElementById('content'),
  scroll_Bar               = document.createElement('DIV'),
  scroll_Progress          = document.createElement('DIV'),
  blockIMGs                = document.getElementsByClassName('block-image'),
  $body                    = document.body,
  $bodyClass               = $body.classList,
  content_Style            = scroll_Content.style,
  scroll_Bar_Style         = scroll_Bar.style,
  progress_style           = scroll_Progress.style,
  scroll_Position_Y        = 0, // default scroll position
  scroll_Position_X        = 0, // default horizontal scroll position
  scroll_Position          = 0, // default scroll value
  scroll_Bar_Position      = 0, // default scrollbar pos
  scroll_Current_Progress  = 0, // default scrollbar progress
  parallax_Position        = 0, // default parallax position
  loaded                   = false,
  horizontal               = false,
  draggable                = false,
  progress                 = false,
  translate_Property       = 'translate3d(',
  content_Transform,
  scroll_Transform,
  body_Height,
  window_Height,
  visible_Height,
  body_Width,
  window_Width,
  visible_Width,
  scrPrcs,
  clearScroll,
  posX,
  posY,
  i;

// SETTINGS
var scrollSpeed      = 2,
  FF_scrollSpeed     = 0.15 / scrollSpeed,
  scroll_Step        = 200,
  parallax_Speed     = 5,
  parallax_Space     = parallax_Speed / 2.85,
  drag_Speed         = 1.5,
  easing_time        = 0.075,
  page_Loaded_Class  = 'page_loaded',
  scrollbar_id       = 'jmooth_scrollbar',
  scroll_Progress_id = 'jmooth_scrollprogress',
  scrolling_Class    = 'im_scrolling',
  Dragging_Class     = 'im_dragging',
  bar_Dragging_Class = 'scroll_bar_dragging';

if (scroll_Content.classList.contains('horizontal')) horizontal = true;
if (scroll_Content.classList.contains('draggable')) draggable = true;

scroll_Bar.setAttribute('id', scrollbar_id);
if (horizontal) scroll_Bar.classList.add('horizon_scrollbar');
$body.appendChild(scroll_Bar);

if (progress) {
  scroll_Progress.setAttribute('id', scroll_Progress_id);
  $body.appendChild(scroll_Progress);
}

var firefox = navigator.userAgent.indexOf('Firefox') > -1;

if (firefox) scrollSpeed = FF_scrollSpeed;

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
      args      = arguments;
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

  if (horizontal) {
    body_Width         = scroll_Content.offsetWidth,
    window_Width       = window.innerWidth,
    visible_Width      = body_Width - window_Width,
    scrPrcs            = window_Width - scroll_Bar.offsetWidth;

    scroll_Position_X  = Math.max(visible_Width * -1, scroll_Position_X);

    content_Transform  = translate_Property + scroll_Position + 'px,0,0)';
    scroll_Transform   = translate_Property + (scroll_Bar_Position * -1) + 'px,0,0)';
  } else {
    body_Height        = scroll_Content.offsetHeight,
    window_Height      = window.innerHeight,
    visible_Height     = body_Height - window_Height,
    scrPrcs            = window_Height - scroll_Bar.offsetHeight;

    scroll_Position_Y  = Math.max(visible_Height * -1, scroll_Position_Y);

    content_Transform  = translate_Property + '0px,' + scroll_Position + 'px,0)';
    scroll_Transform   = translate_Property + '0px,' + (scroll_Bar_Position * -1) + 'px,0)';
  }

  content_Style['-webkit-transform']     = content_Transform;
  content_Style['transform']             = content_Transform;
  scroll_Bar_Style['-webkit-transform']  = scroll_Transform;
  scroll_Bar_Style['transform']          = scroll_Transform;

}, 500);

var limitScroll = function() {
  if (horizontal) {
    scroll_Position_X  = Math.max(visible_Width * -1, scroll_Position_X);
    scroll_Position_X  = Math.min(0, scroll_Position_X);
  } else {
    scroll_Position_Y  = Math.max(visible_Height * -1, scroll_Position_Y);
    scroll_Position_Y  = Math.min(0, scroll_Position_Y);
  }
};

window.onload = function() {

  if (horizontal) {
    body_Width     = scroll_Content.offsetWidth,
    window_Width   = window.innerWidth,
    visible_Width  = body_Width - window_Width,
    scrPrcs        = window_Width - scroll_Bar.offsetWidth;
  } else {
    body_Height    = scroll_Content.offsetHeight,
    window_Height  = window.innerHeight,
    visible_Height = body_Height - window_Height,
    scrPrcs        = window_Height - scroll_Bar.offsetHeight;
  }

  loaded = true;

  $bodyClass.add(page_Loaded_Class);

  prlBlockImg();
  jmoothScroller();

  addEvent(window, 'resize', scrollRecall, 250);

};

/* CUSTOM FOR PARALLAX DEMO IMAGE */
function prlBlockImg() {
  for (i = 0; i < blockIMGs.length; i++) {
    if (horizontal) {
      blockIMGs[i].style.right  = (parallax_Speed * 1.25 * i) + 'vw';
    } else {
      blockIMGs[i].style.bottom = (parallax_Space * i) + 'vh';
    }
  }
}
/* END CUSTOM FOR PARALLAX DEMO IMAGE */

document.addEventListener('wheel', function(event) {
  if (loaded) {
    if ($bodyClass.contains(scrolling_Class)) {
      clearTimeout(clearScroll);
      clearScroll = setTimeout(closeScroll, 250);
    } else {
      $bodyClass.add(scrolling_Class);
    }
    if (horizontal) {
      scroll_Position_X += ((event.deltaY+event.deltaX) / scrollSpeed) * -1;
    } else {
      scroll_Position_Y += (event.deltaY / scrollSpeed) * -1;
    }

    limitScroll();

  }
});

function closeScroll() {
  $bodyClass.remove(scrolling_Class);
}

function jmoothScroller() {
  requestAnimationFrame(jmoothScroller);

  var scrP = 0,
    prlxVal = 0; // CUSTOM FOR PARALLAX DEMO IMAGE

  if (horizontal) {
    scrP    = scroll_Position_X / visible_Width * 100;
    prlxVal = scroll_Position_X / parallax_Speed; // CUSTOM FOR PARALLAX DEMO IMAGE
  } else {
    scrP    = scroll_Position_Y / visible_Height * 100;
    prlxVal = scroll_Position_Y / parallax_Speed; // CUSTOM FOR PARALLAX DEMO IMAGE
  }

  var sclP  = scrP * scrPrcs / 100;

  if (isNaN(sclP)) sclP = 0;

  if (horizontal) {
    scroll_Position   += (scroll_Position_X - scroll_Position) * easing_time;
  } else {
    scroll_Position   += (scroll_Position_Y - scroll_Position) * easing_time;
  }
  scroll_Bar_Position += (sclP - scroll_Bar_Position) * easing_time;
  if (progress) scroll_Current_Progress += (scrP - scroll_Current_Progress) * easing_time;

  parallax_Position   += (prlxVal - parallax_Position) * easing_time; // CUSTOM FOR PARALLAX DEMO IMAGE

  if (horizontal) {
    content_Transform  = translate_Property + scroll_Position + 'px,0,0)';
    scroll_Transform   = translate_Property + (scroll_Bar_Position * -1) + 'px,0,0)';
  } else {
    content_Transform  = translate_Property + '0,' + scroll_Position + 'px,0)';
    scroll_Transform   = translate_Property + '0,' + (scroll_Bar_Position * -1) + 'px,0)';
  }

  /* CUSTOM FOR PARALLAX DEMO IMAGE */
  for (i = 0; i < blockIMGs.length; i++) {
    if (horizontal) {
      blockIMGs[i].style['transform'] = translate_Property + (parallax_Position * 0.8 * -1) + 'px,0,0)';
    } else {
      blockIMGs[i].style['transform'] = translate_Property + '0,' + (parallax_Position * -1) + 'px,0)';
    }
  }
  /* END CUSTOM FOR PARALLAX DEMO IMAGE */

  content_Style['-webkit-transform']     = content_Transform;
  content_Style['transform']             = content_Transform;
  scroll_Bar_Style['-webkit-transform']  = scroll_Transform;
  scroll_Bar_Style['transform']          = scroll_Transform;

  if (progress) progress_style.height = Math.abs(scroll_Current_Progress) + '%';
}

document.addEventListener('keydown', function(event) {
  var key = event.which || event.keyCode || event.charCode;
  if (loaded && (key == 37 || key == 38 || key == 39 || key == 40)) {
    event.preventDefault();
    if ($bodyClass.contains(scrolling_Class)) {
      clearTimeout(clearScroll);
      clearScroll = setTimeout(closeScroll, 250);
    } else {
      $bodyClass.add(scrolling_Class);
    }
    if (horizontal) {
      if (key == 37) scroll_Position_X += scroll_Step;
      if (key == 39) scroll_Position_X -= scroll_Step;
    } else {
      if (key == 38) scroll_Position_Y += scroll_Step;
      if (key == 40) scroll_Position_Y -= scroll_Step;
    }

    limitScroll();

  }
});

var dragging = false,
  scroll_Bar_Dragging = false,
  startDrag = 0;

document.addEventListener('mousedown', function(event) {
  var the_target = event.target;
  if (the_target.id == scrollbar_id) scroll_Bar_Dragging = true;

  if (loaded && draggable && the_target.id != scrollbar_id) {
    event.preventDefault();

    (horizontal) ? startDrag = event.clientX : startDrag = event.clientY;

    dragging = true;
  }
});

document.addEventListener('mousemove', function(event) {
  if (loaded && (dragging || scroll_Bar_Dragging)) {
    event.preventDefault();

    if ($bodyClass.contains(scrolling_Class)) {
      clearTimeout(clearScroll);
      clearScroll = setTimeout(closeScroll, 250);
    } else {
      $bodyClass.add(scrolling_Class);
    }

    (horizontal) ? posX = event.clientX : posY = event.clientY;

    if (scroll_Bar_Dragging) {
      $bodyClass.add(bar_Dragging_Class);
      (horizontal) ? scroll_Position_X = posX / window_Width * visible_Width * -1 : scroll_Position_Y = posY / window_Height * visible_Height * -1;
    }

    if (dragging) {
      $bodyClass.add(Dragging_Class);
      (horizontal) ? scroll_Position_X -= ( startDrag - posX ) / 10 * drag_Speed : scroll_Position_Y -= ( startDrag - posY ) / 10 * drag_Speed;
    }

    limitScroll();

  }

});

document.addEventListener('mouseup', function(event) {
  if (loaded && (dragging || scroll_Bar_Dragging)) event.preventDefault(); dragging = false; $bodyClass.remove(Dragging_Class); $bodyClass.remove(bar_Dragging_Class); scroll_Bar_Dragging = false; scroll_Bar_Dragging = false;
});
