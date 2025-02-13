import Database from "better-sqlite3"

const db = new Database("data.db")
db.pragma("foreign_keys = ON")

db.exec(`
  CREATE TABLE IF NOT EXISTS files (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    uploader_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
  )
`)

export async function saveFile(id, type, uploaderId) {
	const stmt = db.prepare(
		"INSERT INTO files (id, type, uploader_id) VALUES (?, ?, ?)"
	)
	stmt.run(id, type, uploaderId)
}

export async function getFile(id) {
	const stmt = db.prepare("SELECT * FROM files WHERE id = ?")
	return stmt.get(id)
}

export async function deleteFile(id) {
	const stmt = db.prepare("DELETE FROM files WHERE id = ?")
	const result = stmt.run(id)

	if (result.changes === 0) {
		throw new Error("File not found")
	}
}

export async function getUserUploads(userId) {
	const stmt = db.prepare("SELECT * FROM files WHERE uploader_id = ?")
	return stmt.all(userId)
}
