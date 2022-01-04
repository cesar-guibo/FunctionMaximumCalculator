# MaxEvolutionaryAlgorithm
---
MaxEvolutionaryAlgorithm é um projeto desenvolvido para a disciplina **SSC0713-Sistemas-Evolutivos-Aplicados-a-Robotica** cujo objetivo é avaliar o ponto máximo de uma função de duas variáveis, utilizando algoritmos evolutivos estudados em sala de aula.

VÍDEO DE DEMOSTRAÇÃO: https://drive.google.com/file/d/1Z2yzYc7b71UEEMs6Vs5PNQsV61gxKi-A/view?usp=sharing

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

### Rearranjo da população
Realizamos o rearranjo da população por meio da substituição de gerações. 

## Implementação

O projeto foi desenvolvido na linguagem de programação JavaScript, com ajuda da biblioteca Plotly, utilizada para o plot dos gráficos. O site se encontra disponível no link: 

## Qual algoritmo de seleção utilizar?

### Elitismo
Por ser um algoritmo mais guloso que os demais, podemos utilizá-lo quando estamos diante de uma função com poucos máximos locais calculados em seu domínio. Isso ocorre pois como esse método é de natureza gulosa, ele irá convergir mais rapidamente para algum máximo, mas não necessariamente esse ponto será o máximo global da função.

### Roleta ou Torneio
Por serem algoritmos de natureza estocástica, podemos utilizá-los quando estamos diante de uma função com muitos máximos locais calculados em seu domínio. Isso ocorre, porque esses métodos não necessariamente irão convergir para o máximo mais "perto", tendo uma maior chance de convergir para um máximo global. 


## Autores
- César Henrique de Araújo Guibo - 11219705
- Pedro Henrique Borges Monici   - 10816732

