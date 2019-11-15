import { RaceData } from './raceData';
import LapData from './telemetry/f12019/LapData';

const packetSizes = [
    1343, 149, 843, 32, 1104, 843, 1347, 1143
]

const HEADER_SIZE = 23;

export default function parseDump(buf: Buffer): RaceData {
    let offset = 0;
    const result: RaceData = {
        lapData: [],
        participants: []
    };

    const lastLap = new Array(20).fill(0);

    while (offset < buf.length) {
        const header = parseHeader(buf, offset);
        if (header.packetId === 2) {
            const lapData = parseLapData(buf, offset + HEADER_SIZE);
            for (let i = 0; i < lapData.length; i++) {
                const data = lapData[i];
                if (!result.lapData[data.lapNum - 1]) {
                    result.lapData.push({
                        lap: data.lapNum,
                        timings: [],
                    });
                }
                if (!result.lapData[data.lapNum - 1].timings[i]) {
                    result.lapData[data.lapNum - 1].timings[i] = {
                        driverId: result.participants[i].driverId,
                        invalidLap: false,
                    };
                }
                if (data.lapNum > 1 && lastLap[i] < data.lapNum) {
                    const currentDriversLapResult = result.lapData[data.lapNum - 2].timings[i];
                    currentDriversLapResult.lapTime = data.lastLapTime;
                    currentDriversLapResult.position = data.position;
                    lastLap[i] = data.lapNum;
                }
                const currentDriversLapResult = result.lapData[data.lapNum - 1].timings[i];
                currentDriversLapResult.driverId = result.participants[i].driverId;
                if (data.currentSector > 1)
                    currentDriversLapResult.sector1 = data.sector1;
                if (data.currentSector > 2)
                    currentDriversLapResult.sector2 = data.sector2;
                if (data.lapInvalid)
                    currentDriversLapResult.invalidLap = true;
            }
        } else if (header.packetId === 4) {
            if (!result.participants.length) {
                result.participants = parseParticipants(buf, offset + HEADER_SIZE);
                // Fill driver ids in case participants message is after first lap has finished (shouldn't be possible)
                if (result.lapData) {
                    for (const lapData of result.lapData) {
                        for (let i = 0; i < lapData.timings.length; i++) {
                            lapData.timings[i].driverId = result.participants[i].driverId;
                        }
                    }
                }
            }
        }
        offset += packetSizes[header.packetId];
    }
    return result;
}

export function parseHeader(buf: Buffer, offset: number) {
    return {
        packetId: buf.readUInt8(5 + offset)
    }
}

function parseLapData(buf: Buffer, offset: number): Array<LapData> {
    const lapData: Array<LapData> = [];
    for (let i = 0; i < 20; i++) {
        lapData.push({
            lastLapTime: buf.readFloatLE(offset),
            currentLapTime: buf.readFloatLE(offset + 4),
            sector1: buf.readFloatLE(offset + 12),
            sector2: buf.readFloatLE(offset + 16),
            position: buf.readUInt8(offset + 32),
            lapNum: buf.readUInt8(offset + 33),
            currentSector: buf.readUInt8(offset + 35) + 1,
            lapInvalid: buf.readUInt8(offset + 36) !== 0
        });
        offset += 41
    }
    return lapData;
}

function parseParticipants(buf: Buffer, offset: number) {
    const participants = [];
    const cars = buf.readUInt8(offset++);
    for (let i = 0; i < cars; i++) {
        participants.push({
            aiControlled: buf.readUInt8(offset) !== 0,
            driverId: buf.readUInt8(offset + 1),
            teamId: buf.readUInt8(offset + 2),
            name: buf.toString('utf8', offset + 5, offset + 5 + 48).replace(/\0/g, ''),
        });
        offset += 54;
    }
    return participants;
}
