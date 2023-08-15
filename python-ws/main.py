#!/usr/bin/env python

import asyncio
import json
import websockets
import datetime


async def periodic_messages(websocket):
    id = 0
    while True:
        id += 1
        await asyncio.sleep(1)
        await websocket.send(
            json.dumps(
                {
                    "payload": "this is the payload",
                    "type": "telemetry",
                    "id": id,
                    "datetime": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                },
                default=str,
            )
        )


async def handler(websocket):
    # append background task already-running event loop
    asyncio.create_task(periodic_messages(websocket))

    async for message in websocket:
        message_json = json.loads(message)
        response = json.dumps(
            {
                "payload": f"this is the echo payload {message}",
                "type": "echo",
                "id": 0,
                "datetime": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            },
            default=str,
        )
        await websocket.send(response)


async def main():
    async with websockets.serve(handler, "", 8765):
        await asyncio.Future()  # run forever


if __name__ == "__main__":
    asyncio.run(main())
