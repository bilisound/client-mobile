"use strict";
var config = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // config/gluestack-ui.config.ts
  var gluestack_ui_config_exports = {};
  __export(gluestack_ui_config_exports, {
    componentsConfig: () => componentsConfig,
    config: () => config,
    gluestackUIConfig: () => gluestackUIConfig
  });
  var import_animation_resolver = __require("./mock.js");
  var import_legend_motion_animation_driver = __require("./mock.js");
  var import_react143 = __require("./mock.js");

  // config/theme/index.ts
  var theme_exports = {};
  __export(theme_exports, {
    Actionsheet: () => Actionsheet,
    ActionsheetBackdrop: () => ActionsheetBackdrop,
    ActionsheetContent: () => ActionsheetContent,
    ActionsheetDragIndicator: () => ActionsheetDragIndicator,
    ActionsheetFlatList: () => ActionsheetFlatList,
    ActionsheetIcon: () => ActionsheetIcon,
    ActionsheetIndicatorWrapper: () => ActionsheetIndicatorWrapper,
    ActionsheetItem: () => ActionsheetItem,
    ActionsheetItemText: () => ActionsheetItemText,
    ActionsheetScrollView: () => ActionsheetScrollView,
    ActionsheetSectionHeaderText: () => ActionsheetSectionHeaderText,
    ActionsheetSectionList: () => ActionsheetSectionList,
    ActionsheetVirtualizedList: () => ActionsheetVirtualizedList,
    Alert: () => Alert,
    AlertDialog: () => AlertDialog,
    AlertDialogBackdrop: () => AlertDialogBackdrop,
    AlertDialogBody: () => AlertDialogBody,
    AlertDialogCloseButton: () => AlertDialogCloseButton,
    AlertDialogContent: () => AlertDialogContent,
    AlertDialogFooter: () => AlertDialogFooter,
    AlertDialogHeader: () => AlertDialogHeader,
    AlertIcon: () => AlertIcon,
    AlertText: () => AlertText,
    Avatar: () => Avatar,
    AvatarBadge: () => AvatarBadge,
    AvatarFallbackText: () => AvatarFallbackText,
    AvatarGroup: () => AvatarGroup,
    AvatarImage: () => AvatarImage,
    Badge: () => Badge,
    BadgeIcon: () => BadgeIcon,
    BadgeText: () => BadgeText,
    BaseIcon: () => BaseIcon,
    Box: () => Box,
    Button: () => Button,
    ButtonGroup: () => ButtonGroup,
    ButtonGroupHSpacer: () => ButtonGroupHSpacer,
    ButtonGroupVSpacer: () => ButtonGroupVSpacer,
    ButtonIcon: () => ButtonIcon,
    ButtonSpinner: () => ButtonSpinner,
    ButtonText: () => ButtonText,
    Center: () => Center,
    Checkbox: () => Checkbox,
    CheckboxGroup: () => CheckboxGroup,
    CheckboxIcon: () => CheckboxIcon,
    CheckboxIndicator: () => CheckboxIndicator,
    CheckboxLabel: () => CheckboxLabel,
    Divider: () => Divider,
    Fab: () => Fab,
    FabIcon: () => FabIcon,
    FabLabel: () => FabLabel,
    FlatList: () => FlatList,
    FormControl: () => FormControl,
    FormControlError: () => FormControlError,
    FormControlErrorIcon: () => FormControlErrorIcon,
    FormControlErrorText: () => FormControlErrorText,
    FormControlHelper: () => FormControlHelper,
    FormControlHelperText: () => FormControlHelperText,
    FormControlLabel: () => FormControlLabel,
    FormControlLabelText: () => FormControlLabelText,
    HStack: () => HStack,
    Heading: () => Heading,
    Icon: () => Icon,
    Image: () => Image,
    Input: () => Input,
    InputField: () => InputField,
    InputIcon: () => InputIcon,
    InputSlot: () => InputSlot,
    KeyboardAvoidingView: () => KeyboardAvoidingView,
    Link: () => Link,
    LinkText: () => LinkText,
    Menu: () => Menu,
    MenuBackdrop: () => MenuBackdrop,
    MenuItem: () => MenuItem,
    MenuLabel: () => MenuLabel,
    Modal: () => Modal,
    ModalBackdrop: () => ModalBackdrop,
    ModalBody: () => ModalBody,
    ModalCloseButton: () => ModalCloseButton,
    ModalContent: () => ModalContent,
    ModalFooter: () => ModalFooter,
    ModalHeader: () => ModalHeader,
    Popover: () => Popover,
    PopoverArrow: () => PopoverArrow,
    PopoverBackdrop: () => PopoverBackdrop,
    PopoverBody: () => PopoverBody,
    PopoverCloseButton: () => PopoverCloseButton,
    PopoverContent: () => PopoverContent,
    PopoverFooter: () => PopoverFooter,
    PopoverHeader: () => PopoverHeader,
    Pressable: () => Pressable,
    Progress: () => Progress,
    ProgressFilledTrack: () => ProgressFilledTrack,
    Radio: () => Radio,
    RadioGroup: () => RadioGroup,
    RadioIcon: () => RadioIcon,
    RadioIndicator: () => RadioIndicator,
    RadioLabel: () => RadioLabel,
    ScrollView: () => ScrollView,
    SectionList: () => SectionList,
    Select: () => Select,
    SelectActionsheet: () => SelectActionsheet,
    SelectActionsheetBackdrop: () => SelectActionsheetBackdrop,
    SelectActionsheetContent: () => SelectActionsheetContent,
    SelectActionsheetDragIndicator: () => SelectActionsheetDragIndicator,
    SelectActionsheetFlatList: () => SelectActionsheetFlatList,
    SelectActionsheetIcon: () => SelectActionsheetIcon,
    SelectActionsheetIndicatorWrapper: () => SelectActionsheetIndicatorWrapper,
    SelectActionsheetItem: () => SelectActionsheetItem,
    SelectActionsheetItemText: () => SelectActionsheetItemText,
    SelectActionsheetScrollView: () => SelectActionsheetScrollView,
    SelectActionsheetSectionHeaderText: () => SelectActionsheetSectionHeaderText,
    SelectActionsheetSectionList: () => SelectActionsheetSectionList,
    SelectActionsheetVirtualizedList: () => SelectActionsheetVirtualizedList,
    SelectIcon: () => SelectIcon,
    SelectInput: () => SelectInput,
    SelectTrigger: () => SelectTrigger,
    Slider: () => Slider,
    SliderFilledTrack: () => SliderFilledTrack,
    SliderThumb: () => SliderThumb,
    SliderThumbInteraction: () => SliderThumbInteraction,
    SliderTrack: () => SliderTrack,
    Spinner: () => Spinner,
    StatusBar: () => StatusBar,
    Switch: () => Switch,
    Tabs: () => Tabs,
    TabsTab: () => TabsTab,
    TabsTabIcon: () => TabsTabIcon,
    TabsTabList: () => TabsTabList,
    TabsTabPanel: () => TabsTabPanel,
    TabsTabPanels: () => TabsTabPanels,
    TabsTabTitle: () => TabsTabTitle,
    Text: () => Text,
    Textarea: () => Textarea,
    TextareaInput: () => TextareaInput,
    Toast: () => Toast,
    ToastAnimationWrapper: () => ToastAnimationWrapper,
    ToastDescription: () => ToastDescription,
    ToastTitle: () => ToastTitle,
    Tooltip: () => Tooltip,
    TooltipContent: () => TooltipContent,
    TooltipText: () => TooltipText,
    VStack: () => VStack,
    View: () => View
  });

  // config/theme/Actionsheet.ts
  var import_react = __require("./mock.js");
  var Actionsheet = (0, import_react.createStyle)({
    width: "$full",
    height: "$full"
  });

  // config/theme/ActionsheetBackdrop.ts
  var import_react2 = __require("./mock.js");
  var ActionsheetBackdrop = (0, import_react2.createStyle)({
    ":initial": {
      opacity: 0
    },
    ":animate": {
      opacity: 0.6
    },
    ":exit": {
      opacity: 0
    },
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    bg: "black",
    // @ts-ignore
    _dark: {
      bg: "black"
    },
    // @ts-ignore
    _web: {
      cursor: "default"
    }
  });

  // config/theme/ActionsheetContent.ts
  var import_react3 = __require("./mock.js");
  var ActionsheetContent = (0, import_react3.createStyle)({
    alignItems: "center",
    borderTopLeftRadius: "$3xl",
    borderTopRightRadius: "$3xl",
    h: "$full",
    p: "$2",
    bg: "$backgroundLight0",
    _sectionHeaderBackground: {
      bg: "$backgroundLight0"
    },
    _dark: {
      bg: "$backgroundDark900",
      _sectionHeaderBackground: {
        bg: "$backgroundDark900"
      }
    },
    userSelect: "none",
    defaultProps: {
      hardShadow: "5"
    }
  });

  // config/theme/ActionsheetDragIndicator.ts
  var import_react4 = __require("./mock.js");
  var ActionsheetDragIndicator = (0, import_react4.createStyle)({
    height: "$1",
    width: "$16",
    bg: "$backgroundLight400",
    rounded: "$full",
    _dark: {
      bg: "$backgroundDark500"
    }
  });

  // config/theme/ActionsheetFlatList.ts
  var import_react5 = __require("./mock.js");
  var ActionsheetFlatList = (0, import_react5.createStyle)({
    w: "$full",
    h: "auto"
  });

  // config/theme/ActionsheetIcon.ts
  var import_react6 = __require("./mock.js");
  var ActionsheetIcon = (0, import_react6.createStyle)({
    props: {
      size: "sm"
    },
    color: "$backgroundLight500",
    _dark: {
      // @ts-ignore
      color: "$backgroundDark400"
    }
  });

  // config/theme/ActionsheetIndicatorWrapper.ts
  var import_react7 = __require("./mock.js");
  var ActionsheetIndicatorWrapper = (0, import_react7.createStyle)({
    py: "$1",
    w: "$full",
    alignItems: "center"
  });

  // config/theme/ActionsheetItem.ts
  var import_react8 = __require("./mock.js");
  var ActionsheetItem = (0, import_react8.createStyle)({
    p: "$3",
    flexDirection: "row",
    alignItems: "center",
    rounded: "$sm",
    w: "$full",
    ":disabled": {
      opacity: 0.4,
      _web: {
        // @ts-ignore
        pointerEvents: "all !important",
        cursor: "not-allowed"
      }
    },
    ":hover": {
      bg: "$backgroundLight50"
    },
    ":active": {
      bg: "$backgroundLight100"
    },
    ":focus": {
      bg: "$backgroundLight100"
    },
    _dark: {
      ":hover": {
        bg: "$backgroundDark800"
      },
      ":active": {
        bg: "$backgroundDark700"
      },
      ":focus": {
        bg: "$backgroundDark700"
      }
    },
    _web: {
      ":focusVisible": {
        bg: "$backgroundLight100",
        _dark: {
          bg: "$backgroundDark700"
        }
      }
    }
  });

  // config/theme/ActionsheetItemText.ts
  var import_react9 = __require("./mock.js");
  var ActionsheetItemText = (0, import_react9.createStyle)({
    mx: "$2",
    props: {
      size: "md"
    },
    color: "$textLight800",
    _dark: {
      color: "$textDark100"
    }
  });

  // config/theme/ActionsheetScrollView.ts
  var import_react10 = __require("./mock.js");
  var ActionsheetScrollView = (0, import_react10.createStyle)({
    w: "$full",
    h: "auto"
  });

  // config/theme/ActionsheetSectionHeaderText.ts
  var import_react11 = __require("./mock.js");
  var ActionsheetSectionHeaderText = (0, import_react11.createStyle)({
    color: "$textLight500",
    props: { size: "xs" },
    textTransform: "uppercase",
    p: "$3",
    _dark: {
      color: "$textDark400"
    }
  });

  // config/theme/ActionsheetSectionList.ts
  var import_react12 = __require("./mock.js");
  var ActionsheetSectionList = (0, import_react12.createStyle)({
    w: "$full",
    h: "auto"
  });

  // config/theme/ActionsheetVirtualizedList.ts
  var import_react13 = __require("./mock.js");
  var ActionsheetVirtualizedList = (0, import_react13.createStyle)({
    w: "$full",
    h: "auto"
  });

  // config/theme/Alert.ts
  var import_react14 = __require("./mock.js");
  var Alert = (0, import_react14.createStyle)({
    alignItems: "center",
    p: "$3",
    flexDirection: "row",
    borderRadius: "$sm",
    variants: {
      action: {
        error: {
          bg: "$backgroundLightError",
          borderColor: "$error300",
          _icon: {
            color: "$error500"
          },
          _dark: {
            bg: "$backgroundDarkError",
            borderColor: "$error700",
            _icon: {
              color: "$error500"
            }
          }
        },
        warning: {
          bg: "$backgroundLightWarning",
          borderColor: "$warning300",
          _icon: {
            color: "$warning500"
          },
          _dark: {
            bg: "$backgroundDarkWarning",
            borderColor: "$warning700",
            _icon: {
              color: "$warning500"
            }
          }
        },
        success: {
          bg: "$backgroundLightSuccess",
          borderColor: "$success300",
          _icon: {
            color: "$success500"
          },
          _dark: {
            bg: "$backgroundDarkSuccess",
            borderColor: "$success700",
            _icon: {
              color: "$success500"
            }
          }
        },
        info: {
          bg: "$backgroundLightInfo",
          borderColor: "$info300",
          _icon: {
            color: "$info500"
          },
          _dark: {
            bg: "$backgroundDarkInfo",
            borderColor: "$info700",
            _icon: {
              color: "$info500"
            }
          }
        },
        muted: {
          bg: "$backgroundLightMuted",
          borderColor: "$secondary300",
          _icon: {
            color: "$secondary500"
          },
          _dark: {
            bg: "$backgroundDarkMuted",
            borderColor: "$secondary700",
            _icon: {
              color: "$secondary500"
            }
          }
        }
      },
      variant: {
        solid: {},
        outline: {
          borderWidth: "$1",
          bg: "$white",
          _dark: {
            bg: "$black"
          }
        },
        accent: {
          borderLeftWidth: "$4"
        }
      }
    },
    defaultProps: {
      variant: "solid",
      action: "info"
    }
  });

  // config/theme/AlertDialog.ts
  var import_react15 = __require("./mock.js");
  var AlertDialog = (0, import_react15.createStyle)({
    w: "$full",
    h: "$full",
    justifyContent: "center",
    alignItems: "center",
    variants: {
      size: {
        xs: { _content: { w: "60%", maxWidth: 360 } },
        sm: { _content: { w: "70%", maxWidth: 420 } },
        md: { _content: { w: "80%", maxWidth: 510 } },
        lg: { _content: { w: "90%", maxWidth: 640 } },
        full: { _content: { w: "$full" } }
      }
    },
    defaultProps: { size: "md" },
    _web: {
      pointerEvents: "box-none"
    }
  });

  // config/theme/AlertDialogBackdrop.ts
  var import_react16 = __require("./mock.js");
  var AlertDialogBackdrop = (0, import_react16.createStyle)({
    ":initial": {
      opacity: 0
    },
    ":animate": {
      opacity: 0.5
    },
    ":exit": {
      opacity: 0
    },
    ":transition": {
      type: "spring",
      damping: 18,
      stiffness: 250,
      opacity: {
        type: "timing",
        duration: 250
      }
    },
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    bg: "$backgroundLight950",
    // @ts-ignore
    _dark: {
      bg: "$backgroundDark950"
    },
    // @ts-ignore
    _web: {
      cursor: "default"
    }
  });

  // config/theme/AlertDialogBody.ts
  var import_react17 = __require("./mock.js");
  var AlertDialogBody = (0, import_react17.createStyle)({
    px: "$4",
    py: "$2"
  });

  // config/theme/AlertDialogCloseButton.ts
  var import_react18 = __require("./mock.js");
  var AlertDialogCloseButton = (0, import_react18.createStyle)({
    zIndex: 1,
    rounded: "$sm",
    p: "$2",
    _icon: {
      color: "$backgroundLight400"
    },
    _text: {
      color: "$backgroundLight400"
    },
    ":hover": {
      _icon: {
        color: "$backgroundLight700"
      },
      _text: {
        color: "$backgroundLight700"
      }
    },
    ":active": {
      _icon: {
        color: "$backgroundLight900"
      },
      _text: {
        color: "$backgroundLight900"
      }
    },
    _dark: {
      _icon: {
        color: "$backgroundLight400"
      },
      _text: {
        color: "$backgroundLight400"
      },
      ":hover": {
        _icon: {
          color: "$backgroundDark200"
        },
        _text: {
          color: "$backgroundLight200"
        }
      },
      ":active": {
        _icon: {
          color: "$backgroundDark100"
        }
      }
    },
    ":focusVisible": {
      bg: "$backgroundLight100",
      _icon: {
        color: "$backgroundLight900"
      },
      _text: {
        color: "$backgroundLight900"
      },
      _dark: {
        bg: "$backgroundDark700",
        _icon: {
          color: "$backgroundLight100"
        },
        _text: {
          color: "$backgroundLight100"
        }
      }
    },
    _web: {
      outlineWidth: 0,
      cursor: "pointer"
    }
  });

  // config/theme/AlertDialogContent.ts
  var import_react19 = __require("./mock.js");
  var AlertDialogContent = (0, import_react19.createStyle)({
    bg: "$backgroundLight50",
    rounded: "$lg",
    overflow: "hidden",
    // @ts-ignore
    ":initial": {
      scale: 0.9,
      opacity: 0
    },
    ":animate": {
      scale: 1,
      opacity: 1
    },
    ":exit": {
      scale: 0.9,
      opacity: 0
    },
    ":transition": {
      type: "spring",
      damping: 18,
      stiffness: 250,
      opacity: {
        type: "timing",
        duration: 250
      }
    },
    // @ts-ignore
    _dark: {
      bg: "$backgroundDark900"
    },
    defaultProps: {
      softShadow: "3"
    }
  });

  // config/theme/AlertDialogFooter.ts
  var import_react20 = __require("./mock.js");
  var AlertDialogFooter = (0, import_react20.createStyle)({
    p: "$4",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    flexWrap: "wrap",
    borderColor: "$borderLight300",
    _dark: {
      borderColor: "$borderDark700"
    }
  });

  // config/theme/AlertDialogHeader.ts
  var import_react21 = __require("./mock.js");
  var AlertDialogHeader = (0, import_react21.createStyle)({
    p: "$4",
    borderColor: "$borderLight300",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    _dark: {
      borderColor: "$borderDark700"
    }
  });

  // config/theme/AlertIcon.ts
  var import_react22 = __require("./mock.js");
  var AlertIcon = (0, import_react22.createStyle)({
    props: {
      size: "md"
    }
  });

  // config/theme/AlertText.ts
  var import_react23 = __require("./mock.js");
  var AlertText = (0, import_react23.createStyle)({
    flex: 1
  });

  // config/theme/Avatar.ts
  var import_react24 = __require("./mock.js");
  var Avatar = (0, import_react24.createStyle)({
    borderRadius: "$full",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    bg: "$primary600",
    variants: {
      size: {
        xs: {
          w: "$6",
          h: "$6",
          _badge: {
            w: "$2",
            h: "$2"
          },
          _text: {
            props: { size: "2xs" }
          }
        },
        sm: {
          w: "$8",
          h: "$8",
          _badge: {
            w: "$2",
            h: "$2"
          },
          _text: {
            props: { size: "xs" }
          }
        },
        md: {
          w: "$12",
          h: "$12",
          _badge: {
            w: "$3",
            h: "$3"
          },
          _text: {
            props: { size: "md" }
          }
        },
        lg: {
          w: "$16",
          h: "$16",
          _badge: {
            w: "$4",
            h: "$4"
          },
          _text: {
            props: { size: "xl" }
          }
        },
        xl: {
          w: "$24",
          h: "$24",
          _badge: {
            w: "$6",
            h: "$6"
          },
          _text: {
            props: { size: "3xl" }
          }
        },
        "2xl": {
          w: "$32",
          h: "$32",
          _badge: {
            w: "$8",
            h: "$8"
          },
          _text: {
            props: { size: "5xl" }
          }
        }
      }
    },
    defaultProps: {
      size: "md"
    }
  });

  // config/theme/AvatarBadge.ts
  var import_react25 = __require("./mock.js");
  var AvatarBadge = (0, import_react25.createStyle)({
    w: "$5",
    h: "$5",
    bg: "$success500",
    borderRadius: "$full",
    position: "absolute",
    right: 0,
    bottom: 0,
    borderColor: "white",
    borderWidth: 2
  });

  // config/theme/AvatarFallbackText.ts
  var import_react26 = __require("./mock.js");
  var AvatarFallbackText = (0, import_react26.createStyle)({
    color: "$textLight0",
    fontWeight: "$semibold",
    props: {
      size: "xl"
    },
    overflow: "hidden",
    textTransform: "uppercase",
    _web: {
      cursor: "default"
    }
  });

  // config/theme/AvatarGroup.ts
  var import_react27 = __require("./mock.js");
  var AvatarGroup = (0, import_react27.createStyle)({
    flexDirection: "row-reverse",
    position: "relative",
    _avatar: {
      ml: -10
    }
  });

  // config/theme/AvatarImage.ts
  var import_react28 = __require("./mock.js");
  var AvatarImage = (0, import_react28.createStyle)({
    w: "$full",
    h: "$full",
    borderRadius: "$full",
    position: "absolute"
  });

  // config/theme/Badge.ts
  var import_react29 = __require("./mock.js");
  var Badge = (0, import_react29.createStyle)({
    flexDirection: "row",
    alignItems: "center",
    borderRadius: "$xs",
    variants: {
      action: {
        error: {
          bg: "$backgroundLightError",
          borderColor: "$error300",
          _icon: {
            color: "$error600"
          },
          _text: {
            color: "$error600"
          },
          _dark: {
            bg: "$backgroundDarkError",
            borderColor: "$error700",
            _text: {
              color: "$error400"
            },
            _icon: {
              color: "$error400"
            }
          }
        },
        warning: {
          bg: "$backgroundLightWarning",
          borderColor: "$warning300",
          _icon: {
            color: "$warning600"
          },
          _text: {
            color: "$warning600"
          },
          _dark: {
            bg: "$backgroundDarkWarning",
            borderColor: "$warning700",
            _text: {
              color: "$warning400"
            },
            _icon: {
              color: "$warning400"
            }
          }
        },
        success: {
          bg: "$backgroundLightSuccess",
          borderColor: "$success300",
          _icon: {
            color: "$success600"
          },
          _text: {
            color: "$success600"
          },
          _dark: {
            bg: "$backgroundDarkSuccess",
            borderColor: "$success700",
            _text: {
              color: "$success400"
            },
            _icon: {
              color: "$success400"
            }
          }
        },
        info: {
          bg: "$backgroundLightInfo",
          borderColor: "$info300",
          _icon: {
            color: "$info600"
          },
          _text: {
            color: "$info600"
          },
          _dark: {
            bg: "$backgroundDarkInfo",
            borderColor: "$info700",
            _text: {
              color: "$info400"
            },
            _icon: {
              color: "$info400"
            }
          }
        },
        muted: {
          bg: "$backgroundLightMuted",
          borderColor: "$secondary300",
          _icon: {
            color: "$secondary600"
          },
          _text: {
            color: "$secondary600"
          },
          _dark: {
            bg: "$backgroundDarkMuted",
            borderColor: "$secondary700",
            _text: {
              color: "$secondary400"
            },
            _icon: {
              color: "$secondary400"
            }
          }
        }
      },
      variant: {
        solid: {},
        outline: {
          borderWidth: "$1"
        }
      },
      size: {
        sm: {
          px: "$2",
          _icon: {
            props: {
              size: "2xs"
            }
          },
          _text: {
            props: {
              size: "2xs"
            }
          }
        },
        md: {
          px: "$2",
          _icon: {
            props: {
              size: "xs"
            }
          },
          _text: {
            props: {
              size: "xs"
            }
          }
        },
        lg: {
          px: "$2",
          _icon: {
            props: { size: "sm" }
          },
          _text: {
            props: { size: "sm" }
          }
        }
      }
    },
    ":disabled": {
      opacity: 0.5
    },
    defaultProps: {
      action: "info",
      variant: "solid",
      size: "md"
    }
  });

  // config/theme/BadgeIcon.ts
  var import_react30 = __require("./mock.js");
  var BadgeIcon = (0, import_react30.createStyle)({
    props: {
      size: "md"
    }
  });

  // config/theme/BadgeText.ts
  var import_react31 = __require("./mock.js");
  var BadgeText = (0, import_react31.createStyle)({
    textTransform: "uppercase"
  });

  // config/theme/Box.ts
  var import_react32 = __require("./mock.js");
  var Box = (0, import_react32.createStyle)({});

  // config/theme/Button.ts
  var import_react33 = __require("./mock.js");
  var Button = (0, import_react33.createStyle)({
    borderRadius: "$sm",
    backgroundColor: "$primary500",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    _text: {
      color: "$textLight0",
      fontWeight: "$semibold",
      _dark: {
        color: "$textDark0"
      }
    },
    _icon: {
      color: "$textLight0",
      _dark: {
        color: "$textDark0"
      }
    },
    _spinner: {
      props: {
        color: "$backgroundLight0"
      },
      _dark: {
        props: {
          color: "$backgroundDark0"
        }
      }
    },
    variants: {
      action: {
        primary: {
          bg: "$primary500",
          borderColor: "$primary300",
          ":hover": {
            bg: "$primary600",
            borderColor: "$primary400"
          },
          ":active": {
            bg: "$primary700",
            borderColor: "$primary700"
          },
          _text: {
            color: "$primary600",
            ":hover": {
              color: "$primary600"
            },
            ":active": {
              color: "$primary700"
            }
          },
          _icon: {
            color: "$primary600",
            ":hover": {
              color: "$primary600"
            },
            ":active": {
              color: "$primary700"
            }
          },
          _spinner: {
            props: {
              color: "$primary600"
            },
            ":hover": {
              props: {
                color: "$primary600"
              }
            },
            ":active": {
              props: {
                color: "$primary700"
              }
            }
          },
          _dark: {
            bg: "$primary400",
            borderColor: "$primary700",
            ":hover": {
              bg: "$primary500",
              borderColor: "$primary400"
            },
            ":active": {
              bg: "$primary600",
              borderColor: "$primary300"
            },
            _text: {
              color: "$primary300",
              ":hover": {
                color: "$primary300"
              },
              ":active": {
                color: "$primary200"
              }
            },
            _icon: {
              color: "$primary300",
              ":hover": {
                color: "$primary300"
              },
              ":active": {
                color: "$primary200"
              }
            },
            _spinner: {
              props: { color: "$primary300" },
              ":hover": {
                props: { color: "$primary300" }
              },
              ":active": {
                props: { color: "$primary200" }
              }
            },
            ":focusVisible": {
              _web: {
                boxShadow: "offset 0 0 0 2px $info400"
              }
            }
          }
        },
        secondary: {
          bg: "$secondary500",
          borderColor: "$secondary300",
          ":hover": {
            bg: "$secondary600",
            borderColor: "$secondary400"
          },
          ":active": {
            bg: "$secondary700",
            borderColor: "$secondary700"
          },
          _text: {
            color: "$secondary600",
            ":hover": {
              color: "$secondary600"
            },
            ":active": {
              color: "$secondary700"
            }
          },
          _icon: {
            color: "$secondary600",
            ":hover": {
              color: "$secondary600"
            },
            ":active": {
              color: "$secondary700"
            }
          },
          _spinner: {
            props: {
              color: "$secondary600"
            },
            ":hover": {
              props: { color: "$secondary600" }
            },
            ":active": {
              props: { color: "$secondary700" }
            }
          },
          _dark: {
            bg: "$secondary400",
            borderColor: "$secondary700",
            ":hover": {
              bg: "$secondary500",
              borderColor: "$secondary400"
            },
            ":active": {
              bg: "$secondary600",
              borderColor: "$secondary300"
            },
            _text: {
              color: "$secondary300",
              ":hover": {
                color: "$secondary300"
              },
              ":active": {
                color: "$secondary200"
              }
            },
            _icon: {
              color: "$secondary300",
              ":hover": {
                color: "$secondary300"
              },
              ":active": {
                color: "$secondary200"
              }
            },
            _spinner: {
              props: {
                color: "$secondary300"
              },
              ":hover": {
                props: { color: "$secondary300" }
              },
              ":active": {
                props: { color: "$secondary200" }
              }
            }
          }
        },
        positive: {
          bg: "$success500",
          borderColor: "$success300",
          ":hover": {
            bg: "$success600",
            borderColor: "$success400"
          },
          ":active": {
            bg: "$success700",
            borderColor: "$success700"
          },
          _text: {
            color: "$success600",
            ":hover": {
              color: "$success600"
            },
            ":active": {
              color: "$success700"
            }
          },
          _icon: {
            color: "$success600",
            ":hover": {
              color: "$success600"
            },
            ":active": {
              color: "$success700"
            }
          },
          _spinner: {
            props: {
              color: "$success600"
            },
            ":hover": {
              props: { color: "$success600" }
            },
            ":active": {
              props: { color: "$success700" }
            }
          },
          _dark: {
            bg: "$success400",
            borderColor: "$success700",
            ":hover": {
              bg: "$success500",
              borderColor: "$success400"
            },
            ":active": {
              bg: "$success600",
              borderColor: "$success300"
            },
            _text: {
              color: "$success300",
              ":hover": {
                color: "$success300"
              },
              ":active": {
                color: "$success200"
              }
            },
            _icon: {
              color: "$success300",
              ":hover": {
                color: "$success300"
              },
              ":active": {
                color: "$success200"
              }
            },
            _spinner: {
              props: {
                color: "$success300"
              },
              ":hover": {
                props: { color: "$success300" }
              },
              ":active": {
                props: { color: "$success200" }
              }
            },
            ":focusVisible": {
              _web: {
                boxShadow: "offset 0 0 0 2px $info400"
              }
            }
          }
        },
        negative: {
          bg: "$error500",
          borderColor: "$error300",
          ":hover": {
            bg: "$error600",
            borderColor: "$error400"
          },
          ":active": {
            bg: "$error700",
            borderColor: "$error700"
          },
          _text: {
            color: "$error600",
            ":hover": {
              color: "$error600"
            },
            ":active": {
              color: "$error700"
            }
          },
          _icon: {
            color: "$error600",
            ":hover": {
              color: "$error600"
            },
            ":active": {
              color: "$error700"
            }
          },
          _spinner: {
            props: {
              color: "$error600"
            },
            ":hover": {
              props: { color: "$error600" }
            },
            ":active": {
              props: { color: "$error700" }
            }
          },
          _dark: {
            bg: "$error400",
            borderColor: "$error700",
            ":hover": {
              bg: "$error500",
              borderColor: "$error400"
            },
            ":active": {
              bg: "$error600",
              borderColor: "$error300"
            },
            _text: {
              color: "$error300",
              ":hover": {
                color: "$error300"
              },
              ":active": {
                color: "$error200"
              }
            },
            _icon: {
              color: "$error300",
              ":hover": {
                color: "$error300"
              },
              ":active": {
                color: "$error200"
              }
            },
            _spinner: {
              props: {
                color: "$error300"
              },
              ":hover": {
                props: { color: "$error300" }
              },
              ":active": {
                props: { color: "$error200" }
              }
            },
            ":focusVisible": {
              _web: {
                boxShadow: "offset 0 0 0 2px $info400"
              }
            }
          }
        },
        default: {
          bg: "$transparent",
          ":hover": {
            bg: "$backgroundLight50"
          },
          ":active": {
            bg: "transparent"
          },
          _dark: {
            bg: "transparent",
            ":hover": {
              bg: "$backgroundDark900"
            },
            ":active": {
              bg: "transparent"
            }
          }
        }
      },
      variant: {
        link: {
          px: "$0",
          ":hover": {
            _text: {
              textDecorationLine: "underline"
            }
          },
          ":active": {
            _text: {
              textDecorationLine: "underline"
            }
          }
        },
        outline: {
          bg: "transparent",
          borderWidth: "$1",
          ":hover": {
            bg: "$backgroundLight50"
          },
          ":active": {
            bg: "transparent"
          },
          _dark: {
            bg: "transparent",
            ":hover": {
              bg: "$backgroundDark900"
            },
            ":active": {
              bg: "transparent"
            }
          }
        },
        solid: {
          _text: {
            color: "$textLight0",
            ":hover": {
              color: "$textLight0"
            },
            ":active": {
              color: "$textLight0"
            }
          },
          _spinner: {
            props: { color: "$textLight0" },
            ":hover": {
              props: { color: "$textLight0" }
            },
            ":active": {
              props: { color: "$textLight0" }
            }
          },
          _icon: {
            props: { color: "$textLight0" },
            ":hover": {
              props: { color: "$textLight0" }
            },
            ":active": {
              props: { color: "$textLight0" }
            }
          },
          _dark: {
            _text: {
              color: "$textDark0",
              ":hover": {
                color: "$textDark0"
              },
              ":active": {
                color: "$textDark0"
              }
            },
            _spinner: {
              props: { color: "$textDark0" },
              ":hover": {
                props: { color: "$textDark0" }
              },
              ":active": {
                props: { color: "$textDark0" }
              }
            },
            _icon: {
              props: { color: "$textDark0" },
              ":hover": {
                props: { color: "$textDark0" }
              },
              ":active": {
                props: { color: "$textDark0" }
              }
            }
          }
        }
      },
      size: {
        xs: {
          px: "$3.5",
          h: "$8",
          _icon: {
            props: {
              size: "2xs"
            }
          },
          _text: {
            props: {
              size: "xs"
            }
          }
        },
        sm: {
          px: "$4",
          h: "$9",
          _icon: {
            props: {
              size: "sm"
            }
          },
          _text: {
            props: {
              size: "sm"
            }
          }
        },
        md: {
          px: "$5",
          h: "$10",
          _icon: {
            props: {
              size: "md"
            }
          },
          _text: {
            props: {
              size: "md"
            }
          }
        },
        lg: {
          px: "$6",
          h: "$11",
          _icon: {
            props: {
              size: "md"
            }
          },
          _text: {
            props: {
              size: "lg"
            }
          }
        },
        xl: {
          px: "$7",
          h: "$12",
          _icon: {
            props: {
              size: "lg"
            }
          },
          _text: {
            props: {
              size: "xl"
            }
          }
        }
      }
    },
    compoundVariants: [
      {
        action: "primary",
        variant: "link",
        value: {
          px: "$0",
          bg: "transparent",
          ":hover": {
            bg: "transparent"
          },
          ":active": {
            bg: "transparent"
          },
          _dark: {
            bg: "transparent",
            ":hover": {
              bg: "transparent"
            },
            ":active": {
              bg: "transparent"
            }
          }
        }
      },
      {
        action: "secondary",
        variant: "link",
        value: {
          px: "$0",
          bg: "transparent",
          ":hover": {
            bg: "transparent"
          },
          ":active": {
            bg: "transparent"
          },
          _dark: {
            bg: "transparent",
            ":hover": {
              bg: "transparent"
            },
            ":active": {
              bg: "transparent"
            }
          }
        }
      },
      {
        action: "positive",
        variant: "link",
        value: {
          px: "$0",
          bg: "transparent",
          ":hover": {
            bg: "transparent"
          },
          ":active": {
            bg: "transparent"
          },
          _dark: {
            bg: "transparent",
            ":hover": {
              bg: "transparent"
            },
            ":active": {
              bg: "transparent"
            }
          }
        }
      },
      {
        action: "negative",
        variant: "link",
        value: {
          px: "$0",
          bg: "transparent",
          ":hover": {
            bg: "transparent"
          },
          ":active": {
            bg: "transparent"
          },
          _dark: {
            bg: "transparent",
            ":hover": {
              bg: "transparent"
            },
            ":active": {
              bg: "transparent"
            }
          }
        }
      },
      {
        action: "primary",
        variant: "outline",
        value: {
          bg: "transparent",
          ":hover": {
            bg: "$backgroundLight50"
          },
          ":active": {
            bg: "transparent"
          },
          _dark: {
            bg: "transparent",
            ":hover": {
              bg: "$backgroundDark900"
            },
            ":active": {
              bg: "transparent"
            }
          }
        }
      },
      {
        action: "secondary",
        variant: "outline",
        value: {
          bg: "transparent",
          ":hover": {
            bg: "$backgroundLight50"
          },
          ":active": {
            bg: "transparent"
          },
          _dark: {
            bg: "transparent",
            ":hover": {
              bg: "$backgroundDark900"
            },
            ":active": {
              bg: "transparent"
            }
          }
        }
      },
      {
        action: "positive",
        variant: "outline",
        value: {
          bg: "transparent",
          ":hover": {
            bg: "$backgroundLight50"
          },
          ":active": {
            bg: "transparent"
          },
          _dark: {
            bg: "transparent",
            ":hover": {
              bg: "$backgroundDark900"
            },
            ":active": {
              bg: "transparent"
            }
          }
        }
      },
      {
        action: "negative",
        variant: "outline",
        value: {
          bg: "transparent",
          ":hover": {
            bg: "$backgroundLight50"
          },
          ":active": {
            bg: "transparent"
          },
          _dark: {
            bg: "transparent",
            ":hover": {
              bg: "$backgroundDark900"
            },
            ":active": {
              bg: "transparent"
            }
          }
        }
      },
      {
        action: "primary",
        variant: "solid",
        value: {
          _text: {
            color: "$textLight0",
            ":hover": {
              color: "$textLight0"
            },
            ":active": {
              color: "$textLight0"
            }
          },
          _icon: {
            color: "$textLight0",
            ":hover": {
              color: "$textLight0"
            },
            ":active": {
              color: "$textLight0"
            }
          },
          _spinner: {
            props: { color: "$textLight0" },
            ":hover": {
              props: { color: "$textLight0" }
            },
            ":active": {
              props: { color: "$textLight0" }
            }
          },
          _dark: {
            _text: {
              color: "$textDark0",
              ":hover": {
                color: "$textDark0"
              },
              ":active": {
                color: "$textDark0"
              }
            },
            _icon: {
              color: "$textDark0",
              ":hover": {
                color: "$textDark0"
              },
              ":active": {
                color: "$textDark0"
              }
            },
            _spinner: {
              props: { color: "$textDark0" },
              ":hover": {
                props: { color: "$textDark0" }
              },
              ":active": {
                props: { color: "$textDark0" }
              }
            }
          }
        }
      },
      {
        action: "secondary",
        variant: "solid",
        value: {
          _text: {
            color: "$textLight0",
            ":hover": {
              color: "$textLight0"
            },
            ":active": {
              color: "$textLight0"
            }
          },
          _icon: {
            color: "$textLight0",
            ":hover": {
              color: "$textLight0"
            },
            ":active": {
              color: "$textLight0"
            }
          },
          _spinner: {
            props: { color: "$textLight0" },
            ":hover": {
              props: { color: "$textLight0" }
            },
            ":active": {
              props: { color: "$textLight0" }
            }
          },
          _dark: {
            _text: {
              color: "$textDark0",
              ":hover": {
                color: "$textDark0"
              },
              ":active": {
                color: "$textDark0"
              }
            },
            _icon: {
              color: "$textDark0",
              ":hover": {
                color: "$textDark0"
              },
              ":active": {
                color: "$textDark0"
              }
            },
            _spinner: {
              props: { color: "$textDark0" },
              ":hover": {
                props: { color: "$textDark0" }
              },
              ":active": {
                props: { color: "$textDark0" }
              }
            }
          }
        }
      },
      {
        action: "positive",
        variant: "solid",
        value: {
          _text: {
            color: "$textLight0",
            ":hover": {
              color: "$textLight0"
            },
            ":active": {
              color: "$textLight0"
            }
          },
          _icon: {
            color: "$textLight0",
            ":hover": {
              color: "$textLight0"
            },
            ":active": {
              color: "$textLight0"
            },
            props: { color: "$textLight0" }
          },
          _spinner: {
            props: { color: "$textLight0" },
            ":hover": {
              props: { color: "$textLight0" }
            },
            ":active": {
              props: { color: "$textLight0" }
            }
          },
          _dark: {
            _text: {
              color: "$textDark0",
              ":hover": {
                color: "$textDark0"
              },
              ":active": {
                color: "$textDark0"
              }
            },
            _icon: {
              color: "$textDark0",
              ":hover": {
                color: "$textDark0"
              },
              ":active": {
                color: "$textDark0"
              }
            },
            _spinner: {
              props: { color: "$textDark0" },
              ":hover": {
                props: { color: "$textDark0" }
              },
              ":active": {
                props: { color: "$textDark0" }
              }
            }
          }
        }
      },
      {
        action: "negative",
        variant: "solid",
        value: {
          _text: {
            color: "$textLight0",
            ":hover": {
              color: "$textLight0"
            },
            ":active": {
              color: "$textLight0"
            }
          },
          _icon: {
            color: "$textLight0",
            ":hover": {
              color: "$textLight0"
            },
            ":active": {
              color: "$textLight0"
            }
          },
          _spinner: {
            props: { color: "$textLight0" },
            ":hover": {
              props: { color: "$textLight0" }
            },
            ":active": {
              props: { color: "$textLight0" }
            }
          },
          _dark: {
            _text: {
              color: "$textDark0",
              ":hover": {
                color: "$textDark0"
              },
              ":active": {
                color: "$textDark0"
              }
            },
            _icon: {
              color: "$textDark0",
              ":hover": {
                color: "$textDark0"
              },
              ":active": {
                color: "$textDark0"
              }
            },
            _spinner: {
              props: { color: "$textDark0" },
              ":hover": {
                props: { color: "$textDark0" }
              },
              ":active": {
                props: { color: "$textDark0" }
              }
            }
          }
        }
      }
    ],
    props: {
      size: "md",
      variant: "solid",
      action: "primary"
    },
    _web: {
      ":focusVisible": {
        outlineWidth: "$0.5",
        outlineColor: "$primary700",
        outlineStyle: "solid",
        _dark: {
          outlineColor: "$primary300"
        }
      }
    },
    ":disabled": {
      opacity: 0.4
    }
  });

  // config/theme/ButtonGroup.ts
  var import_react34 = __require("./mock.js");
  var ButtonGroup = (0, import_react34.createStyle)({
    variants: {
      size: {
        xs: {
          _button: {
            props: {
              size: "xs"
            }
          }
        },
        sm: {
          _button: {
            props: {
              size: "sm"
            }
          }
        },
        md: {
          _button: {
            props: {
              size: "md"
            }
          }
        },
        lg: {
          _button: {
            props: {
              size: "lg"
            }
          }
        },
        xl: {
          _button: {
            _button: {
              props: {
                size: "xl"
              }
            }
          }
        }
      },
      space: {
        xs: {
          gap: "$1"
        },
        sm: {
          gap: "$2"
        },
        md: {
          gap: "$3"
        },
        lg: {
          gap: "$4"
        },
        xl: {
          gap: "$5"
        },
        "2xl": {
          gap: "$6"
        },
        "3xl": {
          gap: "$7"
        },
        "4xl": {
          gap: "$8"
        }
      },
      isAttached: {
        true: {
          gap: 0
        }
      }
    },
    defaultProps: {
      size: "md",
      space: "sm"
    }
  });

  // config/theme/ButtonGroupHSpacer.ts
  var import_react35 = __require("./mock.js");
  var ButtonGroupHSpacer = (0, import_react35.createStyle)({
    variants: {
      space: {
        xs: {
          w: "$1"
        },
        sm: {
          w: "$1.5"
        },
        md: {
          w: "$2"
        },
        lg: {
          w: "$3"
        },
        xl: {
          w: "$4"
        }
      }
    }
  });

  // config/theme/ButtonGroupVSpacer.ts
  var import_react36 = __require("./mock.js");
  var ButtonGroupVSpacer = (0, import_react36.createStyle)({
    variants: {
      space: {
        xs: {
          h: "$1"
        },
        sm: {
          h: "$1.5"
        },
        md: {
          h: "$2"
        },
        lg: {
          h: "$3"
        },
        xl: {
          h: "$4"
        }
      }
    }
  });

  // config/theme/ButtonIcon.ts
  var import_react37 = __require("./mock.js");
  var ButtonIcon = (0, import_react37.createStyle)({
    props: {
      size: "md"
    }
  });

  // config/theme/ButtonSpinner.ts
  var import_react38 = __require("./mock.js");
  var ButtonSpinner = (0, import_react38.createStyle)({});

  // config/theme/ButtonText.ts
  var import_react39 = __require("./mock.js");
  var ButtonText = (0, import_react39.createStyle)({
    color: "$textLight0",
    userSelect: "none"
  });

  // config/theme/Center.ts
  var import_react40 = __require("./mock.js");
  var Center = (0, import_react40.createStyle)({
    alignItems: "center",
    justifyContent: "center"
  });

  // config/theme/Checkbox.ts
  var import_react41 = __require("./mock.js");
  var Checkbox = (0, import_react41.createStyle)({
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    variants: {
      size: {
        lg: {
          _text: {
            props: {
              size: "lg"
            }
          },
          _icon: {
            props: {
              size: "md"
            }
          },
          _indicator: {
            borderWidth: 3,
            h: "$6",
            w: "$6"
          }
        },
        md: {
          _text: {
            props: {
              size: "md"
            }
          },
          _icon: {
            props: {
              size: "sm"
            }
          },
          _indicator: {
            borderWidth: 2,
            h: "$5",
            w: "$5"
          }
        },
        sm: {
          _text: {
            props: {
              size: "sm"
            }
          },
          _icon: {
            props: {
              size: "2xs"
            }
          },
          _indicator: {
            borderWidth: 2,
            h: "$4",
            w: "$4"
          }
        }
      }
    },
    defaultProps: {
      size: "md"
    },
    _web: {
      cursor: "pointer",
      ":disabled": {
        cursor: "not-allowed"
      }
    }
  });

  // config/theme/CheckboxGroup.ts
  var import_react42 = __require("./mock.js");
  var CheckboxGroup = (0, import_react42.createStyle)({});

  // config/theme/CheckboxIcon.ts
  var import_react43 = __require("./mock.js");
  var CheckboxIcon = (0, import_react43.createStyle)({
    ":checked": {
      color: "$backgroundLight0"
    },
    ":disabled": {
      opacity: 0.4
    },
    _dark: {
      ":checked": {
        color: "$backgroundDark0"
      },
      ":disabled": {
        opacity: 0.4
      }
    }
  });

  // config/theme/CheckboxIndicator.ts
  var import_react44 = __require("./mock.js");
  var CheckboxIndicator = (0, import_react44.createStyle)({
    justifyContent: "center",
    alignItems: "center",
    borderColor: "$borderLight400",
    bg: "$transparent",
    borderRadius: 4,
    _web: {
      ":focusVisible": {
        outlineWidth: "2px",
        outlineColor: "$primary700",
        outlineStyle: "solid",
        _dark: {
          outlineColor: "$primary300"
        }
      }
    },
    ":checked": {
      borderColor: "$primary600",
      bg: "$primary600"
    },
    ":hover": {
      borderColor: "$borderLight500",
      bg: "transparent",
      ":invalid": {
        borderColor: "$error700"
      },
      ":checked": {
        bg: "$primary700",
        borderColor: "$primary700",
        ":disabled": {
          borderColor: "$primary600",
          bg: "$primary600",
          opacity: 0.4,
          ":invalid": {
            borderColor: "$error700"
          }
        }
      },
      ":disabled": {
        borderColor: "$borderLight400",
        ":invalid": {
          borderColor: "$error700"
        }
      }
    },
    ":active": {
      ":checked": {
        bg: "$primary800",
        borderColor: "$primary800"
      }
    },
    ":invalid": {
      borderColor: "$error700"
    },
    ":disabled": {
      opacity: 0.4
    },
    _dark: {
      borderColor: "$borderDark500",
      bg: "$transparent",
      ":checked": {
        borderColor: "$primary500",
        bg: "$primary500"
      },
      ":hover": {
        borderColor: "$borderDark400",
        bg: "transparent",
        ":invalid": {
          borderColor: "$error400"
        },
        ":checked": {
          bg: "$primary400",
          borderColor: "$primary400",
          ":disabled": {
            borderColor: "$primary500",
            bg: "$primary500",
            opacity: 0.4,
            ":invalid": {
              borderColor: "$error400"
            }
          }
        },
        ":disabled": {
          borderColor: "$borderDark500",
          ":invalid": {
            borderColor: "$error400"
          }
        }
      },
      ":active": {
        ":checked": {
          bg: "$primary300",
          borderColor: "$primary300"
        }
      },
      ":invalid": {
        borderColor: "$error400"
      },
      ":disabled": {
        opacity: 0.4
      }
    }
  });

  // config/theme/CheckboxLabel.ts
  var import_react45 = __require("./mock.js");
  var CheckboxLabel = (0, import_react45.createStyle)({
    color: "$textLight600",
    ":checked": {
      color: "$textLight900"
    },
    ":hover": {
      color: "$textLight900",
      ":checked": {
        color: "$textLight900",
        ":disabled": {
          color: "$textLight900"
        }
      },
      ":disabled": {
        color: "$textLight600"
      }
    },
    ":active": {
      color: "$textLight900",
      ":checked": {
        color: "$textLight900"
      }
    },
    ":disabled": {
      opacity: 0.4
    },
    _web: {
      MozUserSelect: "none",
      WebkitUserSelect: "none",
      msUserSelect: "none"
    },
    userSelect: "none",
    _dark: {
      color: "$textDark400",
      ":checked": {
        color: "$textDark100"
      },
      ":hover": {
        color: "$textDark100",
        ":checked": {
          color: "$textDark100",
          ":disabled": {
            color: "$textDark100"
          }
        }
      },
      ":disabled": {
        color: "$textDark100"
      },
      ":active": {
        color: "$textDark100",
        ":checked": {
          color: "$textDark100"
        }
      }
    }
  });

  // config/theme/Divider.ts
  var import_react46 = __require("./mock.js");
  var Divider = (0, import_react46.createStyle)({
    bg: "$backgroundLight200",
    _dark: {
      bg: "$backgroundLight800"
    },
    variants: {
      orientation: {
        vertical: {
          width: "$px",
          height: "$full"
        },
        horizontal: {
          height: "$px",
          width: "$full"
        }
      }
    },
    defaultProps: {
      orientation: "horizontal"
    }
  });

  // config/theme/Fab.ts
  var import_react47 = __require("./mock.js");
  var Fab = (0, import_react47.createStyle)({
    bg: "$primary500",
    rounded: "$full",
    zIndex: 20,
    p: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    ":hover": {
      bg: "$primary600"
    },
    ":active": {
      bg: "$primary700"
    },
    ":disabled": {
      opacity: 0.4,
      _web: {
        // @ts-ignore
        pointerEvents: "all !important",
        cursor: "not-allowed"
      }
    },
    _text: {
      color: "$textLight50",
      fontWeight: "$normal",
      _dark: {
        _text: {
          color: "$textDark50"
        }
      }
    },
    _icon: {
      color: "$textLight50",
      ":hover": {
        color: "$textLight0"
      },
      ":active": {
        color: "$textLight0"
      },
      _dark: {
        _icon: {
          color: "$textDark0",
          ":hover": {
            color: "$textDark0"
          },
          ":active": {
            color: "$textDark0"
          }
        }
      }
    },
    _dark: {
      bg: "$primary400",
      ":hover": {
        bg: "$primary500"
      },
      ":active": {
        bg: "$primary600"
      },
      ":disabled": {
        opacity: 0.4,
        _web: {
          cursor: "not-allowed"
        }
      }
    },
    _web: {
      ":focusVisible": {
        outlineWidth: 2,
        outlineColor: "$primary700",
        outlineStyle: "solid",
        _dark: {
          outlineColor: "$primary300"
        }
      }
    },
    variants: {
      size: {
        sm: {
          px: "$2.5",
          py: "$2.5",
          _text: {
            fontSize: "$sm"
          },
          _icon: {
            props: {
              size: "sm"
            }
          }
        },
        md: {
          px: "$3",
          py: "$3",
          _text: {
            fontSize: "$md"
          },
          _icon: {
            props: {
              size: "md"
            }
          }
        },
        lg: {
          px: "$4",
          py: "$4",
          _text: {
            fontSize: "$lg"
          },
          _icon: {
            props: {
              size: "md"
            }
          }
        }
      },
      placement: {
        "top right": {
          top: "$4",
          right: "$4"
        },
        "top left": {
          top: "$4",
          left: "$4"
        },
        "bottom right": {
          bottom: "$4",
          right: "$4"
        },
        "bottom left": {
          bottom: "$4",
          left: "$4"
        },
        "top center": {
          top: "$4",
          alignSelf: "center"
          // TODO: fix this, this is correct way, but React Native doesn't support this on Native
          // left: '50%',
          // transform: [
          //   {
          //     // @ts-ignore
          //     translateX: '-50%',
          //   },
          // ],
        },
        "bottom center": {
          bottom: "$4",
          alignSelf: "center"
          // TODO: fix this, this is correct way, but React Native doesn't support this on Native
          // left: '50%',
          // transform: [
          //   {
          //     // @ts-ignore
          //     translateX: '-50%',
          //   },
          // ],
        }
      }
    },
    defaultProps: {
      placement: "bottom right",
      size: "md",
      hardShadow: "2"
    }
  });

  // config/theme/FabIcon.ts
  var import_react48 = __require("./mock.js");
  var FabIcon = (0, import_react48.createStyle)({
    props: {
      size: "md"
    }
  });

  // config/theme/FabLabel.ts
  var import_react49 = __require("./mock.js");
  var FabLabel = (0, import_react49.createStyle)({
    color: "$textLight50"
  });

  // config/theme/FlatList.ts
  var import_react50 = __require("./mock.js");
  var FlatList = (0, import_react50.createStyle)({});

  // config/theme/FormControl.ts
  var import_react51 = __require("./mock.js");
  var FormControl = (0, import_react51.createStyle)({
    flexDirection: "column",
    variants: {
      size: {
        sm: {
          _labelText: {
            props: { size: "sm" }
          },
          _labelAstrick: {
            props: { size: "sm" }
          },
          _helperText: {
            props: { size: "xs" }
          },
          _errorText: {
            props: { size: "xs" }
          }
        },
        md: {
          _labelText: {
            props: { size: "md" }
          },
          _labelAstrick: {
            props: { size: "md" }
          },
          _helperText: {
            props: { size: "sm" }
          },
          _errorText: {
            props: { size: "sm" }
          }
        },
        lg: {
          _labelText: {
            props: { size: "lg" }
          },
          _labelAstrick: {
            props: { size: "lg" }
          },
          _helperText: {
            props: { size: "md" }
          },
          _errorText: {
            props: { size: "md" }
          }
        }
      }
    },
    defaultProps: {
      size: "md"
    }
  });

  // config/theme/FormControlError.ts
  var import_react52 = __require("./mock.js");
  var FormControlError = (0, import_react52.createStyle)({
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    mt: "$1",
    gap: "$1"
  });

  // config/theme/FormControlErrorIcon.ts
  var import_react53 = __require("./mock.js");
  var FormControlErrorIcon = (0, import_react53.createStyle)({
    color: "$error700",
    _dark: {
      // @ts-ignore
      color: "$error400"
    },
    props: {
      size: "sm"
    }
  });

  // config/theme/FormControlErrorText.ts
  var import_react54 = __require("./mock.js");
  var FormControlErrorText = (0, import_react54.createStyle)({
    color: "$error700",
    _dark: {
      color: "$error400"
    }
  });

  // config/theme/FormControlHelper.ts
  var import_react55 = __require("./mock.js");
  var FormControlHelper = (0, import_react55.createStyle)({
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    mt: "$1"
  });

  // config/theme/FormControlHelperText.ts
  var import_react56 = __require("./mock.js");
  var FormControlHelperText = (0, import_react56.createStyle)({
    props: {
      size: "xs"
    },
    color: "$textLight500",
    _dark: {
      color: "$textDark400"
    }
  });

  // config/theme/FormControlLabel.ts
  var import_react57 = __require("./mock.js");
  var FormControlLabel = (0, import_react57.createStyle)({
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    mb: "$1"
  });

  // config/theme/FormControlLabelText.ts
  var import_react58 = __require("./mock.js");
  var FormControlLabelText = (0, import_react58.createStyle)({
    fontWeight: "$medium",
    color: "$textLight900",
    _dark: {
      color: "$textDark50"
    }
  });

  // config/theme/HStack.ts
  var import_react59 = __require("./mock.js");
  var HStack = (0, import_react59.createStyle)({
    flexDirection: "row",
    variants: {
      space: {
        xs: {
          gap: "$1"
        },
        sm: {
          gap: "$2"
        },
        md: {
          gap: "$3"
        },
        lg: {
          gap: "$4"
        },
        xl: {
          gap: "$5"
        },
        "2xl": {
          gap: "$6"
        },
        "3xl": {
          gap: "$7"
        },
        "4xl": {
          gap: "$8"
        }
      },
      reversed: {
        true: {
          flexDirection: "row-reverse"
        }
      }
    }
  });

  // config/theme/Heading.ts
  var import_html_elements = __require("./mock.js");
  var import_react60 = __require("./mock.js");
  var Heading = (0, import_react60.createStyle)({
    color: "$textLight900",
    letterSpacing: "$sm",
    fontWeight: "$bold",
    fontFamily: "$heading",
    // Overrides expo-html default styling
    marginVertical: 0,
    _dark: {
      color: "$textDark50"
    },
    variants: {
      isTruncated: {
        true: {
          props: {
            // @ts-ignore
            numberOfLines: 1,
            ellipsizeMode: "tail"
          }
        }
      },
      bold: {
        true: {
          fontWeight: "$bold"
        }
      },
      underline: {
        true: {
          textDecorationLine: "underline"
        }
      },
      strikeThrough: {
        true: {
          textDecorationLine: "line-through"
        }
      },
      sub: {
        true: {
          fontSize: "$xs",
          lineHeight: "$xs"
        }
      },
      italic: {
        true: {
          fontStyle: "italic"
        }
      },
      highlight: {
        true: {
          bg: "$yellow500"
        }
      },
      size: {
        "5xl": {
          // @ts-ignore
          props: { as: import_html_elements.H1 },
          fontSize: "$6xl",
          lineHeight: "$7xl"
        },
        "4xl": {
          // @ts-ignore
          props: { as: import_html_elements.H1 },
          fontSize: "$5xl",
          lineHeight: "$6xl"
        },
        "3xl": {
          // @ts-ignore
          props: { as: import_html_elements.H1 },
          fontSize: "$4xl",
          lineHeight: "$5xl"
        },
        "2xl": {
          // @ts-ignore
          props: { as: import_html_elements.H2 },
          fontSize: "$3xl",
          lineHeight: "$3xl"
        },
        xl: {
          // @ts-ignore
          props: { as: import_html_elements.H3 },
          fontSize: "$2xl",
          lineHeight: "$3xl"
        },
        lg: {
          // @ts-ignore
          props: { as: import_html_elements.H4 },
          fontSize: "$xl",
          lineHeight: "$2xl"
        },
        md: {
          // @ts-ignore
          props: { as: import_html_elements.H5 },
          fontSize: "$lg",
          lineHeight: "$lg"
        },
        sm: {
          // @ts-ignore
          props: { as: import_html_elements.H6 },
          fontSize: "$md",
          lineHeight: "$lg"
        },
        xs: {
          // @ts-ignore
          props: { as: import_html_elements.H6 },
          fontSize: "$sm",
          lineHeight: "$xs"
        }
      }
    },
    defaultProps: {
      size: "lg"
    }
  });

  // config/theme/Icon.ts
  var import_react61 = __require("./mock.js");
  var BaseIcon = (0, import_react61.createStyle)({
    color: "$backgroundLight800",
    _dark: {
      color: "$backgroundDark400"
    },
    variants: {
      size: {
        "2xs": {
          h: "$3",
          w: "$3",
          props: {
            // @ts-ignore
            size: 12
          }
        },
        xs: {
          h: "$3.5",
          w: "$3.5",
          props: {
            // @ts-ignore
            size: 14
          }
        },
        sm: {
          h: "$4",
          w: "$4",
          props: {
            // @ts-ignore
            size: 16
          }
        },
        md: {
          h: "$4.5",
          w: "$4.5",
          props: {
            // @ts-ignore
            size: 18
          }
        },
        lg: {
          h: "$5",
          w: "$5",
          props: {
            // @ts-ignore
            size: 20
          }
        },
        xl: {
          h: "$6",
          w: "$6",
          props: {
            // @ts-ignore
            size: 24
          }
        }
      }
    }
    // defaultProps: {
    //   size: 'md',
    // },
  });
  var Icon = (0, import_react61.createStyle)({
    props: {
      size: "md",
      // @ts-ignore
      fill: "none"
    },
    color: "$backgroundLight800",
    _dark: {
      // @ts-ignore
      color: "$backgroundDark400"
    }
  });

  // config/theme/Image.ts
  var import_react62 = __require("./mock.js");
  var Image = (0, import_react62.createStyle)({
    maxWidth: "$full",
    variants: {
      size: {
        "2xs": {
          w: "$6",
          h: "$6"
        },
        xs: {
          w: "$10",
          h: "$10"
        },
        sm: {
          w: "$16",
          h: "$16"
        },
        md: {
          w: "$20",
          h: "$20"
        },
        lg: {
          w: "$24",
          h: "$24"
        },
        xl: {
          w: "$32",
          h: "$32"
        },
        "2xl": {
          w: "$64",
          h: "$64"
        },
        full: {
          w: "$full",
          h: "$full"
        }
      }
    },
    defaultProps: {
      size: "md"
    }
  });

  // config/theme/Input.ts
  var import_react63 = __require("./mock.js");
  var Input = (0, import_react63.createStyle)({
    borderWidth: 1,
    borderColor: "$backgroundLight300",
    borderRadius: "$sm",
    flexDirection: "row",
    overflow: "hidden",
    alignContent: "center",
    ":hover": {
      borderColor: "$borderLight400"
    },
    ":focus": {
      borderColor: "$primary700",
      ":hover": {
        borderColor: "$primary700"
      }
    },
    ":disabled": {
      opacity: 0.4,
      ":hover": {
        borderColor: "$backgroundLight300"
      }
    },
    _input: {
      py: "auto",
      px: "$3"
    },
    _icon: {
      color: "$textLight400"
    },
    _dark: {
      borderColor: "$borderDark700",
      ":hover": {
        borderColor: "$borderDark400"
      },
      ":focus": {
        borderColor: "$primary400",
        ":hover": {
          borderColor: "$primary400"
        }
      },
      ":disabled": {
        ":hover": {
          borderColor: "$borderDark700"
        }
      }
    },
    variants: {
      size: {
        xl: {
          h: "$12",
          _input: {
            props: {
              size: "xl"
            }
          },
          _icon: {
            props: {
              size: "xl"
            }
          }
        },
        lg: {
          h: "$11",
          _input: {
            props: {
              size: "lg"
            }
          },
          _icon: {
            props: {
              size: "lg"
            }
          }
        },
        md: {
          h: "$10",
          _input: {
            props: {
              size: "md"
            }
          },
          _icon: {
            props: {
              size: "sm"
            }
          }
        },
        sm: {
          h: "$9",
          _input: {
            props: {
              size: "sm"
            }
          },
          _icon: {
            props: {
              size: "xs"
            }
          }
        }
      },
      variant: {
        underlined: {
          _input: {
            _web: {
              outlineWidth: 0,
              outline: "none"
            },
            px: "$0"
          },
          borderWidth: 0,
          borderRadius: 0,
          borderBottomWidth: "$1",
          ":focus": {
            borderColor: "$primary700",
            _web: {
              boxShadow: "inset 0 -1px 0 0 $primary700"
            }
          },
          ":invalid": {
            borderBottomWidth: 2,
            borderBottomColor: "$error700",
            _web: {
              boxShadow: "inset 0 -1px 0 0 $error700"
            },
            ":hover": {
              borderBottomColor: "$error700"
            },
            ":focus": {
              borderBottomColor: "$error700",
              ":hover": {
                borderBottomColor: "$error700",
                _web: {
                  boxShadow: "inset 0 -1px 0 0 $error700"
                }
              }
            },
            ":disabled": {
              ":hover": {
                borderBottomColor: "$error700",
                _web: {
                  boxShadow: "inset 0 -1px 0 0 $error700"
                }
              }
            }
          },
          _dark: {
            ":focus": {
              borderColor: "$primary400",
              _web: {
                boxShadow: "inset 0 -1px 0 0 $primary400"
              }
            },
            ":invalid": {
              borderColor: "$error400",
              _web: {
                boxShadow: "inset 0 -1px 0 0 $error400"
              },
              ":hover": {
                borderBottomColor: "$error400"
              },
              ":focus": {
                borderBottomColor: "$error400",
                ":hover": {
                  borderBottomColor: "$error400",
                  _web: {
                    boxShadow: "inset 0 -1px 0 0 $error400"
                  }
                }
              },
              ":disabled": {
                ":hover": {
                  borderBottomColor: "$error400",
                  _web: {
                    boxShadow: "inset 0 -1px 0 0 $error400"
                  }
                }
              }
            }
          }
        },
        outline: {
          _input: {
            _web: {
              outlineWidth: 0,
              outline: "none"
            }
          },
          ":focus": {
            borderColor: "$primary700",
            _web: {
              boxShadow: "inset 0 0 0 1px $primary700"
            }
          },
          ":invalid": {
            borderColor: "$error700",
            _web: {
              boxShadow: "inset 0 0 0 1px $error700"
            },
            ":hover": {
              borderColor: "$error700"
            },
            ":focus": {
              borderColor: "$error700",
              ":hover": {
                borderColor: "$error700",
                _web: {
                  boxShadow: "inset 0 0 0 1px $error700"
                }
              }
            },
            ":disabled": {
              ":hover": {
                borderColor: "$error700",
                _web: {
                  boxShadow: "inset 0 0 0 1px $error700"
                }
              }
            }
          },
          _dark: {
            ":focus": {
              borderColor: "$primary400",
              _web: {
                boxShadow: "inset 0 0 0 1px $primary400"
              }
            },
            ":invalid": {
              borderColor: "$error400",
              _web: {
                boxShadow: "inset 0 0 0 1px $error400"
              },
              ":hover": {
                borderColor: "$error400"
              },
              ":focus": {
                borderColor: "$error400",
                ":hover": {
                  borderColor: "$error400",
                  _web: {
                    boxShadow: "inset 0 0 0 1px $error400"
                  }
                }
              },
              ":disabled": {
                ":hover": {
                  borderColor: "$error400",
                  _web: {
                    boxShadow: "inset 0 0 0 1px $error400"
                  }
                }
              }
            }
          }
        },
        rounded: {
          borderRadius: 999,
          _input: {
            px: "$4",
            _web: {
              outlineWidth: 0,
              outline: "none"
            }
          },
          ":focus": {
            borderColor: "$primary700",
            _web: {
              boxShadow: "inset 0 0 0 1px $primary700"
            }
          },
          ":invalid": {
            borderColor: "$error700",
            _web: {
              boxShadow: "inset 0 0 0 1px $error700"
            },
            ":hover": {
              borderColor: "$error700"
            },
            ":focus": {
              borderColor: "$error700",
              ":hover": {
                borderColor: "$error700",
                _web: {
                  boxShadow: "inset 0 0 0 1px $error700"
                }
              }
            },
            ":disabled": {
              ":hover": {
                borderColor: "$error700",
                _web: {
                  boxShadow: "inset 0 0 0 1px $error700"
                }
              }
            }
          },
          _dark: {
            ":focus": {
              borderColor: "$primary400",
              _web: {
                boxShadow: "inset 0 0 0 1px $primary400"
              }
            },
            ":invalid": {
              borderColor: "$error400",
              _web: {
                boxShadow: "inset 0 0 0 1px $error400"
              },
              ":hover": {
                borderColor: "$error400"
              },
              ":focus": {
                borderColor: "$error400",
                ":hover": {
                  borderColor: "$error400",
                  _web: {
                    boxShadow: "inset 0 0 0 1px $error400"
                  }
                }
              },
              ":disabled": {
                ":hover": {
                  borderColor: "$error400",
                  _web: {
                    boxShadow: "inset 0 0 0 1px $error400"
                  }
                }
              }
            }
          }
        }
      }
    },
    defaultProps: {
      size: "md",
      variant: "outline"
    }
  });

  // config/theme/InputField.ts
  var import_react64 = __require("./mock.js");
  var InputField = (0, import_react64.createStyle)({
    flex: 1,
    color: "$textLight900",
    props: {
      placeholderTextColor: "$textLight500"
    },
    _dark: {
      color: "$textDark50",
      props: {
        placeholderTextColor: "$textDark400"
      }
    },
    _web: {
      cursor: "text",
      ":disabled": {
        cursor: "not-allowed"
      }
    },
    variants: {
      size: {
        "2xs": {
          fontSize: "$2xs",
          lineHeight: "$2xs"
        },
        xs: {
          fontSize: "$xs",
          lineHeight: "$sm"
        },
        sm: {
          fontSize: "$sm",
          lineHeight: "$sm"
        },
        md: {
          fontSize: "$md",
          lineHeight: "$md"
        },
        lg: {
          fontSize: "$lg",
          lineHeight: "$xl"
        },
        xl: {
          fontSize: "$xl",
          lineHeight: "$xl"
        },
        "2xl": {
          fontSize: "$2xl",
          lineHeight: "$2xl"
        },
        "3xl": {
          fontSize: "$3xl",
          lineHeight: "$3xl"
        },
        "4xl": {
          fontSize: "$4xl",
          lineHeight: "$4xl"
        },
        "5xl": {
          fontSize: "$5xl",
          lineHeight: "$6xl"
        },
        "6xl": {
          fontSize: "$6xl",
          lineHeight: "$7xl"
        }
      }
    }
  });

  // config/theme/InputIcon.ts
  var import_react65 = __require("./mock.js");
  var InputIcon = (0, import_react65.createStyle)({
    props: {
      size: "md"
    }
  });

  // config/theme/InputSlot.ts
  var import_react66 = __require("./mock.js");
  var InputSlot = (0, import_react66.createStyle)({
    justifyContent: "center",
    alignItems: "center",
    _web: {
      ":disabled": {
        cursor: "not-allowed"
      }
    }
  });

  // config/theme/KeyboardAvoidingView.ts
  var import_react67 = __require("./mock.js");
  var KeyboardAvoidingView = (0, import_react67.createStyle)({});

  // config/theme/Link.ts
  var import_react68 = __require("./mock.js");
  var Link = (0, import_react68.createStyle)({
    _web: {
      outlineWidth: 0,
      ":disabled": {
        cursor: "not-allowed"
      },
      ":focusVisible": {
        outlineWidth: 2,
        outlineColor: "$primary700",
        outlineStyle: "solid",
        _dark: {
          outlineColor: "$primary400"
        }
      }
    },
    _text: {
      ":hover": {
        color: "$info600",
        textDecorationLine: "none"
      },
      ":active": {
        color: "$info700"
      },
      ":disabled": {
        opacity: 0.4
      },
      _dark: {
        ":hover": {
          color: "$info400"
        },
        ":active": {
          color: "$info300"
        }
      }
    }
  });

  // config/theme/LinkText.ts
  var import_react69 = __require("./mock.js");
  var LinkText = (0, import_react69.createStyle)({
    textDecorationLine: "underline",
    color: "$info700",
    _dark: {
      color: "$info300"
    }
  });

  // config/theme/Menu.ts
  var import_react70 = __require("./mock.js");
  var Menu = (0, import_react70.createStyle)({
    ":initial": {
      opacity: 0
    },
    ":animate": {
      opacity: 1
    },
    ":exit": {
      opacity: 0
    },
    ":transition": {
      type: "spring",
      damping: 18,
      stiffness: 250,
      opacity: {
        type: "timing",
        duration: 200
      }
    },
    minWidth: 200,
    py: "$2",
    rounded: "$sm",
    bg: "$backgroundLight0",
    _dark: {
      bg: "$backgroundDark900"
    },
    defaultProps: {
      softShadow: "3"
    }
  });

  // config/theme/MenuBackdrop.ts
  var import_react71 = __require("./mock.js");
  var MenuBackdrop = (0, import_react71.createStyle)({
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    // use this for when you want to give background colour to backdrop
    // opacity: 0.5,
    // bg: '$backgroundLight500',
    _web: {
      cursor: "default"
    }
  });

  // config/theme/MenuItem.ts
  var import_react72 = __require("./mock.js");
  var MenuItem = (0, import_react72.createStyle)({
    p: "$3",
    flexDirection: "row",
    alignItems: "center",
    ":hover": {
      bg: "$backgroundLight100"
    },
    ":disabled": {
      opacity: 0.4,
      _web: {
        cursor: "not-allowed"
      },
      ":focus": {
        bg: "transparent"
      },
      _dark: {
        ":focus": {
          bg: "transparent"
        }
      }
    },
    ":active": {
      bg: "$backgroundLight200"
    },
    ":focus": {
      bg: "$backgroundLight100",
      // @ts-ignore
      outlineWidth: "$0",
      outlineStyle: "none"
    },
    ":focusVisible": {
      // @ts-ignore
      outlineWidth: "$0.5",
      outlineColor: "$primary700",
      outlineStyle: "solid",
      _dark: {
        outlineColor: "$primary300"
      }
    },
    _dark: {
      ":hover": {
        bg: "$backgroundDark800"
      },
      ":active": {
        bg: "$backgroundDark700"
      },
      ":focus": {
        bg: "$backgroundDark800"
      }
    },
    _web: {
      cursor: "pointer"
    }
  });

  // config/theme/MenuLabel.ts
  var import_react73 = __require("./mock.js");
  var MenuLabel = (0, import_react73.createStyle)({});

  // config/theme/Modal.ts
  var import_react74 = __require("./mock.js");
  var Modal = (0, import_react74.createStyle)({
    width: "$full",
    height: "$full",
    justifyContent: "center",
    alignItems: "center",
    variants: {
      size: {
        xs: { _content: { width: "60%", maxWidth: 360 } },
        sm: { _content: { width: "70%", maxWidth: 420 } },
        md: { _content: { width: "80%", maxWidth: 510 } },
        lg: { _content: { width: "90%", maxWidth: 640 } },
        full: { _content: { width: "100%" } }
      }
    },
    defaultProps: { size: "md" },
    _web: {
      pointerEvents: "box-none"
    }
  });

  // config/theme/ModalBackdrop.ts
  var import_react75 = __require("./mock.js");
  var ModalBackdrop = (0, import_react75.createStyle)({
    ":initial": {
      opacity: 0
    },
    ":animate": {
      opacity: 0.5
    },
    ":exit": {
      opacity: 0
    },
    ":transition": {
      type: "spring",
      damping: 18,
      stiffness: 250,
      opacity: {
        type: "timing",
        duration: 250
      }
    },
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    bg: "$backgroundLight950",
    // @ts-ignore
    _dark: {
      bg: "$backgroundDark950"
    },
    // @ts-ignore
    _web: {
      cursor: "default"
    }
  });

  // config/theme/ModalBody.ts
  var import_react76 = __require("./mock.js");
  var ModalBody = (0, import_react76.createStyle)({
    px: "$4",
    paddingTop: 0,
    paddingBottom: "$2"
  });

  // config/theme/ModalCloseButton.ts
  var import_react77 = __require("./mock.js");
  var ModalCloseButton = (0, import_react77.createStyle)({
    zIndex: 1,
    p: "$2",
    rounded: "$sm",
    _icon: {
      color: "$backgroundLight400"
    },
    _text: {
      color: "$backgroundLight400"
    },
    ":hover": {
      _icon: {
        color: "$backgroundLight700"
      },
      _text: {
        color: "$backgroundLight700"
      }
    },
    ":active": {
      _icon: {
        color: "$backgroundLight900"
      },
      _text: {
        color: "$backgroundLight900"
      }
    },
    _dark: {
      _icon: {
        color: "$backgroundDark400"
      },
      _text: {
        color: "$backgroundDark400"
      },
      ":hover": {
        _icon: {
          color: "$backgroundDark200"
        },
        _text: {
          color: "$backgroundDark200"
        }
      },
      ":active": {
        _icon: {
          color: "$backgroundDark100"
        },
        _text: {
          color: "$backgroundDark100"
        }
      }
    },
    ":focusVisible": {
      bg: "$backgroundLight100",
      _icon: {
        color: "$backgroundLight900"
      },
      _text: {
        color: "$backgroundLight900"
      },
      _dark: {
        bg: "$backgroundDark700",
        _icon: {
          color: "$backgroundLight100"
        },
        _text: {
          color: "$backgroundLight100"
        }
      }
    },
    _web: {
      outlineWidth: 0,
      cursor: "pointer"
    }
  });

  // config/theme/ModalContent.ts
  var import_react78 = __require("./mock.js");
  var ModalContent = (0, import_react78.createStyle)({
    bg: "$backgroundLight50",
    rounded: "$lg",
    overflow: "hidden",
    ":initial": {
      opacity: 0,
      scale: 0.9
    },
    ":animate": {
      opacity: 1,
      scale: 1
    },
    ":exit": {
      opacity: 0
    },
    ":transition": {
      type: "spring",
      damping: 18,
      stiffness: 250,
      opacity: {
        type: "timing",
        duration: 250
      }
    },
    // @ts-ignore
    _dark: {
      bg: "$backgroundDark900"
    },
    defaultProps: {
      softShadow: "3"
    }
  });

  // config/theme/ModalFooter.ts
  var import_react79 = __require("./mock.js");
  var ModalFooter = (0, import_react79.createStyle)({
    p: "$4",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    flexWrap: "wrap"
  });

  // config/theme/ModalHeader.ts
  var import_react80 = __require("./mock.js");
  var ModalHeader = (0, import_react80.createStyle)({
    px: "$4",
    paddingTop: "$4",
    paddingBottom: "$2",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row"
  });

  // config/theme/Popover.ts
  var import_react81 = __require("./mock.js");
  var Popover = (0, import_react81.createStyle)({
    width: "$full",
    height: "$full",
    justifyContent: "center",
    alignItems: "center",
    variants: {
      size: {
        xs: { _content: { width: "60%", maxWidth: 360 } },
        sm: { _content: { width: "70%", maxWidth: 420 } },
        md: { _content: { width: "80%", maxWidth: 510 } },
        lg: { _content: { width: "90%", maxWidth: 640 } },
        full: { _content: { width: "100%" } }
      }
    },
    defaultProps: { size: "md" },
    _web: {
      pointerEvents: "box-none"
    }
  });

  // config/theme/PopoverArrow.ts
  var import_react82 = __require("./mock.js");
  var PopoverArrow = (0, import_react82.createStyle)({});

  // config/theme/PopoverBackdrop.ts
  var import_react83 = __require("./mock.js");
  var PopoverBackdrop = (0, import_react83.createStyle)({
    ":initial": {
      opacity: 0
    },
    ":animate": {
      opacity: 0.5
    },
    ":exit": {
      opacity: 0
    },
    ":transition": {
      type: "spring",
      damping: 18,
      stiffness: 250,
      opacity: {
        type: "timing",
        duration: 250
      }
    },
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    bg: "$backgroundLight950",
    // @ts-ignore
    _dark: {
      bg: "$backgroundDark950"
    },
    // @ts-ignore
    _web: {
      cursor: "default"
    }
  });

  // config/theme/PopoverBody.ts
  var import_react84 = __require("./mock.js");
  var PopoverBody = (0, import_react84.createStyle)({
    p: "$4",
    pt: "$2"
  });

  // config/theme/PopoverCloseButton.ts
  var import_react85 = __require("./mock.js");
  var PopoverCloseButton = (0, import_react85.createStyle)({
    zIndex: 1,
    p: "$2",
    rounded: "$sm",
    _icon: {
      color: "$backgroundLight400"
    },
    _text: {
      color: "$backgroundLight400"
    },
    ":hover": {
      _icon: {
        color: "$backgroundLight700"
      },
      _text: {
        color: "$backgroundLight700"
      }
    },
    ":active": {
      _icon: {
        color: "$backgroundLight900"
      },
      _text: {
        color: "$backgroundLight900"
      }
    },
    _dark: {
      _icon: {
        color: "$backgroundDark400"
      },
      _text: {
        color: "$backgroundDark400"
      },
      ":hover": {
        _icon: {
          color: "$backgroundDark200"
        },
        _text: {
          color: "$backgroundDark200"
        }
      },
      ":active": {
        _icon: {
          color: "$backgroundDark100"
        },
        _text: {
          color: "$backgroundDark100"
        }
      }
    },
    ":focusVisible": {
      bg: "$backgroundLight100",
      _icon: {
        color: "$backgroundLight900"
      },
      _text: {
        color: "$backgroundLight900"
      },
      _dark: {
        bg: "$backgroundDark700",
        _icon: {
          color: "$backgroundLight100"
        },
        _text: {
          color: "$backgroundLight100"
        }
      }
    },
    _web: {
      outlineWidth: 0,
      cursor: "pointer"
    }
  });

  // config/theme/PopoverFooter.ts
  var import_react86 = __require("./mock.js");
  var PopoverFooter = (0, import_react86.createStyle)({
    p: "$4",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    flexWrap: "wrap",
    borderTopWidth: 1,
    borderColor: "$borderLight300",
    _dark: {
      borderColor: "$borderDark700"
    }
  });

  // config/theme/PopoverHeader.ts
  var import_react87 = __require("./mock.js");
  var PopoverHeader = (0, import_react87.createStyle)({
    p: "$4",
    pb: "$2",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row"
  });

  // config/theme/PopoverContent.ts
  var import_react88 = __require("./mock.js");
  var PopoverContent = (0, import_react88.createStyle)({
    bg: "$backgroundLight50",
    rounded: "$lg",
    overflow: "hidden",
    ":initial": {
      opacity: 0
    },
    ":animate": {
      opacity: 1
    },
    ":exit": {
      opacity: 0
    },
    ":transition": {
      type: "spring",
      damping: 18,
      stiffness: 250,
      opacity: {
        type: "timing",
        duration: 250
      }
    },
    // @ts-ignore
    _dark: {
      bg: "$backgroundDark900"
    },
    defaultProps: {
      softShadow: "3"
    }
  });

  // config/theme/Pressable.ts
  var import_react89 = __require("./mock.js");
  var Pressable = (0, import_react89.createStyle)({
    _web: {
      ":focusVisible": {
        outlineWidth: "2px",
        outlineColor: "$primary700",
        outlineStyle: "solid",
        _dark: {
          outlineColor: "$primary300"
        }
      }
    }
  });

  // config/theme/Progress.ts
  var import_react90 = __require("./mock.js");
  var Progress = (0, import_react90.createStyle)({
    bg: "$backgroundLight300",
    borderRadius: "$full",
    w: "100%",
    variants: {
      size: {
        xs: {
          h: "$1",
          _filledTrack: {
            h: "$1"
          }
        },
        sm: {
          h: "$2",
          _filledTrack: {
            h: "$2"
          }
        },
        md: {
          h: "$3",
          _filledTrack: {
            h: "$3"
          }
        },
        lg: {
          h: "$4",
          _filledTrack: {
            h: "$4"
          }
        },
        xl: {
          h: "$5",
          _filledTrack: {
            h: "$5"
          }
        },
        "2xl": {
          h: "$6",
          _filledTrack: {
            h: "$6"
          }
        }
      }
    },
    _dark: {
      bg: "$backgroundDark700"
    },
    defaultProps: {
      size: "md"
    }
  });

  // config/theme/ProgressFilledTrack.ts
  var import_react91 = __require("./mock.js");
  var ProgressFilledTrack = (0, import_react91.createStyle)({
    bg: "$primary500",
    borderRadius: "$full",
    _dark: {
      bg: "$primary400"
    }
  });

  // config/theme/Radio.ts
  var import_react92 = __require("./mock.js");
  var Radio = (0, import_react92.createStyle)({
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    variants: {
      size: {
        lg: {
          _text: {
            props: {
              size: "lg"
            }
          },
          _icon: {
            props: {
              size: "md"
            }
          },
          _indicator: {
            p: 2,
            h: "$6",
            w: "$6"
          }
        },
        md: {
          _text: {
            props: {
              size: "md"
            }
          },
          _icon: {
            props: {
              size: "sm"
            }
          },
          _indicator: {
            p: 1.5,
            h: "$5",
            w: "$5"
          }
        },
        sm: {
          _text: {
            props: {
              size: "sm"
            }
          },
          _icon: {
            props: {
              size: "2xs"
            }
          },
          _indicator: {
            p: 1,
            h: "$4",
            w: "$4"
          }
        }
      }
    },
    defaultProps: {
      size: "md"
    },
    _web: {
      cursor: "pointer",
      ":disabled": {
        cursor: "not-allowed"
      }
    }
  });

  // config/theme/RadioGroup.ts
  var import_react93 = __require("./mock.js");
  var RadioGroup = (0, import_react93.createStyle)({});

  // config/theme/RadioIcon.ts
  var import_react94 = __require("./mock.js");
  var RadioIcon = (0, import_react94.createStyle)({
    borderRadius: "$full",
    ":checked": {
      color: "$primary600",
      ":hover": {
        color: "$primary700",
        ":disabled": {
          color: "$primary600"
        }
      }
    },
    _dark: {
      ":checked": {
        color: "$primary500",
        ":disabled": {
          color: "$primary500"
        },
        ":hover": {
          ":disabled": {
            color: "$primary500"
          },
          color: "$primary400"
        }
      }
    }
  });

  // config/theme/RadioIndicator.ts
  var import_react95 = __require("./mock.js");
  var RadioIndicator = (0, import_react95.createStyle)({
    justifyContent: "center",
    alignItems: "center",
    bg: "transparent",
    borderColor: "$borderLight400",
    borderWidth: 2,
    borderRadius: 999,
    _web: {
      ":focusVisible": {
        outlineWidth: 2,
        outlineColor: "$primary700",
        outlineStyle: "solid",
        _dark: {
          outlineColor: "$primary400"
        }
      }
    },
    ":checked": {
      borderColor: "$primary600",
      bg: "transparent"
    },
    ":hover": {
      borderColor: "$borderLight500",
      bg: "transparent",
      ":checked": {
        bg: "transparent",
        borderColor: "$primary700"
      },
      ":invalid": {
        borderColor: "$error700"
      },
      ":disabled": {
        ":invalid": {
          borderColor: "$error400",
          opacity: 0.4
        },
        borderColor: "$borderLight400",
        opacity: 0.4
      }
    },
    ":active": {
      bg: "transparent",
      borderColor: "$primary800"
    },
    _dark: {
      borderColor: "$borderDark500",
      bg: "$transparent",
      ":hover": {
        borderColor: "$borderDark400",
        bg: "transparent",
        ":checked": {
          bg: "transparent",
          borderColor: "$primary400"
        },
        ":invalid": {
          borderColor: "$error400"
        },
        ":disabled": {
          borderColor: "$borderDark500",
          opacity: 0.4,
          ":checked": {
            bg: "transparent",
            borderColor: "$primary500"
          },
          ":invalid": {
            borderColor: "$error400"
          }
        }
      },
      ":checked": {
        borderColor: "$primary500"
      },
      ":active": {
        bg: "transparent",
        borderColor: "$primary300"
      },
      ":invalid": {
        borderColor: "$error400"
      }
    },
    ":invalid": {
      borderColor: "$error700"
    },
    ":disabled": {
      opacity: 0.4,
      ":checked": {
        borderColor: "$borderLight400",
        bg: "transparent"
      },
      ":invalid": {
        borderColor: "$error400"
      }
    }
  });

  // config/theme/RadioLabel.ts
  var import_react96 = __require("./mock.js");
  var RadioLabel = (0, import_react96.createStyle)({
    color: "$textLight600",
    ":checked": {
      color: "$textLight900"
    },
    ":hover": {
      color: "$textLight900",
      ":checked": {
        color: "$textLight900"
      },
      ":disabled": {
        color: "$textLight600",
        ":checked": {
          color: "$textLight900"
        }
      }
    },
    ":active": {
      color: "$textLight900",
      ":checked": {
        color: "$textLight900"
      }
    },
    ":disabled": {
      opacity: 0.4
    },
    _web: {
      MozUserSelect: "none",
      WebkitUserSelect: "none",
      msUserSelect: "none"
    },
    userSelect: "none",
    _dark: {
      color: "$textDark400",
      ":checked": {
        color: "$textDark100"
      },
      ":hover": {
        color: "$textDark100",
        ":checked": {
          color: "$textDark100"
        },
        ":disabled": {
          color: "$textDark400",
          ":checked": {
            color: "$textDark100"
          }
        }
      },
      ":active": {
        color: "$textDark100",
        ":checked": {
          color: "$textDark100"
        }
      }
    }
  });

  // config/theme/ScrollView.ts
  var import_react97 = __require("./mock.js");
  var ScrollView = (0, import_react97.createStyle)({});

  // config/theme/SectionList.ts
  var import_react98 = __require("./mock.js");
  var SectionList = (0, import_react98.createStyle)({});

  // config/theme/Select.ts
  var import_react99 = __require("./mock.js");
  var Select = (0, import_react99.createStyle)({});

  // config/theme/SelectActionsheet.ts
  var import_react100 = __require("./mock.js");
  var SelectActionsheet = (0, import_react100.createStyle)({
    width: "$full",
    height: "$full",
    justifyContent: "flex-end",
    alignItems: "center"
  });

  // config/theme/SelectActionsheetBackdrop.ts
  var import_react101 = __require("./mock.js");
  var SelectActionsheetBackdrop = (0, import_react101.createStyle)({
    ":initial": {
      opacity: 0
    },
    ":animate": {
      opacity: 0.5
    },
    ":exit": {
      opacity: 0
    },
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    bg: "$backgroundLight950",
    // @ts-ignore
    _dark: {
      bg: "$backgroundDark950"
    },
    // @ts-ignore
    _web: {
      cursor: "default"
    }
  });

  // config/theme/SelectActionsheetContent.ts
  var import_react102 = __require("./mock.js");
  var SelectActionsheetContent = (0, import_react102.createStyle)({
    alignItems: "center",
    borderTopLeftRadius: "$3xl",
    borderTopRightRadius: "$3xl",
    maxHeight: "70%",
    p: "$2",
    bg: "$backgroundLight0",
    _sectionHeaderBackground: {
      bg: "$backgroundLight0"
    },
    // @ts-ignore
    _dark: {
      bg: "$backgroundDark900",
      _sectionHeaderBackground: {
        bg: "$backgroundDark900"
      }
    },
    userSelect: "none",
    defaultProps: {
      hardShadow: "5"
    }
  });

  // config/theme/SelectActionsheetDragIndicator.ts
  var import_react103 = __require("./mock.js");
  var SelectActionsheetDragIndicator = (0, import_react103.createStyle)({
    height: "$1",
    width: "$16",
    bg: "$backgroundLight400",
    rounded: "$full",
    _dark: {
      bg: "$backgroundDark500"
    }
  });

  // config/theme/SelectActionsheetFlatList.ts
  var import_react104 = __require("./mock.js");
  var SelectActionsheetFlatList = (0, import_react104.createStyle)({
    w: "$full",
    h: "auto"
  });

  // config/theme/SelectActionsheetIcon.ts
  var import_react105 = __require("./mock.js");
  var SelectActionsheetIcon = (0, import_react105.createStyle)({
    w: "$4",
    h: "$4",
    mr: "$2",
    color: "$backgroundLight500",
    _dark: {
      // @ts-ignore
      color: "$backgroundDark400"
    },
    props: {
      size: "md"
    }
  });

  // config/theme/SelectActionsheetIndicatorWrapper.ts
  var import_react106 = __require("./mock.js");
  var SelectActionsheetIndicatorWrapper = (0, import_react106.createStyle)({
    py: "$1",
    w: "$full",
    alignItems: "center"
  });

  // config/theme/SelectActionsheetItem.ts
  var import_react107 = __require("./mock.js");
  var SelectActionsheetItem = (0, import_react107.createStyle)({
    p: "$3",
    flexDirection: "row",
    alignItems: "center",
    rounded: "$sm",
    w: "$full",
    ":disabled": {
      opacity: 0.4,
      _web: {
        // @ts-ignore
        pointerEvents: "all !important",
        cursor: "not-allowed"
      }
    },
    ":hover": {
      bg: "$backgroundLight100"
    },
    ":active": {
      bg: "$backgroundLight200"
    },
    ":focus": {
      bg: "$backgroundLight100"
    },
    _dark: {
      ":hover": {
        bg: "$backgroundDark800"
      },
      ":active": {
        bg: "$backgroundDark700"
      },
      ":focus": {
        bg: "$backgroundDark800"
      }
    },
    _web: {
      ":focusVisible": {
        bg: "$backgroundLight100",
        _dark: {
          bg: "$backgroundDark700"
        }
      }
    }
  });

  // config/theme/SelectActionsheetItemText.ts
  var import_react108 = __require("./mock.js");
  var SelectActionsheetItemText = (0, import_react108.createStyle)({
    mx: "$2",
    fontSize: "$md",
    fontFamily: "$body",
    fontWeight: "$normal",
    lineHeight: "$md",
    color: "$textLight700",
    _dark: {
      color: "$textDark200"
    }
  });

  // config/theme/SelectActionsheetScrollView.ts
  var import_react109 = __require("./mock.js");
  var SelectActionsheetScrollView = (0, import_react109.createStyle)({
    w: "$full",
    h: "auto"
  });

  // config/theme/SelectActionsheetSectionHeaderText.ts
  var import_react110 = __require("./mock.js");
  var SelectActionsheetSectionHeaderText = (0, import_react110.createStyle)({
    color: "$textLight500",
    fontSize: "$sm",
    fontFamily: "$body",
    fontWeight: "$bold",
    lineHeight: "$xs",
    textTransform: "uppercase",
    p: "$3",
    _dark: {
      color: "$textDark400"
    }
  });

  // config/theme/SelectActionsheetSectionList.ts
  var import_react111 = __require("./mock.js");
  var SelectActionsheetSectionList = (0, import_react111.createStyle)({
    w: "$full",
    h: "auto"
  });

  // config/theme/SelectActionsheetVirtualizedList.ts
  var import_react112 = __require("./mock.js");
  var SelectActionsheetVirtualizedList = (0, import_react112.createStyle)({
    w: "$full",
    h: "auto"
  });

  // config/theme/SelectIcon.ts
  var import_react113 = __require("./mock.js");
  var SelectIcon = (0, import_react113.createStyle)({
    props: {
      size: "md"
    }
  });

  // config/theme/SelectInput.ts
  var import_react114 = __require("./mock.js");
  var SelectInput = (0, import_react114.createStyle)({
    _web: {
      w: "$full"
    },
    pointerEvents: "none",
    flex: 1,
    h: "$full",
    color: "$textLight900",
    props: {
      placeholderTextColor: "$textLight500"
    },
    _dark: {
      color: "$textDark50",
      props: {
        placeholderTextColor: "$textDark400"
      }
    }
  });

  // config/theme/SelectTrigger.ts
  var import_react115 = __require("./mock.js");
  var SelectTrigger = (0, import_react115.createStyle)({
    borderWidth: 1,
    borderColor: "$backgroundLight300",
    borderRadius: "$sm",
    flexDirection: "row",
    overflow: "hidden",
    alignItems: "center",
    ":hover": {
      borderColor: "$borderLight400"
    },
    ":focus": {
      borderColor: "$primary700"
    },
    ":disabled": {
      opacity: 0.4,
      ":hover": {
        borderColor: "$backgroundLight300"
      }
    },
    _input: {
      py: "auto",
      px: "$3"
    },
    _icon: {
      color: "$backgroundLight500",
      _dark: {
        color: "$backgroundLight500"
      }
    },
    _dark: {
      borderColor: "$borderDark700",
      ":hover": {
        borderColor: "$borderDark400"
      },
      ":focus": {
        borderColor: "$primary400"
      },
      ":disabled": {
        ":hover": {
          borderColor: "$borderDark700"
        }
      }
    },
    variants: {
      size: {
        xl: {
          h: "$12",
          _input: {
            fontSize: "$xl"
          },
          _icon: {
            h: "$6",
            w: "$6"
          }
        },
        lg: {
          h: "$11",
          _input: {
            fontSize: "$lg"
          },
          _icon: {
            h: "$5",
            w: "$5"
          }
        },
        md: {
          h: "$10",
          _input: {
            fontSize: "$md"
          },
          _icon: {
            h: "$4",
            w: "$4"
          }
        },
        sm: {
          h: "$9",
          _input: {
            fontSize: "$sm"
          },
          _icon: {
            h: "$3.5",
            w: "$3.5"
          }
        }
      },
      variant: {
        underlined: {
          _input: {
            _web: {
              outlineWidth: 0,
              outline: "none"
            },
            px: "$0"
          },
          borderWidth: 0,
          borderRadius: 0,
          borderBottomWidth: "$1",
          ":focus": {
            borderColor: "$primary700",
            _web: {
              boxShadow: "inset 0 -1px 0 0 $primary700"
            },
            ":hover": {
              borderColor: "$primary700",
              _web: {
                boxShadow: "inset 0 -1px 0 0 $primary600"
              }
            }
          },
          ":invalid": {
            borderBottomWidth: 2,
            borderBottomColor: "$error700",
            _web: {
              boxShadow: "inset 0 -1px 0 0 $error700"
            },
            ":hover": {
              borderBottomColor: "$error700"
            },
            ":focus": {
              borderBottomColor: "$error700",
              ":hover": {
                borderBottomColor: "$error700",
                _web: {
                  boxShadow: "inset 0 -1px 0 0 $error700"
                }
              }
            },
            ":disabled": {
              ":hover": {
                borderBottomColor: "$error700",
                _web: {
                  boxShadow: "inset 0 -1px 0 0 $error700"
                }
              }
            }
          },
          _dark: {
            ":focus": {
              borderColor: "$primary400",
              _web: {
                boxShadow: "inset 0 -1px 0 0 $primary400"
              }
            },
            ":invalid": {
              borderColor: "$error400",
              _web: {
                boxShadow: "inset 0 -1px 0 0 $error400"
              },
              ":hover": {
                borderBottomColor: "$error400"
              },
              ":focus": {
                borderBottomColor: "$error400",
                ":hover": {
                  borderBottomColor: "$error400",
                  _web: {
                    boxShadow: "inset 0 -1px 0 0 $error400"
                  }
                }
              },
              ":disabled": {
                ":hover": {
                  borderBottomColor: "$error400",
                  _web: {
                    boxShadow: "inset 0 -1px 0 0 $error400"
                  }
                }
              }
            }
          }
        },
        outline: {
          _input: {
            _web: {
              outlineWidth: 0,
              outline: "none"
            }
          },
          ":focus": {
            borderColor: "$primary700",
            _web: {
              boxShadow: "inset 0 0 0 1px $primary700"
            },
            ":hover": {
              borderColor: "$primary700",
              _web: {
                boxShadow: "inset 0 0 0 1px $primary600"
              }
            }
          },
          ":invalid": {
            borderColor: "$error700",
            _web: {
              boxShadow: "inset 0 0 0 1px $error700"
            },
            ":hover": {
              borderColor: "$error700"
            },
            ":focus": {
              borderColor: "$error700",
              ":hover": {
                borderColor: "$error700",
                _web: {
                  boxShadow: "inset 0 0 0 1px $error700"
                }
              }
            },
            ":disabled": {
              ":hover": {
                borderColor: "$error700",
                _web: {
                  boxShadow: "inset 0 0 0 1px $error700"
                }
              }
            }
          },
          _dark: {
            ":focus": {
              borderColor: "$primary400",
              _web: {
                boxShadow: "inset 0 0 0 1px $primary400"
              }
            },
            ":invalid": {
              borderColor: "$error400",
              _web: {
                boxShadow: "inset 0 0 0 1px $error400"
              },
              ":hover": {
                borderColor: "$error400"
              },
              ":focus": {
                borderColor: "$error400",
                ":hover": {
                  borderColor: "$error400",
                  _web: {
                    boxShadow: "inset 0 0 0 1px $error400"
                  }
                }
              },
              ":disabled": {
                ":hover": {
                  borderColor: "$error400",
                  _web: {
                    boxShadow: "inset 0 0 0 1px $error400"
                  }
                }
              }
            }
          }
        },
        rounded: {
          borderRadius: 999,
          _input: {
            px: "$4",
            _web: {
              outlineWidth: 0,
              outline: "none"
            }
          },
          ":focus": {
            borderColor: "$primary700",
            _web: {
              boxShadow: "inset 0 0 0 1px $primary700"
            },
            ":hover": {
              borderColor: "$primary700",
              _web: {
                boxShadow: "inset 0 0 0 1px $primary600"
              }
            }
          },
          ":invalid": {
            borderColor: "$error700",
            _web: {
              boxShadow: "inset 0 0 0 1px $error700"
            },
            ":hover": {
              borderColor: "$error700"
            },
            ":focus": {
              borderColor: "$error700",
              ":hover": {
                borderColor: "$error700",
                _web: {
                  boxShadow: "inset 0 0 0 1px $error700"
                }
              }
            },
            ":disabled": {
              ":hover": {
                borderColor: "$error700",
                _web: {
                  boxShadow: "inset 0 0 0 1px $error700"
                }
              }
            }
          },
          _dark: {
            ":focus": {
              borderColor: "$primary400",
              _web: {
                boxShadow: "inset 0 0 0 1px $primary400"
              }
            },
            ":invalid": {
              borderColor: "$error400",
              _web: {
                boxShadow: "inset 0 0 0 1px $error400"
              },
              ":hover": {
                borderColor: "$error400"
              },
              ":focus": {
                borderColor: "$error400",
                ":hover": {
                  borderColor: "$error400",
                  _web: {
                    boxShadow: "inset 0 0 0 1px $error400"
                  }
                }
              },
              ":disabled": {
                ":hover": {
                  borderColor: "$error400",
                  _web: {
                    boxShadow: "inset 0 0 0 1px $error400"
                  }
                }
              }
            }
          }
        }
      }
    },
    defaultProps: {
      size: "md",
      variant: "outline"
    }
  });

  // config/theme/Slider.ts
  var import_react116 = __require("./mock.js");
  var Slider = (0, import_react116.createStyle)({
    justifyContent: "center",
    alignItems: "center",
    variants: {
      orientation: {
        horizontal: {
          w: "$full",
          _track: {
            width: "$full"
          },
          _filledTrack: {
            height: "$full"
          }
        },
        vertical: {
          h: "$full",
          _track: {
            height: "$full"
          },
          _filledTrack: {
            width: "$full"
          }
        }
      },
      isReversed: {
        true: {},
        false: {}
      },
      size: {
        sm: {
          _thumb: {
            h: "$4",
            w: "$4"
          }
        },
        md: {
          _thumb: {
            h: "$5",
            w: "$5"
          }
        },
        lg: {
          _thumb: {
            h: "$6",
            w: "$6"
          }
        }
      }
    },
    compoundVariants: [
      {
        orientation: "horizontal",
        size: "sm",
        value: {
          _track: {
            height: "$1",
            flexDirection: "row"
          }
        }
      },
      {
        orientation: "horizontal",
        size: "sm",
        isReversed: true,
        value: {
          _track: {
            height: "$1",
            flexDirection: "row-reverse"
          }
        }
      },
      {
        orientation: "horizontal",
        size: "md",
        value: {
          _track: {
            height: 5,
            flexDirection: "row"
          }
        }
      },
      {
        orientation: "horizontal",
        size: "md",
        isReversed: true,
        value: {
          _track: {
            height: 5,
            flexDirection: "row-reverse"
          }
        }
      },
      {
        orientation: "horizontal",
        size: "lg",
        value: {
          _track: {
            height: "$1.5",
            flexDirection: "row"
          }
        }
      },
      {
        orientation: "horizontal",
        size: "lg",
        isReversed: true,
        value: {
          _track: {
            height: "$1.5",
            flexDirection: "row-reverse"
          }
        }
      },
      {
        orientation: "vertical",
        size: "sm",
        value: {
          _track: {
            w: "$1",
            flexDirection: "column-reverse"
          }
        }
      },
      {
        orientation: "vertical",
        size: "sm",
        isReversed: true,
        value: {
          _track: {
            width: "$1",
            flexDirection: "column"
          }
        }
      },
      {
        orientation: "vertical",
        size: "md",
        value: {
          _track: {
            width: 5,
            flexDirection: "column-reverse"
          }
        }
      },
      {
        orientation: "vertical",
        size: "md",
        isReversed: true,
        value: {
          _track: {
            width: 5,
            flexDirection: "column"
          }
        }
      },
      {
        orientation: "vertical",
        size: "lg",
        value: {
          _track: {
            width: "$1.5",
            flexDirection: "column-reverse"
          }
        }
      },
      {
        orientation: "vertical",
        size: "lg",
        isReversed: true,
        value: {
          _track: {
            width: "$1.5",
            flexDirection: "column"
          }
        }
      }
    ],
    _web: {
      ":disabled": {
        // @ts-ignore
        pointerEvents: "all !important",
        cursor: "not-allowed",
        opacity: 0.4
      }
    },
    defaultProps: {
      size: "md",
      orientation: "horizontal"
    }
  });

  // config/theme/SliderFilledTrack.ts
  var import_react117 = __require("./mock.js");
  var SliderFilledTrack = (0, import_react117.createStyle)({
    bg: "$primary500",
    _dark: {
      bg: "$primary400"
    },
    ":focus": {
      bg: "$primary600",
      _dark: {
        bg: "$primary300"
      }
    },
    ":active": {
      bg: "$primary600",
      _dark: {
        bg: "$primary300"
      }
    },
    ":hover": {
      bg: "$primary600",
      _dark: {
        bg: "$primary300"
      }
    }
  });

  // config/theme/SliderThumb.ts
  var import_react118 = __require("./mock.js");
  var SliderThumb = (0, import_react118.createStyle)({
    bg: "$primary500",
    _dark: {
      bg: "$primary400"
    },
    position: "absolute",
    borderRadius: "$full",
    ":focus": {
      bg: "$primary600",
      _dark: {
        bg: "$primary300"
      }
    },
    ":active": {
      bg: "$primary600",
      _dark: {
        bg: "$primary300"
      }
    },
    ":hover": {
      bg: "$primary600",
      _dark: {
        bg: "$primary300"
      }
    },
    ":disabled": {
      bg: "$primary500",
      _dark: {
        bg: "$primary500"
      }
    },
    _web: {
      // @ts-ignore
      cursor: "pointer",
      ":active": {
        outlineWidth: 4,
        outlineStyle: "solid",
        outlineColor: "$primary400",
        _dark: {
          outlineColor: "$primary500"
        }
      },
      ":focus": {
        outlineWidth: 4,
        outlineStyle: "solid",
        outlineColor: "$primary400",
        _dark: {
          outlineColor: "$primary500"
        }
      }
    },
    defaultProps: {
      hardShadow: "1"
    }
  });

  // config/theme/SliderThumbInteraction.ts
  var import_react119 = __require("./mock.js");
  var SliderThumbInteraction = (0, import_react119.createStyle)({
    borderRadius: 9999,
    zIndex: -1
  });

  // config/theme/SliderTrack.ts
  var import_react120 = __require("./mock.js");
  var SliderTrack = (0, import_react120.createStyle)({
    // h: '100%',
    // w: '100%',
    bg: "$backgroundLight300",
    _dark: {
      bg: "$backgroundDark700"
    },
    borderRadius: "$lg",
    overflow: "hidden",
    variants: {
      variant: {
        horizontal: {
          width: "100%"
        },
        vertical: {
          height: "100%"
        }
      }
    }
  });

  // config/theme/Spinner.ts
  var import_react121 = __require("./mock.js");
  var Spinner = (0, import_react121.createStyle)({
    props: {
      color: "$primary500"
    },
    _dark: {
      props: {
        color: "$primary400"
      }
    }
  });

  // config/theme/StatusBar.ts
  var import_react122 = __require("./mock.js");
  var StatusBar = (0, import_react122.createStyle)({});

  // config/theme/Switch.ts
  var import_react123 = __require("./mock.js");
  var Switch = (0, import_react123.createStyle)({
    props: {
      // todo: add support for this in style.gluestack.io
      // trackColor: { false: '$backgroundLight300', true: '$primary600' },
      // hacky fix for the above
      // @ts-ignore
      trackColor: { false: "$backgroundLight300", true: "$primary600" },
      thumbColor: "$backgroundLight0",
      // @ts-ignore
      activeThumbColor: "$backgroundLight0",
      // for ios specifically in unchecked state
      ios_backgroundColor: "$backgroundLight300"
    },
    borderRadius: "$full",
    variants: {
      // @ts-ignore
      size: {
        sm: {
          transform: [
            {
              scale: 0.75
            }
          ]
        },
        md: {},
        lg: {
          transform: [
            {
              scale: 1.25
            }
          ]
        }
      }
    },
    _web: {
      ":focus": {
        outlineWidth: 0,
        outlineColor: "$primary700",
        outlineStyle: "solid",
        _dark: {
          // @ts-ignore
          outlineColor: "$primary600",
          outlineWidth: 0,
          outlineStyle: "solid"
        }
      }
    },
    defaultProps: {
      size: "md"
    },
    ":disabled": {
      _web: {
        cursor: "pointer",
        ":disabled": {
          cursor: "not-allowed"
        }
      },
      opacity: 0.4,
      // @ts-ignore
      trackColor: { false: "$backgroundLight300", true: "$primary600" },
      // for ios specifically in unchecked state
      ios_backgroundColor: "$backgroundLight300",
      ":hover": {
        props: {
          // @ts-ignore
          trackColor: { false: "$backgroundLight300", true: "$primary600" }
        }
      }
    },
    ":invalid": {
      borderColor: "$error700",
      borderRadius: 12,
      borderWidth: 2
    },
    ":hover": {
      props: {
        // todo: add support for this in style.gluestack.io
        // trackColor: { false: '$backgroundLight400', true: '$primary700' },
        // hacky fix for the above
        // @ts-ignore
        trackColor: { false: "$backgroundLight400", true: "$primary700" },
        ios_backgroundColor: "$backgroundLight400"
      },
      ":invalid": {
        props: {
          // todo: add support for this in style.gluestack.io
          // trackColor: { false: '$backgroundLight400', true: '$primary700' },
          // hacky fix for the above
          // @ts-ignore
          trackColor: { false: "$backgroundLight300", true: "$primary700" }
        }
      }
    },
    ":checked": {
      props: {
        // @ts-ignore
        thumbColor: "$backgroundLight0"
      }
    },
    _dark: {
      props: {
        // @ts-ignore
        trackColor: { false: "$backgroundDark700", true: "$primary500" },
        thumbColor: "$backgroundDark0",
        // @ts-ignore
        activeThumbColor: "$backgroundDark0"
      },
      ":invalid": {
        borderColor: "$error400",
        borderRadius: 12,
        borderWidth: 2
      },
      ":hover": {
        props: {
          // @ts-ignore
          trackColor: { false: "$backgroundDark600", true: "$primary600" },
          ios_backgroundColor: "$backgroundLight400"
        },
        ":invalid": {
          props: {
            // todo: add support for this in style.gluestack.io
            // trackColor: { false: '$backgroundLight400', true: '$primary700' },
            // hacky fix for the above
            // @ts-ignore
            trackColor: { false: "$backgroundDark700", true: "$primary600" }
          }
        }
      },
      ":disabled": {
        _web: {
          cursor: "pointer",
          ":disabled": {
            cursor: "not-allowed"
          }
        },
        opacity: 0.4,
        // @ts-ignore
        trackColor: { false: "$backgroundLight300", true: "$primary500" },
        // for ios specifically in unchecked state
        ios_backgroundColor: "$backgroundLight300",
        ":hover": {
          props: {
            // @ts-ignore
            trackColor: { false: "$backgroundDark700", true: "$primary500" }
          }
        }
      }
    }
  });

  // config/theme/Tabs.ts
  var import_react124 = __require("./mock.js");
  var Tabs = (0, import_react124.createStyle)({});

  // config/theme/TabsTab.ts
  var import_react125 = __require("./mock.js");
  var TabsTab = (0, import_react125.createStyle)({
    bg: "transparent",
    _web: {
      outlineWidth: 0
    },
    variants: {
      size: {
        md: {
          px: "$4",
          py: "$2",
          _text: {
            fontSize: "$md",
            lineHeight: "$md"
          }
        }
      }
    },
    defaultProps: {
      size: "md"
    },
    ":hover": {
      // bg: '$secondary50_alpha_20',
      borderRadius: "$full"
    },
    ":active": {
      // bg: '$secondary50_alpha_10',
      borderRadius: "$full"
    },
    ":focus": {
      // bg: '$secondary50_alpha_20',
      borderRadius: "$full"
    },
    ":disabled": {
      opacity: 0.5
    },
    _dark: {
      ":hover": {
        bg: "$backgroundLight500",
        borderRadius: "$full"
      },
      ":active": {
        bg: "$backgroundLight400",
        borderRadius: "$full"
      },
      ":focus": {
        bg: "$backgroundLight400",
        borderRadius: "$full"
      },
      ":disabled": {
        opacity: 0.5
      }
    }
  });

  // config/theme/TabsTabIcon.ts
  var import_react126 = __require("./mock.js");
  var TabsTabIcon = (0, import_react126.createStyle)({
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    mr: 12
  });

  // config/theme/TabsTabList.ts
  var import_react127 = __require("./mock.js");
  var TabsTabList = (0, import_react127.createStyle)({
    flexDirection: "row",
    alignSelf: "flex-start",
    // bg: 'radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 100%) , rgba(255, 255, 255, 0.04);',
    rounded: "$full"
  });

  // config/theme/TabsTabPanel.ts
  var import_react128 = __require("./mock.js");
  var TabsTabPanel = (0, import_react128.createStyle)({});

  // config/theme/TabsTabPanels.ts
  var import_react129 = __require("./mock.js");
  var TabsTabPanels = (0, import_react129.createStyle)({});

  // config/theme/TabsTabTitle.ts
  var import_react130 = __require("./mock.js");
  var TabsTabTitle = (0, import_react130.createStyle)({
    fontFamily: "$body"
  });

  // config/theme/Text.ts
  var import_react131 = __require("./mock.js");
  var Text = (0, import_react131.createStyle)({
    color: "$textLight700",
    _dark: {
      color: "$textDark200"
    },
    fontWeight: "$normal",
    fontFamily: "$body",
    fontStyle: "normal",
    letterSpacing: "$md",
    variants: {
      isTruncated: {
        true: {
          props: {
            // @ts-ignore
            numberOfLines: 1,
            ellipsizeMode: "tail"
          }
        }
      },
      bold: {
        true: {
          fontWeight: "$bold"
        }
      },
      underline: {
        true: {
          textDecorationLine: "underline"
        }
      },
      strikeThrough: {
        true: {
          textDecorationLine: "line-through"
        }
      },
      sub: {
        true: {
          fontSize: "$xs",
          lineHeight: "$xs"
        }
      },
      italic: {
        true: {
          fontStyle: "italic"
        }
      },
      highlight: {
        true: {
          bg: "$yellow500"
        }
      },
      size: {
        "2xs": {
          fontSize: "$2xs",
          lineHeight: "$2xs"
        },
        xs: {
          fontSize: "$xs",
          lineHeight: "$sm"
        },
        sm: {
          fontSize: "$sm",
          lineHeight: "$sm"
        },
        md: {
          fontSize: "$md",
          lineHeight: "$md"
        },
        lg: {
          fontSize: "$lg",
          lineHeight: "$xl"
        },
        xl: {
          fontSize: "$xl",
          lineHeight: "$xl"
        },
        "2xl": {
          fontSize: "$2xl",
          lineHeight: "$2xl"
        },
        "3xl": {
          fontSize: "$3xl",
          lineHeight: "$3xl"
        },
        "4xl": {
          fontSize: "$4xl",
          lineHeight: "$4xl"
        },
        "5xl": {
          fontSize: "$5xl",
          lineHeight: "$6xl"
        },
        "6xl": {
          fontSize: "$6xl",
          lineHeight: "$7xl"
        }
      }
    },
    defaultProps: {
      size: "md"
    }
  });

  // config/theme/Textarea.ts
  var import_react132 = __require("./mock.js");
  var Textarea = (0, import_react132.createStyle)({
    w: "100%",
    borderWidth: 1,
    borderColor: "$backgroundLight300",
    borderRadius: "$sm",
    h: 100,
    _input: {
      p: "$3",
      _web: {
        outlineWidth: 0,
        outline: "none"
      }
    },
    ":hover": {
      borderColor: "$borderLight400"
    },
    ":focus": {
      borderColor: "$primary700",
      ":hover": {
        borderColor: "$primary700"
      }
    },
    ":disabled": {
      opacity: 0.4,
      ":hover": {
        borderColor: "$backgroundLight300"
      }
    },
    _dark: {
      borderColor: "$borderDark700",
      ":hover": {
        borderColor: "$borderDark600"
      },
      ":focus": {
        borderColor: "$primary400",
        ":hover": {
          borderColor: "$primary400"
        }
      },
      ":disabled": {
        ":hover": {
          borderColor: "$borderDark700"
        }
      }
    },
    variants: {
      size: {
        xl: {
          _input: {
            fontSize: "$xl"
          }
        },
        lg: {
          _input: {
            fontSize: "$lg"
          }
        },
        md: {
          _input: {
            fontSize: "$md"
          }
        },
        sm: {
          _input: {
            fontSize: "$sm"
          }
        }
      },
      variant: {
        default: {
          _input: {
            _web: {
              outlineWidth: "0",
              outline: "none"
            }
          },
          ":focus": {
            borderColor: "$primary700",
            _web: {
              boxShadow: "inset 0 0 0 1px $primary700"
            }
          },
          ":invalid": {
            borderColor: "$error700",
            _web: {
              boxShadow: "inset 0 0 0 1px $error700"
            },
            ":hover": {
              borderColor: "$error700"
            },
            ":focus": {
              ":hover": {
                borderColor: "$primary700",
                _web: {
                  boxShadow: "inset 0 0 0 1px $primary700"
                }
              }
            },
            ":disabled": {
              ":hover": {
                borderColor: "$error700",
                _web: {
                  boxShadow: "inset 0 0 0 1px $error700"
                }
              }
            }
          },
          _dark: {
            ":focus": {
              borderColor: "$primary400",
              _web: {
                boxShadow: "inset 0 0 0 1px $primary400"
              }
            },
            ":invalid": {
              borderColor: "$error400",
              _web: {
                boxShadow: "inset 0 0 0 1px $error400"
              },
              ":hover": {
                borderColor: "$error400"
              },
              ":focus": {
                ":hover": {
                  borderColor: "$primary400",
                  _web: {
                    boxShadow: "inset 0 0 0 1px $primary400"
                  }
                }
              },
              ":disabled": {
                ":hover": {
                  borderColor: "$error400",
                  _web: {
                    boxShadow: "inset 0 0 0 1px $error400"
                  }
                }
              }
            }
          }
        }
      }
    },
    defaultProps: {
      variant: "default",
      size: "md"
    }
  });

  // config/theme/TextareaInput.ts
  var import_react133 = __require("./mock.js");
  var TextareaInput = (0, import_react133.createStyle)({
    p: "$2",
    color: "$textLight900",
    textAlignVertical: "top",
    flex: 1,
    props: {
      // @ts-ignore
      multiline: true,
      placeholderTextColor: "$textLight500"
    },
    _dark: {
      color: "$textDark50",
      props: {
        placeholderTextColor: "$textDark400"
      }
    },
    _web: {
      cursor: "text",
      ":disabled": {
        cursor: "not-allowed"
      }
    }
  });

  // config/theme/ToastAnimationWrapper.ts
  var import_react134 = __require("./mock.js");
  var ToastAnimationWrapper = (0, import_react134.createStyle)({
    m: "$3",
    backgroundColor: "white",
    borderRadius: "$sm",
    flexDirection: "row",
    _web: {
      pointerEvents: "auto"
    },
    defaultProps: {
      hardShadow: "5"
    }
  });

  // config/theme/Toast.ts
  var import_react135 = __require("./mock.js");
  var Toast = (0, import_react135.createStyle)({
    px: "$4",
    py: "$3",
    borderRadius: "$sm",
    flexDirection: "row",
    variants: {
      action: {
        error: {
          bg: "$backgroundLightError",
          borderColor: "$error300",
          _icon: {
            color: "$error500"
          },
          _dark: {
            bg: "$backgroundDarkError",
            borderColor: "$error700",
            _icon: {
              color: "$error500"
            }
          }
        },
        warning: {
          bg: "$backgroundLightWarning",
          borderColor: "$warning300",
          _icon: {
            color: "$warning500"
          },
          _dark: {
            bg: "$backgroundDarkWarning",
            borderColor: "$warning700",
            _icon: {
              color: "$warning500"
            }
          }
        },
        success: {
          bg: "$backgroundLightSuccess",
          borderColor: "$success300",
          _icon: {
            color: "$success500"
          },
          _dark: {
            bg: "$backgroundDarkSuccess",
            borderColor: "$success700",
            _icon: {
              color: "$warning500"
            }
          }
        },
        info: {
          bg: "$backgroundLightInfo",
          borderColor: "$info300",
          _icon: {
            color: "$info500"
          },
          _dark: {
            bg: "$backgroundDarkInfo",
            borderColor: "$info700",
            _icon: {
              color: "$info500"
            }
          }
        },
        attention: {
          bg: "$backgroundLightMuted",
          borderColor: "$secondary300",
          _icon: {
            color: "$secondary600"
          },
          _dark: {
            bg: "$backgroundDarkMuted",
            borderColor: "$secondary700",
            _icon: {
              color: "$secondary400"
            }
          }
        }
      },
      variant: {
        solid: {},
        outline: {
          borderWidth: "$1",
          bg: "$white",
          _dark: {
            bg: "$black"
          }
        },
        accent: {
          borderLeftWidth: "$4"
        }
      }
    },
    _web: {
      pointerEvents: "auto"
    },
    defaultProps: {
      variant: "solid",
      action: "attention"
    }
  });

  // config/theme/ToastDescription.ts
  var import_react136 = __require("./mock.js");
  var ToastDescription = (0, import_react136.createStyle)({
    color: "$textLight700",
    _dark: {
      color: "$textDark200"
    },
    props: {
      size: "sm"
    }
  });

  // config/theme/ToastTitle.ts
  var import_react137 = __require("./mock.js");
  var ToastTitle = (0, import_react137.createStyle)({
    fontWeight: "$medium",
    props: {
      size: "md"
    },
    color: "$textLight900",
    _dark: {
      color: "$textDark50"
    }
  });

  // config/theme/Tooltip.ts
  var import_react138 = __require("./mock.js");
  var Tooltip = (0, import_react138.createStyle)({
    width: "$full",
    height: "$full"
  });

  // config/theme/TooltipContent.ts
  var import_react139 = __require("./mock.js");
  var TooltipContent = (0, import_react139.createStyle)({
    ":initial": {
      opacity: 0,
      scale: 0.5
    },
    ":animate": {
      opacity: 1,
      scale: 1
    },
    ":exit": {
      opacity: 0,
      scale: 0.5
    },
    ":transition": {
      type: "spring",
      damping: 18,
      stiffness: 250,
      opacity: {
        type: "timing",
        duration: 250
      }
    },
    py: "$1",
    px: "$3",
    borderRadius: "$sm",
    bg: "$backgroundLight900",
    _text: {
      fontSize: "$xs",
      color: "$textLight50"
    },
    // @ts-ignore
    _dark: {
      bg: "$backgroundDark800",
      _text: {
        color: "$textDark50"
      }
    },
    defaultProps: {
      hardShadow: "2"
    }
  });

  // config/theme/TooltipText.ts
  var import_react140 = __require("./mock.js");
  var TooltipText = (0, import_react140.createStyle)({
    color: "$red400",
    fontFamily: "$body",
    userSelect: "none"
  });

  // config/theme/VStack.ts
  var import_react141 = __require("./mock.js");
  var VStack = (0, import_react141.createStyle)({
    flexDirection: "column",
    variants: {
      space: {
        xs: {
          gap: "$1"
        },
        sm: {
          gap: "$2"
        },
        md: {
          gap: "$3"
        },
        lg: {
          gap: "$4"
        },
        xl: {
          gap: "$5"
        },
        "2xl": {
          gap: "$6"
        },
        "3xl": {
          gap: "$7"
        },
        "4xl": {
          gap: "$8"
        }
      },
      reversed: {
        true: {
          flexDirection: "column-reverse"
        }
      }
    }
  });

  // config/theme/View.ts
  var import_react142 = __require("./mock.js");
  var View = (0, import_react142.createStyle)({});

  // config/gluestack-ui.config.ts
  var gluestackUIConfig = (0, import_react143.createConfig)({
    aliases: {
      bg: "backgroundColor",
      bgColor: "backgroundColor",
      h: "height",
      w: "width",
      p: "padding",
      px: "paddingHorizontal",
      py: "paddingVertical",
      pt: "paddingTop",
      pb: "paddingBottom",
      pr: "paddingRight",
      pl: "paddingLeft",
      m: "margin",
      mx: "marginHorizontal",
      my: "marginVertical",
      mt: "marginTop",
      mb: "marginBottom",
      mr: "marginRight",
      ml: "marginLeft",
      rounded: "borderRadius"
    },
    tokens: {
      colors: {
        // Bilisound custom
        primary0: "#f7fffd",
        primary50: "#eefffa",
        primary100: "#c6fff1",
        primary200: "#8effe6",
        primary300: "#4dfbd8",
        primary400: "#19e8c4",
        primary500: "#00ba9d",
        primary600: "#00a48e",
        primary700: "#028373",
        primary800: "#08675d",
        primary900: "#0c554d",
        primary950: "#003431",
        // Bilisound custom
        accent0: "#f7fcff",
        accent50: "#f0f9ff",
        accent100: "#dff2ff",
        accent200: "#b8e5ff",
        accent300: "#66ccff",
        accent400: "#33bdfd",
        accent500: "#09a5ee",
        accent600: "#0083cc",
        accent700: "#0068a5",
        accent800: "#045988",
        accent900: "#0a4a70",
        accent950: "#062e4b",
        rose50: "#fff1f2",
        rose100: "#ffe4e6",
        rose200: "#fecdd3",
        rose300: "#fda4af",
        rose400: "#fb7185",
        rose500: "#f43f5e",
        rose600: "#e11d48",
        rose700: "#be123c",
        rose800: "#9f1239",
        rose900: "#881337",
        pink50: "#fdf2f8",
        pink100: "#fce7f3",
        pink200: "#fbcfe8",
        pink300: "#f9a8d4",
        pink400: "#f472b6",
        pink500: "#ec4899",
        pink600: "#db2777",
        pink700: "#be185d",
        pink800: "#9d174d",
        pink900: "#831843",
        fuchsia50: "#fdf4ff",
        fuchsia100: "#fae8ff",
        fuchsia200: "#f5d0fe",
        fuchsia300: "#f0abfc",
        fuchsia400: "#e879f9",
        fuchsia500: "#d946ef",
        fuchsia600: "#c026d3",
        fuchsia700: "#a21caf",
        fuchsia800: "#86198f",
        fuchsia900: "#701a75",
        purple50: "#faf5ff",
        purple100: "#f3e8ff",
        purple200: "#e9d5ff",
        purple300: "#d8b4fe",
        purple400: "#c084fc",
        purple500: "#a855f7",
        purple600: "#9333ea",
        purple700: "#7e22ce",
        purple800: "#6b21a8",
        purple900: "#581c87",
        violet50: "#f5f3ff",
        violet100: "#ede9fe",
        violet200: "#ddd6fe",
        violet300: "#c4b5fd",
        violet400: "#a78bfa",
        violet500: "#8b5cf6",
        violet600: "#7c3aed",
        violet700: "#6d28d9",
        violet800: "#5b21b6",
        violet900: "#4c1d95",
        indigo50: "#eef2ff",
        indigo100: "#e0e7ff",
        indigo200: "#c7d2fe",
        indigo300: "#a5b4fc",
        indigo400: "#818cf8",
        indigo500: "#6366f1",
        indigo600: "#4f46e5",
        indigo700: "#4338ca",
        indigo800: "#3730a3",
        indigo900: "#312e81",
        blue50: "#eff6ff",
        blue100: "#dbeafe",
        blue200: "#bfdbfe",
        blue300: "#93c5fd",
        blue400: "#60a5fa",
        blue500: "#3b82f6",
        blue600: "#2563eb",
        blue700: "#1d4ed8",
        blue800: "#1e40af",
        blue900: "#1e3a8a",
        lightBlue50: "#f0f9ff",
        lightBlue100: "#e0f2fe",
        lightBlue200: "#bae6fd",
        lightBlue300: "#7dd3fc",
        lightBlue400: "#38bdf8",
        lightBlue500: "#0ea5e9",
        lightBlue600: "#0284c7",
        lightBlue700: "#0369a1",
        lightBlue800: "#075985",
        lightBlue900: "#0c4a6e",
        darkBlue50: "#dbf4ff",
        darkBlue100: "#addbff",
        darkBlue200: "#7cc2ff",
        darkBlue300: "#4aa9ff",
        darkBlue400: "#1a91ff",
        darkBlue500: "#0077e6",
        darkBlue600: "#005db4",
        darkBlue700: "#004282",
        darkBlue800: "#002851",
        darkBlue900: "#000e21",
        cyan50: "#ecfeff",
        cyan100: "#cffafe",
        cyan200: "#a5f3fc",
        cyan300: "#67e8f9",
        cyan400: "#22d3ee",
        cyan500: "#06b6d4",
        cyan600: "#0891b2",
        cyan700: "#0e7490",
        cyan800: "#155e75",
        cyan900: "#164e63",
        teal50: "#f0fdfa",
        teal100: "#ccfbf1",
        teal200: "#99f6e4",
        teal300: "#5eead4",
        teal400: "#2dd4bf",
        teal500: "#14b8a6",
        teal600: "#0d9488",
        teal700: "#0f766e",
        teal800: "#115e59",
        teal900: "#134e4a",
        emerald50: "#ecfdf5",
        emerald100: "#d1fae5",
        emerald200: "#a7f3d0",
        emerald300: "#6ee7b7",
        emerald400: "#34d399",
        emerald500: "#10b981",
        emerald600: "#059669",
        emerald700: "#047857",
        emerald800: "#065f46",
        emerald900: "#064e3b",
        green50: "#f0fdf4",
        green100: "#dcfce7",
        green200: "#bbf7d0",
        green300: "#86efac",
        green400: "#4ade80",
        green500: "#22c55e",
        green600: "#16a34a",
        green700: "#15803d",
        green800: "#166534",
        green900: "#14532d",
        lime50: "#f7fee7",
        lime100: "#ecfccb",
        lime200: "#d9f99d",
        lime300: "#bef264",
        lime400: "#a3e635",
        lime500: "#84cc16",
        lime600: "#65a30d",
        lime700: "#4d7c0f",
        lime800: "#3f6212",
        lime900: "#365314",
        yellow50: "#fefce8",
        yellow100: "#fef9c3",
        yellow200: "#fef08a",
        yellow300: "#fde047",
        yellow400: "#facc15",
        yellow500: "#eab308",
        yellow600: "#ca8a04",
        yellow700: "#a16207",
        yellow800: "#854d0e",
        yellow900: "#713f12",
        amber50: "#fffbeb",
        amber100: "#fef3c7",
        amber200: "#fde68a",
        amber300: "#fcd34d",
        amber400: "#fbbf24",
        amber500: "#f59e0b",
        amber600: "#d97706",
        amber700: "#b45309",
        amber800: "#92400e",
        amber900: "#78350f",
        orange50: "#fff7ed",
        orange100: "#ffedd5",
        orange200: "#fed7aa",
        orange300: "#fdba74",
        orange400: "#fb923c",
        orange500: "#f97316",
        orange600: "#ea580c",
        orange700: "#c2410c",
        orange800: "#9a3412",
        orange900: "#7c2d12",
        red50: "#fef2f2",
        red100: "#fee2e2",
        red200: "#fecaca",
        red300: "#fca5a5",
        red400: "#f87171",
        red500: "#ef4444",
        red600: "#dc2626",
        red700: "#b91c1c",
        red800: "#991b1b",
        red900: "#7f1d1d",
        warmGray50: "#fafaf9",
        warmGray100: "#f5f5f4",
        warmGray200: "#e7e5e4",
        warmGray300: "#d6d3d1",
        warmGray400: "#a8a29e",
        warmGray500: "#78716c",
        warmGray600: "#57534e",
        warmGray700: "#44403c",
        warmGray800: "#292524",
        warmGray900: "#1c1917",
        trueGray50: "#fafafa",
        trueGray100: "#f5f5f5",
        trueGray200: "#e5e5e5",
        trueGray300: "#d4d4d4",
        trueGray400: "#a3a3a3",
        trueGray500: "#737373",
        trueGray600: "#525252",
        trueGray700: "#404040",
        trueGray800: "#262626",
        trueGray900: "#171717",
        coolGray50: "#f9fafb",
        coolGray100: "#f3f4f6",
        coolGray200: "#e5e7eb",
        coolGray300: "#d1d5db",
        coolGray400: "#9ca3af",
        coolGray500: "#6b7280",
        coolGray600: "#4b5563",
        coolGray700: "#374151",
        coolGray800: "#1f2937",
        coolGray900: "#111827",
        blueGray50: "#f8fafc",
        blueGray100: "#f1f5f9",
        blueGray200: "#e2e8f0",
        blueGray300: "#cbd5e1",
        blueGray400: "#94a3b8",
        blueGray500: "#64748b",
        blueGray600: "#475569",
        blueGray700: "#334155",
        blueGray800: "#1e293b",
        blueGray900: "#0f172a",
        tertiary50: "#ecfdf5",
        tertiary100: "#d1fae5",
        tertiary200: "#a7f3d0",
        tertiary300: "#6ee7b7",
        tertiary400: "#34d399",
        tertiary500: "#10b981",
        tertiary600: "#059669",
        tertiary700: "#047857",
        tertiary800: "#065f46",
        tertiary900: "#064e3b",
        error00: "#FEE9E9",
        error50: "#FEE2E2",
        error100: "#FECACA",
        error200: "#FCA5A5",
        error300: "#F87171",
        error400: "#EF4444",
        error500: "#E63535",
        error600: "#DC2626",
        error700: "#B91C1C",
        error800: "#7F1D1D",
        error900: "#991B1B",
        error950: "#220808",
        success0: "#E4FFF4",
        success50: "#CAFFE8",
        success100: "#A2F1C0",
        success200: "#84D3A2",
        success300: "#66B584",
        success400: "#489766",
        success500: "#348352",
        success600: "#2A7948",
        success700: "#206F3E",
        success800: "#166534",
        success900: "#14532D",
        success950: "#071F11",
        warning50: "#fff7ed",
        warning100: "#ffedd5",
        warning200: "#fed7aa",
        warning300: "#fdba74",
        warning400: "#fb923c",
        warning500: "#f97316",
        warning600: "#ea580c",
        warning700: "#c2410c",
        warning800: "#9a3412",
        warning900: "#7c2d12",
        info50: "#f0f9ff",
        info100: "#e0f2fe",
        info200: "#bae6fd",
        info300: "#7dd3fc",
        info400: "#38bdf8",
        info500: "#0ea5e9",
        info600: "#0284c7",
        info700: "#0369a1",
        info800: "#075985",
        info900: "#0c4a6e",
        light50: "#fafaf9",
        light100: "#f5f5f4",
        light200: "#e7e5e4",
        light300: "#d6d3d1",
        light400: "#a8a29e",
        light500: "#78716c",
        light600: "#57534e",
        light700: "#44403c",
        light800: "#292524",
        light900: "#1c1917",
        /* primary0: "#E5F1FB",
        primary50: "#CCE9FF",
        primary100: "#ADDBFF",
        primary200: "#7CC2FF",
        primary300: "#4AA9FF",
        primary400: "#1A91FF",
        primary500: "#0077E6",
        primary600: "#005DB4",
        primary700: "#004282",
        primary800: "#002851",
        primary900: "#011838",
        primary950: "#000711", */
        secondary0: "#F6F6F6",
        secondary50: "#F3F3F3",
        secondary100: "#E9E9E9",
        secondary200: "#DADADA",
        secondary300: "#B0B0B0",
        secondary400: "#737373",
        secondary500: "#5F5F5F",
        secondary600: "#525252",
        secondary700: "#404040",
        secondary800: "#262626",
        secondary900: "#171717",
        secondary950: "#0C0C0C",
        text0: "#FCFCFC",
        text50: "#F5F5F5",
        text100: "#E5E5E5",
        text200: "#DBDBDB",
        text300: "#D4D4D4",
        text400: "#A3A3A3",
        text500: "#8C8C8C",
        text600: "#737373",
        text700: "#525252",
        text800: "#404040",
        text900: "#262626",
        text950: "#171717",
        textLight0: "#FCFCFC",
        textLight50: "#F5F5F5",
        textLight100: "#E5E5E5",
        textLight200: "#DBDBDB",
        textLight300: "#D4D4D4",
        textLight400: "#A3A3A3",
        textLight500: "#8C8C8C",
        textLight600: "#737373",
        textLight700: "#525252",
        textLight800: "#404040",
        textLight900: "#262626",
        textLight950: "#171717",
        textDark0: "#FCFCFC",
        textDark50: "#F5F5F5",
        textDark100: "#E5E5E5",
        textDark200: "#DBDBDB",
        textDark300: "#D4D4D4",
        textDark400: "#A3A3A3",
        textDark500: "#8C8C8C",
        textDark600: "#737373",
        textDark700: "#525252",
        textDark800: "#404040",
        textDark900: "#262626",
        textDark950: "#171717",
        borderDark0: "#FCFCFC",
        borderDark50: "#F5F5F5",
        borderDark100: "#E5E5E5",
        borderDark200: "#DBDBDB",
        borderDark300: "#D4D4D4",
        borderDark400: "#A3A3A3",
        borderDark500: "#8C8C8C",
        borderDark600: "#737373",
        borderDark700: "#525252",
        borderDark800: "#404040",
        borderDark900: "#262626",
        borderDark950: "#171717",
        borderLight0: "#FCFCFC",
        borderLight50: "#F5F5F5",
        borderLight100: "#E5E5E5",
        borderLight200: "#DBDBDB",
        borderLight300: "#D4D4D4",
        borderLight400: "#A3A3A3",
        borderLight500: "#8C8C8C",
        borderLight600: "#737373",
        borderLight700: "#525252",
        borderLight800: "#404040",
        borderLight900: "#262626",
        borderLight950: "#171717",
        backgroundDark0: "#FCFCFC",
        backgroundDark50: "#F5F5F5",
        backgroundDark100: "#F1F1F1",
        backgroundDark200: "#DBDBDB",
        backgroundDark300: "#D4D4D4",
        backgroundDark400: "#A3A3A3",
        backgroundDark500: "#8C8C8C",
        backgroundDark600: "#737373",
        backgroundDark700: "#525252",
        backgroundDark800: "#404040",
        backgroundDark900: "#262626",
        backgroundDark950: "#171717",
        backgroundLight0: "#FCFCFC",
        backgroundLight50: "#F5F5F5",
        backgroundLight100: "#F1F1F1",
        backgroundLight200: "#DBDBDB",
        backgroundLight300: "#D4D4D4",
        backgroundLight400: "#A3A3A3",
        backgroundLight500: "#8C8C8C",
        backgroundLight600: "#737373",
        backgroundLight700: "#525252",
        backgroundLight800: "#404040",
        backgroundLight900: "#262626",
        backgroundLight950: "#171717",
        backgroundLightError: "#FEF1F1",
        backgroundDarkError: "#422B2B",
        backgroundLightWarning: "#FFF4EB",
        backgroundDarkWarning: "#412F23",
        backgroundLightSuccess: "#EDFCF2",
        backgroundDarkSuccess: "#1C2B21",
        backgroundLightInfo: "#EBF8FE",
        backgroundDarkInfo: "#1A282E",
        backgroundLightMuted: "#F6F6F7",
        backgroundDarkMuted: "#252526",
        backgroundLight: "#FFFFFF",
        backgroundDark: "#171717",
        white: "#FFFFFF",
        black: "#000000"
      },
      space: {
        px: "1px",
        0: 0,
        0.5: 2,
        1: 4,
        1.5: 6,
        2: 8,
        2.5: 10,
        3: 12,
        3.5: 14,
        4: 16,
        4.5: 18,
        5: 20,
        6: 24,
        7: 28,
        8: 32,
        9: 36,
        10: 40,
        11: 44,
        12: 48,
        16: 64,
        20: 80,
        24: 96,
        32: 128,
        40: 160,
        48: 192,
        56: 224,
        64: 256,
        72: 288,
        80: 320,
        96: 384,
        "1/2": "50%",
        "1/3": "33.333%",
        "2/3": "66.666%",
        "1/4": "25%",
        "2/4": "50%",
        "3/4": "75%",
        "1/5": "20%",
        "2/5": "40%",
        "3/5": "60%",
        "4/5": "80%",
        "1/6": "16.666%",
        "2/6": "33.333%",
        "3/6": "50%",
        "4/6": "66.666%",
        "5/6": "83.333%",
        full: "100%"
      },
      borderWidths: {
        0: 0,
        1: 1,
        2: 2,
        4: 4,
        8: 8
      },
      radii: {
        none: 0,
        xs: 2,
        sm: 4,
        md: 6,
        lg: 8,
        xl: 12,
        "2xl": 16,
        "3xl": 24,
        full: 9999
      },
      breakpoints: {
        base: 0,
        sm: 480,
        md: 768,
        lg: 992,
        xl: 1280
      },
      mediaQueries: {
        base: "@media screen and (min-width: 0)",
        xs: "@media screen and (min-width: 400px)",
        sm: "@media screen and (min-width: 480px)",
        md: "@media screen and (min-width: 768px)",
        lg: "@media screen and (min-width: 992px)",
        xl: "@media screen and (min-width: 1280px)"
      },
      letterSpacings: {
        xs: -0.4,
        sm: -0.2,
        md: 0,
        lg: 0.2,
        xl: 0.4,
        "2xl": 1.6
      },
      lineHeights: {
        "2xs": 16,
        xs: 18,
        sm: 20,
        md: 22,
        lg: 24,
        xl: 28,
        "2xl": 32,
        "3xl": 40,
        "4xl": 48,
        "5xl": 56,
        "6xl": 72,
        "7xl": 90
      },
      fontWeights: {
        hairline: "100",
        thin: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
        extraBlack: "950"
      },
      fonts: {
        heading: void 0,
        body: void 0,
        mono: void 0
      },
      fontSizes: {
        "2xs": 10,
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        "2xl": 24,
        "3xl": 30,
        "4xl": 36,
        "5xl": 48,
        "6xl": 60,
        "7xl": 72,
        "8xl": 96,
        "9xl": 128
      },
      opacity: {
        0: 0,
        5: 0.05,
        10: 0.1,
        20: 0.2,
        25: 0.25,
        30: 0.3,
        40: 0.4,
        50: 0.5,
        60: 0.6,
        70: 0.7,
        75: 0.75,
        80: 0.8,
        90: 0.9,
        95: 0.95,
        100: 1
      }
    },
    globalStyle: {
      variants: {
        hardShadow: {
          1: {
            shadowColor: "$backgroundLight900",
            shadowOffset: {
              width: -2,
              height: 2
            },
            shadowRadius: 8,
            shadowOpacity: 0.5,
            elevation: 10
          },
          2: {
            shadowColor: "$backgroundLight900",
            shadowOffset: {
              width: 0,
              height: 3
            },
            shadowRadius: 8,
            shadowOpacity: 0.5,
            elevation: 10
          },
          3: {
            shadowColor: "$backgroundLight900",
            shadowOffset: {
              width: 2,
              height: 2
            },
            shadowRadius: 8,
            shadowOpacity: 0.5,
            elevation: 10
          },
          4: {
            shadowColor: "$backgroundLight900",
            shadowOffset: {
              width: 0,
              height: -3
            },
            shadowRadius: 8,
            shadowOpacity: 0.5,
            elevation: 10
          },
          // this 5th version is only for toast shadow
          // temporary
          5: {
            shadowColor: "$backgroundLight900",
            shadowOffset: {
              width: 0,
              height: 3
            },
            shadowRadius: 8,
            shadowOpacity: 0.2,
            elevation: 10
          }
        },
        softShadow: {
          1: {
            shadowColor: "$backgroundLight900",
            shadowOffset: {
              width: 0,
              height: 0
            },
            shadowRadius: 10,
            shadowOpacity: 0.1,
            _android: {
              shadowColor: "$backgroundLight500",
              elevation: 5,
              shadowOpacity: 0.05
            }
          },
          2: {
            shadowColor: "$backgroundLight900",
            shadowOffset: {
              width: 0,
              height: 0
            },
            shadowRadius: 20,
            elevation: 3,
            shadowOpacity: 0.1,
            _android: {
              shadowColor: "$backgroundLight500",
              elevation: 10,
              shadowOpacity: 0.1
            }
          },
          3: {
            shadowColor: "$backgroundLight900",
            shadowOffset: {
              width: 0,
              height: 0
            },
            shadowRadius: 30,
            shadowOpacity: 0.1,
            elevation: 4,
            _android: {
              shadowColor: "$backgroundLight500",
              elevation: 15,
              shadowOpacity: 0.15
            }
          },
          4: {
            shadowColor: "$backgroundLight900",
            shadowOffset: {
              width: 0,
              height: 0
            },
            shadowRadius: 40,
            shadowOpacity: 0.1,
            elevation: 10,
            _android: {
              shadowColor: "$backgroundLight500",
              elevation: 20,
              shadowOpacity: 0.2
            }
          }
        }
      }
    },
    plugins: [new import_animation_resolver.AnimationResolver(import_legend_motion_animation_driver.MotionAnimationDriver)]
  });
  var componentsConfig = (0, import_react143.createComponents)(theme_exports);
  var config = {
    ...gluestackUIConfig,
    components: componentsConfig
  };
  return __toCommonJS(gluestack_ui_config_exports);
})();
module.exports = config;
