import Vue from 'vue';

interface Rule {
	left: boolean,
	right: boolean,
	center: boolean,
	cell: boolean,
}

interface Data {
	ctx: CanvasRenderingContext2D | null,
	width: number,
	height: number,
	cellWidth: number,
	cellHeight: number,
}

interface CellRect {
	color: string,
	x: number,
	y: number,
}

export default Vue.extend({
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
			validator: (val: string): boolean => { // written without shorthand due to typescript bug
				return val.length == 8;
			}
		},
	},
	data(): Data {
		return {
			ctx: null,
			width: 0,
			height: 0,
			cellWidth: 10,
			cellHeight: 10,
		};
	},
	mounted() {
		this.ctx = (this.$refs.cellCanvas as HTMLCanvasElement).getContext('2d');
		const el = this.$el as HTMLCanvasElement;
		this.width = el.width;
		this.height = el.height;
	},
	computed: {
		cells(): CellRect[][] {
			const rules = this.genRules();
			const firstRow = this.initRow(this.columns, this.rand, [this.color1, this.color2]);

			return Array.from(Array(this.rows))
				.reduce((acc, _, idx) => {
					const row = this.newRow(rules, [this.color1, this.color2], acc[idx]);
					acc.push(row);
					return acc;
				}, [firstRow])
				.map((r: Array<string>, i: number) : Array<CellRect> => {
					const cellY = i * this.cellHeight;
					return r.map((c: string, j: number) : CellRect => {
						const cellX = j * this.cellWidth;
						return {
							color: c,
							x: cellX,
							y: cellY,
						}
					})
				});
		},
		ruleArray(): number[] {
			return this.rule.split('').map(Number);
		},
		columns(): number {
			return Math.floor(this.width / this.cellWidth);
		},
		rows(): number {
			return Math.floor(this.height / this.cellHeight);
		}
	},
	methods: {
		genRules(): Rule[] {
			return Array.from(Array(8)) //create empty array
				.map((_, idx):  number[] => ('000' + idx.toString(2)).slice(-3).split('').map(Number)) //convert to 0 - 7 bit array
				.map((rule, idx) => rule.concat(this.ruleArray[idx])) //add rule to rule base
				.map((rule: number[]): Rule => {
					return {
						left: rule[0] == 1,
						center: rule[1] == 1,
						right: rule[2] == 1,
						cell: rule[3] == 1,
					};
				})
				.reverse();
		},
		/**
		 * @param {int} cellsPerRow - number of cells in each row
		 * @param {bool} rand - indicate if row should be random or not
		 * @param {Array<string>} colors - an array containing 2 color hexcodes as strings
		 * @returns {Array<string>} the initial row arrary
		 */
		initRow(cellsPerRow: number, rand: boolean, colors: string[]): string[] {
			const randChoice = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
			const row = Array.from(Array(cellsPerRow))
				.map(() => rand ? randChoice(colors) : colors[1]);

			if (!rand) {
				row[Math.floor(cellsPerRow/2)] = colors[0];
			}
			return row; 
		},
		/**
		 * @param {Array<Rule>} rules - the rule array to calculate the new row from
		 * @param {Array<string>} colors - an array containing 2 color hexcodes as strings
		 * @param {Array<string>} oldRow - the previous row
		 * @returns {Array<string>} the new row
		 */
		newRow(rules: Rule[], colors: string[], oldRow: string[]): string[] {
			const state = (cell: string) => cell === colors[0];
			const match = (rule: Rule, left: string, right: string, center: string): boolean => { 
				return state(left) === rule.left &&
					state(center) === rule.center &&
					state(right) === rule.right;
			};
			return oldRow.map((el, idx, row) => {
				const left = row[idx-1] || row[row.length-1];
				const center = el;
				const right = row[idx+1] || row[0];
				const rule = rules.find(rule => match(rule, left, right, center));
				const newCenter = (!!rule)
					? rule.cell
						? colors[0]
						: colors[1]
					: '';
				return newCenter;
			});
		},
		renderCanvas() {
			if (this.ctx !== null) {
				this.ctx.clearRect(0, 0, this.width, this.height);
				for (const row of this.cells) {
					for (const cell of row) {
						this.ctx.fillStyle = cell.color;
						this.ctx.fillRect(cell.x, cell.y, this.cellWidth, this.cellHeight);
					}
				}
			}
		}
	},
	watch: {
		cells() {
			this.renderCanvas();
		}
	}
});
