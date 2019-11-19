/**
 * http core 文件
 */

function timeoutCut(fetch, time) {
    let out = null;
    const timePromise = new Promise((res, rej) => {
        out = () => {
            rej("timeout");
        };
    });
    const res = Promise.race([fetch, timePromise]);
    setTimeout(out, time);
    return res;
}

console.log(timeoutCut);

function handelGetUrl(url, params) {
    if (params) {
        const paramsArray = [];
        Object.keys(params).forEach(key => {
            const value = params[key];
            if (Object.prototype.toString.call(value) !== "[object Object]") {
                paramsArray.push(`${key}=${value}`);
            }
        });
        if (url.search(/\?/) === -1) {
            url += `?${paramsArray.join("&")}`;
        } else if (paramsArray.length > 0) {
            url += `&${paramsArray.join("&")}`;
        }
    }
    return url;
}

export function requestFetch(info) {
    const { method = "GET", url, data, dataType = "application/json;" } = info;
    const options = {
        timeout: 15000,
        mode: "cors",
        credentials: "same-origin",
        cache: "no-store",
        method,
        dataType,
        ...info,
        headers: {
            Accept: "application/json"
        },
        url: method === "GET" ? handelGetUrl(url, data) : url
    };
    if (method === "POST" || method === "post") {
        options.body = JSON.stringify(data);
    }
    options.headers["Content-Type"] = `${dataType}charset=utf-8`;
    return timeoutCut(fetch(options.url, options), options.timeout)
        .then(response => {
            if (response.status === 200) {
                try {
                    return Promise.resolve({ response, data: response.json(), result: true });
                } catch (error) {
                    return Promise.reject(error);
                }
            } else {
                return Promise.resolve({ response, result: false });
            }
        })
        .catch(error => {
            return Promise.reject(error);
        });
}

export function sendFile(options) {
    const { url, file, process, ...other } = options;
    return new Promise((res, rej) => {
        const xhr = new XMLHttpRequest();
        const form = new FormData();
        if (process) xhr.upload.addEventListener("progress", process, false);
        const successFn = _ => {
            try {
                res(JSON.parse(xhr.responseText));
            } catch (e) {
                rej(e);
            }
        };
        const errorFn = resp => rej(resp);
        xhr.addEventListener("load", successFn, false);
        xhr.addEventListener("error", errorFn, false);
        xhr.addEventListener("abort", errorFn, false);
        form.append("file", file);
        Object.keys(other).map(key => form.append(key, other[key]));
        xhr.open("POST", url, true);
        xhr.send(form);
    });
}
