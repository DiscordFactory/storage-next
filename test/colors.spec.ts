import test from 'ava'
import { Colors } from '../src'
import Blue from '../src/colors/Blue'
import Cyan from '../src/colors/Cyan'
import Fuchsia from '../src/colors/Fushia'
import Gray from '../src/colors/Gray'
import Green from '../src/colors/Green'
import LightBlue from '../src/colors/LightBlue'
import Lime from '../src/colors/Lime'
import Orange from '../src/colors/Orange'
import Pink from '../src/colors/Pink'
import Purple from '../src/colors/Purple'
import Red from '../src/colors/Red'
import Special from '../src/colors/Special'
import Yellow from '../src/colors/Yellow'

test('get blue color', (t) => {
  t.is(Colors.BLUE_100, Blue.BLUE_100)
  t.is(Colors.BLUE_200, Blue.BLUE_200)
  t.is(Colors.BLUE_300, Blue.BLUE_300)
  t.is(Colors.BLUE_400, Blue.BLUE_400)
  t.is(Colors.BLUE_500, Blue.BLUE_500)
  t.is(Colors.BLUE_600, Blue.BLUE_600)
  t.is(Colors.BLUE_700, Blue.BLUE_700)
  t.is(Colors.BLUE_800, Blue.BLUE_800)
  t.is(Colors.BLUE_900, Blue.BLUE_900)
})

test('get cyan color', (t) => {
  t.is(Colors.CYAN_100, Cyan.CYAN_100)
  t.is(Colors.CYAN_200, Cyan.CYAN_200)
  t.is(Colors.CYAN_300, Cyan.CYAN_300)
  t.is(Colors.CYAN_400, Cyan.CYAN_400)
  t.is(Colors.CYAN_500, Cyan.CYAN_500)
  t.is(Colors.CYAN_600, Cyan.CYAN_600)
  t.is(Colors.CYAN_700, Cyan.CYAN_700)
  t.is(Colors.CYAN_800, Cyan.CYAN_800)
  t.is(Colors.CYAN_900, Cyan.CYAN_900)
})

test('get fushia color', (t) => {
  t.is(Colors.FUCHSIA_100, Fuchsia.FUCHSIA_100)
  t.is(Colors.FUCHSIA_200, Fuchsia.FUCHSIA_200)
  t.is(Colors.FUCHSIA_300, Fuchsia.FUCHSIA_300)
  t.is(Colors.FUCHSIA_400, Fuchsia.FUCHSIA_400)
  t.is(Colors.FUCHSIA_500, Fuchsia.FUCHSIA_500)
  t.is(Colors.FUCHSIA_600, Fuchsia.FUCHSIA_600)
  t.is(Colors.FUCHSIA_700, Fuchsia.FUCHSIA_700)
  t.is(Colors.FUCHSIA_800, Fuchsia.FUCHSIA_800)
  t.is(Colors.FUCHSIA_900, Fuchsia.FUCHSIA_900)
})

test('get gray color', (t) => {
  t.is(Colors.GRAY_100, Gray.GRAY_100)
  t.is(Colors.GRAY_200, Gray.GRAY_200)
  t.is(Colors.GRAY_300, Gray.GRAY_300)
  t.is(Colors.GRAY_400, Gray.GRAY_400)
  t.is(Colors.GRAY_500, Gray.GRAY_500)
  t.is(Colors.GRAY_600, Gray.GRAY_600)
  t.is(Colors.GRAY_700, Gray.GRAY_700)
  t.is(Colors.GRAY_800, Gray.GRAY_800)
  t.is(Colors.GRAY_900, Gray.GRAY_900)
})

test('get green color', (t) => {
  t.is(Colors.GREEN_100, Green.GREEN_100)
  t.is(Colors.GREEN_200, Green.GREEN_200)
  t.is(Colors.GREEN_300, Green.GREEN_300)
  t.is(Colors.GREEN_400, Green.GREEN_400)
  t.is(Colors.GREEN_500, Green.GREEN_500)
  t.is(Colors.GREEN_600, Green.GREEN_600)
  t.is(Colors.GREEN_700, Green.GREEN_700)
  t.is(Colors.GREEN_800, Green.GREEN_800)
  t.is(Colors.GREEN_900, Green.GREEN_900)
})

test('get light blue color', (t) => {
  t.is(Colors.LIGHT_BLUE_100, LightBlue.LIGHT_BLUE_100)
  t.is(Colors.LIGHT_BLUE_200, LightBlue.LIGHT_BLUE_200)
  t.is(Colors.LIGHT_BLUE_300, LightBlue.LIGHT_BLUE_300)
  t.is(Colors.LIGHT_BLUE_400, LightBlue.LIGHT_BLUE_400)
  t.is(Colors.LIGHT_BLUE_500, LightBlue.LIGHT_BLUE_500)
  t.is(Colors.LIGHT_BLUE_600, LightBlue.LIGHT_BLUE_600)
  t.is(Colors.LIGHT_BLUE_700, LightBlue.LIGHT_BLUE_700)
  t.is(Colors.LIGHT_BLUE_800, LightBlue.LIGHT_BLUE_800)
  t.is(Colors.LIGHT_BLUE_900, LightBlue.LIGHT_BLUE_900)
})

test('get lime color', (t) => {
  t.is(Colors.LIME_100, Lime.LIME_100)
  t.is(Colors.LIME_200, Lime.LIME_200)
  t.is(Colors.LIME_300, Lime.LIME_300)
  t.is(Colors.LIME_400, Lime.LIME_400)
  t.is(Colors.LIME_500, Lime.LIME_500)
  t.is(Colors.LIME_600, Lime.LIME_600)
  t.is(Colors.LIME_700, Lime.LIME_700)
  t.is(Colors.LIME_800, Lime.LIME_800)
  t.is(Colors.LIME_900, Lime.LIME_900)
})

test('get orange color', (t) => {
  t.is(Colors.ORANGE_100, Orange.ORANGE_100)
  t.is(Colors.ORANGE_200, Orange.ORANGE_200)
  t.is(Colors.ORANGE_300, Orange.ORANGE_300)
  t.is(Colors.ORANGE_400, Orange.ORANGE_400)
  t.is(Colors.ORANGE_500, Orange.ORANGE_500)
  t.is(Colors.ORANGE_600, Orange.ORANGE_600)
  t.is(Colors.ORANGE_700, Orange.ORANGE_700)
  t.is(Colors.ORANGE_800, Orange.ORANGE_800)
  t.is(Colors.ORANGE_900, Orange.ORANGE_900)
})

test('get pink color', (t) => {
  t.is(Colors.PINK_100, Pink.PINK_100)
  t.is(Colors.PINK_200, Pink.PINK_200)
  t.is(Colors.PINK_300, Pink.PINK_300)
  t.is(Colors.PINK_400, Pink.PINK_400)
  t.is(Colors.PINK_500, Pink.PINK_500)
  t.is(Colors.PINK_600, Pink.PINK_600)
  t.is(Colors.PINK_700, Pink.PINK_700)
  t.is(Colors.PINK_800, Pink.PINK_800)
  t.is(Colors.PINK_900, Pink.PINK_900)
})

test('get purple color', (t) => {
  t.is(Colors.PURPLE_100, Purple.PURPLE_100)
  t.is(Colors.PURPLE_200, Purple.PURPLE_200)
  t.is(Colors.PURPLE_300, Purple.PURPLE_300)
  t.is(Colors.PURPLE_400, Purple.PURPLE_400)
  t.is(Colors.PURPLE_500, Purple.PURPLE_500)
  t.is(Colors.PURPLE_600, Purple.PURPLE_600)
  t.is(Colors.PURPLE_700, Purple.PURPLE_700)
  t.is(Colors.PURPLE_800, Purple.PURPLE_800)
  t.is(Colors.PURPLE_900, Purple.PURPLE_900)
})

test('get red color', (t) => {
  t.is(Colors.RED_100, Red.RED_100)
  t.is(Colors.RED_200, Red.RED_200)
  t.is(Colors.RED_300, Red.RED_300)
  t.is(Colors.RED_400, Red.RED_400)
  t.is(Colors.RED_500, Red.RED_500)
  t.is(Colors.RED_600, Red.RED_600)
  t.is(Colors.RED_700, Red.RED_700)
  t.is(Colors.RED_800, Red.RED_800)
  t.is(Colors.RED_900, Red.RED_900)
})

test('get yellow color', (t) => {
  t.is(Colors.YELLOW_100, Yellow.YELLOW_100)
  t.is(Colors.YELLOW_200, Yellow.YELLOW_200)
  t.is(Colors.YELLOW_300, Yellow.YELLOW_300)
  t.is(Colors.YELLOW_400, Yellow.YELLOW_400)
  t.is(Colors.YELLOW_500, Yellow.YELLOW_500)
  t.is(Colors.YELLOW_600, Yellow.YELLOW_600)
  t.is(Colors.YELLOW_700, Yellow.YELLOW_700)
  t.is(Colors.YELLOW_800, Yellow.YELLOW_800)
  t.is(Colors.YELLOW_900, Yellow.YELLOW_900)
})

test('get special color', (t) => {
  t.is(Colors.INVISIBLE, Special.INVISIBLE)
})