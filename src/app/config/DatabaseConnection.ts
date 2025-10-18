import { Pool } from 'pg';

// Khai báo cấu hình kết nối
const pool = new Pool({
  user: 'postgres',        // Username trong hình
  host: 'localhost',       // Host
  database: 'postgres',    // Database name
  password: '1', // Thay bằng mật khẩu thực tế
  port: 5432,              // Port
});

// Export pool để dùng cho các query khác
export default pool;

