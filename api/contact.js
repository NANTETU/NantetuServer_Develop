export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
        return res.status(500).json({ success: false, message: 'Server configuration error: Webhook URL not set.' });
    }

    const { name, email, subject, message } = req.body;

    if (!message || !name) {
        return res.status(400).json({ success: false, message: 'Name and message are required.' });
    }

    const payload = {
        username: "Nantetu Contact Form",
        embeds: [{
            title: `New Contact: ${subject || 'No Subject'}`,
            color: 0x9b59b6, // Purple
            fields: [
                { name: "Name", value: name, inline: true },
                { name: "Email", value: email || "Not provided", inline: true },
                { name: "Message", value: message }
            ],
            timestamp: new Date().toISOString()
        }]
    };

    try {
        const discordRes = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (discordRes.ok) {
            return res.status(200).json({ success: true, message: 'Message sent!' });
        } else {
            const errText = await discordRes.text();
            console.error("Discord Webhook Error:", errText);
            return res.status(500).json({ success: false, message: 'Failed to send to Discord.' });
        }
    } catch (error) {
        console.error("Contact API Error:", error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}
