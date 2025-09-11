import { Ace } from "./boom/ace";

const foo = "foo";
const bar = 123;
function biz(s: string) {
	const aa = new Ace();
	const f = aa.aceBar(foo);
	return s + f;
}

export { foo, bar, biz };
