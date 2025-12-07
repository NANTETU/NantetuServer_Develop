import React from 'react';
import { Lock } from 'lucide-react';

export const PrivacyPage = ({ L }) => {
    const title = L.privacy?.title || "プライバシーポリシー";
    const subtitle = L.privacy?.subtitle || "個人情報の取り扱いについて";

    return (
        <div className="max-w-4xl mx-auto py-32 px-4 animate-fade-in-scale">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-black mb-4 dark:text-white flex justify-center items-center gap-3">
                    <Lock className="text-purple-500" size={40} />
                    {title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
            </div>

            <div className="space-y-8">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <p className="text-gray-700 dark:text-gray-300 mb-6">{L.privacy?.intro}</p>

                    <h3 className="text-xl font-bold mb-4 text-purple-600 dark:text-purple-400 border-b border-gray-200 dark:border-gray-700 pb-2">{L.privacy?.section1_title}</h3>
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl">
                            <h4 className="font-bold mb-2 dark:text-white">{L.privacy?.subsection1_1_title}</h4>
                            <p className="text-sm text-gray-500 mb-1">{L.privacy?.subsection1_1_info}</p>
                            <p className="mb-3 text-gray-700 dark:text-gray-300">{L.privacy?.subsection1_1_data}</p>
                            <p className="text-sm text-gray-500 mb-1">{L.privacy?.subsection1_1_purpose}</p>
                            <p className="text-gray-700 dark:text-gray-300">{L.privacy?.subsection1_1_usage}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl">
                            <h4 className="font-bold mb-2 dark:text-white">{L.privacy?.subsection1_2_title}</h4>
                            <p className="text-sm text-gray-500 mb-1">{L.privacy?.subsection1_1_info}</p>
                            <p className="mb-3 text-gray-700 dark:text-gray-300">{L.privacy?.subsection1_2_data}</p>
                            <p className="text-sm text-gray-500 mb-1">{L.privacy?.subsection1_1_purpose}</p>
                            <p className="text-gray-700 dark:text-gray-300">{L.privacy?.subsection1_2_usage}</p>
                        </div>
                    </div>

                    <h3 className="text-xl font-bold mb-4 text-purple-600 dark:text-purple-400 border-b border-gray-200 dark:border-gray-700 pb-2">{L.privacy?.section2_title}</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-8">{L.privacy?.section2_content}</p>

                    <h3 className="text-xl font-bold mb-4 text-purple-600 dark:text-purple-400 border-b border-gray-200 dark:border-gray-700 pb-2">{L.privacy?.section3_title}</h3>
                    <p className="text-gray-700 dark:text-gray-300">{L.privacy?.section3_content} <a href={`mailto:${L.privacy?.email}`} className="text-purple-500 underline font-bold">{L.privacy?.email}</a></p>
                </div>
            </div>
        </div>
    );
};
