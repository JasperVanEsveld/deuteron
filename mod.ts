import { Command } from "./deps.ts";
import { compile } from "./compile.ts";

const args = Deno.args.join(" ");
if (args.includes("--help") || args.includes("-h")) {
  await new Command()
    .name("deutron")
    .description(
      "Utility script that compiles a deno program to a binary that also includes webview. Takes all default Deno compile arguments as well."
    )
    .option(
      "--webview-url <string>",
      "The URL or path of the html file to load.",
      {
        default: "./index.html",
      }
    )
    .option("--title  <string>", "The title of the webview")
    .option(
      "--no-decorations",
      "Disables the OS title bar (minimize, maximize, close, etc)"
    )
    .option("--transparent", "Allows for transparent backgrounds")
    .option("--dev-tools", "Allows user to open the dev-tools window")
    .arguments("[file]")
    .parse();
} else {
  await compile();
}
