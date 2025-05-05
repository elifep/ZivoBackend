import fs from 'fs';
import path from 'path';
import pool from '../config/database';

const runMigrations = async (): Promise<void> => {
    const migrationDir = path.resolve(__dirname, '../../migrations');
    const files = fs.readdirSync(migrationDir).filter(file => file.endsWith('.sql'));

    for (const file of files.sort()) {
        const filePath = path.join(migrationDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');
        console.log(`🔁 Migration çalışıyor: ${file}`);

        try {
            await pool.query(sql);
            console.log(`✅ Migration tamamlandı: ${file}`);
        } catch (err) {
            console.error(`❌ Migration hatası (${file}):`, err);
            process.exit(1); // hata olursa işlemi durdur
        }
    }

    await pool.end(); // bağlantıyı kapat
};

runMigrations();