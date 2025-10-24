import { NextRequest, NextResponse } from 'next/server';
import pool from '../../config/DatabaseConnection';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '10';
    const category = searchParams.get('category');
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
        c.category_name,
        a.author_name
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.category_id
      LEFT JOIN authors a ON b.author_id = a.author_id
      WHERE b.quantity > 0
    `;

    const queryParams: (string | number)[] = [];
    let paramCount = 1;

    if (category) {
      query += ` AND c.category_name = $${paramCount}`;
      queryParams.push(category);
      paramCount++;
    }

    if (search) {
      query += ` AND (b.title ILIKE $${paramCount} OR a.author_name ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
      paramCount++;
    }

    query += ` ORDER BY b.created_at DESC LIMIT $${paramCount}`;
    queryParams.push(parseInt(limit));

    const result = await pool.query(query, queryParams);

    const books = result.rows.map(book => ({
      id: book.book_id,
      title: book.title,
      author: book.author_name || 'Unknown Author',
      isbn: book.isbn,
      publisher: book.publisher,
      publishYear: book.publish_year,
      quantity: book.quantity,
      description: book.description,
      imageURL: book.image_url || '/placeholder-book.jpg',
      category: book.category_name || 'Uncategorized',
      createdAt: book.created_at,
      // Add some default values for compatibility
      rating: 4.5, // Default rating since not in database
      reviews: Math.floor(Math.random() * 100) + 20, // Random reviews
      status: book.quantity > 0 ? 'available' : 'unavailable'
    }));

    return NextResponse.json({
      success: true,
      books,
      total: books.length
    });

  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { error: 'Lỗi khi tải dữ liệu sách' },
      { status: 500 }
    );
  }
}
