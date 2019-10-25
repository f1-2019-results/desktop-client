export interface PacketHeader {
    packetFormat: Number
    gameMajorVersion: Number
    gameMinorVersion: Number
    packetVersion: Number
    packetId: Number
    sessionUID: Buffer
    sessionTime: Number
    frameIdentifier: Number
    playerCarIndex: Number
}