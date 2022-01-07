# FunctionMaximumCalculator
---
FunctionMaximumCalculator é um projeto desenvolvido para a disciplina **SSC0713-Sistemas-Evolutivos-Aplicados-a-Robotica** cujo objetivo é avaliar o ponto máximo de uma função de duas variáveis, utilizando algoritmos evolutivos estudados em sala de aula.

VÍDEO DE DEMOSTRAÇÃO: https://drive.google.com/file/d/1Jlu1yerpbfYdhpWDBJQgZYkoKxxj9YPN/view?usp=sharing

## Algoritmos de Seleção Utilizados

### Elitismo
O melhor indivíduo (melhor fitness) é encontrado e selecionado para, assim, cruzar com todos os outros indivíduos

### Torneio
'n' indivíduos são selecionados de maneira randômica para um "torneio" e os que ganharem (melhor fitness) são selecionados para cruzar com os outros indivíduos.

### Roleta
'n' indivíduos são selecionados aleatoriamente a partir de uma distribuição que leva em consideração o fato de que indivíduos com maior fitness tendem a reproduzir com mais frequência que indivíduos com menor fitness (no caso, realizamos uma *Soft Max* nos fitness de todos os indivíduos para obter essa distribuição). 

## Algoritmo de Reprodução Utilizado

### Crossover
Partindo do pressuposto biológico onde a reprodução sexuada de indivíduos necessita de um crossover, simulamos tal fenômeno a partir da **média calculada sobre dois indivíduos**. Logo, isso permite que o novo indivíduo gerado perpetue as características de seus "pais".

### Mutação
A partir de uma constante (mutationRatio) que determina a porcentagem de mutação a cada reprodução, construímos o nosso algoritmo. Esse, por sua vez, considera o indivíduo atual X, que está sofrendo a mutação, e calcula um valor aleatório de mutação através da amostragem de uma distribuição uniforme. Isso fará com que o indivíduo X possua um valor que pertence ao intervalo

$$[max\{x - mutation\_ratio, MIN\}, min\{x + mutation\_ratio, MAX\}]$$ 

onde $MIN$ e $MAX$ são constantes arbitrárias que determinam a região do domínio da função que está sob consideração na procura do máximo.

É válido ressaltar que existe a opção também de ocorrer uma Mutação Variada, isto é, com um MutationRatio que varia ao longo das gerações. Tal opção é importante para tratar funções com muitos máximos locais e, assim, conseguir encontrar com sucesso o máximo global.

### Rearranjo da população
Realizamos o rearranjo da população por meio da substituição de gerações. 

## Implementação

O projeto foi desenvolvido na linguagem de programação JavaScript, com ajuda da biblioteca Plotly, utilizada para o plot dos gráficos. O site se encontra disponível no link: https://cesar-guibo.github.io/FunctionMaximumCalculator/

## Autores
- César Henrique de Araújo Guibo - 11219705
- Pedro Henrique Borges Monici   - 10816732

