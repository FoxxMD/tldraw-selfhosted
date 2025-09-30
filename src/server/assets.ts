import { mkdir, readFile, writeFile } from 'fs/promises'
import { join, resolve } from 'path'
import { Readable } from 'stream'

// We are just using the filesystem to store assets
let DIR = resolve('./.assets')
if(process.env.CONFIG_DIR !== undefined) {
	DIR = join(process.env.CONFIG_DIR, 'assets');
}
console.log(`Assets: ${DIR}`);

export async function storeAsset(id: string, stream: Readable) {
	await mkdir(DIR, { recursive: true })
	await writeFile(join(DIR, id), stream)
}

export async function loadAsset(id: string) {
	return await readFile(join(DIR, id))
}
