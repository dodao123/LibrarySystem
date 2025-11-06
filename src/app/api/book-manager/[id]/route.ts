import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../config/DatabaseConnection';

// GET single book by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookId = params.id;

    const result = await pool.query(
      `SELECT 
        b.book_id,
        b.title,
        b.isbn,
        b.publisher,
        b.publish_year,
        b.quantity,
        b.description,
        b.image_url,
        b.created_at,
        b.category_id,
        b.author_id,
        c.category_name,
        a.author_name
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.category_id
      LEFT JOIN authors a ON b.author_id = a.author_id
      WHERE b.book_id = $1`,
      [bookId]
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
    console.error('Error fetching book:', error);
    return NextResponse.json(
      { error: 'Lỗi khi tải dữ liệu sách' },
      { status: 500 }
    );
  }
}

// PUT - Update book
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookId = params.id;
    const body = await request.json();
    const { 
      title, 
      isbn, 
      category_id, 
      author_id, 
      publisher, 
      publish_year, 
      quantity, 
      description, 
      image_url 
    } = body;

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: 'Tên sách là bắt buộc' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `UPDATE books SET
        title = $1,
        isbn = $2,
        category_id = $3,
        author_id = $4,
        publisher = $5,
        publish_year = $6,
        quantity = $7,
        description = $8,
        image_url = $9
      WHERE book_id = $10
      RETURNING *`,
      [
        title,
        isbn || null,
        category_id || null,
        author_id || null,
        publisher || null,
        publish_year || null,
        quantity || 1,
        description || null,
        image_url || null,
        bookId
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Không tìm thấy sách' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      book: result.rows[0],
      message: 'Cập nhật sách thành công'
    });

  } catch (error) {
    console.error('Error updating book:', error);
    
    // Check for unique constraint violation (ISBN)
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
      return NextResponse.json(
        { error: 'ISBN đã tồn tại trong hệ thống' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Lỗi khi cập nhật sách' },
      { status: 500 }
    );
  }
}

// DELETE book
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookId = params.id;

    // Check if book has any borrow records
    const borrowCheck = await pool.query(
      `SELECT COUNT(*) as count FROM borrow_records WHERE book_id = $1 AND status = 'borrowed'`,
      [bookId]
    );

    if (parseInt(borrowCheck.rows[0].count) > 0) {
      return NextResponse.json(
        { error: 'Không thể xóa sách đang được mượn' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `DELETE FROM books WHERE book_id = $1 RETURNING *`,
      [bookId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Không tìm thấy sách' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Xóa sách thành công'
    });

  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json(
      { error: 'Lỗi khi xóa sách' },
      { status: 500 }
    );
  }
}
