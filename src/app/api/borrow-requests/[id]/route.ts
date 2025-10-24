import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../config/DatabaseConnection';

// PUT - Cập nhật trạng thái yêu cầu mượn sách (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { status, approvedBy, dueDate } = await request.json();
    const { id: requestId } = await params;

    if (!status) {
      return NextResponse.json(
        { error: 'Thiếu thông tin trạng thái' },
        { status: 400 }
      );
    }

    // Start transaction
    await pool.query('BEGIN');

    try {
      // Update borrow request
      const updateQuery = `
        UPDATE borrow_requests 
        SET status = $1, approved_by = $2, approve_date = NOW()
        WHERE request_id = $3
        RETURNING user_id, book_id
      `;
      
      const result = await pool.query(updateQuery, [status, approvedBy, requestId]);

      if (result.rows.length === 0) {
        await pool.query('ROLLBACK');
        return NextResponse.json(
          { error: 'Yêu cầu mượn sách không tồn tại' },
          { status: 404 }
        );
      }

      const { user_id, book_id } = result.rows[0];

      // If approved, create borrow record and update status to borrowed
      if (status === 'approved') {
        await pool.query(
          `INSERT INTO borrow_records (request_id, user_id, book_id, due_date) 
           VALUES ($1, $2, $3, $4)`,
          [requestId, user_id, book_id, dueDate]
        );

        // Update borrow request status to borrowed
        await pool.query(
          'UPDATE borrow_requests SET status = $1 WHERE request_id = $2',
          ['borrowed', requestId]
        );

        // Decrease book quantity
        await pool.query(
          'UPDATE books SET quantity = quantity - 1 WHERE book_id = $1',
          [book_id]
        );
      }

      await pool.query('COMMIT');

      return NextResponse.json({
        message: `Yêu cầu mượn sách đã được ${status === 'approved' ? 'duyệt' : 'từ chối'} thành công!`
      });

    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Update borrow request error:', error);
    return NextResponse.json(
      { error: 'Lỗi server, vui lòng thử lại sau' },
      { status: 500 }
    );
  }
}

// DELETE - Xóa yêu cầu mượn sách
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: requestId } = await params;

    const result = await pool.query(
      'DELETE FROM borrow_requests WHERE request_id = $1 RETURNING request_id',
      [requestId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Yêu cầu mượn sách không tồn tại' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Yêu cầu mượn sách đã được xóa thành công!'
    });

  } catch (error) {
    console.error('Delete borrow request error:', error);
    return NextResponse.json(
      { error: 'Lỗi server, vui lòng thử lại sau' },
      { status: 500 }
    );
  }
}
