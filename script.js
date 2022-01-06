const MAX = 20;
const MIN = 0;
const TOURNAMENTS_SIZE = 4;

const tail = (arr) => arr[arr.length - 1];

const zip = (...args) => args[0].map((value, idx) => args.map(arg => arg[idx]));

const sum = (array) => array.reduce((acc, x) => acc + x, 0);

const argmax = (arr) => arr.reduce((acc, elem, idx) => elem > arr[acc] ? idx : acc, 0);

const partialSum = (arr) => arr.reduce((acc, elem) => [...acc, acc.length > 0 ? tail(acc) + elem : elem], []);

const max = (arr) => arr.reduce((acc, elem) => acc < elem ? elem : acc, Number.MIN_SAFE_INTEGER);

const min = (arr) => arr.reduce((acc, elem) => acc < elem ? acc : elem, Number.MAX_SAFE_INTEGER);

// Gera um inteiro aleatório
const randInt = (start, end) => start + Math.floor(Math.random() * (end - start));

// Gera os valores de uma dada função fitnessFn
const polyval = (fitnessFn) => {
	let minZ = 0;
	let maxZ = 0;

	let _z = [];
	for (let y = 0; y < MAX + 1; y++) {
		let _zrow = [];
		for (let x = 0; x < MAX + 1; x++) {
			_zrow.push(fitnessFn(x, y));
			if (_zrow[x] > maxZ) maxZ = _zrow[x];
			if (_zrow[x] < minZ) minZ = _zrow[x];
		}
		_z.push(_zrow);
	}

	return {z : _z, type: 'surface'};
}

// Realiza a amostragem de uma distribuição de elementos 'elements' com probabilidades 'probabilities'
const sampleFromDistribution = (elements, probabilites) => {
    const sample = zip(elements, probabilites).flatMap(([elem, p]) => Array.from({length: (p * 100)}).fill(elem));
    return sample[randInt(0, sample.length)];
}

// Realiza uma mutação no valor curr através de um mutationRatio
const mutate = (curr, mutationRatio) => {
    const max = Math.min(curr * (1 + mutationRatio / 100), MAX);
    const min = Math.max(curr * (1 - mutationRatio / 100), MIN);
    return Math.random() * (max - min) + min;
};

// Realiza o crossover com a média entre os elementos 'x' e 'y'
const crossover = (x, y) => (x + y) / 2.0;

// Realiza uma seleção elitista
const elitistSelection = (x, fitness) => [x, Array.from({length: x.length}).fill(x[argmax(fitness)])];

// Roda a roleta e escolhe um elemento de tal forma que as probabilidades dos valores 
// são maiores quanto maiores seus fitness (SoftMax)
const rollRoulette = (fitness) => {
    const exponentials = fitness.map((elem) => Math.exp(elem));
    const exponentialsSum = sum(exponentials);
    const probabilites = exponentials.map((elem) => elem / exponentialsSum);
    const indices = Array.from(exponentials.keys());
    return Array.from({length: indices.length}, (_) => sampleFromDistribution(indices, probabilites));
};

// Realiza uma seleção pelo método da roleta
const roulletteSelection = (x, fitness) => {
    const father = rollRoulette(fitness).map((i) => x[i]);
    const mother = rollRoulette(fitness).map((i) => x[i]);
    return [father, mother];
};

// Realiza uma seleção pelo método de torneio
const tournamentSelection = (x, fitness) => {
    const WinnersIndices = x.map((_) => {
        const winners = Array.from({length: TOURNAMENTS_SIZE}).map(_ => Math.floor(Math.random() * x.length));
        return winners.reduce((acc, elem) => fitness[acc] < fitness[elem] ? elem : acc, winners[0]);
    });
    const winners = WinnersIndices.map((elem) => x[elem]);
    return [winners, winners];
};

// Realiza a reprodução sexuada
const reproduce = (x, y, fitness, selectionFn, mutationRatio) => {
    const partialMutate = (x) => mutate(x, mutationRatio);
    const [X1, X2] = selectionFn(x, fitness);
    const [Y1, Y2] = selectionFn(y, fitness);
    const newX = zip(X1, X2).map(([x1, x2]) => partialMutate(crossover(x1, x2)));
    const newY = zip(Y1, Y2).map(([y1, y2]) => partialMutate(crossover(y1, y2)));
    return [newX, newY];
};

// Gera a função que simula a evolução da população
const generateEvolver = (fitnessFn, selectionFn, mutationRatio) => {
    const FitnessFn = (arr) => arr.map(([xi, yi]) => fitnessFn(xi, yi));
    const evolve = (generations, [X, Y]) => {
		let fitnessHistory = Array.from({length: generations});
		for (let i = 0; i < generations - 1; i++) {
			fitnessHistory[i] = FitnessFn(zip(X, Y));
			[X, Y] = reproduce(X, Y, fitnessHistory[i], selectionFn, mutationRatio);
		}
        fitnessHistory[generations - 1] = FitnessFn(zip(X, Y));
        return [X, Y, fitnessHistory];
    };
    return (X, Y, generations) => evolve(generations, [X, Y]);
};

const selectionFnsMap = {
    'ELITISM': elitistSelection,
    'ROULETTE': roulletteSelection,
    'TOURNAMENT': tournamentSelection
};

// Plota o grafico final
const plotGraphic = (bestPoint, fitnessFn) => {
    const data = polyval(fitnessFn);
    const div = "graph";
    const layout = {
        autosize: true,
    }
    Plotly.purge(div);
    Plotly.plot(div,
        [
            data,
            {
                ...bestPoint,
                mode: 'markers',
		        marker: {
			        size: 5,
			        line: {
				        color: 'rgba(241, 193, 0, 1)',
				        width: 0.5
			        },
			        opacity: 0.8
		        },
		        type: 'scatter3d'
            }
        ], layout);
};


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
        const selectionFn = selectionFnsMap[parameters.algorithm];
        const fitnessFn = (x, y) => {
            const fn = parameters.function.trim();
            const paddedFn = fn[0] === '-' ? ['0', ...fn].join('') : fn;
            return eval(paddedFn.replaceAll('^', '**'));
        };

		// Realiza a evolução
        const evolve = generateEvolver(fitnessFn, selectionFn, parameters.mutationRatio);
        const X = Array.from({length: parameters.populationSize}).map((_) => Math.max(Math.random() * MAX));
        const Y = X.map((_) => Math.max(Math.random() * MAX));
        const [finalX, finalY, fitnessHistory] = evolve(X, Y, parameters.generations);
        
		// Melhor ponto (indivíduo) da população final
		const finalFitness = tail(fitnessHistory);
        const bestIndex = argmax(finalFitness);
        const bestPoint = {
            x: [finalX[bestIndex]],
            y: [finalY[bestIndex]],
            z: [finalFitness[bestIndex]],
        };

		// Plot Graphic
        plotGraphic(bestPoint, fitnessFn);
		
		// Print result
		document.getElementById('result').innerHTML = `Result: (${bestPoint.x}, ${bestPoint.y},${bestPoint.z})`;

		// Plot History
        const cX = Array.from({length: X.length}, (_, idx) => idx);
        const cY = fitnessHistory.map(max);
        Plotly.purge('history');
        Plotly.plot('history',
            [{
                x: cX,
                y: cY,
                mode: 'lines+markers',
                name: "fitnessHistory",
                font: {
                    size: 16
                }
            }],
            {
                yaxis: {range: [min(cY), max(cY)]}
            }
        );
    })
}

window.onload = main;
