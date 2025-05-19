# 🌊 GOOS Metadata Standard

This repository defines the official **GOOS Metadata Standard** for ocean observation missions and related entities. It provides semantic models, validation schemas, and examples to ensure consistent, machine-readable metadata across platforms and systems.

---

## 📁 Repository Structure

```text
goos-metadata-standard/
├── ontology/      # OWL (Turtle) files defining the classes and properties
├── context/       # JSON-LD context files for linked data representation
├── schema/        # JSON Schema files for data validation
├── example/       # Sample JSON(-LD) examples for each class
├── website/       # React website for browsing the standard
└── README.md      # This file
```

---

## 🧠 Purpose

The **GOOS Metadata Standard** aims to:

- Enable **interoperability** between observing systems, nations, and organizations.
- Describe **missions, platforms, sensors, observations**, and more using [schema.org](https://schema.org), [SOSA/SSN](https://www.w3.org/TR/vocab-ssn/), and other W3C standards.
- Provide a flexible but coherent **structure for metadata exchange**, both human-readable and machine-processable.

---

## 📦 Components

Each class in the model includes:

- ✅ **Ontology** (`.ttl`) — defines the class and its relationships
- ✅ **JSON-LD Context** — maps terms for linked data use
- ✅ **JSON Schema** — enables validation of instances
- ✅ **Example JSON** — real-world usage samples

Classes include:
- `GOOSMission`
- `Platform`
- `Sensor`
- `Activation`, `Deactivation`
- `Observation`, `ObservationSetup`
- `WIGOSProgram`, `Country`, `Organization`
- And many more...

---

## 🌐 Web Interface

The `/website/` folder contains the **React application** that presents the model in a browsable, user-friendly way. It includes:

- Class pages with labels, descriptions, and linked definitions
- Access to `.ttl`, `.jsonld`, `.schema.json`, and `.example.json`
- Visual navigation and explanation of GOOS passport and workflows

To run locally:

```bash
cd website/
npm install
npm run dev

