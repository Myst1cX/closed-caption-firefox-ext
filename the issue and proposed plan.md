Folder 1: chrome-ext (original extension, meant for chrome, works flawlessly. 
Folder 2: firefox-ext (port of original extension. need to fix the text color feature. 
Description of issue: The firefox-ext port has an issue with text color selector. 
When I click on the default color which opens up the firefox color selection gui, the firefox-ext extension's ui closes automatically since it is no
longer in focus. So when I select the color from firefox color selection gui, and the gui is subsequently closed,
our extension window needs to be manually reopened, upon which, the default color value is reinstated. In essence, the color we selected in 
firefox color selection gui, is not updated in our extension menu and also subtitle doesnt get the color because the extension window does not remain 
open during color picking. 
Proposed fix: Implementing a custom color picker which stays within the popup, so the extension menu doesn't lose focus, and remains open. 
(so we no longer rely on native browser color picker). Inside zilla folder is a browser extension with such custom color picker that stays within popup.
It is called jPicker and i would like you to implement it.
Expectations: 
1. Stays completely within the popup - No native browser color picker is used
2. Provides a full color spectrum - Users can pick any color visually
3. Includes hue slider - For precise color selection
4. Has preset swatches - For quick common color selection
5. Shows live preview - Updates the color in real-time
6. Works on all browsers - Including Firefox, since it doesn't rely on any browser-native dialogs
7. The color picker popup appears when clicking the color preview square, and it stays open until the user clicks OK, Cancel, or clicks outside.
8. The color is applied immediately as the user selects it, and the subtitle text color updates in real-time.

