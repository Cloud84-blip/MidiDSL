# Arduino-Langium DSL

This DSL allowi the description of a music piece, which we see as a set of tracks evolving on time.
This README provides instructions on how to generate and validate Arduino code using this DSL.

## Getting Started

To get started with Arduino-Langium DSL, you need to run the following commands:

1. **Clone the Repository**:

    Github CLI:
```
gh repo clone Cloud84-blip/MidiDSL
````

2. **Install the Dependencies**:

```
npm install
```

3. **Generate the Language Server and CLI**: 

```
npm run langium:generate
```

4. **Build the Project**:

```
npm run build
```

5. **Validate a `.mlang` File**:
To validate a `.mlang` file using the DSL, use the command:

```
./bin/cli.js parseAndValidate ./scenarios/{your_file}
```

Replace `{your_file}` with the path to your `.mlang` file.

6. **Generate Arduino Code**:
To generate Arduino code from a `.mlang` file, use the command:

```
./bin/cli.js generateArduinoCode ./scenarios/{your_file}
```

Replace `{your_file}` with the path of your `.mlang` file.

You can find the generated code in the [generated](./generated) folder.

## Basic Scenarios

The DSL comes withthe two basic scenario located in the [scenarios](./scenarios) folder.

[1. **Billie jean**]

[2. **Love is all**]  
  

## Authors

- AYARI Hadil 
- GUIBLIN Nicolas 
- MOVSESSIAN Chahan 
- PARIS Floriane 
