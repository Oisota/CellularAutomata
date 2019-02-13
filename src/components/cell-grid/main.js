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
	computed: {
		cells() {
			const row = this.initRow(100, this.rand, [this.color1, this.color2])
				.map(color => `background-color: ${color}`);
			return [row];
		},
		ruleArray() {
			return this.rule.split('').map(Number);
		}
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
	},
};
