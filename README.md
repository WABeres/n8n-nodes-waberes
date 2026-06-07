# n8n-nodes-waberes

<p align="center">
  <img src="https://avatars.githubusercontent.com/u/285155181?s=200&v=4" width="80" />
</p>

<p align="center">
  <strong>WABeres node for n8n</strong><br/>
  Send WhatsApp messages and verify webhook signatures via the WABeres API.
</p>

<p align="center">
  <a href="#english">English</a> · <a href="#indonesia">Indonesia</a>
</p>
<img width="1584" height="396" alt="173569848-c624317f-42b1-45a6-ab09-f0ea3c247648" src="https://github.com/user-attachments/assets/51f61b9f-bd1c-495e-9ba7-747c7dbbaea2" />

---

## English

### What is WABeres?

[WABeres](https://waberes.fredoronan.web.id) is a WhatsApp API gateway service built for indie developers, freelancers, and agencies in Indonesia. This community node lets you integrate WABeres into your n8n workflows without manually setting up HTTP requests or handling HMAC signature signing.

### Installation

In your n8n instance, go to **Settings → Community Nodes → Install** and enter:

```
n8n-nodes-waberes
```

> **Note:** Your n8n instance must have community nodes enabled. For self-hosted instances, set the environment variable `N8N_COMMUNITY_PACKAGES_ENABLED=true`.

### Credentials

You will need to create a **WABeres API** credential with the following fields:

| Field | Description |
|---|---|
| Base URL | Your WABeres API base URL |
| API Key | Your WABeres API key |
| Secret Key | Your WABeres secret key for request signing and verify webhook |

### Operations

#### Resource: Message

| Operation | Description |
|---|---|
| **Send Text** | Send a text message to a WhatsApp number |
| **Send Chat Presence** | Send a typing indicator (`start` or `stop`) to a WhatsApp number |

#### Resource: Webhook

| Operation | Description |
|---|---|
| **Verify Signature** | Verify the HMAC-SHA256 signature of an incoming WABeres webhook |

### Example Workflow

A typical webhook workflow looks like this:

```
Webhook (n8n built-in) → WABeres: Verify Signature → your logic → WABeres: Send Text
```

The **Verify Signature** operation will throw an error and stop the workflow if the signature is invalid, so you don't need to add extra IF nodes to handle invalid requests.

### Documentation

Full API reference and guides: [waberes.mintlify.app](https://waberes.mintlify.app)

---

## Indonesia

### Apa itu WABeres?

[WABeres](https://waberes.fredoronan.web.id) adalah layanan WhatsApp API gateway yang dibangun untuk indie developer, freelancer, dan agensi di Indonesia. Community node ini memungkinkan kamu mengintegrasikan WABeres ke dalam workflow n8n tanpa perlu setup HTTP request secara manual atau mengurus HMAC signature signing sendiri.

### Instalasi

Di instance n8n kamu, buka **Settings → Community Nodes → Install** dan masukkan:

```
n8n-nodes-waberes
```

> **Catatan:** Instance n8n kamu harus mengizinkan community nodes. Untuk self-hosted, tambahkan environment variable `N8N_COMMUNITY_PACKAGES_ENABLED=true`.

### Credentials

Buat credential **WABeres API** dengan field berikut:

| Field | Keterangan |
|---|---|
| Base URL | Base URL WABeres API kamu |
| API Key | API key WABeres kamu |
| Secret Key | Secret key untuk request signing dan verifikasi webhook |

### Operasi

#### Resource: Message

| Operasi | Keterangan |
|---|---|
| **Send Text** | Kirim pesan teks ke nomor WhatsApp |
| **Send Chat Presence** | Kirim indikator mengetik (`start` atau `stop`) ke nomor WhatsApp |

#### Resource: Webhook

| Operasi | Keterangan |
|---|---|
| **Verify Signature** | Verifikasi HMAC-SHA256 signature dari webhook WABeres yang masuk |

### Contoh Workflow

Workflow webhook yang umum dipakai:

```
Webhook (bawaan n8n) → WABeres: Verify Signature → logika kamu → WABeres: Send Text
```

Operasi **Verify Signature** akan melempar error dan menghentikan workflow jika signature tidak valid, jadi kamu tidak perlu menambahkan IF node tambahan untuk menangani request yang tidak valid.

### Dokumentasi

Referensi API lengkap dan panduan: [waberes.mintlify.app](https://waberes.mintlify.app)

---

<p align="center">
  Built for community by <a href="https://fredoronan.web.id">Fredo Ronan</a>
</p>
