import Vue from 'vue';

import App from './components/app';

const app = new Vue({ // eslint-disable-line no-unused-vars
	el: '#app',
	render: h => h(App)
});