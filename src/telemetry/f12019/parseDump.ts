import { RaceData } from '../../raceData';
import { NewRaceBody } from '../../services/raceService';
import PacketId from './packetId';
import * as packets from './packets';
import { RecursivePartial } from '../../util/RecursivePartial';

const packetSizes = [
    1343, 149, 843, 32, 1104, 843, 1347, 1143
];

export function parseDump(buf: Buffer): NewRaceBody {
    let offset = 0;
    const race: RecursivePartial<NewRaceBody> = {
        game: 'F1 2019',
        results: [],
    };
    const lastLapNum = new Array(20).fill(0);

    while (offset < buf.length) {
        const header = packets.Header.parse(buf, offset);

        // TODO: Participants packet is expected to come before LapData packet, check if this is always the case.
        if (header.packetId === PacketId.Participants) {
            if (!race.results) {
                const participants = packets.Participants.parse(buf, offset + packets.Header.size).participants;
                race.results = participants.map(p => ({
                    driverId: p.driverId.toString(),
                    driverName: p.name,
                    isAi: p.aiControlled,
                    laps: [],
                }))
            }
        } else if (header.packetId === PacketId.LapData) {
            const lapData = packets.Lap.parse(buf, offset + packets.Header.size);
            for (let i = 0; i < lapData.length; i++) {
                const data = lapData[i];
                const laps = (race.results as NewRaceBody['results'])[i].laps;
                if (laps.length < data.currentLapNum) {
                    laps.push({
                        position: -1,
                        sectors: [],
                        invalid: false,
                    })
                }
                // Fill sector times and position when lap has changed
                if (data.currentLapNum > 1 && lastLapNum[i] < data.currentLapNum) {
                    const lastLap = laps[data.currentLapNum - 2];
                    const sectorTimeSum = lastLap.sectors.reduce((a, b) => a + b);
                    // Telemetry only contains fields for sector 1 and sector 2 times. 
                    lastLap.sectors.push(data.lastLapTime - sectorTimeSum);
                    lastLap.position = data.carPosition;
                    lastLapNum[i] = data.currentLapNum;
                }
                const currentLap = laps[data.currentLapNum - 1];
                if (data.sector > 1)
                    currentLap.sectors[0] = data.sector1Time;
                if (data.sector > 2)
                    currentLap.sectors[1] = data.sector2Time;
                if (data.currentLapInvalid)
                    currentLap.invalid = true;
            }
        }
        offset += packetSizes[header.packetId];
    }

    return race as NewRaceBody;
}

