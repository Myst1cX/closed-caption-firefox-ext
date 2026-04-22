document.addEventListener('DOMContentLoaded', function () {
  var swatchBtn = document.getElementById('color-swatch-btn');
  var hiddenInput = document.getElementById('text-color-picker');
  var container = document.getElementById('color-picker-container');
  var pickerInited = false;

  function toPickerHex(hexWithHash) {
    return (hexWithHash || '#ffffff').replace('#', '');
  }

  function fireInputEvent() {
    hiddenInput.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function updateSwatch(hex) {
    swatchBtn.style.backgroundColor = hex;
  }

  // Keep the swatch colour in sync with the hidden input.
  // popup.js sets the initial value asynchronously (after storage.get),
  // so we poll until it appears.
  var lastValue = '';
  var syncInterval = setInterval(function () {
    var val = hiddenInput.value;
    if (val && val !== lastValue) {
      lastValue = val;
      updateSwatch(val);
    }
  }, 100);

  function openPicker() {
    container.style.display = 'block';
    if (!pickerInited) {
      var currentHex = hiddenInput.value || '#ffffff';
      var widget = $(container).find('.colorpicker-widget');
      var initialColor = new $.jPicker.Color({ hex: toPickerHex(currentHex) });

      widget.jPicker(
        {
          window: { title: '' },
          color: { active: initialColor, mode: 'h' },
          images: { clientPath: './lib/jPicker/images/' }
        },
        /* OK */ function (color) {
          var hex = '#' + color.val('hex');
          hiddenInput.value = hex;
          lastValue = hex;
          fireInputEvent();
          updateSwatch(hex);
          container.style.display = 'none';
        },
        /* live */ function (color) {
          if (color) {
            var hex = '#' + color.val('hex');
            hiddenInput.value = hex;
            lastValue = hex;
            fireInputEvent();
            updateSwatch(hex);
          }
        },
        /* cancel */ function () {
          container.style.display = 'none';
        }
      );
      pickerInited = true;
    }
  }

  swatchBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (container.style.display === 'none' || container.style.display === '') {
      openPicker();
    } else {
      container.style.display = 'none';
    }
  });

  document.addEventListener('click', function (e) {
    if (
      container.style.display !== 'none' &&
      !container.contains(e.target) &&
      e.target !== swatchBtn
    ) {
      container.style.display = 'none';
    }
  });
});
