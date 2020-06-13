# Guides

---

Guides are made for creating guides, documentation. The basic template is in `mardown`:

```markdown
# My Title 
---

Lorem ipsum
```

## Technical

---

The guides are stored in `.dust/databases/guide.nosql` in the following format:

```typescript
{
    id: this.id,
    title: this.title,
    filename: this.filename,
    isEncrypted: this.isEncrypted,
    platform: this.platform,
    description: this.description,
    tags: this.tags,
}
```

The file content is then saved at the following location `.dust/guides/filename.md`



## Commands

---

**Creating a guide:**

```bash
dust add guide
```

**Searching for guides:**

```bash
dust search "my test" -g
```

For now search is only based on the title. But I will implement keyword extraction with match possibilities.

**Guide actions:**

- delete

- edit

- open (non functional)

- rename

- view
