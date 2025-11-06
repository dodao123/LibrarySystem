-- Thêm dữ liệu mẫu cho categories
INSERT INTO categories (category_name, description) VALUES
('Fantasy', 'Sách giả tưởng, phép thuật, thế giới kỳ ảo.'),
('Science Fiction', 'Sách khoa học viễn tưởng, du hành vũ trụ, công nghệ tương lai.'),
('Mystery', 'Truyện trinh thám, điều tra, bí ẩn.'),
('Romance', 'Truyện tình cảm, lãng mạn.'),
('Historical Fiction', 'Tiểu thuyết lịch sử, dựa trên các sự kiện có thật.'),
('Philosophy', 'Tư tưởng, triết học, và nghiên cứu lý luận.'),
('Classic Literature', 'Những tác phẩm văn học kinh điển thế giới.'),
('Horror', 'Kinh dị, ma quái, rùng rợn.'),
('Adventure', 'Phiêu lưu, khám phá, hành trình kỳ thú.'),
('Non-fiction', 'Sách phi hư cấu, nghiên cứu, tiểu luận.');

-- Thêm dữ liệu mẫu cho authors
INSERT INTO authors (author_name, biography) VALUES
('J.K. Rowling', 'Tác giả người Anh, nổi tiếng với bộ Harry Potter.'),
('George Orwell', 'Nhà văn người Anh, tác giả của 1984 và Animal Farm.'),
('Agatha Christie', 'Nữ hoàng truyện trinh thám người Anh.'),
('Jane Austen', 'Tiểu thuyết gia người Anh, nổi tiếng với Pride and Prejudice.'),
('Leo Tolstoy', 'Nhà văn Nga, tác giả War and Peace và Anna Karenina.'),
('Isaac Asimov', 'Nhà văn Mỹ gốc Nga, chuyên viết khoa học viễn tưởng.'),
('Fyodor Dostoevsky', 'Nhà văn Nga, tác giả Crime and Punishment.'),
('Stephen King', 'Tác giả người Mỹ, chuyên viết truyện kinh dị.'),
('J.R.R. Tolkien', 'Nhà ngôn ngữ học, tác giả The Lord of the Rings.'),
('Ernest Hemingway', 'Nhà văn Mỹ, đoạt giải Nobel, tác giả The Old Man and the Sea.'),
('Paulo Coelho', 'Nhà văn Brazil, nổi tiếng với The Alchemist.'),
('Harper Lee', 'Tác giả Mỹ, nổi tiếng với To Kill a Mockingbird.'),
('Dan Brown', 'Tác giả người Mỹ, chuyên truyện trinh thám - biểu tượng học.'),
('Arthur Conan Doyle', 'Tác giả Sherlock Holmes, nhà văn Scotland.'),
('Albert Camus', 'Triết gia và nhà văn Pháp, đoạt giải Nobel Văn học.');

-- Xóa dữ liệu cũ và thêm dữ liệu mới cho books
DELETE FROM books;

-- Thêm dữ liệu mới với ảnh placeholder (picsum.photos)
INSERT INTO books (title, isbn, category_id, author_id, publisher, publish_year, quantity, description, image_url) VALUES
('Harry Potter and the Sorcerer''s Stone', '9780590353427', 1, 1, 'Bloomsbury', 1997, 10, 'Cuốn đầu tiên trong bộ Harry Potter.', 'https://picsum.photos/seed/harrypotter/300/450'),
('1984', '9780451524935', 2, 2, 'Secker & Warburg', 1949, 6, 'Tác phẩm kinh điển về xã hội toàn trị và giám sát.', 'https://picsum.photos/seed/1984_orwell/300/450'),
('Murder on the Orient Express', '9780007119318', 3, 3, 'Collins Crime Club', 1934, 8, 'Vụ án trên chuyến tàu tốc hành phương Đông.', 'https://picsum.photos/seed/orientexpress/300/450'),
('Pride and Prejudice', '9780141439518', 4, 4, 'T. Egerton', 1813, 7, 'Câu chuyện tình lãng mạn giữa Elizabeth Bennet và Mr. Darcy.', 'https://picsum.photos/seed/prideprejudice/300/450'),
('War and Peace', '9780199232765', 5, 5, 'The Russian Messenger', 1869, 5, 'Tiểu thuyết lịch sử vĩ đại về nước Nga trong thời chiến.', 'https://picsum.photos/seed/warandpeace/300/450'),
('Foundation', '9780553293357', 2, 6, 'Gnome Press', 1951, 9, 'Tác phẩm mở đầu cho series Foundation, nói về sự sụp đổ của Đế chế Thiên hà.', 'https://picsum.photos/seed/foundation/300/450'),
('Crime and Punishment', '9780140449136', 7, 7, 'The Russian Messenger', 1866, 4, 'Tác phẩm tâm lý kinh điển về tội lỗi và chuộc lỗi.', 'https://picsum.photos/seed/crimeandpunishment/300/450'),
('The Shining', '9780385121675', 8, 8, 'Doubleday', 1977, 6, 'Truyện kinh dị nổi tiếng lấy bối cảnh khách sạn Overlook.', 'https://picsum.photos/seed/theshining/300/450'),
('The Lord of the Rings: The Fellowship of the Ring', '9780618574940', 1, 9, 'George Allen & Unwin', 1954, 10, 'Phần đầu tiên trong bộ Chúa tể của những chiếc nhẫn.', 'https://picsum.photos/seed/fellowship/300/450'),
('The Old Man and the Sea', '9780684801223', 7, 10, 'Charles Scribner''s Sons', 1952, 5, 'Câu chuyện ngắn về người ngư phủ già Santiago.', 'https://picsum.photos/seed/oldmansea/300/450'),
('The Alchemist', '9780061122415', 10, 11, 'HarperTorch', 1988, 10, 'Câu chuyện triết lý về hành trình theo đuổi giấc mơ.', 'https://picsum.photos/seed/thealchemist/300/450'),
('To Kill a Mockingbird', '9780060935467', 7, 12, 'J.B. Lippincott & Co.', 1960, 5, 'Tiểu thuyết kinh điển về công lý và phân biệt chủng tộc.', 'https://picsum.photos/seed/tokillamockingbird/300/450'),
('The Da Vinci Code', '9780385504201', 3, 13, 'Doubleday', 2003, 8, 'Tiểu thuyết trinh thám nổi tiếng về bí mật tôn giáo và biểu tượng học.', 'https://picsum.photos/seed/davincicode/300/450'),
('The Adventures of Sherlock Holmes', '9781508475312', 3, 14, 'George Newnes', 1892, 9, 'Tuyển tập truyện trinh thám kinh điển của Sherlock Holmes.', 'https://picsum.photos/seed/sherlockholmes/300/450'),
('The Stranger', '9780679720202', 6, 15, 'Gallimard', 1942, 6, 'Tiểu thuyết triết học nổi tiếng của Albert Camus, biểu tượng của chủ nghĩa hiện sinh.', 'https://picsum.photos/seed/thestranger/300/450');


