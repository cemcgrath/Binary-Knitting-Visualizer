# Binary-Knitting-Visualizer

Turn text into a knitting stitch chart and row or round instructions. Choose binary, Base64, or Morse code, adjust the width, and repeat your message. For binary and Base64, zeroes are knit stitches and ones are purl stitches as viewed from the front. For Morse code, dashes are knit stitches and dots are purl stitches.

Morse code is case-insensitive and supports English letters, digits, and common punctuation. One separator-colored knit stitch separates letters and punctuation, and three separate words. The separator color defaults to light blue and can be changed. Runs of whitespace count as one word boundary; leading and trailing whitespace add no stitches unless they separate message repeats. Whitespace is shown as `/` in the displayed and copied code. Row instructions mark separator stitches with `[separator]`; on wrong-side rows, purl them so they appear knit on the front. Unsupported characters must be removed or replaced before a pattern can be generated.

[Open the knitting visualizer](https://cemcgrath.github.io/Binary-Knitting-Visualizer/)

The UI runs entirely in your browser. You can also open `index.html` locally.

The page markup is in `index.html`, styling is in `styles.css`, and chart and UI logic are in `app.js`. The `encodings/` directory contains the separate binary, Base64, and Morse encoding functions. These scripts are loaded in order by the page, so local file access does not require a web server.

Use **Building your message** below **Message repeats** to choose **Right Side only (in the round)** or **Right and Wrong Side (flat)** (the default). Both start at the bottom left, reading left to right. In the round, every round is RS and reads left to right. Flat knitting alternates RS rows left to right with WS rows right to left, continuing the code on both sides; WS instructions reverse knit and purl so the front matches the chart.

Set the piece width from 4 to 320 stitches. Use **Open fullscreen** on the stitch chart to fill your screen; scroll to see charts larger than the display. Select **Exit fullscreen** or press Escape to return.
