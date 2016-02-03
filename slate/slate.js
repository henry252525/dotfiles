// CONFIGS
// ============================================================================
S.configAll({
  'defaultToCurrentScreen' : true,
  'orderScreensLeftToRight': true
});

// OPERATIONS
// ============================================================================
var fullscreen = S.operation('move', {
  'x'     : 'screenOriginX',
  'y'     : 'screenOriginY',
  'width' : 'screenSizeX',
  'height': 'screenSizeY'
});

var center = S.operation('move', {
  'x'     : 'screenOriginX+screenSizeX/8',
  'y'     : 'screenOriginY+screenSizeY/8',
  'width' : '0.75*screenSizeX',
  'height': '0.75*screenSizeY'
});

// LEFT OPERATORS
var leftThird = S.operation('move', {
  'x'     : 'screenOriginX',
  'y'     : 'screenOriginY',
  'width' : 'screenSizeX/3',
  'height': 'screenSizeY'
});

var leftHalf = S.operation('move', {
  'x'     : 'screenOriginX',
  'y'     : 'screenOriginY',
  'width' : 'screenSizeX/2',
  'height': 'screenSizeY'
});

var leftTwoThird = S.operation('move', {
  'x'     : 'screenOriginX',
  'y'     : 'screenOriginY',
  'width' : 'screenSizeX/1.5',
  'height': 'screenSizeY'
});

// RIGHT OPERATORS
var rightThird = S.operation('move', {
  'x'     : 'screenOriginX+screenSizeX/1.5',
  'y'     : 'screenOriginY',
  'width' : 'ceiling(screenSizeX/3)',
  'height': 'screenSizeY'
});

var rightHalf = S.operation('move', {
  'x'     : 'screenOriginX+screenSizeX/2',
  'y'     : 'screenOriginY',
  'width' : 'ceiling(screenSizeX/2)',
  'height': 'screenSizeY'
});

var rightTwoThird = S.operation('move', {
  'x'     : 'screenOriginX+screenSizeX/3',
  'y'     : 'screenOriginY',
  'width' : 'ceiling(screenSizeX/1.5)',
  'height': 'screenSizeY'
});

// WINDOW HINT
var windowHint = S.operation('hint', {
  'characters' : 'HJKLGFDSA'
});

// APP SWITCHER
// var appSwitch = S.operation('switch');


// BINDINGS
// ============================================================================
S.bindAll({
  // Mine
  'up:ctrl;cmd' : fullscreen,
  'down:ctrl;cmd' : center,
  'right:ctrl;cmd' : rightHalf,
  'left:ctrl;cmd' : leftHalf,
  // Elijah's
  'f:cmd;shift' : fullscreen,
  'h:ctrl;shift': leftThird,
  'h:alt;shift' : leftHalf,
  'h:cmd;shift' : leftTwoThird,
  'l:ctrl;shift': rightThird,
  'l:alt;shift' : rightHalf,
  'l:cmd;shift' : rightTwoThird,
  'space:ctrl' : windowHint
});



// from https://gist.github.com/gfreezy/6060661
var pushRight = slate.operation("push", {
  "direction": "right",
  "style": "bar-resize:screenSizeX/2"
});

var pushLeft = slate.operation("push", {
  "direction": "left",
  "style": "bar-resize:screenSizeX/2"
});

var throwNextLeft = slate.operation("throw", {
  "width": "screenSizeX/2",
  "height": "screenSizeY",
  "screen": "next"
});

var throwNextRight = slate.operation("throw", {
  "x": "screenOriginX+(screenSizeX)/2",
  "y": "screenOriginY",
  "width": "screenSizeX/2",
  "height": "screenSizeY",
  "screen": "next"
});

var fullscreen = slate.operation("move", {
  "x" : "screenOriginX",
  "y" : "screenOriginY",
  "width" : "screenSizeX",
  "height" : "screenSizeY"
});

var throwNextFullscreen = slate.operation("throw", {
  "x": "screenOriginX",
  "y": "screenOriginY",
  "width": "screenSizeX",
  "height": "screenSizeY",
  "screen": "next"
});

var throwNext = function(win) {
  if (!win) {
    return;
  }
  var winRect = win.rect();
  var screen = win.screen().visibleRect();

  var newX = (winRect.x - screen.x)/screen.width+"*screenSizeX+screenOriginX";
  var newY = (winRect.y - screen.y)/screen.height+"*screenSizeY+screenOriginY";
  var newWidth = winRect.width/screen.width+"*screenSizeX";
  var newHeight = winRect.height/screen.height+"*screenSizeY";
  var throwNext = slate.operation("throw", {
    "x": newX,
    "y": newY,
    "width": newWidth,
    "height": newHeight,
    "screen": "next"
  });
  win.doOperation(throwNext);
};

var pushedLeft = function(win) {
  if (!win) {
    return false;
  }
  var winRect = win.rect();
  var screen = win.screen().visibleRect();

  if (winRect.x === screen.x &&
      winRect.y === screen.y &&
      winRect.width === screen.width/2 &&
      winRect.height === screen.height
    ) {
    return true;
  }
  return false;
};

var pushedRight = function(win) {
  if (!win) {
    return false;
  }
  var winRect = win.rect();
  var screen = win.screen().visibleRect();

  if (winRect.x === screen.x + screen.width/2 &&
      winRect.y === screen.y &&
      winRect.width === screen.width/2 &&
      winRect.height === screen.height
    ) {
    return true;
  }
  return false;
};

var isFullscreen = function(win) {
  if (!win) {
    return false;
  }
  var winRect = win.rect();
  var screen = win.screen().visibleRect();
  if (winRect.width === screen.width &&
      winRect.height === screen.height
    ) {
    return true;
  }
  return false;
};


slate.bind("h:ctrl,cmd", function(win) {
  if (!win) {
    return;
  }
  if (pushedLeft(win)) {
    win.doOperation(throwNextLeft);
  } else {
    win.doOperation(pushLeft);
  }
});

slate.bind("l:ctrl,cmd", function(win) {
  if (!win) {
    return;
  }

  if (pushedRight(win)) {
    win.doOperation(throwNextRight);
  } else {
    win.doOperation(pushRight);
  }
});

slate.bind("k:ctrl,cmd", function(win) {
  if (!win) {
    return;
  }

  if (isFullscreen(win)) {
    win.doOperation(throwNextFullscreen);
  } else {
    win.doOperation(fullscreen);
  }
});

slate.bind("j:ctrl,cmd", function(win) {
  if (!win) {
    return;
  }

  if (pushedLeft(win)) {
    win.doOperation(throwNextLeft);
  } else if (pushedRight(win)) {
    win.doOperation(throwNextRight);
  } else if (isFullscreen(win)) {
    win.doOperation(throwNextFullscreen);
  } else {
    throwNext(win);
  }
});

