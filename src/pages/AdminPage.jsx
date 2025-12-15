import React, { useState } from 'react';
import { Shield, Server, Users, Terminal, RefreshCw, Send } from 'lucide-react';

export const AdminPage = ({ L, db, showToast }) => {
    const [adminInput, setAdminInput] = useState("");
    const [adminLog, setAdminLog] = useState([]);

    // 簡易的なコンソール機能
    const handleAdminSubmit = (e) => {
        e.preventDefault();
        const cmd = adminInput.trim();
        if (!cmd) return;

        let response = `> ${cmd}\n`;
        switch (cmd.toLowerCase()) {
            case 'help':
                response += "Available commands: help, status, whois, reload, clear";
                break;
            case 'status':
                response += "Server Status: ONLINE\nTPS: 20.0\nMemory: 4GB / 16GB";
                break;
            default:
                response += "Unknown command. Type 'help' for list.";
        }

        setAdminLog([...adminLog, response]);
        setAdminInput("");
    };

    return (
        <div className="max-w-6xl mx-auto py-32 px-4 animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl">
                    <Shield size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-black dark:text-white">Admin Dashboard</h1>
                    <p className="text-gray-500">Connected to: Nantetu-Core-v2.5</p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-2 text-gray-500 dark:text-gray-400 font-bold text-sm">
                        <Server size={18} /> USAGE
                    </div>
                    <div className="text-3xl font-black text-gray-800 dark:text-white">24%</div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full mt-4 overflow-hidden">
                        <div className="h-full bg-green-500 w-[24%]" />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-2 text-gray-500 dark:text-gray-400 font-bold text-sm">
                        <Users size={18} /> ONLINE
                    </div>
                    <div className="text-3xl font-black text-gray-800 dark:text-white">12 / 50</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-2 text-gray-500 dark:text-gray-400 font-bold text-sm">
                        <RefreshCw size={18} /> UPTIME
                    </div>
                    <div className="text-3xl font-black text-gray-800 dark:text-white">4d 12h</div>
                </div>
            </div>

            <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 font-mono text-sm">
                <div className="bg-gray-800 px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-300 font-bold">
                        <Terminal size={16} /> Server Console
                    </div>
                    <button onClick={() => setAdminLog([])} className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded transition-colors">Clear</button>
                </div>
                <div className="h-96 p-6 overflow-y-auto text-gray-300 space-y-1">
                    <div className="text-green-400">Welcome to Nantetu Server Console.</div>
                    {adminLog.map((log, i) => (
                        <div key={i} className="whitespace-pre-wrap">{log}</div>
                    ))}
                </div>
                <form onSubmit={handleAdminSubmit} className="bg-gray-800 p-4 flex gap-4">
                    <span className="text-gray-500 py-2">{">"}</span>
                    <input
                        type="text"
                        value={adminInput}
                        onChange={(e) => setAdminInput(e.target.value)}
                        className="flex-1 bg-transparent outline-none text-white py-2"
                        placeholder="Enter command..."
                    />
                    <button type="submit" className="text-purple-400 hover:text-purple-300"><Send size={18} /></button>
                </form>
            </div>
        </div>
    );
};
