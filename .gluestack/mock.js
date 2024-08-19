const react = {
  forwardRef: () => {},
  createElement: () => {},
};
const reactNative = {
  Platform: {
    select: () => {},
  },
  StyleSheet: {
    create: () => {},
  },
  PixelRatio: {
    getFontScale: () => {},
  },
};
const gluestackStyleReact = {
  createConfig: (config) => {
    return config;
  },
  createStyle: (config) => {
    return config;
  },
  createComponents: (config) => {
    return config;
  },
  FontResolver: class {
    constructor(...args) {
      return args;
    }
  }
};
const expoHtmlElements = {
  A: () => {},
  H1: () => {},
  H2: () => {},
  H3: () => {},
  H4: () => {},
  H5: () => {},
  H6: () => {},
  Div: () => {},
  Img: () => {},
  Footer: () => {},
  Header: () => {},
  Aside: () => {},
  Main: () => {},
  Section: () => {},
  UL: () => {},
  LI: () => {},
  HR: () => {},
  Table: () => {},
  THead: () => {},
  TBody: () => {},
  TFoot: () => {},
  TH: () => {},
  TD: () => {},
  Caption: () => {},
  P: () => {},
  B: () => {},
  S: () => {},
  I: () => {},
  Q: () => {},
  Blockquote: () => {},
  BR: () => {},
  Mark: () => {},
  Code: () => {},
  Pre: () => {},
  Time: () => {},
  Strong: () => {},
  Del: () => {},
  EM: () => {},
  Span: () => {},
};
const gluestackStyleAnimationResolver = {
  AnimationResolver: class {
    constructor() {}
  },
};
const gluestackStyleLegendMotionAnimationDriver = {
};
const gluestackStyleMotiAnimationDriver = {
};

module.exports = {
  ...react,
  ...reactNative,
  ...gluestackStyleReact,
  ...gluestackStyleAnimationResolver,
  ...gluestackStyleLegendMotionAnimationDriver,
  ...gluestackStyleMotiAnimationDriver,
}
