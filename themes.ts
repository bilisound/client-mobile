type Theme = {
  accentBackground: string;
  accentColor: string;
  background0: string;
  background025: string;
  background05: string;
  background075: string;
  color1: string;
  color2: string;
  color3: string;
  color4: string;
  color5: string;
  color6: string;
  color7: string;
  color8: string;
  color9: string;
  color10: string;
  color11: string;
  color12: string;
  color0: string;
  color025: string;
  color05: string;
  color075: string;
  background: string;
  backgroundHover: string;
  backgroundPress: string;
  backgroundFocus: string;
  borderColor: string;
  borderColorHover: string;
  borderColorPress: string;
  borderColorFocus: string;
  color: string;
  colorHover: string;
  colorPress: string;
  colorFocus: string;
  colorTransparent: string;
  placeholderColor: string;
  outlineColor: string;

}

function t(a: [number, number][]) {
  let res: Record<string,string> = {}
  for (const [ki, vi] of a) {
    res[ks[ki] as string] = vs[vi] as string
  }
  return res as Theme
}
const vs = [
  'hsla(171, 100%, 46%, 1)',
  'hsla(0, 20%, 99%, 0)',
  'hsla(0, 20%, 99%, 0.25)',
  'hsla(0, 20%, 99%, 0.5)',
  'hsla(0, 20%, 99%, 0.75)',
  'hsla(0, 15%, 99%, 1)',
  'hsla(0, 15%, 93%, 1)',
  'hsla(0, 15%, 88%, 1)',
  'hsla(0, 15%, 82%, 1)',
  'hsla(0, 15%, 77%, 1)',
  'hsla(0, 15%, 72%, 1)',
  'hsla(0, 15%, 66%, 1)',
  'hsla(0, 15%, 61%, 1)',
  'hsla(0, 15%, 55%, 1)',
  'hsla(0, 15%, 50%, 1)',
  'hsla(0, 15%, 15%, 1)',
  'hsla(0, 15%, 10%, 1)',
  'hsla(0, 14%, 10%, 0)',
  'hsla(0, 14%, 10%, 0.25)',
  'hsla(0, 14%, 10%, 0.5)',
  'hsla(0, 14%, 10%, 0.75)',
  'hsla(171, 100%, 57%, 1)',
  'hsla(0, 15%, 14%, 1)',
  'hsla(0, 15%, 19%, 1)',
  'hsla(0, 15%, 23%, 1)',
  'hsla(0, 15%, 28%, 1)',
  'hsla(0, 15%, 32%, 1)',
  'hsla(0, 15%, 37%, 1)',
  'hsla(0, 15%, 41%, 1)',
  'hsla(0, 15%, 46%, 1)',
  'hsla(0, 15%, 95%, 1)',
  'hsla(0, 15%, 95%, 0)',
  'hsla(0, 15%, 95%, 0.25)',
  'hsla(0, 15%, 95%, 0.5)',
  'hsla(0, 15%, 95%, 0.75)',
  'hsla(171, 100%, 36%, 0)',
  'hsla(171, 100%, 36%, 0.25)',
  'hsla(171, 100%, 36%, 0.5)',
  'hsla(171, 100%, 36%, 0.75)',
  'hsla(171, 100%, 36%, 1)',
  'hsla(171, 100%, 39%, 1)',
  'hsla(171, 100%, 43%, 1)',
  'hsla(171, 100%, 49%, 1)',
  'hsla(171, 100%, 52%, 1)',
  'hsla(171, 100%, 55%, 1)',
  'hsla(171, 100%, 59%, 1)',
  'hsla(171, 100%, 62%, 1)',
  'hsla(171, 100%, 65%, 1)',
  'hsla(171, 52%, 95%, 1)',
  'hsla(171, 52%, 95%, 0)',
  'hsla(171, 52%, 95%, 0.25)',
  'hsla(171, 52%, 95%, 0.5)',
  'hsla(171, 52%, 95%, 0.75)',
  'hsla(171, 100%, 35%, 0)',
  'hsla(171, 100%, 35%, 0.25)',
  'hsla(171, 100%, 35%, 0.5)',
  'hsla(171, 100%, 35%, 0.75)',
  'hsla(171, 100%, 35%, 1)',
  'hsla(171, 100%, 38%, 1)',
  'hsla(171, 100%, 41%, 1)',
  'hsla(171, 100%, 54%, 1)',
  'hsla(171, 100%, 60%, 1)',
  'hsla(171, 52%, 90%, 1)',
  'rgba(0,0,0,0.5)',
  'rgba(0,0,0,0.8)',
]

const ks = [
'accentBackground',
'accentColor',
'background0',
'background025',
'background05',
'background075',
'color1',
'color2',
'color3',
'color4',
'color5',
'color6',
'color7',
'color8',
'color9',
'color10',
'color11',
'color12',
'color0',
'color025',
'color05',
'color075',
'background',
'backgroundHover',
'backgroundPress',
'backgroundFocus',
'borderColor',
'borderColorHover',
'borderColorPress',
'borderColorFocus',
'color',
'colorHover',
'colorPress',
'colorFocus',
'colorTransparent',
'placeholderColor',
'outlineColor']


const n1 = t([[0, 0],[1, 0],[2, 1],[3, 2],[4, 3],[5, 4],[6, 5],[7, 6],[8, 7],[9, 8],[10, 9],[11, 10],[12, 11],[13, 12],[14, 13],[15, 14],[16, 15],[17, 16],[18, 17],[19, 18],[20, 19],[21, 20],[22, 5],[23, 4],[24, 6],[25, 6],[26, 8],[27, 7],[28, 9],[29, 8],[30, 16],[31, 15],[32, 16],[33, 15],[34, 17],[35, 13],[36, 18]])

export const light = n1
const n2 = t([[0, 21],[1, 21],[2, 17],[3, 18],[4, 19],[5, 20],[6, 16],[7, 22],[8, 23],[9, 24],[10, 25],[11, 26],[12, 27],[13, 28],[14, 29],[15, 14],[16, 6],[17, 30],[18, 31],[19, 32],[20, 33],[21, 34],[22, 16],[23, 22],[24, 20],[25, 20],[26, 24],[27, 25],[28, 23],[29, 24],[30, 30],[31, 6],[32, 30],[33, 6],[34, 31],[35, 29],[36, 32]])

export const dark = n2
const n3 = t([[0, 8],[1, 8],[2, 35],[3, 36],[4, 37],[5, 38],[6, 39],[7, 40],[8, 41],[9, 0],[10, 42],[11, 43],[12, 44],[13, 45],[14, 46],[15, 47],[16, 48],[17, 48],[18, 49],[19, 50],[20, 51],[21, 52],[22, 39],[23, 38],[24, 40],[25, 40],[26, 0],[27, 41],[28, 42],[29, 0],[30, 48],[31, 48],[32, 48],[33, 48],[34, 49],[35, 46],[36, 50]])

export const light_accent = n3
const n4 = t([[0, 29],[1, 29],[2, 53],[3, 54],[4, 55],[5, 56],[6, 57],[7, 58],[8, 59],[9, 41],[10, 0],[11, 42],[12, 43],[13, 60],[14, 21],[15, 61],[16, 62],[17, 48],[18, 49],[19, 50],[20, 51],[21, 52],[22, 57],[23, 58],[24, 56],[25, 56],[26, 41],[27, 0],[28, 59],[29, 41],[30, 48],[31, 62],[32, 48],[33, 62],[34, 49],[35, 21],[36, 50]])

export const dark_accent = n4
const n5 = t([[30, 15],[31, 14],[32, 15],[33, 14]])

export const light_alt1 = n5
const n6 = t([[30, 14],[31, 13],[32, 14],[33, 13]])

export const light_alt2 = n6
const n7 = t([[22, 8],[23, 7],[24, 9],[25, 9],[26, 11],[27, 10],[29, 11],[28, 12]])

export const light_active = n7
export const light_surface3 = n7
export const light_Button = n7
export const light_SliderTrackActive = n7
const n8 = t([[22, 6],[23, 5],[24, 7],[25, 7],[26, 9],[27, 8],[29, 9],[28, 10]])

export const light_surface1 = n8
export const light_ListItem = n8
export const light_SelectTrigger = n8
export const light_Card = n8
export const light_Progress = n8
export const light_TooltipArrow = n8
export const light_SliderTrack = n8
export const light_Input = n8
export const light_TextArea = n8
const n9 = t([[22, 7],[23, 6],[24, 8],[25, 8],[26, 10],[27, 9],[29, 10],[28, 11]])

export const light_surface2 = n9
export const light_Checkbox = n9
export const light_Switch = n9
export const light_TooltipContent = n9
export const light_RadioGroupItem = n9
const n10 = t([[22, 10],[23, 10],[24, 11],[25, 11],[26, 10],[27, 10],[29, 11],[28, 11]])

export const light_surface4 = n10
const n11 = t([[30, 6],[31, 14],[32, 6],[33, 14]])

export const dark_alt1 = n11
const n12 = t([[30, 14],[31, 29],[32, 14],[33, 29]])

export const dark_alt2 = n12
const n13 = t([[22, 24],[23, 25],[24, 23],[25, 23],[26, 27],[27, 28],[29, 27],[28, 26]])

export const dark_active = n13
export const dark_surface3 = n13
export const dark_Button = n13
export const dark_SliderTrackActive = n13
const n14 = t([[22, 22],[23, 23],[24, 16],[25, 16],[26, 25],[27, 26],[29, 25],[28, 24]])

export const dark_surface1 = n14
export const dark_ListItem = n14
export const dark_SelectTrigger = n14
export const dark_Card = n14
export const dark_Progress = n14
export const dark_TooltipArrow = n14
export const dark_SliderTrack = n14
export const dark_Input = n14
export const dark_TextArea = n14
const n15 = t([[22, 23],[23, 24],[24, 22],[25, 22],[26, 26],[27, 27],[29, 26],[28, 25]])

export const dark_surface2 = n15
export const dark_Checkbox = n15
export const dark_Switch = n15
export const dark_TooltipContent = n15
export const dark_RadioGroupItem = n15
const n16 = t([[22, 26],[23, 26],[24, 25],[25, 25],[26, 26],[27, 26],[29, 25],[28, 25]])

export const dark_surface4 = n16
const n17 = t([[30, 48],[31, 47],[32, 48],[33, 47]])

export const light_accent_alt1 = n17
const n18 = t([[30, 47],[31, 46],[32, 47],[33, 46]])

export const light_accent_alt2 = n18
const n19 = t([[22, 0],[23, 41],[24, 42],[25, 42],[26, 44],[27, 43],[29, 44],[28, 45]])

export const light_accent_active = n19
export const light_accent_surface3 = n19
export const light_accent_Button = n19
export const light_accent_SliderTrackActive = n19
const n20 = t([[22, 40],[23, 39],[24, 41],[25, 41],[26, 42],[27, 0],[29, 42],[28, 43]])

export const light_accent_surface1 = n20
export const light_accent_ListItem = n20
export const light_accent_SelectTrigger = n20
export const light_accent_Card = n20
export const light_accent_Progress = n20
export const light_accent_TooltipArrow = n20
export const light_accent_SliderTrack = n20
export const light_accent_Input = n20
export const light_accent_TextArea = n20
const n21 = t([[22, 41],[23, 40],[24, 0],[25, 0],[26, 43],[27, 42],[29, 43],[28, 44]])

export const light_accent_surface2 = n21
export const light_accent_Checkbox = n21
export const light_accent_Switch = n21
export const light_accent_TooltipContent = n21
export const light_accent_RadioGroupItem = n21
const n22 = t([[22, 43],[23, 43],[24, 44],[25, 44],[26, 43],[27, 43],[29, 44],[28, 44]])

export const light_accent_surface4 = n22
const n23 = t([[30, 62],[31, 61],[32, 62],[33, 61]])

export const dark_accent_alt1 = n23
const n24 = t([[30, 61],[31, 21],[32, 61],[33, 21]])

export const dark_accent_alt2 = n24
const n25 = t([[22, 41],[23, 0],[24, 59],[25, 59],[26, 43],[27, 60],[29, 43],[28, 42]])

export const dark_accent_active = n25
export const dark_accent_surface3 = n25
export const dark_accent_Button = n25
export const dark_accent_SliderTrackActive = n25
const n26 = t([[22, 58],[23, 59],[24, 57],[25, 57],[26, 0],[27, 42],[29, 0],[28, 41]])

export const dark_accent_surface1 = n26
export const dark_accent_ListItem = n26
export const dark_accent_SelectTrigger = n26
export const dark_accent_Card = n26
export const dark_accent_Progress = n26
export const dark_accent_TooltipArrow = n26
export const dark_accent_SliderTrack = n26
export const dark_accent_Input = n26
export const dark_accent_TextArea = n26
const n27 = t([[22, 59],[23, 41],[24, 58],[25, 58],[26, 42],[27, 43],[29, 42],[28, 0]])

export const dark_accent_surface2 = n27
export const dark_accent_Checkbox = n27
export const dark_accent_Switch = n27
export const dark_accent_TooltipContent = n27
export const dark_accent_RadioGroupItem = n27
const n28 = t([[22, 42],[23, 42],[24, 0],[25, 0],[26, 42],[27, 42],[29, 0],[28, 0]])

export const dark_accent_surface4 = n28
const n29 = t([[30, 6],[31, 5],[32, 7],[33, 7],[22, 16],[23, 15],[24, 16],[25, 15],[26, 14],[27, 13],[29, 12],[28, 11]])

export const light_SwitchThumb = n29
export const light_SliderThumb = n29
export const light_Tooltip = n29
export const light_ProgressIndicator = n29
const n30 = t([[22, 63]])

export const light_SheetOverlay = n30
export const light_DialogOverlay = n30
export const light_ModalOverlay = n30
export const light_accent_SheetOverlay = n30
export const light_accent_DialogOverlay = n30
export const light_accent_ModalOverlay = n30
const n31 = t([[30, 22],[31, 23],[32, 16],[33, 16],[22, 30],[23, 6],[24, 30],[25, 6],[26, 14],[27, 29],[29, 28],[28, 27]])

export const dark_SwitchThumb = n31
export const dark_SliderThumb = n31
export const dark_Tooltip = n31
export const dark_ProgressIndicator = n31
const n32 = t([[22, 64]])

export const dark_SheetOverlay = n32
export const dark_DialogOverlay = n32
export const dark_ModalOverlay = n32
export const dark_accent_SheetOverlay = n32
export const dark_accent_DialogOverlay = n32
export const dark_accent_ModalOverlay = n32
const n33 = t([[30, 40],[31, 39],[32, 41],[33, 41],[22, 48],[23, 48],[24, 48],[25, 48],[26, 47],[27, 46],[29, 45],[28, 44]])

export const light_accent_SwitchThumb = n33
export const light_accent_SliderThumb = n33
export const light_accent_Tooltip = n33
export const light_accent_ProgressIndicator = n33
const n34 = t([[30, 58],[31, 59],[32, 57],[33, 57],[22, 48],[23, 62],[24, 48],[25, 62],[26, 61],[27, 21],[29, 60],[28, 43]])

export const dark_accent_SwitchThumb = n34
export const dark_accent_SliderThumb = n34
export const dark_accent_Tooltip = n34
export const dark_accent_ProgressIndicator = n34