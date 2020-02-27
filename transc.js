const scssToCss = require("./mainThread/scssToCss");
const path = require("path");

async function main() {
    const css = await scssToCss(path.join(__dirname, "./src/components/MarkDown/index.scss"));
    console.log(`css is :`, css);
}

main();

function change(dm) {
    const arr = Array.from(dm);
    for (const item of arr) {
        item.setAttribute("src-p", item.src);
        item.src = "";
    }
    return;
}
