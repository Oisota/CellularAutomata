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
		}
	}
};
