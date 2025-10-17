// A helper function to pick a random element from an array
const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// --- DATABASE OF ARTISTIC ELEMENTS ---

const coreSubjects = [
  'a lone astronaut discovering a cosmic ocean', 'a majestic city built into a giant waterfall', 'a bio-luminescent forest inhabited by crystal creatures', 'an ancient library at the edge of the universe', 'a mechanical dragon guarding a floating castle', 'a forgotten underwater metropolis', 'a surrealist tea party on a crescent moon', 'a knight whose armor is forged from starlight', 'a bustling marketplace on a city-sized spaceship', 'a serene zen garden on Mars', 'a whimsical village of treehouses connected by glowing bridges', 'a musician playing an instrument that controls the weather', 'a scholar deciphering glowing runes in a cave of wonders', 'a colossal creature made of clouds and storm', 'a hidden sanctuary powered by a fallen star'
];

const primaryStyles = [
  'ultra-photorealistic, detailed', 'a vibrant digital painting', 'a classic oil painting', 'a delicate watercolor illustration', 'a sharp and clean vector art piece', 'a gritty, textured charcoal sketch', 'a high-fashion concept photograph', 'a detailed anime and manga art style', 'a charming and simple cartoon style', 'a dramatic 3D render', 'a minimalist ink wash painting'
];

const artisticInfluences = [
  'with the dramatic chiaroscuro of the Baroque period', 'in the style of Hudson River School landscapes', 'with the dreamlike quality of Surrealist masters like Salvador Dalí', 'capturing the fleeting light of Impressionism', 'using the bold colors and lines of Japanese Ukiyo-e woodblock prints', 'incorporating the geometric complexity of Islamic art', 'with the raw emotion of German Expressionism', 'emulating the grandeur of Romanticism paintings', 'with a nod to the clean, functional design of the Bauhaus movement', 'inspired by the intricate patterns of Art Nouveau', 'with the rebellious energy of street art and graffiti'
];

const futuristicElements = [
  'infused with cyberpunk aesthetics, featuring neon signs and high-tech implants', 'blended with steampunk elements like clockwork mechanisms and polished brass', 'imagined in a solarpunk future, with lush greenery integrated into advanced architecture', 'with a touch of biopunk, showing organic technology and genetic modifications', 'designed with sleek, high-tech minimalism, featuring holographic interfaces', 'set in a gritty, dieselpunk world of heavy machinery and industrial grime'
];

const compositionAndFraming = [
  'shot with a wide-angle lens to capture the epic scale', 'a low-angle shot emphasizing power and height', 'a high-angle shot providing a bird\'s-eye view', 'a symmetrical composition creating a sense of balance and order', 'an asymmetrical composition for a dynamic and tense feeling', 'following the rule of thirds for a visually pleasing layout', 'a close-up shot focusing on intricate details', 'a cinematic dutch angle for a sense of unease or action'
];

const lightingStyles = [
  'bathed in the soft, warm glow of the golden hour', 'dramatically lit with volumetric lighting, casting visible rays of light', 'illuminated by eerie, bioluminescent flora and fauna', 'cast in the harsh, contrasting shadows of film noir', 'glowing with the vibrant, electric colors of neon lights', 'shrouded in a mysterious, thick fog with diffused light', 'lit by the ethereal light of a full moon and twinkling stars'
];

const colorPalettes = [
  'a contrasting palette of deep blues and fiery oranges', 'a harmonious, analogous palette of greens and yellows', 'a sophisticated monochromatic palette using shades of a single color', 'a vibrant, triadic color scheme for a playful and energetic mood', 'a dreamy, pastel color palette for a soft and gentle atmosphere', 'a dark, moody palette with pops of electric color', 'a vaporwave aesthetic with shades of pink, teal, and purple'
];

const surrealTwists = [
  'where rivers flow upwards into the sky', 'featuring impossible architecture that defies gravity', 'where the flora and fauna are made of glass and metal', 'with clocks melting over the landscape', 'and the sky is filled with floating, glowing islands', 'where characters cast shadows that have a life of their own', 'with trees that grow musical instruments instead of fruit'
];

const texturesAndDetails = [
  'every surface rendered with hyper-detailed textures', 'the brushstrokes are visibly thick and expressive', 'a focus on the interplay between organic and synthetic textures', 'with a glossy, reflective sheen on metallic surfaces', 'a soft, matte finish that diffuses light beautifully', 'intricate patterns and filigree are etched into the surfaces'
];

const moods = [
  'evoking a sense of wonder and epic adventure', 'creating a serene, peaceful, and contemplative atmosphere', 'filled with a mysterious and slightly ominous energy', 'bursting with joyful, chaotic, and vibrant energy', 'a feeling of nostalgic melancholy and quiet solitude', 'a powerful, awe-inspiring, and majestic mood'
];


export const generateInspirationalPrompt = (): string => {
  // Construct a detailed, multi-part prompt
  const subject = getRandomElement(coreSubjects);
  const style = getRandomElement(primaryStyles);
  const influence = getRandomElement(artisticInfluences);
  const composition = getRandomElement(compositionAndFraming);
  const lighting = getRandomElement(lightingStyles);
  const palette = getRandomElement(colorPalettes);
  const texture = getRandomElement(texturesAndDetails);
  const mood = getRandomElement(moods);

  let prompt = `Create an original, masterful digital artwork. The central subject is ${subject}. 
The overall aesthetic should be that of a ${style}, but deeply influenced by an innovative fusion of styles.
Incorporate a conceptual approach that blends ${influence} with the imaginative possibilities of a ${getRandomElement(futuristicElements)}.

The composition must be deliberate; frame the scene using a ${composition}.
Lighting is crucial: the scene is ${lighting}, which works in tandem with ${palette} to establish a powerful atmosphere.
This atmosphere should be carefully crafted, ${mood}. 
Pay meticulous attention to detail; ${texture}, creating a rich tactile experience for the viewer.
As a final, unexpected touch, introduce a surreal element, ${getRandomElement(surrealTwists)}.

The final image should be a harmonious yet visually surprising piece, a testament to the seamless blend of disparate artistic worlds. It must be high-resolution, intricate, and emotionally resonant.`;
  
  return prompt;
};
