export const formatCorrectedDate = (dateString) => {
    // スプレッドシートからの形式 (例: "2025/12/03 22:44:25") をそのまま Dateオブジェクトに渡す
    const d = new Date(dateString);

    // Dateオブジェクトが有効な日付を生成できなかった場合、元の文字列をそのまま返す
    if (isNaN(d.getTime())) {
        return dateString;
    }

    // 月を 0-11 から 1-12 に修正 (+1)
    const correctMonth = d.getMonth() + 1;
    const correctDay = d.getDate();

    // 表示形式を YYYY.MM.DD に整形して返す（時間情報は省略）
    return `${d.getFullYear()}.${String(correctMonth).padStart(2, '0')}.${String(correctDay).padStart(2, '0')}`;
};

export const formatTimestamp = (ts) => {
    if (!ts) return '';
    try {
        const d = ts.toDate ? ts.toDate() : new Date(ts);
        if (Number.isNaN(d.getTime())) return '';
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    } catch {
        return '';
    }
};
