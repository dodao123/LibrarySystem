import { NextRequest, NextResponse } from 'next/server';
import pool from '../../config/DatabaseConnection';

// GET - Lấy danh sách yêu cầu mượn sách
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    let query = `
      SELECT 
        br.request_id,
        br.user_id,
        br.book_id,
        br.request_date,
        br.status,
        br.approved_by,
        br.approve_date,
        u.full_name as user_name,
        u.email as user_email,
        b.title as book_title,
        b.image_url as book_image,
        a.author_name,
        c.category_name,
        approver.full_name as approver_name
      FROM borrow_requests br
      JOIN users u ON br.user_id = u.user_id
      JOIN books b ON br.book_id = b.book_id
      LEFT JOIN authors a ON b.author_id = a.author_id
      LEFT JOIN categories c ON b.category_id = c.category_id
      LEFT JOIN users approver ON br.approved_by = approver.user_id
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

    query += ` ORDER BY br.request_date DESC`;

    const result = await pool.query(query, queryParams);

    return NextResponse.json({
      success: true,
      requests: result.rows
    });

  } catch (error) {
    console.error('Error fetching borrow requests:', error);
    return NextResponse.json(
      { error: 'Lỗi khi tải danh sách yêu cầu mượn sách' },
      { status: 500 }
    );
  }
}

// POST - Tạo yêu cầu mượn sách mới
export async function POST(request: NextRequest) {
  try {
    const { userId, bookId } = await request.json();

    // Validation
    if (!userId || !bookId) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      );
    }

    // Check if book exists and is available
    const bookResult = await pool.query(
      'SELECT quantity, title FROM books WHERE book_id = $1',
      [bookId]
    );

    if (bookResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Sách không tồn tại' },
        { status: 404 }
      );
    }

    const book = bookResult.rows[0];
    if (book.quantity <= 0) {
      return NextResponse.json(
        { error: 'Sách đã hết, không thể mượn' },
        { status: 400 }
      );
    }

    // Check if user already has a pending request for this book
    const existingRequest = await pool.query(
      'SELECT * FROM borrow_requests WHERE user_id = $1 AND book_id = $2 AND status = $3',
      [userId, bookId, 'pending']
    );

    if (existingRequest.rows.length > 0) {
      return NextResponse.json(
        { error: 'Bạn đã có yêu cầu mượn sách này đang chờ duyệt' },
        { status: 400 }
      );
    }

    // Create new borrow request
    const result = await pool.query(
      'INSERT INTO borrow_requests (user_id, book_id) VALUES ($1, $2) RETURNING request_id',
      [userId, bookId]
    );

    return NextResponse.json({
      message: 'Yêu cầu mượn sách đã được gửi thành công!',
      requestId: result.rows[0].request_id
    }, { status: 201 });

  } catch (error) {
    console.error('Borrow request error:', error);
    return NextResponse.json(
      { error: 'Lỗi server, vui lòng thử lại sau' },
      { status: 500 }
    );
  }
}
