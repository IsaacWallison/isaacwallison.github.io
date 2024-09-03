window.addEventListener('load', () => {
  const saveButton = document.querySelector('#saveButton');
  const drawModeButton = document.querySelector('#drawModeButton');
  const eraseModeButton = document.querySelector('#eraseModeButton');
  const clearButton = document.querySelector('#clearButton');
  const lineWidth = document.querySelector('#lineWidth');
  const lineColor = document.querySelector('#lineColor');

  /** @type {HTMLCanvasElement} */
  const canvas = document.querySelector('#canvas');
  const context = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.onresize = () => {
    window.location.reload();
  };

  const state = {
    deviceType: null,
    isDrawingMode: false,
    isErasingMode: false,
    isDrawing: false,
    isErasing: false,
    isAllowedToDrawOrErase: false,

    draw: {
      initialCoords: {
        x: 0,
        y: 0,
      },
      lineColor: lineColor.value,
      lineWidth: lineWidth.value,
    },
  };

  const events = {
    mouse: {
      start: 'mousedown',
      up: 'mouseup',
      move: 'mousemove',
      leave: 'mouseleave',
    },
    touch: {
      start: 'touchstart',
      up: 'touchend',
      move: 'touchmove',
      leave: 'touchcancel',
    },
  };

  function init() {
    setDeviceType();
    setEvents();
    drawModeButton.click();
  }

  init();

  function setDeviceType() {
    try {
      document.createEvent('TouchEvent');
      state.deviceType = 'touch';
    } catch (error) {
      state.deviceType = 'mouse';
    }
  }

  function setEvents() {
    lineWidth.onchange = setLineWidth;
    lineColor.oninput = setLineColor;
    saveButton.onclick = saveAsImage;
    drawModeButton.onclick = setIsDrawingMode;
    eraseModeButton.onclick = setIsErasingMode;
    clearButton.onclick = clearCanvas;
  }

  function saveAsImage() {
    const anchor = document.createElement('a');
    anchor.download = `draw-${Date.now()}.png`;
    anchor.href = canvas.toDataURL();
    anchor.click();
  }

  function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  function setIsDrawingMode(e) {
    removeSelectedButtonState();
    state.isErasingMode = false;
    state.isDrawingMode = true;
    e.target.classList.add('selected');
  }

  function setIsErasingMode(e) {
    removeSelectedButtonState();
    state.isDrawingMode = false;
    state.isErasingMode = true;
    e.target.classList.add('selected');
  }

  function setLineWidth(e) {
    state.draw.lineWidth = e.target.value;
  }

  function setLineColor(e) {
    state.draw.lineColor = e.target.value;
  }

  function removeSelectedButtonState() {
    [drawModeButton, eraseModeButton].forEach((button) => {
      button.classList.remove('selected');
    });
  }

  function handleDrawing(e, fn) {
    e.preventDefault();
    if (state.deviceType === 'touch') {
      const { touches, changedTouches } = e.originalEvent ?? e;
      const touch = touches[0] ?? changedTouches[0];
      const x = Math.floor(touch.clientX - canvas.getBoundingClientRect().x);
      const y = Math.floor(touch.clientY - canvas.getBoundingClientRect().y);

      return fn(x, y);
    }

    const x = e.offsetX;
    const y = e.offsetY;

    fn(x, y);
  }

  canvas.addEventListener(events[state.deviceType].start, (e) => {
    state.isAllowedToDrawOrErase = true;
    handleDrawing(e, (x, y) => {
      context.beginPath();
      context.moveTo(x, y);
    });
  });

  canvas.addEventListener(events[state.deviceType].move, (e) => {
    if (!state.isAllowedToDrawOrErase) return;

    handleDrawing(e, (x, y) => {
      if (state.isDrawingMode) {
        const { lineWidth, lineColor } = state.draw;

        context.lineWidth = lineWidth;
        context.strokeStyle = lineColor;
        context.lineCap = 'round';

        context.lineTo(x, y);

        context.stroke();

        return;
      }

      if (state.isErasingMode) {
        const { lineWidth } = state.draw;

        context.clearRect(x, y, lineWidth * Math.PI, lineWidth * Math.PI);
      }
    });
  });

  canvas.addEventListener(events[state.deviceType].up, (e) => {
    state.isAllowedToDrawOrErase = false;
  });

  canvas.addEventListener(events[state.deviceType].leave, (e) => {
    state.isAllowedToDrawOrErase = false;
  });
});
