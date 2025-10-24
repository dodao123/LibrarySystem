import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../config/DatabaseConnection';

// PUT - Xác nhận trả sách
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: recordId } = await params;

    // Start transaction
    await pool.query('BEGIN');

    try {
      // Get borrow record details
      const recordResult = await pool.query(
        `SELECT br.record_id, br.request_id, br.user_id, br.book_id, br.due_date,
                brq.status as request_status
         FROM borrow_records br
         JOIN borrow_requests brq ON br.request_id = brq.request_id
         WHERE br.record_id = $1`,
        [recordId]
      );

      if (recordResult.rows.length === 0) {
        await pool.query('ROLLBACK');
        return NextResponse.json(
          { error: 'Bản ghi mượn sách không tồn tại' },
          { status: 404 }
        );
      }

      const record = recordResult.rows[0];

      // Check if already returned
      if (record.request_status === 'returned') {
        await pool.query('ROLLBACK');
        return NextResponse.json(
          { error: 'Sách đã được trả rồi' },
          { status: 400 }
        );
      }

      // Update borrow record
      await pool.query(
        `UPDATE borrow_records 
         SET return_date = NOW(), status = 'returned'
         WHERE record_id = $1`,
        [recordId]
      );

      // Update borrow request status
      await pool.query(
        'UPDATE borrow_requests SET status = $1 WHERE request_id = $2',
        ['returned', record.request_id]
      );

      // Increase book quantity
      await pool.query(
        'UPDATE books SET quantity = quantity + 1 WHERE book_id = $1',
        [record.book_id]
      );

      await pool.query('COMMIT');

      return NextResponse.json({
        message: 'Xác nhận trả sách thành công!'
      });

    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Return book error:', error);
    return NextResponse.json(
      { error: 'Lỗi server, vui lòng thử lại sau' },
      { status: 500 }
    );
  }
}
