import path from "path";
import { readFile, rm } from "fs/promises";
import { execFile, spawn } from "child_process";
import type { Plugin, ResolvedConfig } from "vite";
import tmp from "tmp";

type HxmlConfig = {
  sourceMap: boolean;
  hasJsEs: boolean;
};

tmp.setGracefulCleanup();

let compilationServer: ReturnType<typeof spawn> | undefined;

export default function haxe(opts = { port: 6000 }) {
  // TODO: Filtering
  //const filter = createFilter(opts.include, opts.exclude);
  let config: ResolvedConfig;
  const dir = tmp.dirSync({ unsafeCleanup: true });
  let hxmlFiles: Map<string, HxmlConfig> = new Map();

  return {
    name: "haxe",

    buildStart() {
      if (config.command === "serve" && !compilationServer) {
        compilationServer = spawn("haxe", ["--wait", opts.port.toString()]);
        compilationServer.on("close", (code) => {
          if (code && code > 0) {
            // TODO: Check if it's already running, if not, error
            compilationServer = undefined;
          }
        });
      }
    },

    buildEnd() {
      if (compilationServer) compilationServer.kill();
    },

    handleHotUpdate(event) {
      let files: string[];
      if (event.file.endsWith(".hx")) files = Array.from(hxmlFiles.keys());
      else if (!event.file.endsWith(".hxml")) files = [event.file];
      else return;

      files.forEach((hxml) => {
        const module = event.server.moduleGraph.getModuleById(hxml);
        if (module) {
          event.server.reloadModule(module);
        }
      });
    },

    configResolved(resolved) {
      config = resolved;
    },

    transform(src, id) {
      if (!id.endsWith(".hxml")) return;

      const hxmlargs = src
        .split(/[\r\n]+/)
        .map((s) => s.trim())
        .filter((s) => !s.startsWith("#") && !s.startsWith("-js"))
        .flatMap((s) => s.split(/\s+/))
        .filter((s) => s);

      const sourceMap = !!hxmlargs.find((line) =>
        line.includes("source-map-content")
      );

      const hasJsEs = !!hxmlargs.find((line) => line.includes("js-es="));

      hxmlFiles.set(id, {
        sourceMap,
        hasJsEs,
      });

      return new Promise(async (resolve, reject) => {
        tmp.tmpName((err, tmpName) => {
          if (err) return reject(err);
          const file = path.join(dir.name, path.basename(tmpName) + ".js");
          const map = file + ".map";

          let args =
            config.command === "serve"
              ? ["-v", "--connect", opts.port.toString()]
              : [];

          args = [...args, ...hxmlargs, `-js=${file}`].concat(
            hasJsEs ? [] : ["-D", "js-es=6"]
          );

          execFile("haxe", args, async (err, _, stderr) => {
            if (err) {
              return reject(stderr.trim());
            }

            resolve({
              code: await readFile(file, { encoding: "utf8" }),
              map: sourceMap ? await readFile(map, { encoding: "utf8" }) : null,
            });

            rm(file).catch(() => {});
            rm(map).catch(() => {});
          });
        });
      });
    },
  } satisfies Plugin;
}
