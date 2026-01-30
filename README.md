# Metrica Ecosystem ☁️📊

Metrica is a modular analytics ecosystem composed of **three clearly separated layers**, each with a distinct responsibility:

1. **Metrica (Core Backend & Logic)** – the analytics engine
2. **Metrica SDK** – external/foreign access for publishing stats
3. **Metrica Cloud** – a UI + deployment wrapper around Metrica

This repository focuses on **Metrica**, while clearly defining the core system.

---

## 🧠 Ecosystem Overview

```
[ Websites / Apps / Services ]
            ↓
        Metrica SDK
            ↓
      Metrica Backend
   (Core Logic & Engine)
            ↓
       Metrica Cloud
   (Dashboard & Wrapper)
```


---

## 🔧 1. Metrica — Core Backend & Logic

**Metrica** is the brain of the system.

It is a standalone analytics engine responsible for **all core logic and data processing**. More Complex data processing is handled on frontend, for minimization of API Calls.

### Responsibilities

* Accept analytics events (via SDK)
* Validate and normalize incoming data and Origin (CORS Protection)
* Store **raw analytics events** (immutable)
* Serve analytics queries to users (Metrica Cloud)




---

## 🔌 2. Metrica SDK — External Publishing Layer

The **Metrica SDK** is the bridge between foreign systems and the Metrica backend.

It allows **any external website, app, or service** to publish analytics data without knowing internal backend details.

### SDK Responsibilities

* Abstract API communication
* Provide a simple, stable interface
* Handle:

  * Event publishing
  * Environment context (browser)

### Example Use Cases

* Websites sending page views
* Reporting failed Sign Ups,...

The SDK is intentionally lightweight and replaceable.

---

## ☁️ 3. Metrica Cloud — Wrapper & Dashboard


It is a **wrapper around Metrica**, responsible for:

* Configuring projects and defining pages and events
* Providing a visual dashboard
* Offering human-friendly exploration of analytics

### What Metrica Cloud Does

* Fethes data from Metrica
* Applies client-side filtering & visualization
* Presents metrics through charts and dashboards
* Acts as the primary UI



---

## 🏗️ Architecture Overview

| Layer         | Purpose                 |
| ------------- | ----------------------- |
| Metrica       | Logic, processing, data |
| Metrica SDK   | External ingestion      |
| Metrica Cloud | UI & wrapper            |

This separation ensures:

* Scalability
* Replaceable UI
* Multiple consumers
* Clean mental model

---

## 📦 Repository Scope

This repository primarily contains: Metrica (backend)


The **Metrica Cloud** and **SDK** may live in separate repositories.



If Cloud disappears, Metrica still works.
If SDK changes, Metrica remains stable.

---



## ✍️ Author

Built by **Luka Jekić** as a deep exploration of analytics system design.
