# 📇 Contact Deduplication API

A Node.js + PostgreSQL API that deduplicates contacts based on email and phone number. It maintains a single primary contact and links secondary contacts accordingly.

---

## 🚀 Features

- Deduplicates contact entries using email and phone number
- Maintains relationships between primary and secondary contacts
- Updates linked information dynamically
- Provides unified response format for each contact

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **ORM/Driver:** `pg`
- **Language:** JavaScript (ESM)

---

## 📦 Installation

```bash
git clone https://github.com/your-username/contact-deduplication-api.git
cd contact-deduplication-api
npm install
