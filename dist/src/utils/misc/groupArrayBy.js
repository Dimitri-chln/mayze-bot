"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function groupArrayBy(array, n) {
    var groups = [
        []
    ];
    for (var i = 0, j = 0; i < array.length; i++) {
        if (i >= n && i % n === 0) {
            j++;
            groups[j] = [];
        }
        groups[j].push(array[i]);
    }
    return groups;
}
exports.default = groupArrayBy;
