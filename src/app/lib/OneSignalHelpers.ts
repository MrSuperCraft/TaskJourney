


const sendNotification = async (title: string, message: string, playerIds: string[], sendAfter: Date) => {
    try {
        const response = await fetch('https://onesignal.com/api/v1/notifications', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${process.env.NEXT_PUBLIC_ONESIGNAL_REST_API_KEY}`, // Ensure this key is included
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({
                app_id: process.env.NEXT_PUBLIC_ONESIGNAL_ID,
                contents: { en: message },
                headings: { en: title },
                include_external_user_ids: [...playerIds], // Correct the key name for external IDs
                send_after: sendAfter.toISOString(), // ISO format
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Error sending notification:', error);
        } else {
            const data = await response.json();
            console.log('Notification sent successfully:', data);
        }
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};


const changeTag = async (tag: string, value: string, uid: string) => {

    const url = `https://onesignal.com/api/v1/apps/${process.env.NEXT_PUBLIC_ONESIGNAL_ID}/users/${uid}`;

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Basic ${process.env.NEXT_PUBLIC_ONESIGNAL_REST_API_KEY}`, // Ensure this key is included
            'Content-Type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify({
            tags: {
                [tag]: value
            }
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        console.error('Error changing tag:', error);
    } else {
        const data = await response.json();
        console.log('Tag changed successfully:', data);
    }

}


const viewTags = async (uid: string) => {
    const url = `https://api.onesignal.com/apps/${process.env.NEXT_PUBLIC_ONESIGNAL_ID}/users/by/external_id/${uid}`;
    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${process.env.NEXT_PUBLIC_ONESIGNAL_REST_API_KEY}`,
            'Content-Type': 'application/json',
            'accept': 'application/json'
        }
    };

    const response = await fetch(url, options);

    if (!response.ok) {
        const error = await response.json();
        console.error('Error fetching tags:', error);
        return null;
    } else {
        const data = await response.json();
        console.log('Tags fetched successfully:', data);
        return data.properties.tags; // Assuming you only need the tags part
    }
}







export { sendNotification, changeTag, viewTags };




