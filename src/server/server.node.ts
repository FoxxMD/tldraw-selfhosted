import cors from '@fastify/cors'
import websocketPlugin from '@fastify/websocket'
import fastify from 'fastify'
import path from 'node:path';
import ServeStatic from '@fastify/static';
import type { RawData } from 'ws'
import { loadAsset, storeAsset } from './assets.js'
import { makeOrLoadRoom } from './rooms.js'
import { unfurl } from './unfurl.js'

const PORT = 5858

// For this example we use a simple fastify server with the official websocket plugin
// To keep things simple we're skipping normal production concerns like rate limiting and input validation.
const app = fastify()
app.register(websocketPlugin)
app.register(cors, { origin: '*' });

if(process.env.NODE_ENV === 'production') {
	app.register(ServeStatic, {
		root: path.resolve(import.meta.dirname, '..', '..', 'client', 'assets'),
		prefix: '/assets/'
	});
}


app.register(async (app) => {
	// This is the main entrypoint for the multiplayer sync
	app.get('/api/connect/:roomId', { websocket: true }, async (socket, req) => {
		// The roomId comes from the URL pathname
		const roomId = (req.params as any).roomId as string
		// The sessionId is passed from the client as a query param,
		// you need to extract it and pass it to the room.
		const sessionId = (req.query as any)?.['sessionId'] as string

		// At least one message handler needs to
		// be attached before doing any kind of async work
		// https://github.com/fastify/fastify-websocket?tab=readme-ov-file#attaching-event-handlers
		// We collect messages that came in before the room was loaded, and re-emit them
		// after the room is loaded.
		const caughtMessages: RawData[] = []

		const collectMessagesListener = (message: RawData) => {
			caughtMessages.push(message)
		}

		socket.on('message', collectMessagesListener)

		// Here we make or get an existing instance of TLSocketRoom for the given roomId
		const room = await makeOrLoadRoom(roomId)
		// and finally connect the socket to the room
		room.handleSocketConnect({ sessionId, socket })

		socket.off('message', collectMessagesListener)

		// Finally, we replay any caught messages so the room can process them
		for (const message of caughtMessages) {
			socket.emit('message', message)
		}
	})

	// To enable blob storage for assets, we add a simple endpoint supporting PUT and GET requests
	// But first we need to allow all content types with no parsing, so we can handle raw data
	app.addContentTypeParser('*', (_, __, done) => done(null))
	app.put('/api/uploads/:id', {}, async (req, res) => {
		const id = (req.params as any).id as string
		await storeAsset(id, req.raw)
		res.send({ ok: true })
	})
	app.get('/api/uploads/:id', async (req, res) => {
		const id = (req.params as any).id as string
		const data = await loadAsset(id)
		res.send(data)
	})

	// To enable unfurling of bookmarks, we add a simple endpoint that takes a URL query param
	app.get('/api/unfurl', async (req, res) => {
		const url = (req.query as any).url as string
		res.send(await unfurl(url))
	});

	if(process.env.NODE_ENV === 'production') {
		app.setNotFoundHandler((req, res) => {
			res.sendFile('index.html', path.resolve(import.meta.dirname, '..', '..', 'client'))
	});
		// app.get('/path/with/different/root', function (req, reply) {
		// 	reply.sendFile('index.html', path.resolve(import.meta.dirname, '..', '..', 'client')) // serving a file from a different root location
		// });
	}
});

app.listen({ port: PORT, host: '0.0.0.0' }, (err) => {
	if (err) {
		console.error(err)
		process.exit(1)
	}

	console.log(`Server started on port ${PORT}`)
})
