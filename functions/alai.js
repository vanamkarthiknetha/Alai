const { v4: uuidv4 } = require('uuid');

async function createNewPresentation(token) {
    const url = `${process.env.ALAI_BASE_URL}/create-new-presentation`;
    const presentationId = uuidv4();
    const presentationTitle = `Presentation ${presentationId}`;

    const payload = {
        "presentation_id": presentationId,
        "presentation_title": presentationTitle,
        "create_first_slide": true,
        "theme_id": "a6bff6e5-3afc-4336-830b-fbc710081012",
        "default_color_set_id": 0
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating presentation:', error);
        throw error;
    }
}

async function getSharableLink(token, presentationId) {
    const url = `${process.env.ALAI_BASE_URL}/upsert-presentation-share`;
    const payload = {
        presentation_id: presentationId
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return `https://app.getalai.com/view/${result}` || null;
    } catch (error) {
        console.error('Error getting sharable link:', error);
        throw error;
    }
}

async function alai(token,data) {
    const result = await createNewPresentation(token)
    const sharableLink = await getSharableLink(token,result.id)
    return sharableLink
}

module.exports = alai;
