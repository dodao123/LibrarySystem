import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../config/DatabaseConnection';

// GET - Lấy thông tin chi tiết sách theo ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = await pool.query(
      `SELECT 
        b.book_id as id,
        b.title,
        b.isbn,
        b.publisher,
        b.publish_year,
        b.quantity,
        b.description,
        b.image_url,
        a.author_name,
        c.category_name
      FROM books b
      LEFT JOIN authors a ON b.author_id = a.author_id
      LEFT JOIN categories c ON b.category_id = c.category_id
      WHERE b.book_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Không tìm thấy sách' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      book: result.rows[0]
    });

  } catch (error) {
    console.error('Error fetching book details:', error);
    return NextResponse.json(
      { error: 'Lỗi khi tải thông tin sách' },
      { status: 500 }
    );
  }
}
