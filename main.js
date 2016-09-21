(() => {

    const automata = Automata({
        randState: true,
        rowCount: 300,
        containerID: 'container',
        delay: 50,
        rule: [1,0,1,0,0,0,0,1]
    });
    automata.run();

})();

document
.forms['regen-form']
.addEventListener('submit', (event) => {
    event.preventDefault();
    const rule = event
        .target[0]
        .value
        .split('')
        .map(value => Number(value));
    const randState = event.target[1].checked;
    const automata = Automata({
        randState: randState,
        rowCount: 300,
        containerID: 'container',
        delay: 50,
        rule: rule
    });
    automata.run();
});
