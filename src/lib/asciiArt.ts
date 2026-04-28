 

export { buildBanner as buildBlockBanner } from './asciiFonts';

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
