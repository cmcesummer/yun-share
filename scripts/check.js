const eslint = require("eslint");
const path = require("path");
const fs = require("fs");
const glob = require("glob");
const ignore = require("ignore");

const { CLIEngine } = eslint;

const cli = new CLIEngine({
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
            globalReturn: true,
            impliedStrict: true,
            jsx: true,
            experimentalObjectRestSpread: true
        }
    },
    parser: "babel-eslint",
    rules: {
        complexity: ["error", { max: 0 }]
    },
    useEslintrc: false
});

/**
 * 提取函数类型正则
 */
const REG_FUNC_TYPE = /^(Method |Async function |Arrow function |Function )/g;

/**
 * eslint提示前缀
 */
const MESSAGE_PREFIX = "Maximum allowed is 1.";

/**
 * eslint提示后缀
 */
const MESSAGE_SUFFIX = "has a complexity of ";

/**
 * 提取mssage主要部分
 * @param {*} message
 */
function getMain(message) {
    return message.replace(MESSAGE_PREFIX, "").replace(MESSAGE_SUFFIX, "");
}

/**
 * 提取代码复杂度
 * @param {*} message
 */
function getComplexity(message) {
    const main = getMain(message);
    /(\d+)\./g.test(main);
    return +RegExp.$1;
}

/**
 * 获取函数名
 * @param {*} message
 */
function getFunctionName(message) {
    const main = getMain(message);
    let test = /'([a-zA-Z0-9_$]+)'/g.test(main);
    return test ? RegExp.$1 : "*";
}

/**
 * 提取函数类型
 * @param {*} message
 */
function getFunctionType(message) {
    let hasFuncType = REG_FUNC_TYPE.test(message);
    return hasFuncType ? RegExp.$1 : "";
}

/**
 * 提取文件名称
 * @param {*} filePath
 */
function getFileName(filePath) {
    return filePath.replace(process.cwd(), "").trim();
}

/**
 * 获取重构建议
 * @param {*} complexity
 */
function getAdvice(complexity) {
    if (complexity > 15) {
        return "强烈建议";
    } else if (complexity > 10) {
        return "建议";
    } else {
        return "无需";
    }
}

/**
 * 获取单个文件的复杂度
 */
function executeOnFiles(paths, min) {
    const reports = cli.executeOnFiles(paths).results;
    const result = [];
    const fileCount = paths.length;
    let funcCount = 0;

    for (let i = 0; i < reports.length; i++) {
        const { messages, filePath } = reports[i];
        for (let j = 0; j < messages.length; j++) {
            const { message, ruleId, line, column } = messages[j];
            funcCount++;
            if (ruleId === "complexity") {
                const complexity = getComplexity(message);
                if (complexity >= min) {
                    result.push({
                        funcType: getFunctionType(message),
                        funcName: getFunctionName(message),
                        position: line + "," + column,
                        fileName: getFileName(filePath),
                        complexity,
                        advice: getAdvice(complexity)
                    });
                }
            }
        }
    }
    return { fileCount, funcCount, result };
}

const EXTENSIONS = "**/*.js";

/**
 * 默认忽略文件夹
 */
const DEFAULT_IGNORE_PATTERNS = ["node_modules/**", "build/**", "dist/**", "output/**", "common_build/**"];

/**
 * ignore文件名
 */
const IGNORE_FILE_NAME = ".gitignore";

/**
 * 默认参数
 */
const DEFAULT_PARAM = {
    rootPath: "",
    ignoreRules: [],
    defalutIgnore: true,
    extensions: EXTENSIONS,
    ignoreFileName: IGNORE_FILE_NAME
};

/**
 * 获取glob扫描的文件列表
 * @param {*} rootPath 跟路径
 * @param {*} extensions 扩展
 * @param {*} defalutIgnore 是否开启默认忽略
 */
function getGlobScan(rootPath, extensions, defalutIgnore) {
    return new Promise(resolve => {
        glob(`${rootPath}${extensions}`, { dot: true, ignore: defalutIgnore ? DEFAULT_IGNORE_PATTERNS : [] }, (err, files) => {
            // glob(path.join(rootPath, extensions), { dot: true, ignore: defalutIgnore ? DEFAULT_IGNORE_PATTERNS : [] }, (err, files) => {
            if (err) {
                console.log(err);
                process.exit(1);
            }
            resolve(files);
        });
    });
}

/**
 * 加载ignore配置文件，并处理成数组
 * @param {*} ignoreFileName
 */
async function loadIgnorePatterns(ignoreFileName) {
    const ignorePath = path.resolve(process.cwd(), ignoreFileName);
    try {
        const ignores = fs.readFileSync(ignorePath, "utf8");
        return ignores.split(/[\n\r]|\n\r/).filter(pattern => Boolean(pattern));
    } catch (e) {
        return [];
    }
}

/**
 * 根据ignore配置过滤文件列表
 * @param {*} files
 * @param {*} ignorePatterns
 * @param {*} cwd
 */
function filterFilesByIgnore(files, ignorePatterns, ignoreRules, cwd = process.cwd()) {
    const ig = ignore().add([...ignorePatterns, ...ignoreRules]);
    const filtered = files
        .map(raw => (path.isAbsolute(raw) ? raw : path.resolve(cwd, raw)))
        .map(raw => path.relative(cwd, raw))
        .filter(filePath => !ig.ignores(filePath))
        .map(raw => path.resolve(cwd, raw));
    return filtered;
}

/**
 * 执行扫描
 * @param {*} path 扫描路径 - 默认为当前路径
 */
async function scan(param) {
    param = Object.assign(DEFAULT_PARAM, param);

    const { rootPath, extensions, defalutIgnore, ignoreRules, ignoreFileName } = param;

    process.chdir(rootPath);

    const ignorePatterns = await loadIgnorePatterns(ignoreFileName);

    let files = await getGlobScan(rootPath, extensions, defalutIgnore);

    return filterFilesByIgnore(files, ignorePatterns, ignoreRules);
}

/**
 * 执行扫描
 * @param {*} scanParam 扫描参数，具体参见 c-scan
 * @param {*} min 最小代码复杂度 , 大于此值不会被添加到结果
 */
async function check(scanParam = {}, min = 1) {
    const files = await scan(scanParam);
    return executeOnFiles(files, min);
}

async function showFil() {
    const checkNumber = 6;
    const files = await check(
        {
            // extensions: "**/*.js",
            rootPath: path.join(__dirname, "../src/")
            // defalutIgnore: "true",
            // ignoreRules: [],
            // ignoreFileName: ".gitignore"
        },
        checkNumber
    );
    console.log(`检查文件数：${files.fileCount}`);
    console.log(`检查函数数：${files.funcCount}`);
    console.log(`圈复杂度检查结果：`);
    if (files.result.length > 0) {
        console.log(files.result);
    } else {
        console.log(`-无函数复杂度大于${checkNumber}`);
    }
}

showFil();
