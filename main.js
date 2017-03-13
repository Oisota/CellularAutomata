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
