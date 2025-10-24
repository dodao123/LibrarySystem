import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '../../../config/DatabaseConnection';

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, password, phone } = await request.json();

    // Validation
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ thông tin bắt buộc' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Mật khẩu phải có ít nhất 6 ký tự' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT email FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'Email đã được sử dụng' },
        { status: 400 }
      );
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const result = await pool.query(
      'INSERT INTO users (full_name, email, password_hash, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING user_id, full_name, email, role, created_at',
      [fullName, email, passwordHash, phone || null, 'student']
    );

    const newUser = result.rows[0];

    return NextResponse.json({
      message: 'Đăng ký thành công!',
      user: {
        id: newUser.user_id,
        fullName: newUser.full_name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.created_at
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Lỗi server, vui lòng thử lại sau' },
      { status: 500 }
    );
  }
}
