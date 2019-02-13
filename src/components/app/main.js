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
			rule: '10000001',
			rows: 300,
		};
	}
};
