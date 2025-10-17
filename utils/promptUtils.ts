import { GoogleGenAI } from "@google/genai";

// --- Singleton pattern for the GoogleGenAI client ---
let aiInstance: GoogleGenAI | null = null;
const getAiClient = (): GoogleGenAI => {
  if (!aiInstance) {
    // This will now only be called when needed, preventing a startup crash.
    aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiInstance;
};

// A helper function to pick a random element from an array
const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// --- "Super Rich" High-Level Concepts to Seed the AI Prompt Generator ---
// This list is intentionally vast and varied to ensure a wide range of outputs.
const highLevelConcepts = [
  // Photography
  'A moody, cinematic black and white photograph capturing a decisive moment on a city street.',
  'A breathtaking landscape photograph of a remote wilderness, shot on Kodak Ektar film.',
  'An intimate, emotional portrait with dramatic chiaroscuro lighting.',
  'A high-fashion editorial shot in a brutalist architectural setting.',
  'A gritty, photojournalistic image from a bustling marketplace in Marrakech.',
  'A dreamy, soft-focus macro photograph of bioluminescent fungi in a dark forest.',
  'An architectural photograph of a futuristic building at twilight, in the style of Julius Shulman.',
  'A long-exposure photograph of a starry sky over an ancient ruin, revealing the Milky Way.',
  'A candid street photograph in Tokyo at night, filled with neon reflections, shot on Cinestill 800T.',
  'An ethereal underwater photograph of a coral reef and a lone diver.',
  'A minimalist photograph of sand dunes with harsh, raking light creating deep shadows.',
  'A powerful sports photograph capturing the peak of an athlete\'s motion.',
  'A nostalgic, grainy photograph of a 1970s suburban scene, reminiscent of Stephen Shore.',
  'A dramatic wildlife photograph of a wolf howling on a snowy ridge.',
  
  // Painting & Illustration
  'An epic fantasy matte painting of a city built on the back of a colossal, sleeping dragon.',
  'A Pre-Raphaelite oil painting of a mythical scene, rich with symbolism and detail, in the style of John William Waterhouse.',
  'A vibrant, energetic abstract expressionist painting with thick, textured impasto brushstrokes, like Gerhard Richter.',
  'A delicate, traditional Japanese Ukiyo-e woodblock print of a quiet temple in the snow.',
  'A whimsical, detailed children\'s book illustration of a hidden animal village, in the style of Arthur Rackham.',
  'A dark, surrealist painting exploring subconscious fears, in the style of Zdzisław Beksiński or H.R. Giger.',
  'A sleek, optimistic solarpunk illustration of a self-sustaining city with vertical farms and clean energy.',
  'A piece of pop art in the style of Roy Lichtenstein, depicting a modern technological dilemma.',
  'A grand, baroque oil painting of a celestial battle between angels and demons.',
  'A golden-age illustration of a knight facing a dragon, by Frank Frazetta.',
  'A beautiful Art Nouveau poster with flowing lines and organic forms, inspired by Alphonse Mucha.',
  'A detailed, cross-section scientific illustration of a fantastical creature.',

  // Sci-Fi & Cyberpunk
  'Concept art for a grimy, rain-slicked, neon-drenched cyberpunk alleyway overflowing with detail.',
  'A cinematic still of a colossal, silent starship exiting a swirling, colorful nebula.',
  'A detailed illustration of a bio-mechanical android in a state of disrepair, contemplating its own existence.',
  'An epic splash art of a mech battle in a war-torn, futuristic city, with explosions and motion blur.',
  'A retro-futuristic sovietwave poster for a fictional space mission to Venus.',
  'A dieselpunk vehicle design, heavily armored, weathered, and bristling with custom modifications.',
  'A high-tech laboratory where a new form of artificial intelligence is being born.',
  'Concept art for an alien planet with bizarre, towering flora and two suns in the sky.',
  'A lonely astronaut discovering an ancient alien artifact on the surface of Mars.',
  'A scene from a space-opera, showing a diplomatic meeting in a grand galactic senate.',

  // Character Design
  'Full-body character concept art for a wandering samurai with a cursed, glowing katana.',
  'A character design sheet for a charismatic sky-pirate captain, with callouts for their gear and expressions.',
  'A stylized character design for an arcane spellweaver from a high fantasy world, adorned in celestial robes.',
  'A photorealistic portrait of a grizzled, post-apocalyptic survivor with intricate tattoos and scars.',
  'Character concept art of a plague doctor who is also an alchemist, with vials and arcane tools.',
  'A design for a royal guard from an underwater Atlantean city, with bio-luminescent armor.',
  'A turn-around sheet for a stealthy cyberpunk ninja with cybernetic enhancements.',

  // Architecture & Interior Design
  'An architectural render of a minimalist, cantilevered house on a rugged cliffside overlooking the ocean.',
  'A design for a deconstructivist art museum that appears to defy gravity, in the style of Zaha Hadid.',
  'A biophilic design for a public library that is seamlessly integrated into a living, ancient forest.',
  'An interior design shot of a cozy, book-filled reading nook in a Victorian-era home, with a fireplace.',
  'An architectural visualization of a tranquil Zen monastery in a misty bamboo forest.',
  'A concept for a futuristic, sustainable skyscraper that incorporates waterfalls and vertical gardens.',
  
  // Abstract & Surreal
  'A mind-bending, geometric abstract piece inspired by the impossible architecture of M.C. Escher.',
  'A metaphysical painting depicting a quiet, lonely plaza with long, dramatic shadows, in the style of Giorgio de Chirico.',
  'A piece of generative fractal art, showing complex, evolving patterns with vibrant, psychedelic colors.',
  'A surrealist assemblage combining everyday objects into a new, unsettling form.',
  'A beautiful, chaotic abstract painting made with the fluid art pouring technique.',
  'A cubist portrait that deconstructs the subject into geometric forms and multiple viewpoints.',
];

const metaPromptTemplate = `You are a world-class creative director and prompt engineer for an advanced AI image generation model. Your task is to take a high-level concept and expand it into a rich, detailed, and evocative prompt. The prompt should be a single, flowing paragraph and feel like a professional art direction brief.

Key elements to include:
- **Subject:** Clearly describe the main subject, characters, and action.
- **Setting:** Paint a vivid picture of the environment, time of day, and atmosphere.
- **Style:** Specify the artistic style (e.g., oil painting, 3D render, photograph, matte painting, concept art) and medium.
- **Artist Influence:** Name one or two specific artists, directors, or studios known for a relevant style (e.g., "in the style of Syd Mead", "inspired by Studio Ghibli", "reminiscent of Annie Leibovitz").
- **Lighting:** Describe the lighting in detail (e.g., "dramatic chiaroscuro lighting", "soft, diffused morning light through a misty forest", "a room drenched in the neon glow of a city at night").
- **Details & Camera:** Add specific, tangible details. Mention camera properties if relevant (e.g., "shot on a Leica M6 with a 35mm lens", "cinematic anamorphic lens flare", "shallow depth of field with beautiful bokeh", "macro shot").
- **Composition:** Briefly touch on the composition (e.g., "extreme wide shot to emphasize scale", "intimate close-up portrait", "dynamic action pose").
- **Mood:** Convey the overall mood and atmosphere (e.g., "melancholic and contemplative", "epic and awe-inspiring", "gritty and dystopian").

**IMPORTANT:** Do NOT use lists, bullet points, or quotation marks in your final output. The output must be a single, cohesive, ready-to-use paragraph.

Here is the high-level concept to expand upon:
"\${/* concept will be injected here */}"

Now, generate the detailed and artistic prompt.`;

/**
 * Generates a high-quality, inspirational prompt for image generation
 * by using the Gemini API to expand upon a random high-level concept.
 * @returns A promise that resolves to a string containing the generated prompt.
 */
export const generateInspirationalPrompt = async (): Promise<string> => {
  const concept = getRandomElement(highLevelConcepts);
  const finalMetaPrompt = metaPromptTemplate.replace("\${/* concept will be injected here */}", concept);

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: finalMetaPrompt,
    });

    const generatedText = response.text.trim();
    // Clean up any extraneous quotes the model might have added
    return generatedText.replace(/^"|"$/g, '').replace(/\s+/g, ' ').trim();
  } catch (error) {
    console.error("Error generating prompt with Gemini:", error);
    // Provide a high-quality fallback prompt if the API call fails
    return "An epic and highly detailed fantasy matte painting of a lost city nestled in a colossal, overgrown cavern, with waterfalls cascading into a bioluminescent lake. The scene is illuminated by god rays piercing through an opening in the cavern ceiling, creating a mystical and awe-inspiring atmosphere. In the style of Sparth and John Harris, cinematic, 8K resolution, trending on ArtStation.";
  }
};