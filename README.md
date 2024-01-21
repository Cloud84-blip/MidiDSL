# MIDI-Langium DSL

This DSL allow the description of a music piece, which we see as a set of tracks evolving on time.
This README provides instructions on how to generate and validate MIDI using this DSL.

## BNF

You can find the BNF of the DSL here: [BNF](./src/language/midi-lang.langium)

## Getting Started

To get started with MIDI-Langium DSL, you need to run the following commands:

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

6. **Generate MIDI**:
To generate MIDI from a `.mlang` file, use the command:

```
./bin/cli.js generate ./scenarios/{your_file}
```

Replace `{your_file}` with the path of your `.mlang` file.

You can find the generated code in the [generated](./generated) folder.

## Note on Instrument Names in BNF and Generated MIDI Files

The instrument name defined in a track within the BNF is included as a descriptive label in the generated MIDI files. However, the actual sound or instrument used during MIDI playback is determined by your MIDI file interpreter or playback software. It's important to manually select the desired instrument in your MIDI player or software to match the intended sound, as the label in the MIDI file serves only as a guide or description and does not automatically set the instrument sound.

## Note on BPM and Time Signature in Generated MIDI Files

The current version of the MIDI-Langium DSL allows for specifying BPM (beats per minute) and time signature at any desired measure in the .mlang files. However, the current MIDI file generator applies only the first BPM value and the first time signature value to the entire MIDI file. We plan to enhance this feature in future updates to allow different BPMs and time signatures at specified measures throughout the MIDI file.

## Basic Scenarios

The DSL comes withthe two basic scenario and one ultra-basic test located in the [scenarios](./scenarios) folder.

[1. **Billie jean**]

[2. **Love is all**]

[3. **Test**]
  

## Authors

- AYARI Hadil 
- GUIBLIN Nicolas 
- MOVSESSIAN Chahan 
- PARIS Floriane 
