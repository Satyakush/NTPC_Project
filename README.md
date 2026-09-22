# 🏢 ProcureHub — NTPC Internship Project

**ProcureHub** is an internal cooperative procurement workflow application developed during my internship at **NTPC Vindhyachal**.

It focuses on digitizing procurement requests, approvals and billing workflows while improving visibility into the request lifecycle.

> This public repository is portfolio-safe documentation/code. Internal NTPC data and credentials are not included.

## 🎯 Problem

Procurement workflows involve multiple stages, approvals and records. Manual coordination can make request status, billing and follow-up harder to track.

ProcureHub provides a centralized workflow for managing those stages.

## 🔄 Workflow

```text
Purchase Request
       ↓
Approval Workflow
       ↓
Request Processing
       ↓
Billing
       ↓
Finalization
```

## 🧑‍💻 My Contribution

- Full-stack application development.
- Procurement request and approval workflows.
- Billing-related backend functionality.
- Data processing and reporting workflows.
- Risk-analysis reporting and automation.
- Power BI dashboard development.
- Improving reporting efficiency through automation.

## 📊 Analytics & Reporting

- Automated repetitive risk-analysis reporting workflows.
- Power BI dashboards for operational visibility.
- Structured enterprise data processing.

## 🏗️ Application Structure

```text
ProcureHub/
├── backend/   REST API + business logic
├── client/    React frontend
└── README.md
```

High-level request flow:

```text
React Client → REST API → Business Logic → Database
```

## 🧰 Tech Stack

- React
- Node.js
- Express.js
- MongoDB
- REST APIs
- Authentication / authorization
- Power BI

## ⚙️ Local Development

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd client
npm install
npm run dev
```

Create the backend `.env` using the variables expected by the application.

## 🔐 Security

Secrets and environment-specific configuration should be stored in `.env` files and never committed to Git. Internal enterprise data should not be placed in this public repository.

## 📌 Project Context

**Organization:** NTPC Vindhyachal  
**Project:** ProcureHub  
**Role:** SDE Intern  
**Domain:** Procurement workflow + analytics

This project demonstrates experience working with real business requirements, workflow state, reporting automation and enterprise data.

## 👨‍💻 Author

**Satyam Kushwaha** · [GitHub](https://github.com/Satyakush) · [Portfolio](https://satyakush.github.io/Portfolio/)