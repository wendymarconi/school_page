const bcrypt = require('bcryptjs');

async function test() {
    const pass = 'Escuela@2026';
    const hash = await bcrypt.hash(pass, 10);
    console.log('Hash generado:', hash);
    const match = await bcrypt.compare(pass, hash);
    console.log('¿Coinciden?:', match);
    process.exit(0);
}

test();
