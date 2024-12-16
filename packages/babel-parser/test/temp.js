import { parse } from "../lib/index.js";

function getParser(code) {
  return () =>
    parse(code, { sourceType: "module", plugins: ["arkts", "decorators"] });
}
function shouldParse(name, code) {
  // eslint-disable-next-line jest/valid-title
  it(name, () => {
    expect(getParser(code)()).toMatchSnapshot();
  });
}
function shouldsetError(name, code) {
  // eslint-disable-next-line jest/valid-title
  it(name, () => {
    expect(() =>
      parse(code, { sourceType: "module", plugins: ["arkts", "decorators"] }),
    ).toThrow();
  });
}

describe("arkts", () => {
  shouldParse("simple struct", "struct A {}");

  shouldParse("decorated struct", "@component struct A {}");

  shouldParse("struct with build", "struct A { build() {} }");

  shouldParse("build simple call", "struct A { build() { Text('a') } }");

  shouldParse(
    "build simple trailing closure call",
    "struct A { build() { Column('a') { Text('b') } } }",
  );

  shouldParse(
    "build multiple trailing closure calls",
    "struct A { build() { Column('a') { Text('b').fontSize(20) Image('c.png') } } }",
  );

  shouldParse(
    "build trailing closure chaining call",
    "struct A { build() { Column('a') { Text('b') }.height(50) } }",
  );
  shouldParse(
    "ForEach try",
    "struct A { build() { Column() { ForEach(this,(item:string)=>{ Row(){} },(item:number)=>item) }}}",
  );
  shouldParse(
    "LazyForEach try",
    "struct A { a:s=new s();build() { Column() { LazyForEach(this.a,(item:string)=>{ Row(){} },item=>item) }}}",
  );
  shouldParse(
    "export default try",
    "@Component export default struct A { build() {}}",
  );
  shouldParse(
    "export default try 2",
    "@Custom export default struct Inte{ build(){}}",
  );
  shouldParse("export try 0", "export struct A { build() {}}");
  shouldParse("export try", "@Component export struct A { build() {}}");
  shouldParse(
    "export try 2",
    "@Entry @Component export struct A { build() {}}",
  );
  shouldParse(
    "this token in build() body",
    "@Component struct A { a;build(){ this.a}}",
  );
  shouldParse(
    "this token case 2",
    "@Component struct A{build(){this.b Clo(){}}}",
  );
  shouldParse(
    "this token case 3",
    "@Component struct A{build(){Text(){} this.a }}",
  );
  shouldParse(
    "this token in a trailingClosure body",
    "@Component struct A { a;build(){ Row(){this.a}}}",
  );
  shouldParse(
    "stateStyles property without brace use this",
    "struct Foo{a();build(){Column().stateStyles({f:this.a})}}",
  );
  shouldParse(
    "stateStyles may appears in TS",
    "struct Foo{build(){Column().stateStyles({f:height(100)})}}",
  );
  shouldsetError(
    "stateStyles false case to be fail",
    "struct Foo{build(){Column().stateStyles({f:{height(100)}})}}",
  );
  shouldParse(
    "stateStyles property case 2 with {.}",
    "struct Foo{build(){Column().stateStyles({f:{.height(100)}})}}",
  );
  shouldParse("import in ArkTS", "import * as all from './export' ");
  shouldParse(
    "@Builder Decorate Function in top scope",
    "@Builder function Foo(a:string){Row(){}}",
  );
  shouldParse(
    "@Builder Decorate Function in a struct",
    "struct A{@Builder Foo(a:string){Row(){}.h(100)}}",
  );
  shouldParse(
    "@Builderparam Decorate property use function in top scope",
    "@Builder function f() {} struct A{@BuilderParam a: () => void = f;}",
  );
  shouldParse(
    "@Builderparam Decorate property use function in struct",
    "struct A{@Builder f() {} @BuilderParam a: () => void = this.f;}",
  );
  shouldParse(
    "@Extend Decorate Function in the top scope",
    "@Extend(Text) function Foo(a:number){.setsize(a)}",
  );
  shouldParse(
    "@AnimatableExtend Decorate Function in the top scope",
    "@AnimatableExtend(Text) function Foo(a:number){.setsize(a)}",
  );
  shouldParse(
    "@Styles Decorate Function in top-scope",
    "@Styles function Foo(){.setsize(2)}",
  );
  shouldParse(
    "@Styles Decorate Function in a struct",
    "@Component struct A{@Styles a(){.h(10)}}",
  );

  shouldParse(
    "two way binding variable use '!!'",
    "struct A{build(){Text({t:this.t!!})}}",
  );
  shouldParse(
    "two way binding variable use '$$'",
    "struct A{build(){Text({t:$$this.t})}}",
  );
  shouldParse(
    "two way binding variable use '$$' ,and use field named with '$' ",
    "struct A{@State $value:number;build(){Text({t:$$this.$value})}}",
  );
  //
  //Some trouble met in 2024-12-6
  //
  shouldParse(
    "No two way binding variable use '$$' ,use field named with '$' ",
    "struct A{build(){Text({t:$value, b:$b})}}",
  );
  shouldParse(
    "use some kind of '$' such as  '$r'",
    "struct A{@State placeholder: string = getContext().resourceManager.getStringSync($r('app.string.placeholder'));build(){Text({size: $r('app.integer.placeholderFont_size')})}}",
  );
  shouldParse(
    "two way binding variable use '!!' ,and use expression with double '!' ",
    "function A(s:boolean|undefined){return !!s};struct A{build(){Text({t:this.t!!})}}",
  );
  shouldParse(
    "';' in any end of line, especially for LazyForEach",
    "struct A { a:s=new s();build() { Column() { LazyForEach(this.a,(item:string)=>{ Row(){} },item=>item); }}}",
  );
  shouldParse(
    "';' in any end of line, especially in a function with ArkTSCallExpression",
    "struct A { build() {}} @Builder function Foo(){A();}",
  );
  shouldParse(
    "if statement in the closure",
    "struct A { build() { Column('a') { Text('b') if (true) { Text('b') } } } }",
  );

  shouldParse(
    "if else statement in closure",
    "struct A { build() { Column('a') { if (true) { Text('b') } else if (true) { Text('c') } else { Text('d') } } } }",
  );
  shouldParse(
    "param in a block",
    "struct A { build() { Column({ a:b,b:c}) } }",
  );
  shouldParse(
    "param in a block in another block",
    "struct A { build() { Column({ a:b,b:c, c:{d:e,e:f}})} }",
  );
  shouldParse(
    "export default try for function use decorator",
    "@Build export default function A(){}",
  );
  shouldParse(
    "export default try for function without decorator",
    "export default function A(){}",
  );
  shouldParse(
    "export try for function use decorator",
    "@Build export function A(){}",
  );
  shouldParse(
    "export try for function without decorator",
    "export function A(){}",
  );
  //
  //Some trouble met in 2024-12-9
  //
  shouldParse(
    "this token in a trailingClosure body with a lot",
    "@Component struct A { a;build(){ Row(){this.a() this.a() this.a(f)}}}",
  );
  shouldParse(
    "';' in any end of line, include after a call",
    "struct A{build(){Column(){Text().b(); Text()}.a();}}",
  );
  shouldParse(
    "If/else in not only closure",
    "struct A{build(){if(Text(a)){}else{}}}",
  );
  shouldParse(
    "If/else in a ForEach or LazyForEach",
    "struct A { build() { Column() { ForEach(this,(item:string)=>{ if(1){Row(){}}else if(b){Text('c')}else{Text('v')} },(item:number)=>item) }}}",
  );
  shouldParse(
    "If/else in a ForEach or LazyForEach",
    "struct A { build() { Column() { ForEach(this,(item:string)=>{ if(1){Row(){}}else if(b){Text('c')}else{Text('v')} },(item:number)=>item) }}}",
  );
  shouldParse(
    "@Builder Decorate Function in a struct",
    "struct A{@Builder Foo(a:string){if(1){Row(){}}else if(b){Text('c')}else{Text('v')}}}",
  );
  shouldParse(
    "a lot if ForEach or LazyForEach",
    "struct A { build() { Column() { ForEach(this,(item:string)=>{ ForEach(this,(item:string)=>{ if(1){Row('a').b()}else if(b){Text('c')}else{Text('v')} },(item:number)=>item); Row('c').b()},(item:number)=>item) }}}",
  );
});
