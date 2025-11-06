'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit2, Trash2, Search, X, Save, Image } from 'lucide-react';
import ProtectedRoute from '../../Components/ProtectedRoute';
import Link from 'next/link';

interface Book {
  book_id: number;
  title: string;
  isbn: string;
  category_id: number;
  category_name: string;
  author_id: number;
  author_name: string;
  publisher: string;
  publish_year: number;
  quantity: number;
  description: string;
  image_url: string;
  created_at: string;
}

interface Category {
  category_id: number;
  category_name: string;
  description: string;
}

interface Author {
  author_id: number;
  author_name: string;
  biography: string;
}

interface BookFormData {
  title: string;
  isbn: string;
  category_id: string;
  author_id: string;
  publisher: string;
  publish_year: string;
  quantity: string;
  description: string;
  image_url: string;
}

export default function BookManagerPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    isbn: '',
    category_id: '',
    author_id: '',
    publisher: '',
    publish_year: '',
    quantity: '1',
    description: '',
    image_url: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [booksRes, categoriesRes, authorsRes] = await Promise.all([
        fetch('/api/book-manager'),
        fetch('/api/categories'),
        fetch('/api/authors')
      ]);

      const [booksData, categoriesData, authorsData] = await Promise.all([
        booksRes.json(),
        categoriesRes.json(),
        authorsRes.json()
      ]);

      if (booksData.success) setBooks(booksData.books);
      if (categoriesData.success) setCategories(categoriesData.categories);
      if (authorsData.success) setAuthors(authorsData.authors);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const url = searchTerm 
        ? `/api/book-manager?search=${encodeURIComponent(searchTerm)}`
        : '/api/book-manager';
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setBooks(data.books);
      }
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingBook(null);
    setFormData({
      title: '',
      isbn: '',
      category_id: '',
      author_id: '',
      publisher: '',
      publish_year: '',
      quantity: '1',
      description: '',
      image_url: ''
    });
    setShowModal(true);
  };

  const openEditModal = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      isbn: book.isbn || '',
      category_id: book.category_id?.toString() || '',
      author_id: book.author_id?.toString() || '',
      publisher: book.publisher || '',
      publish_year: book.publish_year?.toString() || '',
      quantity: book.quantity?.toString() || '1',
      description: book.description || '',
      image_url: book.image_url || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Vui lòng nhập tên sách');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        title: formData.title.trim(),
        isbn: formData.isbn.trim() || null,
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        author_id: formData.author_id ? parseInt(formData.author_id) : null,
        publisher: formData.publisher.trim() || null,
        publish_year: formData.publish_year ? parseInt(formData.publish_year) : null,
        quantity: formData.quantity ? parseInt(formData.quantity) : 1,
        description: formData.description.trim() || null,
        image_url: formData.image_url.trim() || null
      };

      const url = editingBook 
        ? `/api/book-manager/${editingBook.book_id}`
        : '/api/book-manager';
      
      const method = editingBook ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || (editingBook ? 'Cập nhật sách thành công' : 'Thêm sách thành công'));
        setShowModal(false);
        fetchData();
      } else {
        alert(data.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Có lỗi xảy ra khi lưu dữ liệu');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (bookId: number, bookTitle: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa sách "${bookTitle}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/book-manager/${bookId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || 'Xóa sách thành công');
        fetchData();
      } else {
        alert(data.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Có lỗi xảy ra khi xóa sách');
    }
  };

  const filteredBooks = books;

  return (
    <ProtectedRoute requiredRole="admin">
      <main className="min-h-screen w-full overflow-x-hidden">
        {/* Gradient Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-600 via-blue-200 to-purple-50" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10" />
        </div>

        <div className="relative pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <Link href="/admin" className="text-blue-600 hover:text-blue-700 mb-2 inline-block">
                  ← Quay lại trang quản lý
                </Link>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  Quản Lý Sách
                </h1>
                <p className="text-gray-600">Thêm, sửa, xóa sách trong thư viện</p>
              </div>
              
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                title="Thêm sách mới"
              >
                <Plus size={20} />
                Thêm Sách Mới
              </button>
            </div>

            {/* Search Bar */}
            <div className="flex gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800" size={20} />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên sách, tác giả, ISBN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tìm kiếm
              </button>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center h-96">
                <div className="text-gray-600">Đang tải...</div>
              </div>
            )}

            {/* Books Table */}
            {!loading && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hình ảnh
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tên Sách
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tác Giả
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thể Loại
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ISBN
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Số Lượng
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thao Tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredBooks.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center">
                            <BookOpen className="mx-auto text-gray-800 mb-4" size={48} />
                            <p className="text-gray-600">Không có sách nào</p>
                          </td>
                        </tr>
                      ) : (
                        filteredBooks.map((book) => (
                          <tr key={book.book_id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="w-12 h-16 bg-gray-200 rounded flex-shrink-0">
                                {book.image_url ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={book.image_url}
                                    alt={book.title}
                                    className="w-full h-full object-cover rounded"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <BookOpen className="text-gray-800" size={20} />
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">
                                {book.title}
                              </div>
                              <div className="text-sm text-gray-800">
                                {book.publisher} {book.publish_year ? `(${book.publish_year})` : ''}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {book.author_name || 'N/A'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                {book.category_name || 'N/A'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {book.isbn || 'N/A'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {book.quantity}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => openEditModal(book)}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Chỉnh sửa"
                                >
                                  <Edit2 size={18} />
                                </button>
                                <button
                                  onClick={() => handleDelete(book.book_id, book.title)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Xóa"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6 my-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl text-white font-semibold">
                  {editingBook ? 'Chỉnh Sửa Sách' : 'Thêm Sách Mới'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-800 hover:text-gray-600"
                  title="Đóng"
                  aria-label="Đóng modal"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên Sách <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập tên sách"
                      required
                    />
                  </div>

                  {/* ISBN */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ISBN
                    </label>
                    <input
                      type="text"
                      value={formData.isbn}
                      onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                      className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập ISBN"
                    />
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số Lượng
                    </label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập số lượng"
                      min="0"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thể Loại
                    </label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      title="Chọn thể loại"
                    >
                      <option value="">-- Chọn thể loại --</option>
                      {categories.map((cat) => (
                        <option key={cat.category_id} value={cat.category_id}>
                          {cat.category_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Author */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tác Giả
                    </label>
                    <select
                      value={formData.author_id}
                      onChange={(e) => setFormData({ ...formData, author_id: e.target.value })}
                      className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      title="Chọn tác giả"
                    >
                      <option value="">-- Chọn tác giả --</option>
                      {authors.map((author) => (
                        <option key={author.author_id} value={author.author_id}>
                          {author.author_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Publisher */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nhà Xuất Bản
                    </label>
                    <input
                      type="text"
                      value={formData.publisher}
                      onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                      className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập nhà xuất bản"
                    />
                  </div>

                  {/* Publish Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Năm Xuất Bản
                    </label>
                    <input
                      type="number"
                      value={formData.publish_year}
                      onChange={(e) => setFormData({ ...formData, publish_year: e.target.value })}
                      className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập năm xuất bản"
                      min="1000"
                      max="2100"
                    />
                  </div>

                  {/* Image URL */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Hình Ảnh
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        className="flex-1 px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập URL hình ảnh"
                      />
                      <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0">
                        {formData.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={formData.image_url}
                            alt="Preview"
                            className="w-full h-full object-cover rounded"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center" role="img" aria-label="Không có hình ảnh">
                            {/* eslint-disable-next-line jsx-a11y/alt-text */}
                            <Image className="text-gray-800" size={20} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô Tả
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập mô tả sách"
                      rows={4}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                    disabled={submitting}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-gray-200 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    disabled={submitting}
                  >
                    <Save size={18} />
                    {submitting ? 'Đang lưu...' : (editingBook ? 'Cập Nhật' : 'Thêm Sách')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}
