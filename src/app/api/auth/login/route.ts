import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '../../../config/DatabaseConnection';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ email và mật khẩu' },
        { status: 400 }
      );
    }

    // Find user by email
    const result = await pool.query(
      'SELECT user_id, full_name, email, password_hash, role, created_at FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      );
    }

    // Return user data (without password_hash)
    return NextResponse.json({
      message: 'Đăng nhập thành công!',
      user: {
        id: user.user_id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
        createdAt: user.created_at
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Lỗi server, vui lòng thử lại sau' },
      { status: 500 }
    );
  }
}
