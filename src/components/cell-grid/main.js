export default {
	name: 'cell-grid',
	props: {
		color1: {
			type: String,
			required: true,
		},
		color2: {
			type: String,
			required: true,
		},
		rand: {
			type: Boolean,
			required: true,
		},
		rule: {
			type: String,
			required: true,
			validator(val) {
				return val.length == 8;
			}
		},
		rows: {
			type: Number,
			required: true,
		},
	},
	data() {
		return {
			columns: 0,
		};
	},
	mounted() {
		this.columns = Math.floor(this.$el.offsetWidth / 10);
	},
	computed: {
		cells() {
			const rules = Array.from(Array(8)) //create empty array
				.map((_, idx) => ('000' + idx.toString(2)).slice(-3).split('').map(Number)) //convert to 0 - 7 bit array
				.reverse()
				.map((rule, idx) => rule.concat(this.ruleArray[idx])) //add rule to rule base
				.map(rule => ['left','center','right','cell'].reduce((prev, cur, idx) => {
					prev[cur] = rule[idx] === 1;
					return prev;
				}, {})); //convert to rule objects

			const firstRow = this.initRow(this.columns, this.rand, [this.color1, this.color2]);

			return Array.from(Array(this.rows))
				.reduce((acc, cur, idx) => {
					const row = this.newRow(rules, [this.color1, this.color2], acc[idx]);
					acc.push(row);
					return acc;
				}, [firstRow])
				.map(r => r.map(c => `background-color: ${c}`));
		},
		ruleArray() {
			return this.rule.split('').map(Number);
		},
	},
	methods: {
		/**
		 * @param {int} cellsPerRow - number of cells in each row
		 * @param {bool} rand - indicate if row should be random or not
		 * @param {Array<string>} colors - an array containing 2 color hexcodes as strings
		 * @returns {div} the initial row div object
		 */
		initRow(cellsPerRow, rand, colors) {
			const randChoice = arr => arr[Math.floor(Math.random() * arr.length)];
			const row = Array.from(Array(cellsPerRow))
				.map(() => rand ? randChoice(colors) : colors[1]);

			if (!rand) {
				row[Math.floor(cellsPerRow/2)] = colors[0];
			}
			return row; 
		},
		/**
		 * @param {} rules - 
		 * @param {Array<string>} colors - an array containing 2 color hexcodes as strings
		 * @param {div} oldRow - 
		 */
		newRow(rules, colors, oldRow) {
			const state = cell => cell === colors[0];
			const match = (rule, left, right, center) => { 
				return state(left) === rule.left &&
					state(center) === rule.center &&
					state(right) === rule.right;
			};
			return oldRow.map((el, idx, row) => {
				const left = row[idx-1] || row[row.length-1];
				const center = el;
				const right = row[idx+1] || row[0];
				let newCenter = '';
				rules.forEach(rule => { // use array.find here?
					if (match(rule, left, right, center)) {
						newCenter = rule.cell ? colors[0] : colors[1];
					}
				});
				return newCenter;
			});
		},
	},
};
