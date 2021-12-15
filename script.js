const MAX = 20;
const MIN = 0;
const TOURNAMENTS_SIZE = 4;

const tail = (arr) => arr[arr.length - 1];

const zip = (...args) => args[0].map((value, idx) => args.map(arg => arg[idx]));

const sum = (array) => array.reduce((acc, x) => acc + x, 0);

const argmax = (arr) => arr.reduce((acc, elem, idx) => elem > arr[acc] ? idx : acc, 0);

const partialSum = (arr) => arr.reduce((acc, elem) => [...acc, acc.length > 0 ? tail(acc) + elem : elem], []);

const mutate = (curr, mutationRatio) => {
    const max = Math.min(curr * (1 + mutationRatio / 100), MAX);
    const min = Math.max(curr * (1 - mutationRatio / 100), MIN);
    return Math.random() * (max - min) + min;
};

const crossover = (x, y) => x + y / 2;

const elitistSelection = (x, fitness) => [x, Array.from({length: x.length}).fill(x[argmax(fitness)])];

const randInt = (start, end) => start + Math.floor(Math.random() * (end - start));

const rollRoulette = (fitness) => {
    const accumulator = partialSum(fitness);
    const thresholds = Array.from({length: accumulator.length}).map((_) => randInt(0, tail(accumulator)));
    return thresholds.map((threshold) => accumulator.findIndex(elem => elem >= threshold));
};

const roulletteSelection = (x, fitness) => {
    const father = rollRoulette(fitness).map((i) => x[i]);
    const mother = rollRoulette(fitness).map((i) => x[i]);
    return [father, mother];
};

const tournamentSelection = (x, fitness) => {
    const winners = x.map((_) => {
        const winners = Array.from({length: TOURNAMENTS_SIZE}).map(_ => Math.floor(Math.random() * x.length));
        return winners.reduce((acc, elem) => fitness[acc] < fitness[elem] ? elem : acc, winners[0]);
    });
    return [winners, winners];
};

const reproduce = (x, y, fitness, selectionFn, mutationRatio) => {
    const curriedMutate = (x) => mutate(x, mutationRatio);
    const [X1, X2] = selectionFn(x, fitness);
    const [Y1, Y2] = selectionFn(y, fitness);
    const newX = zip(X1, X2).map(([x1, x2]) => curriedMutate(crossover(x1, x2)));
    const newY = zip(Y1, Y2).map(([y1, y2]) => curriedMutate(crossover(y1, y2)));
    return [newX, newY];
};

const generateEvolver = (fitnessFn, selectionFn, mutationRatio) => {
    const FitnessFn = (arr) => arr.map(([xi, yi]) => fitnessFn(xi, yi));
    // Tail recursion optimized
    const evolve = (generationsLeft, [X, Y, fitness]) => {
        let reproducedPopulation = null;
        for (let i = 0; i < generationsLeft; i++) {
            const [newX, newY] = reproduce(X, Y, fitness, selectionFn, mutationRatio);
            const newFitness = FitnessFn(zip(newX, newY));
            reproducedPopulation = [newX, newY, newFitness];
        }
        return reproducedPopulation;
        //return generationsLeft > 0 ?
        //    evolve(--generationsLeft, reproducedPopulation) :
        //    reproducedPopulation;
    }
    return (X, Y, generations) => evolve(generations, [X, Y, FitnessFn(zip(X, Y))]);
};

const selectionFnsMap = {
    'ELITISM': elitistSelection,
    'ROULETTE': roulletteSelection,
    'TOURNAMENT': tournamentSelection
}

const main = () => {
    const parametersForm = document.forms.parameters;
    parametersForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const parameters = {
            algorithm: parametersForm.elements.algorithm.value,
            function: parametersForm.elements.function.value,
            generations: parseInt(parametersForm.elements.generations.value),
            mutationRatio: parseInt(parametersForm.elements['mutation-ratio'].value),
            populationSize: parseInt(parametersForm.elements['population-size'].value)
        };
    console.log(parameters)
        const selectionFn = selectionFnsMap[parameters.algorithm];
        const fitnessFn = (x, y) => {
            const fn = parameters.function.trim();
            const paddedFn = (fn[0] === '-' ? ['0', ...fn] : fn).join('');
            return eval(paddedFn.replaceAll('^', '**'));
        }
        const evolve = generateEvolver(fitnessFn, selectionFn, parameters.mutationRatio);
        const X = Array.from({length: parameters.populationSize}).map((_) => Math.max(Math.random() * MAX));
        const Y = X.map((_) => Math.max(Math.random() * MAX));
        const [resultX, resultY, resultFitness] = evolve(X, Y, parameters.generations);
        const iMax = argmax(resultFitness);
        console.log(`x: ${resultX[iMax]}`)
        console.log(`y: ${resultY[iMax]}`)
        console.log(`resultFitness: ${resultFitness[iMax]}`)
    })
}

window.onload = main;