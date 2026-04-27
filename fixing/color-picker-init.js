document.addEventListener('DOMContentLoaded', function () {
  var swatchBtn = document.getElementById('color-swatch-btn');
  var hiddenInput = document.getElementById('text-color-picker');
  var container = document.getElementById('color-picker-container');
  var translateController = document.querySelector('.translate_controller');
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
    translateController.classList.add('picker-open');
    var langController = document.getElementById('language-controller');
    if (langController && !langController.classList.contains('hidden')) {
      langController.classList.add('hidden');
    }
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
          // The PopupController throttles input events to 300 ms.  jPicker's
          // live callback fires on initialisation (setting up the colour map
          // triggers a G.active change that calls the bound live handler),
          // which starts the throttle window before the user has interacted at
          // all.  If the user picks a colour and clicks OK within that window
          // the immediate fireInputEvent() above is silently dropped.
          // Scheduling a second fire at 310 ms guarantees that the final chosen
          // colour is always sent to the content script, regardless of the
          // current throttle state.
          setTimeout(fireInputEvent, 310);
          updateSwatch(hex);
          container.style.display = 'none';
          translateController.classList.remove('picker-open');
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
          translateController.classList.remove('picker-open');
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
      translateController.classList.remove('picker-open');
    }
  });

});
