import { NextRequest, NextResponse } from 'next/server';
import pool from '../../config/DatabaseConnection';

// GET - Lấy danh sách bản ghi mượn sách
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    let query = `
      SELECT 
        br.record_id,
        br.request_id,
        br.user_id,
        br.book_id,
        br.borrow_date,
        br.due_date,
        br.return_date,
        br.status,
        u.full_name as user_name,
        u.email as user_email,
        b.title as book_title,
        b.image_url as book_image,
        a.author_name,
        c.category_name
      FROM borrow_records br
      JOIN users u ON br.user_id = u.user_id
      JOIN books b ON br.book_id = b.book_id
      LEFT JOIN authors a ON b.author_id = a.author_id
      LEFT JOIN categories c ON b.category_id = c.category_id
    `;

    const queryParams: (string | number)[] = [];
    let paramCount = 1;

    if (userId) {
      query += ` WHERE br.user_id = $${paramCount}`;
      queryParams.push(userId);
      paramCount++;
    }

    if (status) {
      query += userId ? ` AND br.status = $${paramCount}` : ` WHERE br.status = $${paramCount}`;
      queryParams.push(status);
      paramCount++;
    }

    query += ` ORDER BY br.borrow_date DESC`;

    const result = await pool.query(query, queryParams);

    return NextResponse.json({
      success: true,
      records: result.rows
    });

  } catch (error) {
    console.error('Error fetching borrow records:', error);
    return NextResponse.json(
      { error: 'Lỗi khi tải danh sách bản ghi mượn sách' },
      { status: 500 }
    );
  }
}
