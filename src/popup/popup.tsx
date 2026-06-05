import { useEffect, useState } from "react";
import { hexToRgb, hexToHsl } from "./../utils/colorUtils";
import { uiTips } from "./../utils/uiTips";
import { getNearestTailwindColor } from "./../utils/tailwindColors";
import { getRandomGradient } from "./../utils/gradientUtils";

export default function Popup() {
    const [color, setColor] = useState("#22C55E");
    const [recentColors, setRecentColors] = useState<string[]>([]);
    const [copied, setCopied] = useState(false);
    const [gradient, setGradient] = useState(getRandomGradient());
    const [tip] = useState(
        uiTips[Math.floor(Math.random() * uiTips.length)]
    );

    useEffect(() => {
        const saved = JSON.parse(
            localStorage.getItem("recentColors") || "[]"
        );
        setRecentColors(saved);
    }, []);

    const saveColor = (newColor: string) => {
        let updated = [
            newColor,
            ...recentColors.filter((c) => c !== newColor),
        ];
        updated = updated.slice(0, 6);
        setRecentColors(updated);
        localStorage.setItem("recentColors", JSON.stringify(updated));
    };

    const pickColor = async () => {
        // @ts-ignore
        const eyeDropper = new EyeDropper();
        try {
            const result = await eyeDropper.open();
            setColor(result.sRGBHex);
            saveColor(result.sRGBHex);
        } catch (err) {
            console.log(err);
        }
    };

    const copyColor = async (value: string) => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        // hide after a short success animation
        setTimeout(() => {
            setCopied(false);
        }, 1200);
    };

    return (
        <div
            className="
                w-[760px]
                h-[560px]
                overflow-hidden
                bg-[#070B14]
                text-white
                p-6
                relative
                ui-fade-in
            "
        >
            {/* Background Glow */}
            <div className="absolute inset-0 w-full h-full pointer-events-none opacity-20 blur-3xl z-0">
                <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-purple-500" />
                <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-blue-500" />
            </div>

            {/* Main Content Grid */}
            <div className="relative z-10 grid grid-cols-2 gap-6 h-full">
                
                {/* LEFT COLUMN */}
                <div className="flex flex-col gap-4 h-full">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xl shadow-lg">
                            🎨
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-wide">
                                Dev Color Toolkit
                            </h1>
                            <p className="text-gray-400 text-xs">
                                Pick • Convert • Generate
                            </p>
                        </div>
                    </div>

                    {/* Main Color Preview */}
                    <div
                        className="h-24 rounded-2xl border border-white/10 shadow-2xl transition-all duration-500 relative overflow-hidden shrink-0 card-hover glow-accent"
                        style={{ background: color }}
                    >
                        <div className="absolute inset-0 bg-black/10" />
                    </div>

                    {/* Color Input */}
                    <div className="flex gap-3 shrink-0">
                        <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2 text-base font-medium flex items-center input-focus placeholder-fade">
                            {color}
                        </div>
                        <button
                            onClick={() => copyColor(color)}
                            className="px-4 rounded-xl bg-green-500 hover:scale-105 hover:bg-green-400 transition-all duration-300 font-medium btn-interactive btn-scale btn-glow"
                            aria-label={`Copy ${color}`}
                        >
                            {copied ? (
                                <span className="flex items-center gap-2">
                                    <span className="checkmark">
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className="chk" d="M4 12.5l4.5 4.5L20 6" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                    Copied
                                </span>
                            ) : (
                                "Copy"
                            )}
                        </button>
                    </div>

                    {/* Pick Button */}
                    <button
                        onClick={pickColor}
                        className="w-full py-3 rounded-xl text-base font-semibold bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 hover:scale-[1.02] transition-all duration-300 shadow-lg shrink-0 btn-interactive btn-scale glow-accent"
                    >
                        🎯 Pick Color
                    </button>

                    {/* Recent Colors */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shrink-0 card-hover">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold text-sm">Recent Colors</h3>
                            <button
                                onClick={() => {
                                    setRecentColors([]);
                                    localStorage.removeItem("recentColors");
                                }}
                                className="text-xs text-gray-400 hover:text-white transition-all"
                            >
                                Clear
                            </button>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {recentColors.map((c) => (
                                <div key={c} className="relative color-swatch">
                                    <div
                                        onClick={() => setColor(c)}
                                        className="w-10 h-10 rounded-xl cursor-pointer border border-white/10 hover:scale-110 transition-all duration-300 transform-gpu"
                                        style={{ background: c }}
                                        role="button"
                                        tabIndex={0}
                                        aria-label={`Select recent color ${c}`}
                                    />
                                    <div className="tooltip">{c}</div>
                                </div>
                            ))}
                            {recentColors.length === 0 && (
                                <span className="text-xs text-gray-500 italic">No recent colors yet...</span>
                            )}
                        </div>
                    </div>

                    {/* UI Tip (Pushed to bottom) */}
                    <div className="mt-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:border-yellow-500/30 transition-all duration-300 card-hover">
                        <p className="text-yellow-400 mb-1 font-semibold text-sm">💡 UI Tip</p>
                        <p className="text-gray-300 text-xs leading-relaxed">{tip}</p>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="flex flex-col gap-5 h-full">
                    
                    {/* Conversion Section - 2x2 Grid to save space */}
                    <div className="flex flex-col gap-3">
                        <h3 className="text-sm font-semibold">Convert</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: "HEX", value: color, color: "text-purple-400" },
                                { label: "RGB", value: hexToRgb(color), color: "text-blue-400" },
                                { label: "HSL", value: hexToHsl(color), color: "text-pink-400" },
                                { label: "Tailwind", value: getNearestTailwindColor(color).name, color: "text-green-400" },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3 hover:border-purple-500/30 transition-all duration-300 flex flex-col justify-center card-hover"
                                >
                                    <p className="text-gray-400 text-xs mb-1">{item.label}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium truncate pr-2">
                                            {item.value}
                                        </span>
                                        <button
                                            onClick={() => copyColor(item.value)}
                                            className={`text-xs ${item.color} hover:opacity-80 shrink-0 btn-interactive`}
                                            aria-label={`Copy ${item.label} value`}
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Gradient Generator */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex-1 flex flex-col hover:border-purple-500/30 transition-all duration-300 gradient-preview card-hover">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-semibold">Gradient Generator</h3>
                            <button
                                onClick={() => setGradient(getRandomGradient())}
                                className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/40 transition-all duration-300 text-xs"
                            >
                                Generate
                            </button>
                        </div>
                        
                        {/* Enlarged gradient preview to fill remaining space cleanly */}
                        <div
                            className="flex-1 rounded-xl mb-4 shadow-xl border border-white/10 gradient-preview"
                            style={{ background: gradient }}
                        />
                        
                        <button
                            onClick={() => copyColor(gradient)}
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-medium hover:scale-[1.02] transition-all duration-300 text-sm btn-interactive btn-scale btn-glow"
                        >
                            Copy CSS Gradient
                        </button>
                    </div>
                </div>

            </div>

            {/* Toast container for copy success */}
            <div className="toast-root" aria-live="polite" aria-atomic="true">
                {copied && (
                    <div className="toast">
                        <div className="checkmark" aria-hidden>
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path className="chk" d="M4 12.5l4.5 4.5L20 6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div>Copied!</div>
                    </div>
                )}
            </div>
        </div>
    );
}