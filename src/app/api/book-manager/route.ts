import { NextRequest, NextResponse } from 'next/server';
import pool from '../../config/DatabaseConnection';

// GET all books (for admin management)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let query = `
      SELECT 
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
    `;

    const queryParams: string[] = [];
    
    if (search) {
      query += ` WHERE (b.title ILIKE $1 OR a.author_name ILIKE $1 OR b.isbn ILIKE $1)`;
      queryParams.push(`%${search}%`);
    }

    query += ` ORDER BY b.created_at DESC`;

    const result = await pool.query(query, queryParams);

    return NextResponse.json({
      success: true,
      books: result.rows
    });

  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { error: 'Lỗi khi tải dữ liệu sách' },
      { status: 500 }
    );
  }
}

// POST - Create new book
export async function POST(request: NextRequest) {
  try {
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
      `INSERT INTO books (
        title, isbn, category_id, author_id, publisher, 
        publish_year, quantity, description, image_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
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
        image_url || null
      ]
    );

    return NextResponse.json({
      success: true,
      book: result.rows[0],
      message: 'Thêm sách thành công'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating book:', error);
    
    // Check for unique constraint violation (ISBN)
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
      return NextResponse.json(
        { error: 'ISBN đã tồn tại trong hệ thống' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Lỗi khi thêm sách' },
      { status: 500 }
    );
  }
}
