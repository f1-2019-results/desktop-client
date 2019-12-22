import { RaceData } from '../../raceData';
import PacketId from './packetId';
import * as packets from './packets';

const packetSizes = [
    1343, 149, 843, 32, 1104, 843, 1347, 1143
];

export default function parseDump(buf: Buffer): RaceData {
    let offset = 0;
    const result: RaceData = {
        lapData: [],
        participants: []
    };

    const lastLap = new Array(20).fill(0);

    while (offset < buf.length) {
        const header = packets.Header.parse(buf, offset);
        if (header.packetId === PacketId.LapData) {
            const lapData = packets.Lap.parse(buf, offset + packets.Header.size);
            for (let i = 0; i < lapData.length; i++) {
                const data = lapData[i];
                if (!result.lapData[data.currentLapNum - 1]) {
                    result.lapData.push({
                        lap: data.currentLapNum,
                        timings: [],
                    });
                }
                if (!result.lapData[data.currentLapNum - 1].timings[i]) {
                    result.lapData[data.currentLapNum - 1].timings[i] = {
                        driverId: result.participants[i].driverId,
                        invalidLap: false,
                    };
                }
                if (data.currentLapNum > 1 && lastLap[i] < data.currentLapNum) {
                    const currentDriversLapResult = result.lapData[data.currentLapNum - 2].timings[i];
                    currentDriversLapResult.lapTime = data.lastLapTime;
                    currentDriversLapResult.position = data.carPosition;
                    lastLap[i] = data.currentLapNum;
                }
                const currentDriversLapResult = result.lapData[data.currentLapNum - 1].timings[i];
                currentDriversLapResult.driverId = result.participants[i].driverId;
                if (data.sector1Time > 1)
                    currentDriversLapResult.sector1 = data.sector1Time;
                if (data.sector2Time > 2)
                    currentDriversLapResult.sector2 = data.sector2Time;
                if (data.currentLapInvalid)
                    currentDriversLapResult.invalidLap = true;
            }
        } else if (header.packetId === PacketId.Participants) {
            if (!result.participants.length) {
                result.participants = packets.Participants.parse(buf, offset + packets.Header.size).participants;
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

