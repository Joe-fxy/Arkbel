import type Printer from "../printer.ts";
import type * as t from "@babel/types";

export function ArkTSDoubleExclamationExpression(
  this: Printer,
  node: t.ArkTSDoubleExclamationExpression,
) {
  this.print(node.expression, node);
  this.token("!!");
}
export function ArkTSTwoWayBindingExpression(
  this: Printer,
  node: t.ArkTSTwoWayBindingExpression,
) {
  this.print(node.expression, node);
  this.token("$$");
}
