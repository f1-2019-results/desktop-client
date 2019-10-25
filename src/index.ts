import dgram from 'dgram';

async function init(): void {
    
}

init()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });

