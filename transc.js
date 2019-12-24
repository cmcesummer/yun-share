const scssToCss = require("./mainThread/scssToCss");
const path = require("path");

async function main() {
    const css = await scssToCss(path.join(__dirname, "./src/components/MarkDown/index.scss"));
    console.log(`css is :`, css);
}

main();
