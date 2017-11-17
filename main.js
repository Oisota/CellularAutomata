'use strict';

/**
 * @param {Object} spec - specification object
 * @param {Array<string>} spec.colors - an array containing 2 color hexcodes as strings
 * @param {bool} spec.randState - indicate if initial row should be random or not
 * @param {int} spec.rowCount - number of rows to generate
 * @param {string} containerID - the id of the element to generate the automata in
 * @param {Array<int>} spec.rule - an array of length 8 containing the rule to use to generate the automata
 */
function Automata(spec) {

	/**
	 * @param {int} cellsPerRow - number of cells in each row
	 * @param {bool} rand - indicate if row should be random or not
	 * @param {Array<string>} colors - an array containing 2 color hexcodes as strings
	 * @returns {div} the initial row div object
	 */
	function initRow(cellsPerRow, rand, colors) {
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

	/**
	 * @param {} rules - 
	 * @param {Array<string>} colors - an array containing 2 color hexcodes as strings
	 * @param {div} oldRow - 
	 */
	function newRow(rules, colors, oldRow) {
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
		return rowDiv;
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
		const row = newRow(rules, colors, container.children[idx]);
		container.appendChild(row);
	});
}

(() => {
	Automata({
		colors: ['#661111', '#119999'],
		randState: true,
		rowCount: 300,
		containerID: 'container',
		rule: [1,0,1,0,0,0,0,1]
	});
})();

document.forms['regen-form'].addEventListener('submit', (event) => {
	event.preventDefault();
	Automata({
		colors: [
			event.target['color1'].value,
			event.target['color2'].value
		],
		randState: event.target['rand'].checked,
		rule: event.target['rule'].value.split('').map(Number),
		rowCount: 300,
		containerID: 'container'
	});
});
