'use strict';

const Automata = (() => {

    function genFirstRow(cellsPerRow) {
        const randState = () => Math.random() > 0.5 ? 'active' : 'inactive';
        const row = document.createElement('div');
        row.setAttribute('class', 'row');
    
        for (let i=0; i<cellsPerRow; i++) {
            const cell = document.createElement('div');
            cell.setAttribute('class', randState());
            row.appendChild(cell);
        }
        return row; 
    }
    
    function calcNewRow(rules, oldRow) {
        const state = (cell) => cell.getAttribute('class') === 'active';
        const newRow = document.createElement('div');
        newRow.setAttribute('class', 'row');
    
        const len = oldRow.children.length;
        for (let i=0; i<len; i++) {
            const left = oldRow.children[i-1] || oldRow.children[len-1];
            const center = oldRow.children[i];
            const right = oldRow.children[i+1] || oldRow.children[0];
            const newCenter = document.createElement('div');
    
            rules.forEach((rule) => {
                if (state(left) === rule.left && 
                    state(center) === rule.center &&
                    state(right) === rule.right) {
                    newCenter.setAttribute('class', rule.newCell ? 'active' : 'inactive');
                }
            });
            newRow.appendChild(newCenter);
        }
        return newRow;
    }
    
    function Rule(rule) {
        return {
            left: rule[0] === 1,
            center: rule[1] === 1,
            right: rule[2] === 1,
            newCell: rule[3] === 1
        };
    }
    
    function createAutomata(spec) {
        const exports = {};
        const container = document.getElementById(spec.containerID);
        const cellsPerRow = Math.floor(container.offsetWidth / 10);
        const rules = spec.rules.map(rule => Rule(rule));
        const newRow = calcNewRow.bind(undefined, rules);
    
        exports.run = () => {
            container.appendChild(genFirstRow(cellsPerRow));
            let i=0;
            const timer = setInterval(() => {
                container.appendChild(newRow(container.children[i]));
                i=i+1;
                if (i === spec.rowCount) {
                    clearInterval(timer);
                }
            }, spec.delay);
        };
        return exports;
    }
    
    return createAutomata;
})();