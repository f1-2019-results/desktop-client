import * as dgram from 'dgram';
import * as fs from 'fs';
import * as util from 'util';
import { Header } from './telemetry/f12019/packets';
import parseDump from './telemetry/f12019/parseDump';
import { createRace } from './services/raceService';
const readFile = util.promisify(fs.readFile);

export const apiUrl = 'https://f1-results.herokuapp.com';
export const frontendUrl = 'https://f1-2019-results.github.io/#';
//export const apiUrl = 'http://localhost:3000';

const port = 20777;

const HEADER_SIZE = 23;

function init(): void {
    const socket = dgram.createSocket('udp4');
    const writeStream = fs.createWriteStream('./dump.bin');

    let raceStarted = false;

    socket.on('message', (buf) => {
        const header = Header.parse(buf, 0);
        if (header.packetId === 3) {
            const event = buf.toString('utf8', HEADER_SIZE, HEADER_SIZE + 4);
            if (event === 'SSTA') {
                console.log('Race started');
                raceStarted = true;
            } else if (event === 'SEND') {
                console.log('Race ended');
                raceStarted = false;
                writeStream.on('close', () => {
                    processDump('./dump.bin')
                        .then(() => process.exit(0))
                        .catch((err) => {
                            console.error(err)
                            process.exit(1)
                        })
                });
                writeStream.close();
            }
        }
        if (raceStarted)
            writeStream.write(buf);
    });

    socket.on('listening', () => {
        console.log('Waiting for race start');
    });

    socket.bind(port)
}

async function processDump(s: string) {
    const buf = await readFile(s);
    const raceData = parseDump(buf);
    //fs.writeFileSync(s + '.json', JSON.stringify(raceData, null, 2))
    const id = await createRace(raceData)
    console.log(`Race results available at ${frontendUrl}/race/${id}`)
}

init()
