# Customize @babel to support ArkTS
Arkbel is a tool used to convert ArkTS codes to AST, and is maintained by group of [XJTU-ENRE](https://github.com/xjtu-enre).


## environment

using node.js v20.10.4

using yarn

## Helper: AST Viewer

You can use websites below to view AST conveniently:

> Online: https://lihautan.com/babel-ast-explorer/
> GitHub Repo: https://github.com/tanhauhau/babel-ast-explorer

### Display custom AST

1. Run `make build-bundle` to bundle code files;
2. In build artifact `packages/babel-parser/lib/index.js` ,replace all `process.env.BABEL_8_BREAKING` with `false`;
3. Upload this file to the website.

## Make pack and to use before ENRE-ArkTS
0. Run `yarn install` to install dependency;
1. Run `make build` to bundle code files;
2. Run `node scripts/get-declaration.js` to get declaration files in libs;
3. Open `Enre-ArkTS` and run `npm install` to get packages of 'Arkbel/parser','Arkbel/traverse','Arkbel/types'.
4. start your ENRE journey!
>To be Noticed: before run `npm install`,make sure convert node below v18.20.4
