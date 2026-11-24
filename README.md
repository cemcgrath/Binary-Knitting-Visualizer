# Binary-Knitting-Visualizer

Turn text into a knitting stitch chart and flat-knitting row instructions. Choose binary, Base64, or Morse code, adjust the width, and repeat your message. For binary and Base64, zeroes are knit stitches and ones are purl stitches as viewed from the front. For Morse code, dashes are knit stitches and dots are purl stitches.

Morse code is case-insensitive and supports English letters, digits, and common punctuation. Whitespace is shown as `/` in the displayed and copied code. Letter and word boundaries do not add stitches, so the chart alone does not preserve those boundaries. Unsupported characters must be removed or replaced before a pattern can be generated.

[Open the knitting visualizer](https://cemcgrath.github.io/Binary-Knitting-Visualizer/)

The UI runs entirely in your browser. You can also open `index.html` locally.

Set the piece width from 4 to 300 stitches. Use **Open fullscreen** on the stitch chart to fill your screen; scroll to see charts larger than the display. Select **Exit fullscreen** or press Escape to return.
