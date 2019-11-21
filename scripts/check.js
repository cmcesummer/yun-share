const path = require("path");
const fs = require("fs");
const eslint = require("eslint");
const xlsx = require("node-xlsx");
const glob = require("glob");
const ignore = require("ignore");

const { CLIEngine } = eslint;

/**
 * 提取函数类型正则
 */
const REG_FUNC_TYPE = /^(Method |Async function |Async method |Arrow function |Function |Static |Constructor )/g;

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
    const reg = /(\d+)\./;
    return main.match(reg)[1];
}

/**
 * 获取函数名
 * @param {*} message
 */
function getFunctionName(message) {
    const main = getMain(message);
    const reg = /'([a-zA-Z0-9_$]+)'/;
    const arr = main.match(reg);
    return arr ? arr[1] : "*";
}

/**
 * 提取函数类型
 * @param {*} message
 */
function getFunctionType(message) {
    const arr = message.match(REG_FUNC_TYPE);
    if (arr && arr[0]) return arr[0].trim();
    return "";
}

/**
 * 提取文件名称
 * @param {*} filePath
 */
function getFileName(filePath) {
    return filePath.replace(process.cwd(), "").trim();
}

function createCliEngine({ checkType, sourceType = "module", ecmaVersion = 2020 }) {
    // sourceType?: "module" | 'script'
    // ecmaVersion?: 3 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020;
    let parser = "babel-eslint";
    if (checkType === "typescript") {
        parser = "@typescript-eslint/parser";
    }
    return new CLIEngine({
        parserOptions: {
            ecmaVersion,
            sourceType,
            ecmaFeatures: {
                globalReturn: true,
                impliedStrict: true,
                jsx: true,
                experimentalObjectRestSpread: true
            }
        },
        parser,
        rules: {
            complexity: ["error", { max: 0 }]
        },
        useEslintrc: false
    });
}

/**
 * 获取单个文件的复杂度
 */
function executeOnFiles(paths, min) {
    const cli = createCliEngine();
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
                        complexity
                    });
                }
            }
        }
    }
    return { fileCount, funcCount, result };
}

/**
 * 默认忽略文件夹
 */
const DEFAULT_IGNORE_PATTERNS = ["node_modules/**", "build/**", "dist/**", "output/**", "common_build/**"];

/**
 * 默认参数
 */
const DEFAULT_PARAM = {
    rootPath: "",
    ignoreRules: [],
    defalutIgnore: true,
    extensions: "**/*.js",
    ignoreFileName: ".gitignore"
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
 * @param {*} scanParam 扫描参数，DEFAULT_PARAM
 * @param {*} min 最小代码复杂度 , 大于此值不会被添加到结果
 */
async function check(scanParam = {}, min = 1) {
    const files = await scan(scanParam);
    return executeOnFiles(files, min);
}

/**
 * 转化数据格式
 * @param {*} result eslint检查结果
 */
function tarnformData(result) {
    const keyArray = ["funcType", "funcName", "fileName", "position", "complexity"];
    const data = [["函数类型", "函数名", "文件名", "代码位置", "复杂度"]];
    for (const item of result) {
        data.push(keyArray.map(key => item[key]));
    }
    return data;
}

/**
 * 生成excel文件
 * @param {*} path 生成的文件位置
 * @param {*} data 生成数据， buffer
 * @param {*} name sheet名称
 */
function createExcel(path, data, name = "Sheet1") {
    const buffer = xlsx.build([{ name, data: data }]);
    return new Promise((res, rej) => {
        fs.writeFile(path, buffer, "utf-8", er => {
            if (er) {
                rej(er);
                return;
            }
            res();
        });
    });
}

/**
 * 执行函数
 * @param {*} scanParam 扫描参数，DEFAULT_PARAM
 * @param {*} min 限制的复杂度
 */
async function exec(scanParam, min = 10) {
    const files = await check(scanParam, min);
    console.log(`检查文件数：${files.fileCount}`);
    console.log(`检查函数数：${files.funcCount}`);
    console.log(`圈复杂度检查结果：`);
    const length = files.result.length;
    if (length === 0) {
        console.log(`没有函数圈复杂度大于${min}`);
        return;
    }
    if (files.result.length <= 10) {
        console.log(files.result);
        return;
    }
    const filename = path.join(__dirname, "./advice-excel.xlsx");
    await createExcel(filename, tarnformData(files.result));
    console.log(`复杂度越小越好，因此建议修改复杂度超过 ${min} 的函数。`);
    console.log(`建议修改函数数量：${files.result.length};  详情请查阅文件: ${filename}`);
}

exec({ rootPath: path.join(__dirname, "../src/"), extensions: "**/*.?(js|ts|tsx)" }, 6);
