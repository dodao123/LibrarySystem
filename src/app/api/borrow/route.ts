import { NextRequest, NextResponse } from 'next/server';
import pool from '../../config/DatabaseConnection';

export async function POST(request: NextRequest) {
  try {
    const { bookId, userId, borrowDate, returnDate } = await request.json();

    // Validation
    if (!bookId || !userId || !borrowDate || !returnDate) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      );
    }

    // Check if book is available
    const bookResult = await pool.query(
      'SELECT quantity FROM books WHERE book_id = $1',
      [bookId]
    );

    if (bookResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Sách không tồn tại' },
        { status: 404 }
      );
    }

    const availableQuantity = bookResult.rows[0].quantity;

    if (availableQuantity <= 0) {
      return NextResponse.json(
        { error: 'Sách đã hết, không thể mượn' },
        { status: 400 }
      );
    }

    // Check if user already borrowed this book
    const existingBorrow = await pool.query(
      'SELECT * FROM borrows WHERE book_id = $1 AND user_id = $2 AND status = $3',
      [bookId, userId, 'borrowed']
    );

    if (existingBorrow.rows.length > 0) {
      return NextResponse.json(
        { error: 'Bạn đã mượn cuốn sách này rồi' },
        { status: 400 }
      );
    }

    // Start transaction
    await pool.query('BEGIN');

    try {
      // Insert borrow record
      const borrowResult = await pool.query(
        'INSERT INTO borrows (book_id, user_id, borrow_date, return_date, status) VALUES ($1, $2, $3, $4, $5) RETURNING borrow_id',
        [bookId, userId, borrowDate, returnDate, 'borrowed']
      );

      // Update book quantity
      await pool.query(
        'UPDATE books SET quantity = quantity - 1 WHERE book_id = $1',
        [bookId]
      );

      await pool.query('COMMIT');

      return NextResponse.json({
        message: 'Mượn sách thành công!',
        borrowId: borrowResult.rows[0].borrow_id
      }, { status: 201 });

    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Borrow error:', error);
    return NextResponse.json(
      { error: 'Lỗi server, vui lòng thử lại sau' },
      { status: 500 }
    );
  }
}
