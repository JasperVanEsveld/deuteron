import { ProgressBar } from "./deps.ts";

async function checkExists(path: string) {
  try {
    const info = await Deno.lstat(path);
    if (info.isFile && info.size !== 0) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

async function prepareDenoWebview() {
  let bin = localStorage.getItem("deutron-binary");
  if (bin === null || !(await checkExists(bin))) {
    if (Deno.build.os !== "windows") {
      console.log("Sorry only Windows is supported at the moment");
    }
    console.log("Deno-webview binary not found, downloading...");
    bin = await Deno.makeTempFile({ prefix: "deutron" });
    localStorage.setItem("deutron-binary", bin);
    const file = await Deno.open(bin, {
      write: true,
      create: true,
      truncate: true,
    });
    const response = await fetch(
      "https://github.com/JasperVanEsveld/deno/releases/download/webview%2F0.1.0/deno-webview-windows.exe"
    );
    const length = Number.parseInt(
      response.headers.get("content-length") || "70991360"
    );
    const progress = new ProgressBar({
      title: "deno-webview-windows.exe",
      total: length,
      display: ":title :time :bar :percent ",
    });
    let current = 0;
    for await (const buffer of response.body!) {
      await file.write(buffer);
      current += buffer.length;
      progress.render(current);
    }
    await response.body?.pipeTo((await file).writable);
  }
  return bin;
}

export async function compile() {
  const bin = await prepareDenoWebview();
  const p = Deno.run({
    cmd: [bin, "compile", ...Deno.args],
  });
  const code = await p.status();
  if (code.success) {
    console.log(
      "Compilation happens in the background\nPlease wait untill the executable appears..."
    );
  } else {
    console.log(
      "Something went wrong, check to make sure if all the flags and filenames are correct"
    );
  }
}
