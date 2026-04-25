/**
 * asciiArt.ts
 * Decorative ASCII art used by the `welcome` command.
 *
 * Re-exports `buildBanner` from asciiFonts.ts under a clearer name and
 * adds a static decorative portrait shown beside the name banner.
 *
 * No React imports — must stay framework-agnostic so commands can use it.
 */

export { buildBanner as buildBlockBanner } from './asciiFonts';

/**
 * Author-agnostic decorative ASCII emblem shown on the right of the
 * welcome screen. Designed to balance with a 5–6 row name banner on a
 * standard desktop viewport. Roughly 30 cols wide × 14 rows tall.
 *
 * Composition: a stylised "data mask" of glyphs reminiscent of classic
 * neofetch portraits — keeps the welcome screen visually anchored on
 * the right without being tied to any one identity.
 */
export const PORTRAIT_ART = String.raw`         ,##,,eew,
       ,##############C
      a##############@##
     7####^\^"7W7^@####
     ##@b\`       \^@#@^
     ##^,,,,,    ,#^
     ,@######"######=
     ' '555'\`  '5555b|
      T"@   ,,,mg,@,*
        \p|| \~~,#
       \Wp     ,#T
       :b' \@@b^}
        ^,        \b 3-
   .<\`  p   ^v   #   b   *.
   {    }    #"GpGb     [
   '.C  3 * @######Nl   ($
            ^@##b           !`;

/**
 * A more compact 8-row emblem — used in the boot sequence and tighter
 * layouts where the larger PORTRAIT_ART would crowd the screen.
 */
export const COMPACT_EMBLEM = String.raw`     .--""--.
    /  .--.  \
   /  /    \  \
   |  |    |  |
   \  \    /  /
    \  '--'  /
     '--..--'
       || ||`;

/**
 * Decorative divider made of fine-line characters. Useful for the
 * welcome screen and section breaks in command output.
 */
export const DIVIDER_LINE = '─'.repeat(52);

/**
 * Short, dashed divider matching the screenshot's `----` style.
 */
export const DASH_DIVIDER = '────';
