import Vue from 'vue';
import CellGrid from '../cell-grid';
import debounce from 'lodash/debounce';

export default Vue.extend({
	name: 'app',
	components: {
		'cell-grid': CellGrid,
	},
	data() {
		return {
			color1: '#661111',
			color2: '#119999',
			debouncedColor1: '#661111',
			debouncedColor2: '#119999',
			rand: false,
			rule: [1,0,0,0,0,0,0,1].map(x => ({value: x ? true : false})),
			rows: 200,
		};
	},
	created() {
		this.setColor1 = debounce(this.setColor1, 250);
		this.setColor2 = debounce(this.setColor2, 250);
	},
	computed: {
		ruleString(): string {
			return this.rule.map(r => r.value ? 1 : 0).join('');
		}
	},
	methods: {
		setColor1(c: string) {
			this.color1 = c;
		},
		setColor2(c: string) {
			this.color2 = c;
		},
	},
	watch: {
		debouncedColor1(newColor: string) {
			this.setColor1(newColor);
		},
		debouncedColor2(newColor: string) {
			this.setColor2(newColor);
		},
	}
});