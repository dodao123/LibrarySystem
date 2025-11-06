import { NextResponse } from 'next/server';
import pool from '../../config/DatabaseConnection';

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT author_id, author_name, biography FROM authors ORDER BY author_name'
    );

    return NextResponse.json({
      success: true,
      authors: result.rows
    });

  } catch (error) {
    console.error('Error fetching authors:', error);
    return NextResponse.json(
      { error: 'Lỗi khi tải danh sách tác giả' },
      { status: 500 }
    );
  }
}
