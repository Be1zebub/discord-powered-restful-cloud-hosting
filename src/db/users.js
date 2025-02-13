import Database from "better-sqlite3"
import { ACCESS_LEVELS } from "../constants.js"

const db = new Database("data.db")

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    access_level TEXT NOT NULL,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
  )
`)

export async function createUser(id, accessLevel = ACCESS_LEVELS.USER) {
	const stmt = db.prepare("INSERT INTO users (id, access_level) VALUES (?, ?)")
	stmt.run(id, accessLevel)
}

export async function deleteUser(id) {
	const stmt = db.prepare("DELETE FROM users WHERE id = ?")
	const result = stmt.run(id)

	if (result.changes === 0) {
		throw new Error("User not found")
	}
}

export async function listUsers() {
	const stmt = db.prepare("SELECT * FROM users")
	return stmt.all()
}

export async function getUser(id) {
	const stmt = db.prepare("SELECT * FROM users WHERE id = ?")
	return stmt.get(id)
}

export async function deactivateUser(id) {
	const stmt = db.prepare("UPDATE users SET active = false WHERE id = ?")
	stmt.run(id)
}

export async function userExists(id) {
	const stmt = db.prepare("SELECT 1 FROM users WHERE id = ?")
	return !!stmt.get(id)
}
