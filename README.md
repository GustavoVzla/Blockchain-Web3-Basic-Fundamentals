# 🧱 Blockchain Web3 Basic Fundamentals

This repository is a collection of educational projects developed with **Hardhat 3 Alpha + Viem + Ignition**, designed to learn and practice fundamental concepts of blockchain development. Each project is organized in its own folder, with smart contracts, tests, and interaction scripts.

> **⚠️ WARNING**: This project uses Hardhat 3 Alpha, which is still in development. Only for **educational purposes and local testing**.

## 📦 Main Technologies

- **Hardhat 3 Alpha**: New modular and asynchronous system for Ethereum development
- **Viem**: Modern library that replaces ethers.js/web3.js
- **Ignition**: Safe and reproducible deployment system
- **TypeScript**: Static typing for greater code safety
- **Solidity**: Standard language for smart contracts
- **forge-std**: Solidity testing library (Foundry)
- **node:test**: Native testing system for Node.js 20+
- **ESM**: Modern module system for JavaScript

## 🚀 How to Use

Each project has its own instructions, but these are the general steps:

### Quick Installation

**Prerequisites**:

- Node.js v22+
- npm v9+
- Git

```bash
# 1. Create a new directory for your project
mkdir my-blockchain-project
cd my-blockchain-project

# 2. Initialize Hardhat 3 project
npx hardhat@next init
```

This command will ask you for some configuration options. Accept the default options to quickly get a functional configuration that includes:

- Initialization in the current directory
- Example project with Node.js test runner and viem
- Automatic installation of all required dependencies

```bash
# 3. Download the contracts and examples from this repository
# You can clone this repo in a temporary folder and copy the projects you need:
git clone https://github.com/GustavoVzla/Blockchain-Web3-Basic-Fundamentals.git temp-blockchain-examples

# 4. Copy the project you want to study (example: 01-VariablesAndModifiers)
cp -r temp-blockchain-examples/01-VariablesAndModifiers/contracts/* contracts/
cp -r temp-blockchain-examples/01-VariablesAndModifiers/test/* test/
cp -r temp-blockchain-examples/01-VariablesAndModifiers/scripts/* scripts/

# 5. Clean temporary files
rm -rf temp-blockchain-examples
```

### Main Commands

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Start local node
npx hardhat node

# Deploy contract
npx hardhat ignition deploy ./ignition/modules/ContractModule.ts --network localhost
```

## 📚 Project List

| Number | Project                                             | Concept Learned                          | Contracts                                    |
| ------ | --------------------------------------------------- | ---------------------------------------- | -------------------------------------------- |
| 01     | [Variables And Modifiers](01-VariablesAndModifiers) | State variables, visibility modifiers    | VariablesAndModifiers.sol                    |
| 02     | [Data Structures](02-DataStructures)                | Arrays, mappings, structs in Solidity    | DataStructures.sol                           |
| 03     | [Functions And Modifiers](03-FunctionsAndModifiers) | Functions, modifiers, inheritance        | MathOperations.sol, StateVariables.sol, etc. |
| 04     | [Constructor](04-Constructor)                       | Constructors and contract initialization | Constructor.sol                              |
| 05     | [Event Emit](05-Event-Emit)                         | Events and log emission                  | EventEmitter.sol                             |
| 06     | [Require](06-Require)                               | Validations and access control           | RequireBasic.sol, RequireAccess.sol          |
| 07     | [Modifier](07-Modifier)                             | Custom modifiers                         | Modifier.sol                                 |
| 08     | [Payable Receive](08-Payable-Receive)               | Payable functions and Ether handling     | PayableBasics.sol                            |
| 09     | [Fallback Receive](09-Fallback-Receive)             | Fallback and receive functions           | FallbackReceive.sol                          |
| 10     | [Contract Lifecycle](10-ContractLifecycle)          | Interaction of all previous elements     | ContractLifecycle.sol                        |

## 🧪 Types of Tests

Each project includes two types of tests:

### Solidity Tests (`.t.sol`)

- **Ideal for**: Pure contract logic
- **Advantages**: Extreme speed, no intermediate layers
- **Usage**: `npx hardhat test solidity`

### TypeScript Tests (`.test.ts`)

- **Ideal for**: Integration with dApps and user simulation
- **Advantages**: Validates integration with Viem, real flows
- **Usage**: `npx hardhat test node`

## ⚙️ Hardhat 3 Features

- **Improved configuration**: Plugins as part of the configuration
- **Compilation profiles**: Different versions of solc
- **Native remappings**: Full support for npm resolution
- **Network configuration**: `edr` and `http` types with `chainType`

## 🔗 Additional Resources

- [Hardhat 3 Alpha Tutorial](https://hardhat.org/hardhat3-alpha)
- [Viem Documentation](https://viem.sh/docs/)
- [Ignition Documentation](https://hardhat.org/ignition/docs)
- [forge-std Documentation](https://github.com/foundry-rs/forge-std)

## 🤝 How to Contribute

Contributions are welcome! If you have ideas for new projects or improvements:

1. Fork the repository
2. Create a new branch `git checkout -b feature/new-concept`
3. Make your changes and make sure to include a detailed README.md
4. Send a pull request explaining your changes

## 📄 License

This project is under the MIT license. See the [LICENSE](LICENSE) file for more details.

## 📬 Contact

- **LinkedIn**: [linkedin.com/in/gustavotejera](https://www.linkedin.com/in/gustavotejera)
- **Instagram**: @gustavotejera.dev
- **TikTok**: @gustavotejera.dev
- **YouTube**: [youtube.com/@tejeragustavo](https://www.youtube.com/@tejeragustavo)

---

Thank you for visiting this repository! I hope these projects are useful for learning and practicing blockchain development with the most modern technologies. Enjoy coding! 🚀
