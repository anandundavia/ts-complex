# ts-complex
Inspired from 'typhonjs-escomplex', this module helps to find the Halstead Complexity Matrics, Cyclomatic Complexity and Maintainability for typescript.


## Features
* Calculates function wise Halstead Complexity Matrics
* Calculates function wise Cyclomatic Complexity
* Calculates file wise Average Maintainablity and Minimum Maintainablity


## Installing

```
npm install ts-complex
```

## Usage
**Maintainability**
```
const tscomplex = require('ts-complex');

const path = './test.ts'; // Finding maintainability of this file
const maintainability = tscomplex.calculateMaintainability(path);
console.log(maintainability); // { averageMaintainability: 56.14, minMaintainability: 46.19 }
```
**Halstead Complexity Matrics**
```
const tscomplex = require('ts-complex');

const path = './test.ts'; // Finding maintainability of this file
const halstead = tscomplex.calculateHalstead(path);
console.log(halstead); // object with function name as keys and Halstead Complexity Matrics as value
```
**Cyclomatic Complexity**
```
const tscomplex = require('ts-complex');

const path = './test.ts'; // Finding maintainability of this file
const complexity = tscomplex.calculateCyclomaticComplexity(path);
console.log(complexity); // object with function name as keys and cyclomatic complexity as value
```

### How the Maintainability is calculated
The formula to calculate the maintainability for a file is 
171 - (5.2 * log2(Halstead Volume)) - (0.23 * Cyclomatic Complexity) - (16.2 * log2(sourceCodeLength))
** Link to source**

We calculate Halstead Complexity Matrics and Cyclomatic Complexity for each function in the given file
And aggregate them by two methods; considering the average and considering the maximum

Thus, average maintainability is calculated using average halstead volume and average cyclomatic complexity
And minimum maintainability is calculated using maximum halstead volume and maximum cyclomatic complexity 


## Contributing

Pull Requests are welcome! 


## Authors

* **Anand Undavia** - [Anand Undavia](https://github.com/anandundavia/)


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details
