(() => {

    const automata = Automata({
        color1: '#661111',
        color2: '#119999',
        randState: true,
        rowCount: 300,
        containerID: 'container',
        rule: [1,0,1,0,0,0,0,1]
    });
    automata.run();

})();

document
.forms['regen-form']
.addEventListener('submit', (event) => {
    event.preventDefault();
    const color1 = event
        .target[0]
        .value,
    color2 = event
        .target[1]
        .value,
    rule = event
        .target[2]
        .value
        .split('')
        .map(value => Number(value)),
    randState = event.target[3].checked,
    automata = Automata({
        color1: color1,
        color2: color2,
        randState: randState,
        rowCount: 300,
        containerID: 'container',
        rule: rule
    });
    automata.run();
});
