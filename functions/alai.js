const { v4: uuidv4 } = require("uuid");
const WebSocket = require("ws");

let ws; // Declare the WebSocket variable
async function initializeWebSocket() {
  return new Promise((resolve, reject) => {
    ws = new WebSocket(
      "wss://alai-standalone-backend.getalai.com/ws/create-and-stream-slide-variants"
    );

    ws.on("open", () => {
      console.log("WebSocket connection opened");
      resolve();
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      reject(error);
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });
  });
}
async function closeWebSocket(data) {
  try {
    if (ws && ws.readyState === WebSocket.OPEN) {
      await ws.close();
    }
  } catch (error) {
    console.error("Error closing WebSocket:", error);
  }
}
async function waitForVariants() {
  return new Promise((resolve) => {
    const variants = [];

    const messageHandler = (data) => {
      const message = JSON.parse(data);
        variants.push(message); 
        console.log("A variant received!");

        if (variants.length === 5) {
          ws.removeListener("message", messageHandler); 
          resolve(variants);
        }
    };

    // Add the message listener
    ws.on("message", messageHandler);
  });
}

async function createNewPresentation(token) {
  const url = `${process.env.ALAI_BASE_URL}/create-new-presentation`;
  const presentationId = uuidv4();
  const presentationTitle = `Presentation ${presentationId}`;

  const payload = {
    presentation_id: presentationId,
    presentation_title: presentationTitle,
    create_first_slide: false,
    theme_id: "a6bff6e5-3afc-4336-830b-fbc710081012",
    default_color_set_id: 0,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating presentation:", error);
    throw error;
  }
}
async function getSharableLink(token, presentationId) {
  const url = `${process.env.ALAI_BASE_URL}/upsert-presentation-share`;
  const payload = {
    presentation_id: presentationId,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return `https://app.getalai.com/view/${result}` || null;
  } catch (error) {
    console.error("Error getting sharable link:", error);
    throw error;
  }
}
async function createNewSlide(token, presentation_id, slide_order) {
  const url = `${process.env.ALAI_BASE_URL}/create-new-slide`;
  const slideData = {
    slide_id: uuidv4(),
    presentation_id,
    product_type: "PRESENTATION_CREATOR",
    slide_order,
    color_set_id: 0,
  };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(slideData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating new slide:", error);
    throw error;
  }
}
async function updateSlideEntity(token, data) {
  //   const newSlide = await createNewSlide(token,"1ce2c36a-6b78-4268-9d6e-7660dd967691",4);
  //   console.log(newSlide)
}

async function generateSlides(token, noOfSlides, presentation_id) {
  for (let i = 0; i < noOfSlides; i++) {
    const slideOrder = i;
    console.log(`Creating slide ${i + 1} ..... `);
    const ppt = await createNewSlide(token, presentation_id, slideOrder);

    await initializeWebSocket();
    const payload = {
      additional_instructions: "Testing", // Customize as needed
      auth_token: token,
      images_on_slide: [],
      layout_type: "AI_GENERATED_LAYOUT",
      presentation_id: presentation_id,
      slide_id: ppt.slides[i].id,
      slide_specific_context: "Just testing", // Customize as needed
      update_tone_verbosity_calibration_status: false,
    };
    ws.send(JSON.stringify(payload));
    console.log(`Sent WebSocket message for slide ${slideOrder}`);
    // Wait for the response from the WebSocket and store variants
    const variants = await waitForVariants();
    const pptWithVariants = variants[0];
    for (let i = 1; i <= 4; i++) {
      pptWithVariants.variants.push(variants[i]);
    }
    console.log(`Received variants for slide ${slideOrder}`);

    // const updatePayload = {
    //   active_variant_id: variants[0].id, // Set the first variant as active
    //   color_set_id: 0,
    //   created_at: variants[0].created_at,
    //   id: variants[0].slide_id,
    //   presentation_context: variants[0].presentation_context,
    //   presentation_id,
    //   slide_context: variants[0].slide_context,
    //   slide_instructions: variants[0].slide_instructions,
    //   slide_order: variants[0].slide_order,
    //   slide_outline: variants[0].slide_outline,
    //   slide_status: variants[0].slide_status,
    //   variants: variants, // Store all variants
    // };

    // await updateSlideEntity(token,updatePayload);
  }
}

async function alai(token, data) {
  const ppt = await createNewPresentation(token);
  await generateSlides(token, 2, ppt.id);
  const sharableLink = await getSharableLink(token, ppt.id);
//   await closeWebSocket();
  console.log("✅ Sharable Link :", sharableLink);
}

module.exports = alai;
