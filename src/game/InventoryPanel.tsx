import { useState } from 'react';
import {
  OutfitState,
  AssetOption,
  ColorOption,
  HAIRSTYLES,
  HAIR_COLORS,
  EYE_COLORS,
  SKIN_TONES,
  CLOTHING_COLORS,
  FACES,
  TOPS,
  BOTTOMS,
  DRESSES,
  SHOES,
  ACCESSORIES,
  BACKGROUNDS,
  PETS,
} from './data';

export type TabKey = 'hair' | 'faces' | 'tops' | 'bottoms' | 'dresses' | 'shoes' | 'accessories' | 'backgrounds' | 'pets' | 'colors';

interface PanelProps {
  outfit: OutfitState;
  onEquip: (key: string, value: string | null) => void;
  onColor: (key: string, color: string) => void;
  onToggle: (key: 'blush' | 'freckles') => void;
  activeTab: TabKey;
  setActiveTab: (t: TabKey) => void;
}

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'hair', label: 'Hair', icon: 'Hair' },
  { key: 'faces', label: 'Faces', icon: 'Face' },
  { key: 'tops', label: 'Tops', icon: 'Shirt' },
  { key: 'bottoms', label: 'Bottoms', icon: 'Layers' },
  { key: 'dresses', label: 'Dresses', icon: 'Dress' },
  { key: 'shoes', label: 'Shoes', icon: 'Footprints' },
  { key: 'accessories', label: 'Access.', icon: 'Heart' },
  { key: 'backgrounds', label: 'Scene', icon: 'Image' },
  { key: 'pets', label: 'Pets', icon: 'Cat' },
  { key: 'colors', label: 'Colors', icon: 'Palette' },
];

export default function InventoryPanel({ outfit, onEquip, onColor, onToggle, activeTab, setActiveTab }: PanelProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="grid grid-cols-5 gap-1.5 p-2 bg-kawaii-cream/80 rounded-t-pixel border-b-4 border-kawaii-pink/40">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`pixel-btn px-1.5 py-2 text-[10px] text-center no-select ${
              activeTab === t.key ? 'bg-kawaii-pink text-white' : 'bg-white text-kawaii-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto cute-scroll p-3 bg-kawaii-cream/50">
        {activeTab === 'hair' && <HairTab outfit={outfit} onEquip={onEquip} onColor={onColor} />}
        {activeTab === 'faces' && <FacesTab outfit={outfit} onEquip={onEquip} onToggle={onToggle} onColor={onColor} />}
        {activeTab === 'tops' && <AssetTab list={TOPS} outfit={outfit} field="tops" colorField="topsColor" onEquip={onEquip} onColor={onColor} />}
        {activeTab === 'bottoms' && <AssetTab list={BOTTOMS} outfit={outfit} field="bottoms" colorField="bottomsColor" onEquip={onEquip} onColor={onColor} />}
        {activeTab === 'dresses' && <AssetTab list={DRESSES} outfit={outfit} field="dresses" colorField="dressesColor" onEquip={onEquip} onColor={onColor} />}
        {activeTab === 'shoes' && <AssetTab list={SHOES} outfit={outfit} field="shoes" colorField="shoesColor" onEquip={onEquip} onColor={onColor} />}
        {activeTab === 'accessories' && <AccessoriesTab outfit={outfit} onEquip={onEquip} onColor={onColor} />}
        {activeTab === 'backgrounds' && <SimpleTab list={BACKGROUNDS} field="background" outfit={outfit} onEquip={onEquip} />}
        {activeTab === 'pets' && <SimpleTab list={PETS} field="pet" outfit={outfit} onEquip={onEquip} />}
        {activeTab === 'colors' && <ColorsTab outfit={outfit} onColor={onColor} />}
      </div>
    </div>
  );
}

function ItemButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`pixel-btn px-2 py-2 text-[10px] text-center no-select pop-in ${
        active ? 'bg-kawaii-pink text-white' : 'bg-white text-kawaii-ink hover:bg-kawaii-pink/20'
      }`}
    >
      {children}
    </button>
  );
}

function ColorSwatch({ color, active, onClick }: { color: ColorOption; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={color.name}
      className={`w-7 h-7 rounded-lg border-2 transition-transform hover:scale-110 no-select ${
        active ? 'border-kawaii-ink scale-110' : 'border-white'
      }`}
      style={{ backgroundColor: color.hex }}
    />
  );
}

function ColorRow({ palette, value, onPick }: { palette: ColorOption[]; value: string; onPick: (id: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {palette.map((c) => (
        <ColorSwatch key={c.id} color={c} active={value === c.id} onClick={() => onPick(c.id)} />
      ))}
    </div>
  );
}

function HairTab({ outfit, onEquip, onColor }: { outfit: OutfitState; onEquip: (k: string, v: string | null) => void; onColor: (k: string, v: string) => void }) {
  return (
    <div className="space-y-3">
      <div>
        <p className="font-silk text-xs text-kawaii-ink mb-1">Style</p>
        <div className="grid grid-cols-3 gap-1.5">
          {HAIRSTYLES.map((h) => (
            <ItemButton key={h.id} active={outfit.hair === h.id} onClick={() => onEquip('hair', h.id)}>
              {h.name}
            </ItemButton>
          ))}
        </div>
      </div>
      <div>
        <p className="font-silk text-xs text-kawaii-ink mb-1">Hair Color</p>
        <ColorRow palette={HAIR_COLORS} value={outfit.hairColor} onPick={(id) => onColor('hairColor', id)} />
      </div>
      <div>
        <p className="font-silk text-xs text-kawaii-ink mb-1">Eye Color</p>
        <ColorRow palette={EYE_COLORS} value={outfit.eyeColor} onPick={(id) => onColor('eyeColor', id)} />
      </div>
      <div>
        <p className="font-silk text-xs text-kawaii-ink mb-1">Skin Tone</p>
        <ColorRow palette={SKIN_TONES} value={outfit.skin} onPick={(id) => onColor('skin', id)} />
      </div>
    </div>
  );
}

function FacesTab({ outfit, onEquip, onToggle, onColor }: { outfit: OutfitState; onEquip: (k: string, v: string | null) => void; onToggle: (k: 'blush' | 'freckles') => void; onColor: (k: string, v: string) => void }) {
  return (
    <div className="space-y-3">
      <div>
        <p className="font-silk text-xs text-kawaii-ink mb-1">Expression</p>
        <div className="grid grid-cols-3 gap-1.5">
          {FACES.map((f) => (
            <ItemButton key={f.id} active={outfit.face === f.id} onClick={() => onEquip('face', f.id)}>
              {f.name}
            </ItemButton>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onToggle('blush')}
          className={`pixel-btn flex-1 py-2 text-xs no-select ${outfit.blush ? 'bg-kawaii-pink text-white' : 'bg-white text-kawaii-ink'}`}
        >
          Blush {outfit.blush ? 'On' : 'Off'}
        </button>
        <button
          onClick={() => onToggle('freckles')}
          className={`pixel-btn flex-1 py-2 text-xs no-select ${outfit.freckles ? 'bg-kawaii-pink text-white' : 'bg-white text-kawaii-ink'}`}
        >
          Freckles {outfit.freckles ? 'On' : 'Off'}
        </button>
      </div>
      <div>
        <p className="font-silk text-xs text-kawaii-ink mb-1">Eye Color</p>
        <ColorRow palette={EYE_COLORS} value={outfit.eyeColor} onPick={(id) => onColor('eyeColor', id)} />
      </div>
    </div>
  );
}

function AssetTab({ list, outfit, field, colorField, onEquip, onColor }: {
  list: AssetOption[];
  outfit: OutfitState;
  field: keyof OutfitState;
  colorField: keyof OutfitState;
  onEquip: (k: string, v: string | null) => void;
  onColor: (k: string, v: string) => void;
}) {
  const current = outfit[field] as string | null;
  const currentColor = outfit[colorField] as string;
  return (
    <div className="space-y-3">
      <div>
        <div className="grid grid-cols-3 gap-1.5">
          <ItemButton active={current === null} onClick={() => onEquip(field as string, null)}>
            None
          </ItemButton>
          {list.map((a) => (
            <ItemButton key={a.id} active={current === a.id} onClick={() => onEquip(field as string, a.id)}>
              {a.name}
            </ItemButton>
          ))}
        </div>
      </div>
      {current && (
        <div>
          <p className="font-silk text-xs text-kawaii-ink mb-1">Color</p>
          <ColorRow palette={CLOTHING_COLORS} value={currentColor} onPick={(id) => onColor(colorField as string, id)} />
        </div>
      )}
    </div>
  );
}

function AccessoriesTab({ outfit, onEquip, onColor }: { outfit: OutfitState; onEquip: (k: string, v: string | null) => void; onColor: (k: string, v: string) => void }) {
  const toggle = (id: string) => {
    const has = outfit.accessories.includes(id);
    onEquip('accessories', has ? null : id);
    if (!has) onEquip('accessoriesAdd', id);
    else onEquip('accessoriesRemove', id);
  };
  return (
    <div className="space-y-3">
      <div>
        <p className="font-silk text-xs text-kawaii-ink mb-1">Accessories (toggle)</p>
        <div className="grid grid-cols-3 gap-1.5">
          {ACCESSORIES.map((a) => (
            <ItemButton key={a.id} active={outfit.accessories.includes(a.id)} onClick={() => toggle(a.id)}>
              {a.name}
            </ItemButton>
          ))}
        </div>
      </div>
      {outfit.accessories.length > 0 && (
        <div>
          <p className="font-silk text-xs text-kawaii-ink mb-1">Color (applies to last selected)</p>
          <ColorRow
            palette={CLOTHING_COLORS}
            value={outfit.accessoriesColors[outfit.accessories[outfit.accessories.length - 1]] || 'cpink'}
            onPick={(id) => {
              const last = outfit.accessories[outfit.accessories.length - 1];
              onColor(`accessory:${last}`, id);
            }}
          />
        </div>
      )}
    </div>
  );
}

function SimpleTab({ list, field, outfit, onEquip }: { list: AssetOption[]; field: keyof OutfitState; outfit: OutfitState; onEquip: (k: string, v: string | null) => void }) {
  const current = outfit[field] as string;
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {list.map((a) => (
        <ItemButton key={a.id} active={current === a.id} onClick={() => onEquip(field as string, a.id)}>
          {a.name}
        </ItemButton>
      ))}
    </div>
  );
}

function ColorsTab({ outfit, onColor }: { outfit: OutfitState; onColor: (k: string, v: string) => void }) {
  return (
    <div className="space-y-3">
      <div>
        <p className="font-silk text-xs text-kawaii-ink mb-1">Hair Color</p>
        <ColorRow palette={HAIR_COLORS} value={outfit.hairColor} onPick={(id) => onColor('hairColor', id)} />
      </div>
      <div>
        <p className="font-silk text-xs text-kawaii-ink mb-1">Eye Color</p>
        <ColorRow palette={EYE_COLORS} value={outfit.eyeColor} onPick={(id) => onColor('eyeColor', id)} />
      </div>
      <div>
        <p className="font-silk text-xs text-kawaii-ink mb-1">Skin Tone</p>
        <ColorRow palette={SKIN_TONES} value={outfit.skin} onPick={(id) => onColor('skin', id)} />
      </div>
      <div>
        <p className="font-silk text-xs text-kawaii-ink mb-1">Tops Color</p>
        <ColorRow palette={CLOTHING_COLORS} value={outfit.topsColor} onPick={(id) => onColor('topsColor', id)} />
      </div>
      <div>
        <p className="font-silk text-xs text-kawaii-ink mb-1">Bottoms Color</p>
        <ColorRow palette={CLOTHING_COLORS} value={outfit.bottomsColor} onPick={(id) => onColor('bottomsColor', id)} />
      </div>
      <div>
        <p className="font-silk text-xs text-kawaii-ink mb-1">Dress Color</p>
        <ColorRow palette={CLOTHING_COLORS} value={outfit.dressesColor} onPick={(id) => onColor('dressesColor', id)} />
      </div>
      <div>
        <p className="font-silk text-xs text-kawaii-ink mb-1">Shoes Color</p>
        <ColorRow palette={CLOTHING_COLORS} value={outfit.shoesColor} onPick={(id) => onColor('shoesColor', id)} />
      </div>
    </div>
  );
}
