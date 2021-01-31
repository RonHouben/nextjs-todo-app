const path = require("path");
const fs = require("fs");

const pluginName = "GenerateServiceWorkerEnvVariablesWebpackPlugin";

/**
 * We to configure the service-worker to cache calls to both the API and the
 * static content server but these are configurable URLs. We already use the env var
 * system that vue-cli offers so implementing something outside the build
 * process that parses the service-worker file would be messy. This lets us
 * dump the env vars as configured for the rest of the app and import them into
 * the service-worker script to use them.
 *
 * We need to do this as the service-worker script is NOT processed by webpack
 * so we can't put any placeholders in it directly.
 */

module.exports = class GenerateServiceWorkerEnvVariablesWebpackPlugin {
  constructor(opts) {
    if (!opts.outputFilename) {
      throw new Error(
        "[GenerateServiceWorkerEnvVariablesWebpackPlugin] missing `outputFilename: string` in options"
      );
    }
    if (!opts.envKeys || opts.envKeys.length === 0) {
      throw new Error(
        "[GenerateServiceWorkerEnvVariablesWebpackPlugin] missing `envKeys: string[]` in options"
      );
    }
    this.outputFilename = opts.outputFilename;
    this.envKeys = opts.envKeys;
  }

  apply(compiler) {
    const fileContent = Object.keys(process.env)
      .filter((processKey) =>
        this.envKeys.some((envKey) => envKey === processKey)
      )
      .reduce((accum, currKey) => {
        const val = process.env[currKey];
        accum += `const ${currKey} = '${val}'\n`;
        return accum;
      }, "");
    const outputDir = compiler.options.resolveLoader.roots[0] + "/public";

    if (!fs.existsSync(outputDir)) {
      // TODO ideally we'd let Webpack create it for us, but not sure how to
      // make this run later in the lifecycle
      fs.mkdirSync(outputDir);
    }
    const fullOutputPath = path.join(outputDir, this.outputFilename);
    console.debug(
      `[GenerateServiceWorkerEnvVariablesWebpackPlugin] dumping env vars to file=${fullOutputPath}`
    );
    fs.writeFileSync(fullOutputPath, fileContent);
  }
};
