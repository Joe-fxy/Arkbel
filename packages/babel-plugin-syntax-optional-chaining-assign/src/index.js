import { declare } from "@babel/helper-plugin-utils";
import { OptionValidator } from "@babel/helper-validator-option";
const v = new OptionValidator(PACKAGE_JSON.name);
export default declare((api, options) => {
    api.assertVersion(process.env.BABEL_8_BREAKING && process.env.IS_PUBLISH
        ? PACKAGE_JSON.version
        : "^7.23.0");
    v.validateTopLevelOptions(options, { version: "version" });
    const { version } = options;
    v.invariant(version === "2023-07", "'.version' option required, representing the last proposal update. " +
        "Currently, the only supported value is '2023-07'.");
    return {
        name: "syntax-optional-chaining-assign",
        manipulateOptions(opts, parserOpts) {
            parserOpts.plugins.push(["optionalChainingAssign", { version }]);
        },
    };
});
