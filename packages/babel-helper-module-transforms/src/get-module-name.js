if (!process.env.BABEL_8_BREAKING) {
    const originalGetModuleName = getModuleName;
    // @ts-expect-error TS doesn't like reassigning a function.
    // eslint-disable-next-line no-func-assign
    getModuleName = function getModuleName(rootOpts, pluginOpts) {
        return originalGetModuleName(rootOpts, {
            moduleId: pluginOpts.moduleId ?? rootOpts.moduleId,
            moduleIds: pluginOpts.moduleIds ?? rootOpts.moduleIds,
            getModuleId: pluginOpts.getModuleId ?? rootOpts.getModuleId,
            moduleRoot: pluginOpts.moduleRoot ?? rootOpts.moduleRoot,
        });
    };
}
export default function getModuleName(rootOpts, pluginOpts) {
    const { filename, filenameRelative = filename, sourceRoot = pluginOpts.moduleRoot, } = rootOpts;
    const { moduleId, moduleIds = !!moduleId, getModuleId, moduleRoot = sourceRoot, } = pluginOpts;
    if (!moduleIds)
        return null;
    // moduleId is n/a if a `getModuleId()` is provided
    if (moduleId != null && !getModuleId) {
        return moduleId;
    }
    let moduleName = moduleRoot != null ? moduleRoot + "/" : "";
    if (filenameRelative) {
        const sourceRootReplacer = sourceRoot != null ? new RegExp("^" + sourceRoot + "/?") : "";
        moduleName += filenameRelative
            // remove sourceRoot from filename
            .replace(sourceRootReplacer, "")
            // remove extension
            .replace(/\.(\w*?)$/, "");
    }
    // normalize path separators
    moduleName = moduleName.replace(/\\/g, "/");
    if (getModuleId) {
        // If return is falsy, assume they want us to use our generated default name
        return getModuleId(moduleName) || moduleName;
    }
    else {
        return moduleName;
    }
}
