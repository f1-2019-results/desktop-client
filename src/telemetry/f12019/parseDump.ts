import { NewRaceBody } from '../../services/raceService';
import PacketId from './packetId';
import * as packets from './packets';
import { RecursivePartial } from '../../util/RecursivePartial';

const packetSizes = [
    1343, 149, 843, 32, 1104, 843, 1347, 1143
];

const pointDistribution = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

export default function parseDump(buf: Buffer): NewRaceBody {
    let offset = 0;
    const race: RecursivePartial<NewRaceBody> = {
        game: 'F1 2019',
        results: Array.from({ length: 20 }, () => ({ laps: [] })),
        // TODO: Capture when recording??
        startTime: new Date().toISOString(),
    };
    const lastLapNum = new Array(20).fill(0);
    // This will be changed to real number before second lap packets come in
    let totalLaps = 1;

    while (offset < buf.length) {
        const header = packets.Header.parse(buf, offset);

        // First participants packet is not always before the first lapData packet.
        if (header.packetId === PacketId.Participants) {
            const participants = packets.Participants.parse(buf, offset + packets.Header.size).participants;
            participants.forEach((p, i) => {
                const result = (race.results as NewRaceBody['results'])[i];
                // result.driverId = p.driverId.toString();
                result.driverName = p.name;
                result.isAi = p.aiControlled;
            });
        } else if (header.packetId === PacketId.Session) {
            const session = packets.Session.parse(buf, offset + packets.Header.size);
            race.trackId = session.trackId.toString();
            totalLaps = session.totalLaps;
        } else if (header.packetId === PacketId.LapData) {
            const lapData = packets.Lap.parse(buf, offset + packets.Header.size);
            for (let i = 0; i < lapData.length; i++) {
                const data = lapData[i];
                const result = (race.results as NewRaceBody['results'])[i];
                const laps = result.laps;

                if (!result.startPosition)
                    result.startPosition = data.gridPosition;

                // Don't add new lap if driver has finished race
                if (laps.length < data.currentLapNum && data.currentLapNum <= totalLaps) {
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
                    lastLap.sectors[2] = data.lastLapTime - sectorTimeSum;
                    lastLap.position = data.carPosition;
                    lastLapNum[i] = data.currentLapNum;
                }
                if (data.currentLapNum <= totalLaps) {
                    const currentLap = laps[data.currentLapNum - 1];
                    if (data.sector > 0)
                        currentLap.sectors[0] = data.sector1Time;
                    if (data.sector > 1) {
                        currentLap.sectors[1] = data.sector2Time;
                        // It seems like packet from the "cooldown" lap is not always included, leaving last lap unfinished
                        // It's also possible that there's still packets after race end event, but atm recording stops there
                        // So fill in to make sure sector and 
                        // FIXME: This will lead to incorrect (too small) lap time though
                        currentLap.sectors[2] = data.currentLapTime - currentLap.sectors[0] - currentLap.sectors[1]
                        currentLap.position = data.carPosition
                    }
                    if (data.currentLapInvalid)
                        currentLap.invalid = true;
                }
            }
        }
        offset += packetSizes[header.packetId];
    }

    for (const result of race.results) {
        result.position = result.laps[totalLaps - 1].position;
        result.points = pointDistribution[result.position - 1] || 0;
    }

    return race as NewRaceBody;
}

