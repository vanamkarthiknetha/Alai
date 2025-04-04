const { v4: uuidv4 } = require("uuid");
const { initializeWebSocket, closeWebSocket } = require("./realtime");

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

async function generateSlides(token,noOfSlides,presentation_id) {


      for (let i = 0; i < noOfSlides; i++) {
        const slideOrder = i;
        const newSlide = await createNewSlide(token,presentation_id, slideOrder);
        console.log(`Slide${i+1} created`,newSlide)

        // await updateSlideEntity(token, {
        //     presentation_id,
        //     slide_id: newSlide.slide_id, 
        //     slide_specific_context: "Your context here" 
        // });
    }

    
}



async function alai(token, data) {
  await initializeWebSocket();
  const ppt = await createNewPresentation(token);
  
  await generateSlides(token,2,ppt.id)
  const sharableLink = await getSharableLink(token, ppt.id);
  closeWebSocket();
    console.log("✅ Sharable Link :",sharableLink)
}

module.exports = alai;
