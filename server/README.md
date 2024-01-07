# Messages between client and server:

## From client to server:
`connection`: Default message when a client attempts to connect with the server
`find_match`: Message sent when a client is ready to match with other players
`attack_player`: Message sent when a client is attacking another player; sent with { player_id, type }
`transmit_info_to_room`: Message sent to update the server about the current player's health/status. Payload: { player_id, health, wpm }. The server will then transmit this information to all other players in the room.
`request_words`: Message sent to inform the server that more words are needed in the base stream. Empty payload.
`leave_room`: Message sent to inform the server that a player has left the room. Payload: { player_id }.
`disconnect`: Default message sent to inform the server that the player has disconnected. If the client closes the connection themselves, they will be removed from the game.

## From server to client:
`connection_confirmed`: Once the connection initiated by the client is confirmed by the server, the server responds with a payload of { id }, returning the client ID for that connection.
`room_created`: Message confirming that players have been matched for a game. Payload: { room_id, player_ids }, where `player_ids` store a list of client/connection IDs that player has matched with, including their own. 
`transmit_info_to_room`: Message sent to update the room about a player's health/status. Payload: { player_id, health, wpm }. The message will also be sent back to the player who sent this information.
`add_words`: Message sent to a specific room informing them of additional words to queue to the main stream. Payload: { words }
`player_attacked`: Message sent to a specific room informing that a player has been attacked and an additional stream of words should be added into their game. Payload: { player_id, words }
