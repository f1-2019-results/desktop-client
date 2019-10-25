export interface PacketHeader {
    packetFormat: number
    gameMajorVersion: number
    gameMinorVersion: number
    packetVersion: number
    packetId: number
    sessionUID: number
    sessionTime: number
    frameIdentifier: number
    playerCarIndex: number
}