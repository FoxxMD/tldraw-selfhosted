import { useSync } from '@tldraw/sync'
import {
    AssetRecordType,
    getHashForString,
    TLAssetStore,
    TLBookmarkAsset,
    Tldraw,
    uniqueId,
} from 'tldraw'
import { useParams } from 'react-router-dom'
import { ReactNode, useEffect, useState } from 'react'

const WORKER_URL = import.meta.env.VITE_WORKER_URL ?? 'http://localhost:5858';

// In this example, the room ID is hard-coded. You can set this however you like though.
const roomId = 'test-room'

export function Room() {
    const { roomId } = useParams<{ roomId: string }>()

    // Create a store connected to multiplayer.
    const store = useSync({
        // We need to know the websocket's URI...
        uri: `${WORKER_URL}/connect/${roomId}`,
        // ...and how to handle static assets like images & videos
        assets: multiplayerAssets,
    })

    return (
        <RoomWrapper roomId={roomId}>
            <Tldraw
                // we can pass the connected store into the Tldraw component which will handle
                // loading states & enable multiplayer UX like cursors & a presence menu
                store={store}
                deepLinks
                onMount={(editor) => {
                    // @ts-expect-error
                    window.editor = editor
                    // when the editor is ready, we need to register out bookmark unfurling service
                    editor.registerExternalAssetHandler('url', unfurlBookmarkUrl)
                }}
            />
        </RoomWrapper>
    )
}

function RoomWrapper({ children, roomId }: { children: ReactNode; roomId?: string }) {
	const [didCopy, setDidCopy] = useState(false)

	useEffect(() => {
		if (!didCopy) return
		const timeout = setTimeout(() => setDidCopy(false), 3000)
		return () => clearTimeout(timeout)
	}, [didCopy])

	return (
		<div className="RoomWrapper">
			<div className="RoomWrapper-header">
				<WifiIcon />
				<div>{roomId}</div>
				<button
					className="RoomWrapper-copy"
					onClick={() => {
						navigator.clipboard.writeText(window.location.href)
						setDidCopy(true)
					}}
					aria-label="copy room link"
				>
					Copy link
					{didCopy && <div className="RoomWrapper-copied">Copied!</div>}
				</button>
			</div>
			<div className="RoomWrapper-content">{children}</div>
		</div>
	)
}


// How does our server handle assets like images and videos?
const multiplayerAssets: TLAssetStore = {
    // to upload an asset, we prefix it with a unique id, POST it to our worker, and return the URL
    async upload(_asset, file) {
        const id = uniqueId()

        const objectName = `${id}-${file.name}`
        const url = `${WORKER_URL}/uploads/${encodeURIComponent(objectName)}`

        const response = await fetch(url, {
            method: 'PUT',
            body: file,
        })

        if (!response.ok) {
            throw new Error(`Failed to upload asset: ${response.statusText}`)
        }

        return { src: url }
    },
    // to retrieve an asset, we can just use the same URL. you could customize this to add extra
    // auth, or to serve optimized versions / sizes of the asset.
    resolve(asset) {
        return asset.props.src
    },
}

// How does our server handle bookmark unfurling?
async function unfurlBookmarkUrl({ url }: { url: string }): Promise<TLBookmarkAsset> {
    const asset: TLBookmarkAsset = {
        id: AssetRecordType.createId(getHashForString(url)),
        typeName: 'asset',
        type: 'bookmark',
        meta: {},
        props: {
            src: url,
            description: '',
            image: '',
            favicon: '',
            title: '',
        },
    }

    try {
        const response = await fetch(`${WORKER_URL}/unfurl?url=${encodeURIComponent(url)}`)
        const data = await response.json()

        asset.props.description = data?.description ?? ''
        asset.props.image = data?.image ?? ''
        asset.props.favicon = data?.favicon ?? ''
        asset.props.title = data?.title ?? ''
    } catch (e) {
        console.error(e)
    }

    return asset
}

function WifiIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth="1.5"
			stroke="currentColor"
			width={16}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z"
			/>
		</svg>
	)
}