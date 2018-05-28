# ts-complex
Inspired from 'typhonjs-escomplex', this module helps to find the Halstead Complexity Matrices, Cyclomatic Complexity and Maintainability for typescript.


## Features
* Calculates function wise Halstead Complexity Matrices.
* Calculates function wise Cyclomatic Complexity.
* Calculates file wise Average Maintainability and Minimum Maintainability.


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
**Halstead Complexity Matrices**
```
const tscomplex = require('ts-complex');

const path = './test.ts'; // Finding maintainability of this file
const halstead = tscomplex.calculateHalstead(path);
console.log(halstead); // object with function name as keys and Halstead Complexity Matrices as value
```
**Cyclomatic Complexity**
```
const tscomplex = require('ts-complex');

const path = './test.ts'; // Finding maintainability of this file
const complexity = tscomplex.calculateCyclomaticComplexity(path);
console.log(complexity); // object with function name as keys and cyclomatic complexity as value
```

### How  is the Maintainability calculated
The formula to calculate the maintainability for a file is 
$$
171 - 5.2\*log_2(HV) - 0.23 \* CC - 16.2 \* log_2(SLoC)
$$
Where,
$$HV = Halstead\ Volume$$
$$CC = Cyclomatic\ Complexity$$
$$SLoC = Lines\ of \ Code$$

We calculate Halstead Complexity Matrices and Cyclomatic Complexity for each function in the given file.
And aggregate them by two methods; considering the average and considering the maximum.

Thus, average maintainability is calculated using average halstead volume and average cyclomatic complexity.
And minimum maintainability is calculated using maximum halstead volume and maximum cyclomatic complexity.


## Contributing

Pull Requests are welcome! 


## Authors

* **Anand Undavia** - [Anand Undavia](https://github.com/anandundavia/)


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details
