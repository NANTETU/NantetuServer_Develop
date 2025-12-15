import React, { useState } from 'react';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';

export const ProfileEditPage = ({ L, user, profile, db, showToast }) => {
    const [form, setForm] = useState({
        name: profile?.name || '',
        bio: profile?.bio || '',
        gamerTag: profile?.gamerTag || '',
        location: profile?.location || '',
        links: profile?.links || '',
        bannerUrl: profile?.bannerUrl || '',
        iconUrl: profile?.iconUrl || '',
    });
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState({ banner: false, icon: false });
    const [preview, setPreview] = useState({
        banner: profile?.bannerUrl || '',
        icon: profile?.iconUrl || '',
    });
    const [socialLinks, setSocialLinks] = useState(profile?.socialLinks || [
        { platform: 'twitter', url: '' },
        { platform: 'youtube', url: '' },
        { platform: 'twitch', url: '' },
    ]);

    if (!user || user.isAnonymous) {
        return <div className="max-w-3xl mx-auto py-32 px-4 text-center">プロフィールを編集するにはログインしてください。</div>;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSocialLinkChange = (index, field, value) => {
        const newLinks = [...socialLinks];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setSocialLinks(newLinks);
    };

    const handleFileUpload = async (file, type) => {
        if (!file) return null;

        setUploading(prev => ({ ...prev, [type]: true }));

        try {
            // In a real app, upload to Supabase Storage here
            // For now, we'll just create a preview URL
            const previewUrl = URL.createObjectURL(file);
            setPreview(prev => ({ ...prev, [type]: previewUrl }));

            // Simulate upload delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // In a real app, return the uploaded file URL
            return previewUrl;
        } catch (error) {
            console.error('Upload failed:', error);
            showToast && showToast('画像のアップロードに失敗しました');
            return null;
        } finally {
            setUploading(prev => ({ ...prev, [type]: false }));
        }
    };

    const handleBannerChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const url = await handleFileUpload(file, 'banner');
        if (url) {
            setForm(prev => ({ ...prev, bannerUrl: url }));
        }
    };

    const handleIconChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const url = await handleFileUpload(file, 'icon');
        if (url) {
            setForm(prev => ({ ...prev, iconUrl: url }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!db) return;
        setSaving(true);
        try {
            const ref = doc(db, 'profiles', user.uid);
            await updateDoc(ref, {
                name: form.name || 'No Name',
                bio: form.bio || '',
                gamerTag: form.gamerTag || '',
                location: form.location || '',
                links: form.links || '',
                bannerUrl: form.bannerUrl || '',
                iconUrl: form.iconUrl || '',
                socialLinks: socialLinks.filter(link => link.url),
                lastLoginAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            showToast && showToast('プロフィールを保存しました');
        } catch (e) {
            console.error('Failed to save profile', e);
            showToast && showToast('プロフィールの保存に失敗しました');
        } finally {
            setSaving(false);
        }
    };

    const socialIcons = {
        twitter: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/twitter.svg',
        youtube: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/youtube.svg',
        twitch: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/twitch.svg',
        github: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/github.svg',
        instagram: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/instagram.svg',
        facebook: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/facebook.svg',
    };

    return (
        <div className="max-w-4xl mx-auto py-24 px-4 animate-fade-in-scale">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Banner Upload */}
                <div className="relative h-48 bg-gradient-to-r from-purple-500 to-indigo-600">
                    {preview.banner ? (
                        <img
                            src={preview.banner}
                            alt="Banner"
                            className="w-full h-full object-cover"
                        />
                    ) : null}
                    <label className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-white dark:hover:bg-gray-700 transition-colors">
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleBannerChange}
                            disabled={uploading.banner}
                        />
                        {uploading.banner ? (
                            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        )}
                    </label>
                </div>

                <div className="px-8 pb-8 relative">
                    {/* Profile Picture Upload */}
                    <div className="absolute -top-16 left-8">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-gradient-to-br from-purple-400 to-indigo-500 overflow-hidden">
                                {preview.icon ? (
                                    <img
                                        src={preview.icon}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white">
                                        {form.name ? form.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-white dark:hover:bg-gray-700 transition-colors">
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleIconChange}
                                    disabled={uploading.icon}
                                />
                                {uploading.icon ? (
                                    <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}
                            </label>
                        </div>
                    </div>

                    <div className="pt-20 space-y-6">
                        <h2 className="text-2xl font-black dark:text-white">プロフィールを編集</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold mb-1 dark:text-gray-200">表示名</label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="ユーザー名"
                                    className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1 dark:text-gray-200">ゲーマータグ</label>
                                <input
                                    name="gamerTag"
                                    value={form.gamerTag}
                                    onChange={handleChange}
                                    placeholder="例: Player123"
                                    className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1 dark:text-gray-200">自己紹介 (Markdown対応)</label>
                            <textarea
                                name="bio"
                                value={form.bio}
                                onChange={handleChange}
                                rows="4"
                                placeholder="自己紹介を入力してください。マークダウンが使用できます。"
                                className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                            />
                            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                マークダウン記法が使用できます。例: **太字**、*斜体*、[リンク](https://example.com)
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1 dark:text-gray-200">場所</label>
                            <input
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                placeholder="例: 東京都渋谷区"
                                className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1 dark:text-gray-200">ウェブサイト</label>
                            <input
                                name="links"
                                value={form.links}
                                onChange={handleChange}
                                placeholder="https://example.com"
                                className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2 dark:text-gray-200">ソーシャルリンク</label>
                            <div className="space-y-3">
                                {socialLinks.map((link, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                                            <img
                                                src={socialIcons[link.platform] || socialIcons.twitter}
                                                alt={link.platform}
                                                className="w-5 h-5"
                                            />
                                        </div>
                                        <select
                                            value={link.platform}
                                            onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                                            className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        >
                                            <option value="twitter">Twitter / X</option>
                                            <option value="youtube">YouTube</option>
                                            <option value="twitch">Twitch</option>
                                            <option value="github">GitHub</option>
                                            <option value="instagram">Instagram</option>
                                            <option value="facebook">Facebook</option>
                                        </select>
                                        <input
                                            type="text"
                                            value={link.url}
                                            onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                                            placeholder="https://"
                                            className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="px-6 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                キャンセル
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 transition-colors flex items-center"
                            >
                                {saving ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        保存中...
                                    </>
                                ) : '変更を保存'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};
