'use strict';

function Automata(spec) {

	const initRow = (cellsPerRow, rand, colors) => {
		const randChoice = arr => arr[Math.floor(Math.random() * arr.length)];
		const row = document.createElement('div');
		row.setAttribute('class', 'row');

		Array.from(Array(cellsPerRow)).forEach(() => {
			const cell = document.createElement('div');
			cell.style.backgroundColor = rand ? randChoice(colors) : colors[1];
			row.appendChild(cell);
		});

		if (!rand) {
			row.children[Math.floor(cellsPerRow/2)].style.backgroundColor = colors[0];
		}
		return row; 
	};

	const newRow = (rules, colors, oldRow) => {
		const state = cell => cell.style.backgroundColor === colors[0];
		const match = (rule, left, right, center) => { 
			return state(left) === rule.left && state(center) === rule.center && state(right) === rule.right;
		};
		const rowDiv = document.createElement('div');
		rowDiv.setAttribute('class', 'row');
		Array.from(oldRow.children).forEach((el, idx, row) => {
			const left = row[idx-1] || row[row.length-1];
			const center = el;
			const right = row[idx+1] || row[0];
			const newCenter = document.createElement('div');
			rules.forEach(rule => {
				if (match(rule, left, right, center)) {
					newCenter.style.backgroundColor = rule.cell ? colors[0] : colors[1];
				}
			});
			rowDiv.appendChild(newCenter);
		});
		return rowDiv
	};

	const colors = spec.colors.map(hex => { //map hex code to color
		const el = document.createElement('div');
		el.style.backgroundColor = hex;
		return el.style.backgroundColor;
	});
	const container = document.getElementById(spec.containerID);
	const cellsPerRow = Math.floor(container.offsetWidth / 10);
	const rules = Array.from(Array(8)) //create empty array
		.map((_, idx) => ('000' + idx.toString(2)).slice(-3).split('').map(Number)) //convert to 0 - 7 bit array
		.reverse()
		.map((rule, idx) => rule.concat(spec.rule[idx])) //add rule to rule base
		.map(rule => ['left','center','right','cell'].reduce((prev, cur, idx) => {
			prev[cur] = rule[idx] === 1;
			return prev;
		}, {})); //convert to rule objects

	container.innerHTML = '';
	container.appendChild(initRow(cellsPerRow, spec.randState, colors));
	Array.from(Array(spec.rowCount)).forEach((_, idx) => {
		const row = newRow(rules, colors, container.children[idx])
			container.appendChild(row);
	});
}

