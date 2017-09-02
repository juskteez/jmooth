/*
 * Title: Jmooth
 * Description: A native javascript smooth scroll experience experiment
 * Author: Juskteez
 * Contact: juskteez@gmail.com
 * Version: 1.0.2
 */

// SETTINGS
var scroll_Area_id   = 'content',
  page_Loaded_Class  = 'page_loaded',
  scrollbar_id       = 'jmooth_scrollbar',
  scroll_Progress_id = 'jmooth_scrollprogress',
  scrolling_Class    = 'im_scrolling',
  dragging_Class     = 'im_dragging',
  draggable_Class    = 'draggable',
  bar_Dragging_Class = 'scroll_bar_dragging',
  horizontal_Class   = 'horizontal',
  horizon_Bar_Class  = 'horizon_scrollbar',
  scrollSpeed        = 2,
  scroll_Step        = 200,
  parallax_Speed     = 5, // min -10; max 10; reverse by negative value
  drag_Speed         = 1.5,
  touch_Speed        = 4,
  easing_time        = 0.075;


// DECLEARING DEFAULT VARIABLES
var scroll_Content         = document.getElementById(scroll_Area_id),
  scroll_Bar               = document.createElement('DIV'),
  scroll_Progress          = document.createElement('DIV'),
  blockIMGs                = document.getElementsByClassName('block-image'), // CUSTOM FOR PARALLAX DEMO IMAGE
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
  translate_Property       = 'translate3d(',
  loaded                   = false,
  horizontal               = false,
  draggable                = false,
  progress                 = false,
  dragging                 = false,
  scroll_Bar_Dragging      = false,
  startDrag                = 0,
  touching                 = false,
  touch_Move               = 0,
  touch_Object,
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

if (scroll_Content.classList.contains(horizontal_Class)) horizontal = true;
if (scroll_Content.classList.contains(draggable_Class)) draggable = true;

scroll_Bar.setAttribute('id', scrollbar_id);
if (horizontal) scroll_Bar.classList.add(horizon_Bar_Class);
$body.appendChild(scroll_Bar);

if (progress) {
  scroll_Progress.setAttribute('id', scroll_Progress_id);
  $body.appendChild(scroll_Progress);
}

var firefox = navigator.userAgent.indexOf('Firefox') > -1;

if (firefox) scrollSpeed = 0.15 / scrollSpeed;

if (parallax_Speed > 10) {
  parallax_Speed = 1;
} else if (parallax_Speed == 0) {
  parallax_Speed = 0;
} else if (parallax_Speed < 0) {
  parallax_Speed = -11 - parallax_Speed;
} else if (parallax_Speed < -10) {
  parallax_Speed = -1;
} else {
  parallax_Speed = 11 - parallax_Speed;
}

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

var content_Transformer = function(content_Transform_Value, scroll_Bar_Transform_Value) {
  content_Style['-webkit-transform']     = content_Transform_Value;
  content_Style['transform']             = content_Transform_Value;
  scroll_Bar_Style['-webkit-transform']  = scroll_Bar_Transform_Value;
  scroll_Bar_Style['transform']          = scroll_Bar_Transform_Value;
};

var scroll_Proceeding = function() {
  if ($bodyClass.contains(scrolling_Class)) {
    clearTimeout(clearScroll);
    clearScroll = setTimeout(closeScroll, 250);
  } else {
    $bodyClass.add(scrolling_Class);
  }
};

var scrollRecall = debounce(function() {

  if (horizontal) {
    body_Width         = scroll_Content.offsetWidth,
    window_Width       = window.innerWidth,
    visible_Width      = body_Width - window_Width,
    scrPrcs            = window_Width - scroll_Bar.offsetWidth;

    content_Transform  = translate_Property + scroll_Position + 'px,0,0)';
    scroll_Transform   = translate_Property + (scroll_Bar_Position * -1) + 'px,0,0)';
  } else {
    body_Height        = scroll_Content.offsetHeight,
    window_Height      = window.innerHeight,
    visible_Height     = body_Height - window_Height,
    scrPrcs            = window_Height - scroll_Bar.offsetHeight;

    content_Transform  = translate_Property + '0px,' + scroll_Position + 'px,0)';
    scroll_Transform   = translate_Property + '0px,' + (scroll_Bar_Position * -1) + 'px,0)';
  }

  limitScroll();

  content_Transformer(content_Transform,scroll_Transform);

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
      blockIMGs[i].style.bottom = (parallax_Speed * i) + 'vh';
    }
  }
}
/* END CUSTOM FOR PARALLAX DEMO IMAGE */

document.addEventListener('wheel', function(event) {
  if (loaded) {
    scroll_Proceeding();
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

  content_Transformer(content_Transform,scroll_Transform);

  if (progress) progress_style.height = Math.abs(scroll_Current_Progress) + '%';
}

document.addEventListener('keydown', function(event) {
  var key = event.which || event.keyCode || event.charCode;
  if (loaded && (key == 37 || key == 38 || key == 39 || key == 40)) {
    event.preventDefault();
    scroll_Proceeding();

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

document.addEventListener('mousedown', function(event) {
  var the_target = event.target;
  if (the_target.id == scrollbar_id) scroll_Bar_Dragging = true;

  if (loaded && draggable && the_target.id != scrollbar_id) {
    event.preventDefault();

    (horizontal) ? startDrag = event.clientX : startDrag = event.clientY;

    dragging = true;
  }
});

var dragger = function(draggerX,draggerY,draggerPoint,draggerSpeed) {

  $bodyClass.add(dragging_Class);
  (horizontal) ? scroll_Position_X -= ( draggerPoint - draggerX ) / 10 * draggerSpeed : scroll_Position_Y -= ( draggerPoint - draggerY ) / 10 * draggerSpeed;

};

document.addEventListener('mousemove', function(event) {
  if (loaded && (dragging || scroll_Bar_Dragging)) {
    event.preventDefault();

    scroll_Proceeding();

    (horizontal) ? posX = event.clientX : posY = event.clientY;

    if (scroll_Bar_Dragging) {
      $bodyClass.add(bar_Dragging_Class);
      (horizontal) ? scroll_Position_X = posX / window_Width * visible_Width * -1 : scroll_Position_Y = posY / window_Height * visible_Height * -1;
    }

    if (dragging) dragger(posX,posY,startDrag,drag_Speed);

    limitScroll();

  }

});

document.addEventListener('mouseup', function(event) {
  if (loaded && (dragging || scroll_Bar_Dragging)) {
    event.preventDefault();
    dragging = false;

    $bodyClass.remove(dragging_Class);
    $bodyClass.remove(bar_Dragging_Class);

    scroll_Bar_Dragging = false;
  }
});

$body.addEventListener('touchstart', function(event) {
  if (loaded) {
    event.preventDefault();

    (horizontal) ? touch_Move = event.changedTouches[0].clientX : touch_Move = event.changedTouches[0].clientY;

    touching = true;
  }
}, {passive: false});

document.addEventListener('touchmove', function(event) {
  touch_Object = event.changedTouches[0];

  if (loaded && touching) {
    event.preventDefault();
    scroll_Proceeding();

    dragger(touch_Object.clientX,touch_Object.clientY,touch_Move,touch_Speed);

    limitScroll();

  }
}, {passive: false});

var cancel_Touch = function() {
  if (loaded && touching) {
    touching = false;
    $bodyClass.remove(dragging_Class);
  }
};

document.addEventListener('touchend', function() {
  cancel_Touch();
});

document.addEventListener('touchcancel', function() {
  cancel_Touch();
});
