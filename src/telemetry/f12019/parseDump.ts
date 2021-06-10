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
    let raceFinished = false;

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
                result.teamId = p.teamId;
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

                if (data.resultStatus === 3)
                    raceFinished = true;

                if (!result.startPosition)
                    result.startPosition = data.gridPosition + 1;

                // Don't add new lap if driver has finished race
                // Not sure why data.resultStatus === 2 is not enough, so added !raceFinished
                if (laps.length < data.currentLapNum && data.resultStatus === 2 && !raceFinished) {
                    laps.push({
                        position: data.carPosition,
                        sectors: [],
                        invalid: false,
                    })
                }
                // Fill sector times and position when lap has changed
                if (data.currentLapNum > 1 && lastLapNum[i] < data.currentLapNum) {
                    const lastLap = laps[data.currentLapNum - 2];
                    const sectorTimeSum = lastLap.sectors[0] + lastLap.sectors[1];
                    // Telemetry only contains fields for sector 1 and sector 2 times. 
                    lastLap.sectors[2] = data.lastLapTime - sectorTimeSum;
                    lastLap.position = data.carPosition;
                    lastLapNum[i] = data.currentLapNum;
                }
                if (data.currentLapNum <= totalLaps && data.resultStatus === 2) {
                    const currentLap = laps[data.currentLapNum - 1];
                    if (data.sector > 0)
                        currentLap.sectors[0] = data.sector1Time;
                    if (data.sector > 1) {
                        currentLap.sectors[1] = data.sector2Time;
                        // It seems like packet from the "cooldown" lap is not always included, leaving last lap unfinished
                        // It's also possible that there's still packets after race end event, but atm recording stops there
                        // So fill in to make sure sector and position make sense
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

    const lastLapPosition = (result: RecursivePartial<NewRaceBody['results'][0]>) => result.laps[result.laps.length - 1].position;

    for (const result of race.results) {
        if (result.laps[totalLaps - 1])
            result.position = result.laps[totalLaps - 1].position;
        result.points = pointDistribution[result.position - 1] || 0;
    }
    const driversWithoutAllLaps = race.results.filter(result => !result.laps[totalLaps - 1])

    driversWithoutAllLaps
        .sort((a, b) => lastLapPosition(b) - lastLapPosition(a))
        .sort((a, b) => a.laps.length - b.laps.length)

    driversWithoutAllLaps.forEach((driver, i) => {
        driver.position = 20 - i;
        driver.points = pointDistribution[driver.position - 1] || 0;
        // Last lap might be incomplete so set final position to it
        driver.laps[driver.laps.length - 1].position = driver.position;
    })

    // FIXME: #8 Copy sector times of last full laps when lap is incomplete
    // Doesn't work when driver was on last sector. Must be filled in way that
    // gaps to leader make sense.
    race.results.forEach((result, i) => {
        const lastLap = result.laps[result.laps.length - 1];
        if (lastLap && lastLap.sectors.length !== 2)
            lastLap.sectors = result.laps[result.laps.length - 2].sectors;
    })

    return race as NewRaceBody;
}

