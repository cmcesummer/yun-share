const fs = require("fs");
// const path = require("path");
const { render } = require("node-sass");

module.exports = function(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, "utf-8", (err, res) => {
            if (err) {
                reject(err);
                return;
            }
            console.log(res);
            render({ data: res }, (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
                const { css } = result;
                resolve(css.toString());
            });
        });
    });
};
