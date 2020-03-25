window.downTimeFactory = function(param) {
    const { log, cb, interval = 1000 } = param;
    let { ms } = param;
    const startTime = new Date().getTime();
    let count = 0,
        timeFlag = null;
    if (ms > 0) {
        timeFlag = setTimeout(core, interval);
    }
    function core() {
        // 当前循环计数
        count = count + 1;
        // 计算剩余时间
        ms -= interval;
        if (ms < 0) {
            clearTimeout(timeFlag);
            return;
        }
        // 执行逻辑
        if (cb) cb(ms);
        // 误差时间 = 当前时间 - 逻辑时间
        const errorTime = new Date().getTime() - (startTime + count * interval);
        // 下次执行时间
        let nextTime = interval - errorTime;
        if (nextTime < 0) {
            // 这种情况下说明当前进程阻塞时间大于了 interval 时间，
            // 只能到下个进程去纠正多余时间
            nextTime = 0;
        }
        setTimeout(core, nextTime);
        if (log) console.log(`误差：${errorTime} ms，下一次执行：${nextTime} ms 后，离开始还有：${ms} ms`);
    }
};

window.getbigyandsmallb = function(x, y) {
    if (x > y) [x, y] = [y, x];
    for (let i = x; i--; i > 0) {
        if (x % i === 0 && y % i === 0) {
            console.log(`big: ${i}; small: ${(x * y) / i}`);
            break;
        }
    }
};

window.shuixianhua = function() {
    function core(num) {
        const str = num + "";
        if (str.length !== 3) return false;
        const one = str[0] * 1,
            two = str[1] * 1,
            three = str[2] * 1;
        if (Math.pow(one, 3) + Math.pow(two, 3) + Math.pow(three, 3) === num) return true;
        return false;
    }
    const cache = [];
    for (let i = 100; i <= 999; i++) {
        if (core(i)) cache.push(i);
    }
    return cache;
};

window.baiqianbaiji = function() {
    for (let g = 0; g <= 20; g++) {
        for (let m = 0; m <= 33; m++) {
            const x = 100 - g - m;
            if (g * 5 + m * 3 + x / 3 === 100) {
                console.log(`gong: ${g}; mu: ${m}, xiao: ${x}`);
            }
        }
    }
};

window.CRAPSGAME = function(base = 100) {
    const box = document.getElementById("app");
    const showMsg = document.createElement("div");
    showMsg.innerHTML = `有$${base}`;
    const input = document.createElement("input");
    const btn = document.createElement("button");
    // const btn2 = document.createElement("button");
    // btn.innerHTML = ''
    box.appendChild(showMsg);
    box.appendChild(input);
    box.appendChild(btn);
    function getNumber() {
        return Math.ceil(6 * Math.random()) + Math.ceil(6 * Math.random());
    }
    function core() {
        const first = getNumber();
        // console.log(`第一次:`, first);
        if (first === 7 || first === 11) return true;
        if (first === 2 || first === 3 || first === 12) return false;
        while (true) {
            const sec = getNumber();
            // console.log(sec);
            if (sec === 7) return false;
            if (sec === first) return true;
        }
    }
    btn.addEventListener("click", () => {
        const value = input.value * 1;
        if (!(base > 0 && base > value && value > 0)) {
            showMsg.innerHTML = `error`;
            return;
        }
        if (core()) {
            base += value;
        } else {
            base -= value;
        }
        showMsg.innerHTML = `有$${base}`;
    });
};

window.CRAPSGAMERATE = function(number = 100) {
    function getNumber() {
        return Math.ceil(6 * Math.random()) + Math.ceil(6 * Math.random());
    }
    function core() {
        const first = getNumber();
        // console.log(`第一次:`, first);
        if (first === 7 || first === 11) return true;
        if (first === 2 || first === 3 || first === 12) return false;
        while (true) {
            const sec = getNumber();
            // console.log(sec);
            if (sec === 7) return false;
            if (sec === first) return true;
        }
    }
    let base = 100;
    const value = 3;
    for (let i = 0; i < number; i++) {
        if (core()) {
            base += value;
        } else {
            base -= value;
        }
    }
    console.log(base);
};

window.SELF_BIND_THIS = function() {
    const a = Function;
    a.prototype.calls = function(context = window, ...arg) {
        context.fn = this;
        const res = context.fn(...arg);
        delete context.fn;
        return res;
    };
};

window.CREATE_NEW = function(ConstructorFn, ...args) {
    if (typeof ConstructorFn !== "function") {
        throw new Error("not a constructor");
    }
    const obj = Object.create(ConstructorFn.prototype);

    const res = ConstructorFn.call(obj, ...args);

    // 如果返回值不是普通类型的话就 return 这个值， 是的话就 return 上边那个obj
    return res instanceof Object ? res : obj;
};

window.HUI_SU_FA = function() {
    var directs = [
        [-1, 0],
        [0, 1],
        [1, 0],
        [0, -1]
    ];
    var inArea = function(x, y, m, n) {
        return x >= 0 && x < m && y >= 0 && y < n;
    };
    var serachWord = function(board, word, index, startx, starty, m, n, visited) {
        // 如果当前递归的深度已经等于当前单词的长度  直接返回是否匹配
        if (index === word.length - 1) {
            return board[startx][starty] === word[index];
        }
        // 如果匹配
        if (word[index] === board[startx][starty]) {
            visited[startx][starty] = true;
            // 从startx starty 出发  向四个方向寻找
            for (let i = 0; i < 4; i++) {
                let newx = startx + directs[i][0];
                let newy = starty + directs[i][1];
                // 如果新方向没有越界  且  没有被访问过递归
                if (inArea(newx, newy, m, n) && !visited[newx][newy]) {
                    // 找到匹配的单词
                    if (serachWord(board, word, index + 1, newx, newy, m, n, visited)) {
                        return true;
                    }
                }
            }
            // 遍历四个方向依然没有找到  回溯
            visited[startx][starty] = false;
        }
        return false;
    };

    var exist = function(board, word) {
        let m = board.length;
        let n = board[0].length;
        // 创建一个二维数组记录 这里不能直接fill一个对象  小坑
        let visited = new Array(m).fill(undefined).map(item => {
            return new Array(n).fill(false);
        });
        // 遍历二维数组
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (serachWord(board, word, 0, i, j, m, n, visited)) {
                    return true;
                }
            }
        }
        return false;
    };
};
