import CellGrid from '../cell-grid';

export default {
	name: 'app',
	components: {
		'cell-grid': CellGrid,
	},
	data() {
		return {
			color1: '#661111',
			color2: '#119999',
			rand: false,
			rule: [1,0,0,0,0,0,0,1].map(x => x ? {value: true} : {value: false}),
			rows: 300,
		};
	},
	computed: {
		ruleString() {
			return this.rule.map(r => r.value ? 1 : 0).join('');
		}
	}
};
