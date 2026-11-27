# Binary-Knitting-Visualizer

Turn text into a knitting stitch chart and flat-knitting row instructions. Choose binary, Base64, or Morse code, adjust the width, and repeat your message. For binary and Base64, zeroes are knit stitches and ones are purl stitches as viewed from the front. For Morse code, dashes are knit stitches and dots are purl stitches.

Morse code is case-insensitive and supports English letters, digits, and common punctuation. One separator-colored knit stitch separates letters and punctuation, and three separate words. The separator color defaults to light blue and can be changed. Runs of whitespace count as one word boundary; leading and trailing whitespace add no stitches unless they separate message repeats. Whitespace is shown as `/` in the displayed and copied code. Row instructions mark separator stitches with `[separator]`; on wrong-side rows, purl them so they appear knit on the front. Unsupported characters must be removed or replaced before a pattern can be generated.

[Open the knitting visualizer](https://cemcgrath.github.io/Binary-Knitting-Visualizer/)

The UI runs entirely in your browser. You can also open `index.html` locally.

Set the piece width from 4 to 300 stitches. Use **Open fullscreen** on the stitch chart to fill your screen; scroll to see charts larger than the display. Select **Exit fullscreen** or press Escape to return.
