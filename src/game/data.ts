// Central data model for the dress-up game: color palettes, asset catalogs, and types.

export type LayerKey =
  | 'skin'
  | 'underwear'
  | 'bottoms'
  | 'tops'
  | 'dresses'
  | 'outerwear'
  | 'shoes'
  | 'face'
  | 'hairFront'
  | 'accessories'
  | 'pet'
  | 'background';

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
}

export interface AssetOption {
  id: string;
  name: string;
  /** category this asset belongs to */
  category: string;
  /** optional recolorable flag — if true, palette picker applies */
  recolorable?: boolean;
  /** optional default color id from a palette */
  defaultColor?: string;
  /** optional theme tag for daily challenges / randomizer */
  theme?: string;
}

// 30+ hair colors
export const HAIR_COLORS: ColorOption[] = [
  { id: 'hblack', name: 'Raven', hex: '#2b2630' },
  { id: 'hbrn', name: 'Cocoa', hex: '#5a3a28' },
  { id: 'hchoc', name: 'Choco', hex: '#7a4a2c' },
  { id: 'hchest', name: 'Chestnut', hex: '#9a6a3a' },
  { id: 'haub', name: 'Auburn', hex: '#a44a2a' },
  { id: 'hgold', name: 'Gold', hex: '#e8c060' },
  { id: 'hhoney', name: 'Honey', hex: '#d8a850' },
  { id: 'hstraw', name: 'Strawberry', hex: '#e89070' },
  { id: 'hplatinum', name: 'Platinum', hex: '#f0e8c8' },
  { id: 'hsilver', name: 'Silver', hex: '#c8c8d4' },
  { id: 'hgray', name: 'Smoke', hex: '#9a9aa4' },
  { id: 'hwhite', name: 'Snow', hex: '#f8f4f0' },
  { id: 'hpink', name: 'Bubblegum', hex: '#ff9ec0' },
  { id: 'hrose', name: 'Rose', hex: '#ff7aa8' },
  { id: 'hcoral', name: 'Coral', hex: '#ff8a6a' },
  { id: 'hpeach', name: 'Peach', hex: '#ffb898' },
  { id: 'hred', name: 'Cherry', hex: '#d8304a' },
  { id: 'hcrimson', name: 'Crimson', hex: '#b0203a' },
  { id: 'horange', name: 'Tangerine', hex: '#ff9038' },
  { id: 'hlemon', name: 'Lemon', hex: '#f8e058' },
  { id: 'hmint', name: 'Mint', hex: '#9ce8c0' },
  { id: 'hsage', name: 'Sage', hex: '#a8c8a0' },
  { id: 'holive', name: 'Olive', hex: '#b0a868' },
  { id: 'hgreen', name: 'Leaf', hex: '#5cc878' },
  { id: 'hteal', name: 'Teal', hex: '#4ab8b0' },
  { id: 'hsky', name: 'Sky', hex: '#8cc8f0' },
  { id: 'hblue', name: 'Ocean', hex: '#4a78c8' },
  { id: 'hnavy', name: 'Navy', hex: '#2a3a78' },
  { id: 'hlav', name: 'Lavender', hex: '#c8a8f0' },
  { id: 'hpurple', name: 'Grape', hex: '#9a6ad8' },
  { id: 'hviolet', name: 'Violet', hex: '#7a4ac8' },
  { id: 'hmagenta', name: 'Magenta', hex: '#d848b0' },
];

export const EYE_COLORS: ColorOption[] = [
  { id: 'ebrown', name: 'Brown', hex: '#7a4a2c' },
  { id: 'eamber', name: 'Amber', hex: '#c88030' },
  { id: 'ehazel', name: 'Hazel', hex: '#a89048' },
  { id: 'egreen', name: 'Green', hex: '#5cc878' },
  { id: 'eemerald', name: 'Emerald', hex: '#2ca868' },
  { id: 'eblue', name: 'Blue', hex: '#4a78c8' },
  { id: 'esky', name: 'Sky', hex: '#8cc8f0' },
  { id: 'ecyan', name: 'Cyan', hex: '#48c8d8' },
  { id: 'eviolet', name: 'Violet', hex: '#9a6ad8' },
  { id: 'epurple', name: 'Purple', hex: '#b878d8' },
  { id: 'egray', name: 'Gray', hex: '#9a9aa4' },
  { id: 'esilver', name: 'Silver', hex: '#c8c8d4' },
  { id: 'ered', name: 'Crimson', hex: '#d8304a' },
  { id: 'epink', name: 'Pink', hex: '#ff9ec0' },
  { id: 'egold', name: 'Gold', hex: '#e8c060' },
];

export const SKIN_TONES: ColorOption[] = [
  { id: 's1', name: 'Porcelain', hex: '#ffe8d8' },
  { id: 's2', name: 'Ivory', hex: '#fcdcc0' },
  { id: 's3', name: 'Fair', hex: '#f8cca8' },
  { id: 's4', name: 'Light', hex: '#f0b888' },
  { id: 's5', name: 'Warm', hex: '#e8a878' },
  { id: 's6', name: 'Tan', hex: '#d89060' },
  { id: 's7', name: 'Caramel', hex: '#b87048' },
  { id: 's8', name: 'Honey', hex: '#9a5a30' },
  { id: 's9', name: 'Deep', hex: '#7a4020' },
  { id: 's10', name: 'Espresso', hex: '#5a2a14' },
];

// Generic clothing recolor palette (for the palette picker)
export const CLOTHING_COLORS: ColorOption[] = [
  { id: 'cwhite', name: 'White', hex: '#fff8f0' },
  { id: 'ccream', name: 'Cream', hex: '#fff0d8' },
  { id: 'cpink', name: 'Pink', hex: '#ffc8d6' },
  { id: 'cpinkdeep', name: 'Hot Pink', hex: '#ff7aa8' },
  { id: 'crose', name: 'Rose', hex: '#e06d96' },
  { id: 'ccoral', name: 'Coral', hex: '#ff9a78' },
  { id: 'cred', name: 'Red', hex: '#e84858' },
  { id: 'ccrimson', name: 'Crimson', hex: '#c0283a' },
  { id: 'corange', name: 'Orange', hex: '#ff9038' },
  { id: 'clemon', name: 'Lemon', hex: '#f8e058' },
  { id: 'cbutter', name: 'Butter', hex: '#ffe898' },
  { id: 'cmint', name: 'Mint', hex: '#9ce8c0' },
  { id: 'csage', name: 'Sage', hex: '#a8c8a0' },
  { id: 'cgreen', name: 'Green', hex: '#5cc878' },
  { id: 'cteal', name: 'Teal', hex: '#4ab8b0' },
  { id: 'csky', name: 'Sky', hex: '#8cc8f0' },
  { id: 'cblue', name: 'Blue', hex: '#4a78c8' },
  { id: 'cnavy', name: 'Navy', hex: '#2a3a78' },
  { id: 'clav', name: 'Lavender', hex: '#c8a8f0' },
  { id: 'cpurple', name: 'Purple', hex: '#9a6ad8' },
  { id: 'cviolet', name: 'Violet', hex: '#7a4ac8' },
  { id: 'cmagenta', name: 'Magenta', hex: '#d848b0' },
  { id: 'cbrown', name: 'Brown', hex: '#8a5a44' },
  { id: 'cchoco', name: 'Choco', hex: '#6a3a28' },
  { id: 'cblack', name: 'Black', hex: '#2b2630' },
  { id: 'cgray', name: 'Gray', hex: '#9a9aa4' },
];

// Hairstyles catalog
export const HAIRSTYLES: AssetOption[] = [
  { id: 'h_long', name: 'Long', category: 'hair', recolorable: true, defaultColor: 'hpink' },
  { id: 'h_short', name: 'Short', category: 'hair', recolorable: true, defaultColor: 'hpink' },
  { id: 'h_twintails', name: 'Twin Tails', category: 'hair', recolorable: true, defaultColor: 'hpink' },
  { id: 'h_braids', name: 'Braids', category: 'hair', recolorable: true, defaultColor: 'hlav' },
  { id: 'h_bob', name: 'Bob', category: 'hair', recolorable: true, defaultColor: 'hbrn' },
  { id: 'h_ponytail', name: 'Ponytail', category: 'hair', recolorable: true, defaultColor: 'hgold' },
  { id: 'h_spacebuns', name: 'Space Buns', category: 'hair', recolorable: true, defaultColor: 'hpink' },
  { id: 'h_hime', name: 'Hime Cut', category: 'hair', recolorable: true, defaultColor: 'hblack' },
  { id: 'h_wavy', name: 'Wavy', category: 'hair', recolorable: true, defaultColor: 'hhoney' },
  { id: 'h_curly', name: 'Curly', category: 'hair', recolorable: true, defaultColor: 'hchoc' },
  { id: 'h_pigtails', name: 'Pigtails', category: 'hair', recolorable: true, defaultColor: 'hstraw' },
  { id: 'h_messy', name: 'Messy Bun', category: 'hair', recolorable: true, defaultColor: 'hsilver' },
  { id: 'h_halfup', name: 'Half Up', category: 'hair', recolorable: true, defaultColor: 'hrose' },
  { id: 'h_side', name: 'Side Sweep', category: 'hair', recolorable: true, defaultColor: 'hplatinum' },
  { id: 'h_afro', name: 'Afro', category: 'hair', recolorable: true, defaultColor: 'hblack' },
  { id: 'h_pixie', name: 'Pixie', category: 'hair', recolorable: true, defaultColor: 'hgold' },
  { id: 'h_bun', name: 'Bun', category: 'hair', recolorable: true, defaultColor: 'hbrn' },
  { id: 'h_loose', name: 'Loose', category: 'hair', recolorable: true, defaultColor: 'hmint' },
  { id: 'h_ponyhigh', name: 'High Pony', category: 'hair', recolorable: true, defaultColor: 'hsky' },
  { id: 'h_ringlets', name: 'Ringlets', category: 'hair', recolorable: true, defaultColor: 'hlav' },
  { id: 'h_undercut', name: 'Undercut', category: 'hair', recolorable: true, defaultColor: 'hviolet' },
  { id: 'h_longbangs', name: 'Long Bangs', category: 'hair', recolorable: true, defaultColor: 'hwhite' },
];

export const FACES: AssetOption[] = [
  { id: 'f_happy', name: 'Happy', category: 'face' },
  { id: 'f_smile', name: 'Smile', category: 'face' },
  { id: 'f_sleepy', name: 'Sleepy', category: 'face' },
  { id: 'f_surprised', name: 'Surprised', category: 'face' },
  { id: 'f_wink', name: 'Wink', category: 'face' },
  { id: 'f_blush', name: 'Blush', category: 'face' },
  { id: 'f_cool', name: 'Cool', category: 'face' },
  { id: 'f_shy', name: 'Shy', category: 'face' },
];

export const TOPS: AssetOption[] = [
  { id: 't_camisole', name: 'Camisole', category: 'tops', recolorable: true, defaultColor: 'cwhite' },
  { id: 't_crop', name: 'Crop Top', category: 'tops', recolorable: true, defaultColor: 'cpink' },
  { id: 't_sweater', name: 'Sweater', category: 'tops', recolorable: true, defaultColor: 'cmint' },
  { id: 't_hoodie', name: 'Hoodie', category: 'tops', recolorable: true, defaultColor: 'clav' },
  { id: 't_cardi', name: 'Cardigan', category: 'tops', recolorable: true, defaultColor: 'ccream' },
  { id: 't_uniform', name: 'School Top', category: 'tops', recolorable: true, defaultColor: 'cwhite', theme: 'school' },
  { id: 't_blouse', name: 'Blouse', category: 'tops', recolorable: true, defaultColor: 'csky' },
  { id: 't_striped', name: 'Striped', category: 'tops', recolorable: true, defaultColor: 'cpink' },
  { id: 't_stars', name: 'Star Tee', category: 'tops', recolorable: true, defaultColor: 'cnavy' },
  { id: 't_lace', name: 'Lace Top', category: 'tops', recolorable: true, defaultColor: 'cwhite', theme: 'coquette' },
  { id: 't_band', name: 'Band Tee', category: 'tops', recolorable: true, defaultColor: 'cblack', theme: 'kpop' },
  { id: 't_y2k', name: 'Y2K Tee', category: 'tops', recolorable: true, defaultColor: 'cmagenta', theme: 'y2k' },
  { id: 't_puff', name: 'Puff Sleeve', category: 'tops', recolorable: true, defaultColor: 'cpink', theme: 'coquette' },
  { id: 't_googthic', name: 'Goth Blouse', category: 'tops', recolorable: true, defaultColor: 'cblack', theme: 'gothic' },
];

export const BOTTOMS: AssetOption[] = [
  { id: 'b_shorts', name: 'Shorts', category: 'bottoms', recolorable: true, defaultColor: 'cwhite' },
  { id: 'b_skirt', name: 'Skirt', category: 'bottoms', recolorable: true, defaultColor: 'cpink' },
  { id: 'b_pleated', name: 'Pleated Skirt', category: 'bottoms', recolorable: true, defaultColor: 'cnavy', theme: 'school' },
  { id: 'b_jeans', name: 'Jeans', category: 'bottoms', recolorable: true, defaultColor: 'cblue' },
  { id: 'b_mini', name: 'Mini Skirt', category: 'bottoms', recolorable: true, defaultColor: 'cred' },
  { id: 'b_flowy', name: 'Flowy Skirt', category: 'bottoms', recolorable: true, defaultColor: 'cmint', theme: 'cottagecore' },
  { id: 'b_overall', name: 'Overalls', category: 'bottoms', recolorable: true, defaultColor: 'clemon', theme: 'cottagecore' },
  { id: 'b_plaid', name: 'Plaid Skirt', category: 'bottoms', recolorable: true, defaultColor: 'cred', theme: 'school' },
  { id: 'b_lace', name: 'Lace Skirt', category: 'bottoms', recolorable: true, defaultColor: 'clav', theme: 'coquette' },
  { id: 'b_cargo', name: 'Cargo', category: 'bottoms', recolorable: true, defaultColor: 'csage' },
];

export const DRESSES: AssetOption[] = [
  { id: 'd_sundress', name: 'Sundress', category: 'dresses', recolorable: true, defaultColor: 'cpink', theme: 'cottagecore' },
  { id: 'd_fairy', name: 'Fairy Dress', category: 'dresses', recolorable: true, defaultColor: 'cmint', theme: 'fairy' },
  { id: 'd_gothic', name: 'Gothic Dress', category: 'dresses', recolorable: true, defaultColor: 'cblack', theme: 'gothic' },
  { id: 'd_uniform', name: 'School Dress', category: 'dresses', recolorable: true, defaultColor: 'cnavy', theme: 'school' },
  { id: 'd_pajama', name: 'Pajama Dress', category: 'dresses', recolorable: true, defaultColor: 'cpink', theme: 'pajamas' },
  { id: 'd_y2k', name: 'Y2K Dress', category: 'dresses', recolorable: true, defaultColor: 'cmagenta', theme: 'y2k' },
  { id: 'd_coquette', name: 'Coquette Dress', category: 'dresses', recolorable: true, defaultColor: 'cpink', theme: 'coquette' },
  { id: 'd_lemon', name: 'Lemon Dress', category: 'dresses', recolorable: true, defaultColor: 'clemon', theme: 'cottagecore' },
  { id: 'd_kpop', name: 'K-pop Dress', category: 'dresses', recolorable: true, defaultColor: 'cwhite', theme: 'kpop' },
  { id: 'd_lace', name: 'Lace Dress', category: 'dresses', recolorable: true, defaultColor: 'ccream', theme: 'coquette' },
];

export const SHOES: AssetOption[] = [
  { id: 'sh_sneakers', name: 'Sneakers', category: 'shoes', recolorable: true, defaultColor: 'cwhite' },
  { id: 'sh_boots', name: 'Boots', category: 'shoes', recolorable: true, defaultColor: 'cbrown' },
  { id: 'sh_maryjanes', name: 'Mary Janes', category: 'shoes', recolorable: true, defaultColor: 'cblack' },
  { id: 'sh_heels', name: 'Heels', category: 'shoes', recolorable: true, defaultColor: 'cpink' },
  { id: 'sh_sandals', name: 'Sandals', category: 'shoes', recolorable: true, defaultColor: 'ccream' },
  { id: 'sh_slippers', name: 'Slippers', category: 'shoes', recolorable: true, defaultColor: 'cpink', theme: 'pajamas' },
  { id: 'sh_platform', name: 'Platforms', category: 'shoes', recolorable: true, defaultColor: 'cblack', theme: 'y2k' },
  { id: 'sh_loafers', name: 'Loafers', category: 'shoes', recolorable: true, defaultColor: 'cbrown', theme: 'school' },
];

export const ACCESSORIES: AssetOption[] = [
  { id: 'a_bow', name: 'Bow', category: 'accessories', recolorable: true, defaultColor: 'cpink' },
  { id: 'a_clip', name: 'Hair Clip', category: 'accessories', recolorable: true, defaultColor: 'cpink' },
  { id: 'a_glasses', name: 'Glasses', category: 'accessories', recolorable: true, defaultColor: 'cblack' },
  { id: 'a_necklace', name: 'Necklace', category: 'accessories', recolorable: true, defaultColor: 'cwhite' },
  { id: 'a_earrings', name: 'Earrings', category: 'accessories', recolorable: true, defaultColor: 'cpink' },
  { id: 'a_bracelet', name: 'Bracelet', category: 'accessories', recolorable: true, defaultColor: 'cpink' },
  { id: 'a_bag', name: 'Handbag', category: 'accessories', recolorable: true, defaultColor: 'cpink' },
  { id: 'a_plushie', name: 'Plushie', category: 'accessories', recolorable: true, defaultColor: 'cpink' },
  { id: 'a_wings', name: 'Wings', category: 'accessories', recolorable: true, defaultColor: 'cwhite', theme: 'fairy' },
  { id: 'a_halo', name: 'Halo', category: 'accessories', recolorable: true, defaultColor: 'clemon', theme: 'fairy' },
  { id: 'a_catears', name: 'Cat Ears', category: 'accessories', recolorable: true, defaultColor: 'cpink' },
  { id: 'a_bunnyears', name: 'Bunny Ears', category: 'accessories', recolorable: true, defaultColor: 'cwhite' },
  { id: 'a_hat', name: 'Hat', category: 'accessories', recolorable: true, defaultColor: 'cbrown' },
  { id: 'a_beret', name: 'Beret', category: 'accessories', recolorable: true, defaultColor: 'cred' },
  { id: 'a_crown', name: 'Crown', category: 'accessories', recolorable: true, defaultColor: 'clemon' },
  { id: 'a_flower', name: 'Flower', category: 'accessories', recolorable: true, defaultColor: 'cpink', theme: 'cottagecore' },
  { id: 'a_choker', name: 'Choker', category: 'accessories', recolorable: true, defaultColor: 'cblack', theme: 'gothic' },
  { id: 'a_socks', name: 'Frill Socks', category: 'accessories', recolorable: true, defaultColor: 'cwhite', theme: 'coquette' },
];

export const BACKGROUNDS: AssetOption[] = [
  { id: 'bg_bedroom', name: 'Bedroom', category: 'background' },
  { id: 'bg_sakura', name: 'Sakura Park', category: 'background' },
  { id: 'bg_cafe', name: 'Cafe', category: 'background' },
  { id: 'bg_school', name: 'School', category: 'background' },
  { id: 'bg_forest', name: 'Forest', category: 'background' },
  { id: 'bg_beach', name: 'Beach', category: 'background' },
  { id: 'bg_cloud', name: 'Cloud Kingdom', category: 'background' },
  { id: 'bg_magic', name: 'Magical Room', category: 'background' },
];

export const PETS: AssetOption[] = [
  { id: 'p_cat', name: 'Cat', category: 'pet' },
  { id: 'p_bunny', name: 'Bunny', category: 'pet' },
  { id: 'p_bear', name: 'Bear', category: 'pet' },
  { id: 'p_duck', name: 'Duck', category: 'pet' },
  { id: 'p_none', name: 'No Pet', category: 'pet' },
];

export const STICKERS: AssetOption[] = [
  { id: 'st_heart', name: 'Heart', category: 'sticker' },
  { id: 'st_star', name: 'Star', category: 'sticker' },
  { id: 'st_flower', name: 'Flower', category: 'sticker' },
  { id: 'st_sparkle', name: 'Sparkle', category: 'sticker' },
  { id: 'st_bow', name: 'Bow', category: 'sticker' },
];

export type WeatherType = 'none' | 'rain' | 'snow' | 'sakura' | 'sparkles';

export interface OutfitState {
  skin: string;
  hair: string;
  hairColor: string;
  eyeColor: string;
  face: string;
  blush: boolean;
  freckles: boolean;
  underwear: string;
  bottoms: string | null;
  bottomsColor: string;
  tops: string | null;
  topsColor: string;
  dresses: string | null;
  dressesColor: string;
  outerwear: string | null;
  shoes: string | null;
  shoesColor: string;
  accessories: string[];
  accessoriesColors: Record<string, string>;
  pet: string;
  background: string;
  weather: WeatherType;
}

export const DEFAULT_OUTFIT: OutfitState = {
  skin: 's3',
  hair: 'h_long',
  hairColor: 'hpink',
  eyeColor: 'ebrown',
  face: 'f_happy',
  blush: true,
  freckles: false,
  underwear: 'u_basic',
  bottoms: null,
  bottomsColor: 'cwhite',
  tops: null,
  topsColor: 'cpink',
  dresses: 'd_sundress',
  dressesColor: 'cpink',
  outerwear: null,
  shoes: 'sh_maryjanes',
  shoesColor: 'cpink',
  accessories: ['a_bow'],
  accessoriesColors: { a_bow: 'cpink' },
  pet: 'p_cat',
  background: 'bg_bedroom',
  weather: 'sparkles',
};

export function findColor(palette: ColorOption[], id: string): ColorOption {
  return palette.find((c) => c.id === id) || palette[0];
}

export function findAsset(list: AssetOption[], id: string | null): AssetOption | null {
  if (!id) return null;
  return list.find((a) => a.id === id) || null;
}
