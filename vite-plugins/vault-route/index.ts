import {statSync, readdirSync, existsSync} from "fs";
import {join, resolve, parse, extname, normalize} from "path";
import { ViteDevServer, normalizePath } from "vite";
type VaultRouteOptionType={
		routesDirectory: string;
    extensions: string[];
		root:string;
}
const defaultOptions:VaultRouteOptionType = {
  routesDirectory: "src/routes",
  extensions: ["tsx", "jsx", "ts","js"],
	root: normalizePath(process.cwd())
};
let resolvedOptions:VaultRouteOptionType;
function resolveOptions(root:string, userOptions:VaultRouteOptionType):VaultRouteOptionType {
  return {
    ...defaultOptions,
    ...userOptions,
  };
}
function setOptions(options:VaultRouteOptionType) {
  resolvedOptions = options;
}
function getOptions():VaultRouteOptionType {
  if (resolvedOptions === null) {
    throw new Error('Something went wrong. Unable to resolve "UserOptions".');
  }
  return resolvedOptions;
}

function isDirectory(filePath:string) {
  return statSync(filePath).isDirectory();
}
function isCatchAllRoute(s:string) {
  return s === "$";
}
function isDynamicRoute(s:string) {
  return s.startsWith("$");
}
function parameterizeDynamicRoute(s:string) {
  return s.replace(/^\$(.+)$/, (_, p) => `:${p}`);
}
function normalizeFilenameToRoute(filename:string) {
  const MATCH_ALL_ROUTE = "*";
  if (isCatchAllRoute(filename)) {
    return MATCH_ALL_ROUTE;
  }
  if (isDynamicRoute(filename)) {
    return parameterizeDynamicRoute(filename);
  }
  return filename;
}
function toAbsolutePath(filePath:string) {
  return join(resolvedOptions.root, filePath);
}

class RouteNode {
	children?: RouteNode[];
	name: string;
	path: string;
	isDirectory: boolean;
	layoutPath: any;
  constructor(filePath:string) {
    this.children = [];
    this.name = parse(filePath).name;
    this.path = filePath;
  }
}
function buildRouteTree() {
  const root = createNode(getOptions().routesDirectory);
  root.isDirectory = true;
  root.name = "/";
  return root;
}
function createNode(filePath:string) {
  const node = new RouteNode(filePath);
  if (isDirectory(toAbsolutePath(filePath))) {
    node.isDirectory = true;
    node.layoutPath = getLayoutPath(filePath);
    const children = resolveChildren(toAbsolutePath(filePath));
    node.children = children.map(child => createNode(`${filePath}/${child}`));
  }
  const newChildren:RouteNode[] = [];
  node.children?.forEach(childNode => {
    if (childNode.name == "@index") {
      childNode.name = "index";
      const childPage = new RouteNode(childNode.path);
      childPage.name = "$page";
      childPage.layoutPath = getLayoutPath(childNode.path);
      const child = new RouteNode(childNode.path);
      child.name = "page";
      child.layoutPath = getLayoutPath(childNode.path);
      child.isDirectory = true;
      child.children?.push(childPage);
      newChildren.push(child);
    }
    if (childNode.name == ".index") {
      childNode.name = "index";
      const childPage = new RouteNode(childNode.path);
      childPage.name = "$cursor";
      childPage.layoutPath = getLayoutPath(childNode.path);
      const child = new RouteNode(childNode.path);
      child.name = "cursor";
      child.layoutPath = getLayoutPath(childNode.path);
      child.isDirectory = true;
      child.children?.push(childPage);
      newChildren.push(child);
    }
    newChildren.push(childNode);
  });
  node.children = newChildren;
  return node;
}
function getLayoutPath(directoryPath:string) {
  return getOptions()
    .extensions.map((extension) => `${directoryPath}.${extension}`)
    .find(filePath => existsSync(toAbsolutePath(filePath)));
}
function resolveChildren(directoryPath:string) {
  const children = readdirSync(directoryPath);
  return children.filter(child => {
    const childPath = join(directoryPath, child);
    if (isDirectory(childPath)) {
      return true;
    }
    if (isLayout(childPath)) {
      return false;
    }
    const extension = extname(childPath);
    return getOptions().extensions.includes(extension.substring(1));
  });
}
function isLayout(filePath) {
  return existsSync(filePath.split(".").slice(0, -1).join("."));
}

const VIRTUAL_MODULE_ID = "virtual:vault-route";
const RESOLVED_VIRTUAL_MODULE_ID = `\0${VIRTUAL_MODULE_ID}`;

let imports = [];
function generateRoutesModule(rootNode:RouteNode) {
  imports = [];
  const routes = createRouteObject(rootNode);
  const code:string[] = [];
  code.push("import React from 'react';");
  code.push(...imports);
  code.push("");
  const routesString = JSON.stringify(routes, null, 2)
    .replace(/\\"/g, '"')
    .replace(/("::|::")/g, "");
  code.push(`export const routes = [${routesString}]`);
  return code.join("\n");
}
function createRouteObject(node:RouteNode) {
  if (node.isDirectory) {
    return createLayoutRoute(node);
  }
  return createPageRoute(node);
}
function createLayoutRoute(node:RouteNode) {
  return {
    lazy: node.layoutPath ? createLazyRoute(node.layoutPath) : void 0,
    path: node.name.startsWith("__")
      ? void 0
      : normalizeFilenameToRoute(node.name),
    children: node.children?.map(child => createRouteObject(child)),
  };
}
function createPageRoute(node:RouteNode) {
  const path =
    node.name === "index"
      ? { index: true }
      : { path: normalizeFilenameToRoute(node.name) };
  return {
    ...path,
    lazy: createLazyRoute(node.path),
  };
}
function createLazyRoute(filePath:string) {
  return `::() => import("/${filePath}")::`;
}

export default function VaultRoute(userOptions:VaultRouteOptionType) {
  let routeTree:RouteNode;
  return {
    name: "vault-route",
    enforce: "pre",
    configResolved({ root }) {
      setOptions(resolveOptions(root, userOptions));
			console.log(resolveOptions(root, userOptions));
      routeTree = buildRouteTree();
    },
    configureServer(server:ViteDevServer) {
			const listener = (file = '') => (file.includes(normalize('/src/routes/')) ? ()=>{
				routeTree = buildRouteTree();
        reloadServer(server);
			}:null);
      server.watcher.on("unlink", listener);
      server.watcher.on("add", listener);
      server.watcher.on("change", listener);
    },
    resolveId(id:string) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_MODULE_ID;
      }
      return null;
    },
    load(id:string) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        return generateRoutesModule(routeTree);
      }
      return null;
    },
  };
}
function isRouteFile(filePath:string) {
  return (
    filePath.startsWith(resolve(getOptions().routesDirectory)) &&
    getOptions().extensions.some(ext => filePath.endsWith(ext))
  );
}
function reloadServer(server:ViteDevServer) {
  const { moduleGraph } = server;
  const module = moduleGraph.getModuleById(RESOLVED_VIRTUAL_MODULE_ID);
  if (module) {
    moduleGraph.invalidateModule(module);
  }
  server.ws.send({
    type: "full-reload",
  });
}
