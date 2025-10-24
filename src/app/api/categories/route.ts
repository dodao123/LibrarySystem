import { NextResponse } from 'next/server';
import pool from '../../config/DatabaseConnection';

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT category_id, category_name, description FROM categories ORDER BY category_name'
    );

    return NextResponse.json({
      success: true,
      categories: result.rows
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Lỗi khi tải danh mục' },
      { status: 500 }
    );
  }
}
