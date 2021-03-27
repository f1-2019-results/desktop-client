import * as dgram from 'dgram';
import * as fs from 'fs';
import * as util from 'util';
import got from 'got';
import { Header } from './telemetry/f12019/packets';
import parseDump from './telemetry/f12019/parseDump';
const readFile = util.promisify(fs.readFile);

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
                    process.exit(0);
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
    fs.writeFileSync('./dump.json', JSON.stringify(raceData));
    const { body } = await got.post('http://localhost:3000/race', {
        json: raceData,
        responseType: 'json',
    });
    console.log(body)
}

void processDump('./dump5.bin');
//init()