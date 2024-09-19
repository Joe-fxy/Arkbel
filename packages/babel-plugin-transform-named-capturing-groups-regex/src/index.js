/* eslint-disable @babel/development/plugin-name */
import { createRegExpFeaturePlugin } from "@babel/helper-create-regexp-features-plugin";
import { declare } from "@babel/helper-plugin-utils";
export default declare((api, options) => {
    const { runtime } = options;
    if (runtime !== undefined && typeof runtime !== "boolean") {
        throw new Error("The 'runtime' option must be boolean");
    }
    return createRegExpFeaturePlugin({
        name: "transform-named-capturing-groups-regex",
        feature: "namedCaptureGroups",
        options: { runtime },
    });
});
