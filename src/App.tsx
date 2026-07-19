import { useState, useEffect, useRef, useCallback } from 'react';
import {
  OutfitState,
  DEFAULT_OUTFIT,
  HAIRSTYLES,
  HAIR_COLORS,
  FACES,
  TOPS,
  BOTTOMS,
  DRESSES,
  SHOES,
  ACCESSORIES,
  BACKGROUNDS,
  PETS,
  CLOTHING_COLORS,
  WeatherType,
} from './game/data';
import Stage from './game/Stage';
import InventoryPanel, { TabKey } from './game/InventoryPanel';
import { playClick, playEquip, startMusic, setMuted, isMuted } from './game/audio';
import {
  saveFavorite,
  listFavorites,
  deleteFavorite,
  renameFavorite,
  getDailyChallenge,
  FavoriteOutfit,
  DailyChallenge,
} from './game/supabase';

interface Sticker {
  x: number;
  y: number;
  type: string;
}

export default function App() {
  const [outfit, setOutfit] = useState<OutfitState>(DEFAULT_OUTFIT);
  const [history, setHistory] = useState<OutfitState[]>([]);
  const [future, setFuture] = useState<OutfitState[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>('hair');
  const [muted, setMutedState] = useState(false);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [stickerMode, setStickerMode] = useState(false);
  const [stickerType, setStickerType] = useState('st_heart');
  const [weather, setWeather] = useState<WeatherType>('sparkles');
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteOutfit[]>([]);
  const [outfitName, setOutfitName] = useState('My Cute Fit');
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [showChallenge, setShowChallenge] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  // snapshot to history before a change
  const pushHistory = useCallback((prev: OutfitState) => {
    setHistory((h) => [...h.slice(-30), prev]);
    setFuture([]);
  }, []);

  const updateOutfit = useCallback((updater: (o: OutfitState) => OutfitState) => {
    setOutfit((prev) => {
      pushHistory(prev);
      return updater(prev);
    });
  }, [pushHistory]);

  const handleEquip = useCallback((key: string, value: string | null) => {
    playClick();
    updateOutfit((o) => {
      if (key === 'accessoriesAdd' && value) {
        return { ...o, accessories: o.accessories.includes(value) ? o.accessories : [...o.accessories, value] };
      }
      if (key === 'accessoriesRemove' && value) {
        return { ...o, accessories: o.accessories.filter((a) => a !== value) };
      }
      if (key === 'accessories' && value) {
        // toggle handled by add/remove above
        return o;
      }
      return { ...o, [key]: value };
    });
    playEquip();
  }, [updateOutfit]);

  const handleColor = useCallback((key: string, color: string) => {
    playClick();
    updateOutfit((o) => {
      if (key.startsWith('accessory:')) {
        const id = key.split(':')[1];
        return { ...o, accessoriesColors: { ...o.accessoriesColors, [id]: color } };
      }
      return { ...o, [key]: color };
    });
  }, [updateOutfit]);

  const handleToggle = useCallback((key: 'blush' | 'freckles') => {
    playClick();
    updateOutfit((o) => ({ ...o, [key]: !o[key] }));
  }, [updateOutfit]);

  const undo = useCallback(() => {
    playClick();
    setHistory((h) => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setOutfit((cur) => {
        setFuture((f) => [...f, cur]);
        return prev;
      });
      return h.slice(0, -1);
    });
  }, []);

  const redo = useCallback(() => {
    playClick();
    setFuture((f) => {
      if (f.length === 0) return f;
      const next = f[f.length - 1];
      setOutfit((cur) => {
        setHistory((h) => [...h, cur]);
        return next;
      });
      return f.slice(0, -1);
    });
  }, []);

  const randomOutfit = useCallback(() => {
    playEquip();
    updateOutfit((o) => ({
      ...o,
      hair: HAIRSTYLES[Math.floor(Math.random() * HAIRSTYLES.length)].id,
      hairColor: HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)].id,
      eyeColor: o.eyeColor,
      skin: o.skin,
      face: FACES[Math.floor(Math.random() * FACES.length)].id,
      blush: Math.random() > 0.4,
      freckles: Math.random() > 0.6,
      tops: Math.random() > 0.5 ? TOPS[Math.floor(Math.random() * TOPS.length)].id : null,
      topsColor: CLOTHING_COLORS[Math.floor(Math.random() * CLOTHING_COLORS.length)].id,
      bottoms: Math.random() > 0.5 ? BOTTOMS[Math.floor(Math.random() * BOTTOMS.length)].id : null,
      bottomsColor: CLOTHING_COLORS[Math.floor(Math.random() * CLOTHING_COLORS.length)].id,
      dresses: Math.random() > 0.5 ? DRESSES[Math.floor(Math.random() * DRESSES.length)].id : null,
      dressesColor: CLOTHING_COLORS[Math.floor(Math.random() * CLOTHING_COLORS.length)].id,
      shoes: SHOES[Math.floor(Math.random() * SHOES.length)].id,
      shoesColor: CLOTHING_COLORS[Math.floor(Math.random() * CLOTHING_COLORS.length)].id,
      accessories: ACCESSORIES.slice(0, 1 + Math.floor(Math.random() * 3)).map(() => ACCESSORIES[Math.floor(Math.random() * ACCESSORIES.length)].id),
      pet: PETS[Math.floor(Math.random() * (PETS.length - 1))].id,
      background: BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)].id,
      weather: (['none', 'rain', 'snow', 'sakura', 'sparkles'] as WeatherType[])[Math.floor(Math.random() * 5)],
    }));
  }, [updateOutfit]);

  const reset = useCallback(() => {
    playClick();
    updateOutfit(() => DEFAULT_OUTFIT);
    setStickers([]);
    setWeather('sparkles');
  }, [updateOutfit]);

  // Save PNG: composite stage canvas
  const savePNG = useCallback(() => {
    playClick();
    const canvas = stageRef.current?.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `${outfitName || 'outfit'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [outfitName]);

  const toggleFullscreen = useCallback(() => {
    playClick();
    const el = stageRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
      setFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setFullscreen(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const next = !muted;
    setMutedState(next);
    setMuted(next);
    if (!next) startMusic();
    if (!next) playClick();
  }, [muted]);

  // Sticker placement on stage click
  const handleStageClick = useCallback((e: React.MouseEvent) => {
    if (!stickerMode) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 256;
    const y = ((e.clientY - rect.top) / rect.height) * 256;
    setStickers((s) => [...s, { x: Math.round(x), y: Math.round(y), type: stickerType }]);
    playClick();
  }, [stickerMode, stickerType]);

  // Favorites
  const refreshFavorites = useCallback(async () => {
    const list = await listFavorites();
    setFavorites(list);
  }, []);

  const handleSaveFavorite = useCallback(async () => {
    playClick();
    const canvas = stageRef.current?.querySelector('canvas') as HTMLCanvasElement | null;
    const thumb = canvas ? canvas.toDataURL('image/png') : null;
    await saveFavorite(outfitName || 'Untitled Outfit', outfit, thumb);
    await refreshFavorites();
    setShowFavorites(true);
  }, [outfit, outfitName, refreshFavorites]);

  const handleLoadFavorite = useCallback((fav: FavoriteOutfit) => {
    playEquip();
    updateOutfit(() => ({ ...DEFAULT_OUTFIT, ...fav.outfit_state }));
    setOutfitName(fav.outfit_name);
    setShowFavorites(false);
  }, [updateOutfit]);

  const handleDeleteFavorite = useCallback(async (id: string) => {
    playClick();
    await deleteFavorite(id);
    await refreshFavorites();
  }, [refreshFavorites]);

  const handleRenameFavorite = useCallback(async (id: string, name: string) => {
    await renameFavorite(id, name);
    await refreshFavorites();
  }, [refreshFavorites]);

  // Daily challenge
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    getDailyChallenge(today).then((c) => setChallenge(c));
  }, []);

  // Start music on first interaction
  useEffect(() => {
    const onFirst = () => {
      if (!isMuted()) startMusic();
      window.removeEventListener('pointerdown', onFirst);
    };
    window.addEventListener('pointerdown', onFirst);
    return () => window.removeEventListener('pointerdown', onFirst);
  }, []);

  // Load favorites on mount
  useEffect(() => {
    refreshFavorites();
  }, [refreshFavorites]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center px-3 py-4 no-select">
      {/* Header */}
      <header className="w-full max-w-5xl flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-pixel bg-kawaii-pink flex items-center justify-center shadow-pixel">
            <span className="text-white text-lg">🎀</span>
          </div>
          <div>
            <h1 className="font-pixel text-sm sm:text-base text-kawaii-pinkDark leading-tight">KAWAII</h1>
            <p className="font-silk text-[10px] text-kawaii-ink/70">Dress-Up Studio</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => { setShowChallenge(true); playClick(); }} className="pixel-btn bg-kawaii-lavender text-kawaii-ink px-2.5 py-2 text-[10px]">
            Daily
          </button>
          <button onClick={toggleMute} className="pixel-btn bg-white text-kawaii-ink px-2.5 py-2 text-xs" title="Mute">
            {muted ? '🔇' : '🔊'}
          </button>
          <button onClick={toggleFullscreen} className="pixel-btn bg-white text-kawaii-ink px-2.5 py-2 text-xs" title="Fullscreen">
            ⛶
          </button>
        </div>
      </header>

      {/* Main layout */}
      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-3 flex-1">
        {/* Stage */}
        <div ref={stageRef} className="flex-1 flex flex-col gap-2">
          <div
            onClick={handleStageClick}
            className={`relative rounded-pixel overflow-hidden border-4 ${stickerMode ? 'border-kawaii-pinkDeep cursor-crosshair' : 'border-kawaii-cream'} shadow-soft bg-kawaii-cream`}
          >
            <Stage outfit={outfit} weather={weather} stickers={stickers} pet={outfit.pet} />
            {stickerMode && (
              <div className="absolute top-2 left-2 bg-kawaii-pink text-white text-[10px] font-silk px-2 py-1 rounded-lg pop-in">
                Sticker Mode — click to place
              </div>
            )}
          </div>

          {/* Outfit name + save */}
          <div className="flex gap-2 items-center">
            <input
              value={outfitName}
              onChange={(e) => setOutfitName(e.target.value)}
              placeholder="Outfit name..."
              className="flex-1 pixel-btn bg-white text-kawaii-ink px-3 py-2 text-xs outline-none"
            />
            <button onClick={handleSaveFavorite} className="pixel-btn bg-kawaii-pink text-white px-3 py-2 text-xs whitespace-nowrap">
              ★ Save
            </button>
            <button onClick={() => { setShowFavorites(true); playClick(); }} className="pixel-btn bg-kawaii-mint text-kawaii-ink px-3 py-2 text-xs whitespace-nowrap">
              ♥ Favorites
            </button>
          </div>

          {/* Sticker + weather bar */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <button
              onClick={() => { setStickerMode(!stickerMode); playClick(); }}
              className={`pixel-btn px-2.5 py-1.5 text-[10px] ${stickerMode ? 'bg-kawaii-pink text-white' : 'bg-white text-kawaii-ink'}`}
            >
              ✦ Stickers
            </button>
            {stickerMode && (
              <div className="flex gap-1">
                {['st_heart', 'st_star', 'st_flower', 'st_sparkle', 'st_bow'].map((s) => (
                  <button
                    key={s}
                    onClick={() => { setStickerType(s); playClick(); }}
                    className={`pixel-btn px-2 py-1.5 text-[10px] ${stickerType === s ? 'bg-kawaii-lavender text-kawaii-ink' : 'bg-white text-kawaii-ink'}`}
                  >
                    {s === 'st_heart' ? '♥' : s === 'st_star' ? '★' : s === 'st_flower' ? '✿' : s === 'st_sparkle' ? '✦' : '✷'}
                  </button>
                ))}
                <button onClick={() => { setStickers([]); playClick(); }} className="pixel-btn bg-kawaii-cream text-kawaii-ink px-2 py-1.5 text-[10px]">
                  Clear
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="font-silk text-[10px] text-kawaii-ink/70">Weather:</span>
            {(['none', 'sparkles', 'sakura', 'snow', 'rain'] as WeatherType[]).map((w) => (
              <button
                key={w}
                onClick={() => { setWeather(w); playClick(); }}
                className={`pixel-btn px-2 py-1.5 text-[10px] ${weather === w ? 'bg-kawaii-blue text-kawaii-ink' : 'bg-white text-kawaii-ink'}`}
              >
                {w === 'none' ? 'Clear' : w === 'sparkles' ? '✦ Sparkles' : w === 'sakura' ? '🌸 Sakura' : w === 'snow' ? '❄ Snow' : '🌧 Rain'}
              </button>
            ))}
          </div>
        </div>

        {/* Inventory panel */}
        <div className="lg:w-80 flex flex-col bg-kawaii-cream/70 rounded-pixel border-4 border-kawaii-pink/30 shadow-soft overflow-hidden min-h-[320px]">
          <InventoryPanel
            outfit={outfit}
            onEquip={handleEquip}
            onColor={handleColor}
            onToggle={handleToggle}
            activeTab={activeTab}
            setActiveTab={(t) => { setActiveTab(t); playClick(); }}
          />
        </div>
      </div>

      {/* Action bar */}
      <div className="w-full max-w-5xl mt-3 flex flex-wrap gap-1.5 justify-center">
        <button onClick={undo} disabled={history.length === 0} className="pixel-btn bg-white text-kawaii-ink px-3 py-2 text-xs disabled:opacity-40">
          ↶ Undo
        </button>
        <button onClick={redo} disabled={future.length === 0} className="pixel-btn bg-white text-kawaii-ink px-3 py-2 text-xs disabled:opacity-40">
          ↷ Redo
        </button>
        <button onClick={randomOutfit} className="pixel-btn bg-kawaii-mint text-kawaii-ink px-3 py-2 text-xs">
          🎲 Random
        </button>
        <button onClick={reset} className="pixel-btn bg-kawaii-cream text-kawaii-ink px-3 py-2 text-xs">
          ↺ Reset
        </button>
        <button onClick={savePNG} className="pixel-btn bg-kawaii-lavender text-kawaii-ink px-3 py-2 text-xs">
          📸 Save PNG
        </button>
      </div>

      {/* Favorites modal */}
      {showFavorites && (
        <Modal onClose={() => setShowFavorites(false)} title="♥ Favorite Outfits">
          {favorites.length === 0 ? (
            <p className="font-silk text-sm text-kawaii-ink/70 text-center py-8">No saved outfits yet. Press ★ Save to start your collection!</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto cute-scroll p-1">
              {favorites.map((f) => (
                <div key={f.id} className="bg-white rounded-pixel border-2 border-kawaii-pink/40 p-2 flex flex-col gap-1.5 pop-in">
                  {f.thumbnail && <img src={f.thumbnail} alt={f.outfit_name} className="w-full rounded-lg border-2 border-kawaii-cream" style={{ imageRendering: 'pixelated' }} />}
                  <input
                    defaultValue={f.outfit_name}
                    onBlur={(e) => handleRenameFavorite(f.id, e.target.value)}
                    className="font-silk text-xs text-kawaii-ink bg-kawaii-cream/40 px-2 py-1 rounded outline-none"
                  />
                  <div className="flex gap-1">
                    <button onClick={() => handleLoadFavorite(f)} className="pixel-btn bg-kawaii-pink text-white flex-1 py-1.5 text-[10px]">Load</button>
                    <button onClick={() => handleDeleteFavorite(f.id)} className="pixel-btn bg-white text-kawaii-pinkDark flex-1 py-1.5 text-[10px]">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}

      {/* Daily challenge modal */}
      {showChallenge && (
        <Modal onClose={() => setShowChallenge(false)} title="🌸 Daily Outfit Challenge">
          {challenge ? (
            <div className="text-center py-2 px-2">
              <p className="font-pixel text-sm text-kawaii-pinkDark mb-3">{challenge.theme}</p>
              <p className="font-silk text-sm text-kawaii-ink mb-4">{challenge.prompt}</p>
              <button
                onClick={() => {
                  updateOutfit((o) => ({ ...o, background: 'bg_forest', weather: 'sakura' }));
                  setShowChallenge(false);
                  playEquip();
                }}
                className="pixel-btn bg-kawaii-pink text-white px-4 py-2 text-xs"
              >
                Start Styling!
              </button>
            </div>
          ) : (
            <p className="font-silk text-sm text-kawaii-ink/70 text-center py-8">Loading today's challenge...</p>
          )}
        </Modal>
      )}

      <footer className="mt-4 mb-2 font-silk text-[10px] text-kawaii-ink/50 text-center">
        Made with 🎀 — a cozy pixel-art dress-up studio
      </footer>
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 fade-up" onClick={onClose}>
      <div className="bg-kawaii-cream rounded-pixel border-4 border-kawaii-pink shadow-soft max-w-lg w-full p-4 pop-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-pixel text-xs text-kawaii-pinkDark">{title}</h2>
          <button onClick={onClose} className="pixel-btn bg-white text-kawaii-ink px-2 py-1 text-xs">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
