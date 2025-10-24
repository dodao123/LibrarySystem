-- Create borrows table for tracking book loans
CREATE TABLE borrows (
    borrow_id SERIAL PRIMARY KEY,
    book_id INT REFERENCES books(book_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    borrow_date DATE NOT NULL,
    return_date DATE NOT NULL,
    actual_return_date DATE,
    status VARCHAR(20) DEFAULT 'borrowed', -- borrowed | returned | overdue
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_borrows_user_id ON borrows(user_id);
CREATE INDEX idx_borrows_book_id ON borrows(book_id);
CREATE INDEX idx_borrows_status ON borrows(status);

-- Insert sample data for testing
INSERT INTO categories (category_name, description) VALUES 
('Fiction', 'Tiểu thuyết hư cấu'),
('Non-Fiction', 'Sách phi hư cấu'),
('Science Fiction', 'Khoa học viễn tưởng'),
('Romance', 'Lãng mạn'),
('Mystery', 'Trinh thám'),
('Fantasy', 'Huyền ảo');

INSERT INTO authors (author_name, biography) VALUES 
('Nguyễn Nhật Ánh', 'Nhà văn nổi tiếng với các tác phẩm dành cho thiếu nhi'),
('Haruki Murakami', 'Nhà văn Nhật Bản nổi tiếng thế giới'),
('J.K. Rowling', 'Tác giả của series Harry Potter'),
('George Orwell', 'Nhà văn Anh nổi tiếng với tác phẩm 1984'),
('Agatha Christie', 'Nữ hoàng tiểu thuyết trinh thám'),
('Tolkien', 'Tác giả của Chúa tể những chiếc nhẫn');

INSERT INTO books (title, isbn, category_id, author_id, publisher, publish_year, quantity, description, image_url) VALUES 
('Tôi Thấy Hoa Vàng Trên Cỏ Xanh', '978-604-1-00001-1', 1, 1, 'NXB Trẻ', 2010, 5, 'Câu chuyện về tuổi thơ và tình bạn', 'https://via.placeholder.com/300x400?text=Tôi+Thấy+Hoa+Vàng'),
('Norwegian Wood', '978-604-1-00002-2', 1, 2, 'NXB Hội Nhà Văn', 1987, 3, 'Tiểu thuyết về tình yêu và mất mát', 'https://via.placeholder.com/300x400?text=Norwegian+Wood'),
('Harry Potter và Hòn Đá Phù Thủy', '978-604-1-00003-3', 3, 3, 'NXB Trẻ', 1997, 8, 'Cuộc phiêu lưu của cậu bé phù thủy', 'https://via.placeholder.com/300x400?text=Harry+Potter'),
('1984', '978-604-1-00004-4', 2, 4, 'NXB Hội Nhà Văn', 1949, 4, 'Tiểu thuyết dystopian kinh điển', 'https://via.placeholder.com/300x400?text=1984'),
('Án Mạng Trên Chuyến Tàu Phương Đông', '978-604-1-00005-5', 5, 5, 'NXB Trẻ', 1934, 6, 'Tiểu thuyết trinh thám kinh điển', 'https://via.placeholder.com/300x400?text=Murder+on+Orient'),
('Chúa Tể Những Chiếc Nhẫn', '978-604-1-00006-6', 6, 6, 'NXB Hội Nhà Văn', 1954, 7, 'Sử thi fantasy vĩ đại', 'https://via.placeholder.com/300x400?text=Lord+of+Rings');

-- Create borrow_requests table
CREATE TABLE borrow_requests (
    request_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    book_id INT REFERENCES books(book_id) ON DELETE CASCADE,
    request_date TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'pending',  -- pending | approved | rejected | borrowed | returned | overdue
    approved_by INT REFERENCES users(user_id),
    approve_date TIMESTAMP
);

-- Create borrow_records table
CREATE TABLE borrow_records (
    record_id SERIAL PRIMARY KEY,
    request_id INT REFERENCES borrow_requests(request_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    book_id INT REFERENCES books(book_id) ON DELETE CASCADE,
    borrow_date TIMESTAMP DEFAULT NOW(),
    due_date TIMESTAMP,       -- hạn trả
    return_date TIMESTAMP,    -- ngày trả thực tế
    status VARCHAR(20) DEFAULT 'borrowed'  -- borrowed | returned | overdue
);

-- Create indexes for better performance
CREATE INDEX idx_borrow_requests_user_id ON borrow_requests(user_id);
CREATE INDEX idx_borrow_requests_book_id ON borrow_requests(book_id);
CREATE INDEX idx_borrow_requests_status ON borrow_requests(status);
CREATE INDEX idx_borrow_records_user_id ON borrow_records(user_id);
CREATE INDEX idx_borrow_records_book_id ON borrow_records(book_id);
CREATE INDEX idx_borrow_records_status ON borrow_records(status);
