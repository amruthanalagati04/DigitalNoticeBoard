import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { noticeService } from '../services/noticeService.js';
import { Notice, NoticeCategory } from '../types/index.js';
import { ConfirmModal } from '../components/ConfirmModal.js';
import {
  Search,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Pin,
  Calendar,
  X,
  Save,
  ArrowLeft,
  Building2,
} from 'lucide-react';

const CATEGORIES: NoticeCategory[] = [
  'Academic',
  'Examination',
  'Events',
  'Placement',
  'General',
];

export const ManageNoticesPage: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Delete modal state
  const [noticeToDelete, setNoticeToDelete] = useState<Notice | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit modal state
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState<NoticeCategory>('Academic');
  const [editDate, setEditDate] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editPinned, setEditPinned] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await noticeService.getNotices({
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        search: searchQuery.trim() || undefined,
      });
      setNotices(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load notices for management.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [selectedCategory, searchQuery]);

  const handleOpenEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setEditTitle(notice.title);
    setEditDescription(notice.description);
    setEditCategory(notice.category);
    setEditDate(notice.date);
    setEditDepartment(notice.department || '');
    setEditPinned(Boolean(notice.pinned));
    setError(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNotice) return;

    if (!editTitle.trim() || !editDescription.trim() || !editDate) {
      setError('Please provide title, description, and effective date.');
      return;
    }

    try {
      setIsSavingEdit(true);
      setError(null);
      await noticeService.updateNotice(editingNotice._id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        category: editCategory,
        date: editDate,
        department: editDepartment.trim(),
        pinned: editPinned,
      });

      setSuccessMessage('Notice successfully updated.');
      setTimeout(() => setSuccessMessage(null), 3000);
      setEditingNotice(null);
      fetchNotices();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update notice.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!noticeToDelete) return;
    try {
      setIsDeleting(true);
      await noticeService.deleteNotice(noticeToDelete._id);
      setSuccessMessage(`Notice "${noticeToDelete.title}" has been deleted.`);
      setTimeout(() => setSuccessMessage(null), 3000);
      setNoticeToDelete(null);
      fetchNotices();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete notice.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              to="/admin"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Admin Dashboard</span>
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Manage College Notices
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Search, filter, update details, or delete official circulars from the university portal
          </p>
        </div>

        <Link
          to="/admin/create"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors shadow-xs self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publish New Notice</span>
        </Link>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Controls Bar: Search & Category Filter */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, dept..."
            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Pills / Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notices Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Loading announcements for administration...
          </div>
        ) : notices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-2/5">Notice Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Effective Date</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {notices.map((notice) => (
                  <tr key={notice._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-2">
                        {notice.pinned && (
                          <Pin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-semibold text-slate-900 leading-snug line-clamp-1">
                            {notice.title}
                          </p>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {notice.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">
                      {notice.category}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 tabular-nums whitespace-nowrap">
                      {notice.date}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 truncate max-w-[140px]">
                      {notice.department || 'Administration'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 truncate max-w-[120px]">
                      {notice.createdBy?.name || 'Administrator'}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <Link
                          to={`/notices/${notice._id}`}
                          className="p-1.5 text-slate-500 hover:text-blue-900 hover:bg-slate-100 rounded-md transition-colors"
                          title="View Notice Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(notice)}
                          className="p-1.5 text-slate-500 hover:text-amber-800 hover:bg-amber-50 rounded-md transition-colors cursor-pointer"
                          title="Edit Notice"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setNoticeToDelete(notice)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          title="Delete Notice"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 text-sm space-y-2">
            <p>No notices found matching the current search criteria.</p>
            {(searchQuery || selectedCategory !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="text-xs font-semibold text-blue-900 underline"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Edit Notice Modal */}
      {editingNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden my-8 animate-in fade-in duration-150">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Edit College Notice</h3>
                <p className="text-xs text-slate-500">Ref ID: {editingNotice._id}</p>
              </div>
              <button
                onClick={() => setEditingNotice(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as NoticeCategory)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Effective Date
                  </label>
                  <input
                    type="date"
                    required
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={editDepartment}
                  onChange={(e) => setEditDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={5}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 leading-relaxed font-sans"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="edit-pinned"
                  type="checkbox"
                  checked={editPinned}
                  onChange={(e) => setEditPinned(e.target.checked)}
                  className="w-4 h-4 text-blue-900 rounded border-slate-300"
                />
                <label htmlFor="edit-pinned" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Pin this notice to top of notice board
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingNotice(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-xs disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingEdit ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(noticeToDelete)}
        title="Delete Notice"
        message={`Are you sure you want to permanently delete "${noticeToDelete?.title}"? This action removes the circular from the college board and cannot be undone.`}
        confirmLabel={isDeleting ? 'Deleting...' : 'Delete Notice'}
        cancelLabel="Keep Notice"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setNoticeToDelete(null)}
      />
    </div>
  );
};
