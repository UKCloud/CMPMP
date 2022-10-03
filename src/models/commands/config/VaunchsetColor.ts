import { VaunchCommand } from "@/models/VaunchCommand";
import type { Parameter, Example } from "@/models/VaunchManual";
import { ResponseType, type VaunchResponse } from "@/models/VaunchResponse";
import { useConfigStore, defaultconfig } from "@/stores/config";

export class VaunchSetColor extends VaunchCommand {
  constructor() {
    const longDescription: string[] = [
      "Changes the colours of Vaunch. The window colour, text color, and highlight color can be customised. Colors can either be a css colour name, or hex-code.",
      "Supplying * at any of the parameters will leave that element's colour unchanged.",
      "If the window colour is changed, and text colour is not specified Vaunch will set the text colour to either black or white, based on the window colour.",
      "If 'default' is supplied for an element, it will be reset to its default colour",
    ];
    const parameters: Parameter[] = [
      {
        name: "windowColor",
        optional: true,
        repeatable: false,
      },
      {
        name: "textColor",
        optional: true,
        repeatable: false,
      },
      {
        name: "highlightColor",
        optional: true,
        repeatable: false,
      },
    ];

    const examples: Example[] = [
      {
        args: ["cornflowerblue"],
        description: [
          "Sets the window color to the css colour Cornflower Blue",
          "Vaunch will additionally set the text colour to black, as textColor was not specified",
        ],
      },
      {
        args: ["cornflowerblue", "#ffffff"],
        description: [
          "Sets the window color to the css colour Cornflower Blue and the text colour to #ffffff (white)",
        ],
      },
      {
        args: ["*", "*", "orange"],
        description: [
          "Sets the highlight colour to 'orange' while preserving the current window and text colour",
        ],
      },
      {
        args: ["default"],
        description: [
          "Changes the window colour to Vaunch's default, which is based on your OS colour scheme",
        ],
      },
      {
        args: ["cornflowerblue", "default", "navy"],
        description: [
          "Changes the window colour to Cornflower Blue, resets the text colour to the default color (black based on Cornflower Blue) and the highlight color to Navy",
        ],
      },
    ];
    super("set-color", longDescription, parameters, examples);
  }
  aliases: string[] = ["set-colour", "set-colo", "colo"];
  description = "Changes the colour of Vaunch";

  private rgbToHsl(r: number, g: number, b: number) {
    r /= 255;
    g /= 255;
    b /= 255;
    const l = Math.max(r, g, b);
    const s = l - Math.min(r, g, b);
    const h = s
      ? l === r
        ? (g - b) / s
        : l === g
        ? 2 + (b - r) / s
        : 4 + (r - g) / s
      : 0;
    return [
      Math.round(60 * h < 0 ? 60 * h + 360 : 60 * h),
      Math.round(
        100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0)
      ),
      Math.round((100 * (2 * l - s)) / 2),
    ];
  }

  private getRgbColor(newColor: string): string {
    const fakeDiv = document.createElement("div");

    fakeDiv.style.color = newColor;
    document.body.appendChild(fakeDiv);
    // get RBG value of div from color passed. works with any valid CSS color,
    // even names such as green, orange, etc...
    const rgbColor: string = window
      .getComputedStyle(fakeDiv)
      .getPropertyValue("color");
    // remove the fake div, no longer needed
    document.body.removeChild(fakeDiv);
    return rgbColor;
  }

  private calcWindowColor(newColor: string, opacity = 0.7): string {
    const rgbColor: string = this.getRgbColor(newColor);
    // Convert rgb to rgba for background transparency
    const rgbaColor = rgbColor.replace(/(?:rgb)+/g, "rgba");
    return rgbaColor.replace(/(?:\))+/g, `, ${opacity})`);
  }

  private getRgbValue(rgbcolor: string): number[] {
    const rgb: RegExpMatchArray | null = rgbcolor.match(
      /^rgba?\((\d+),\s?(\d+),\s?(\d+)(,\s?\d+(\.\d+)?)?\)$/
    );
    if (rgb) {
      return [parseInt(rgb[1]), parseInt(rgb[2]), parseInt(rgb[3])];
    } else return [0, 0, 0];
  }

  private calcTextColor(windowColor: string): string {
    // let rgb = windowColor.substr(4, windowColor.length - 5);
    const rgb: number[] = this.getRgbValue(windowColor);
    const contrast = rgb[0] * 299 + rgb[1] * 587 + (rgb[2] * 114) / 1000;
    return contrast < 255 / 2 ? "white" : "black";
  }

  private calcAutocompleteColor(newTextColor: string): any {
    const rgb = this.getRgbColor(newTextColor);
    const rgbRaw = this.getRgbValue(rgb);
    const hsl = this.rgbToHsl(rgbRaw[0], rgbRaw[1], rgbRaw[2]);

    if (hsl[1] > 50) {
      hsl[1] = hsl[1] * 0.5;
    } else {
      hsl[1] = Math.round(hsl[1] / 0.2);
      hsl[2] = Math.round(hsl[2] * 0.5);
    }
    return `hsla(${hsl[0]},${hsl[1]}%,${hsl[2]}%, 0.75)`;
  }

  async execute(args: string[]): Promise<VaunchResponse> {
    const config = useConfigStore();
    const newWindowColor = args[0];
    const newTextColor = args[1];
    const newHighlightColor = args[2];

    const changedComponents: string[] = [];

    // If first arg is 'default' set back to default variables
    // If anything past this is defined, it will overwrite the default
    if (newWindowColor == "default") {
      config.color = defaultconfig.color;
      changedComponents.push(`Window colour to default`);
    } else if (newWindowColor != "*") {
      // Set the new window color
      config.color.window = this.calcWindowColor(newWindowColor);
      config.color.windowOpaque = this.calcWindowColor(newWindowColor, 1);
      changedComponents.push(`Window colour to ${newWindowColor}`);
    }

    // If a second color is provided, set the text color to that
    // else calculate the text color based on the window color
    if (newTextColor) {
      if (newTextColor == "default") {
        config.color.text = this.calcTextColor(config.color.window);
        changedComponents.push(`Text colour to default`);
      } else if (newTextColor != "*") {
        config.color.text = newTextColor;
        changedComponents.push(`Text colour to ${newTextColor}`);
      }
      // Calculate the 'best' highlight color for this text color
      config.color.autocomplete = this.calcAutocompleteColor(newTextColor);
    } else config.color.text = this.calcTextColor(config.color.window);

    if (newHighlightColor) {
      if (newHighlightColor == "default") {
        config.color.highlight = defaultconfig.color.highlight;
        changedComponents.push(`Highlight colour to default`);
      } else if (newHighlightColor != "*") {
        config.color.highlight = newHighlightColor;
        changedComponents.push(`Highlight colour to ${newHighlightColor}`);
      }
    }
  
    return this.makeResponse(
      ResponseType.Success,
      `Edited colour scheme: ${changedComponents.join(", ")}`
    );
  }
}
