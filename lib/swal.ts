// lib/swal.ts
import Swal from "sweetalert2";

export const DarkSwal = Swal.mixin({
  background: "#08080a",
  color: "#f4f4f5",
  buttonsStyling: false,
  width: "26rem",
  scrollbarPadding: false,

  // ✨ बटर जस्तै स्मूथ एनिमेसन:
  showClass: {
    popup: "animate-in fade-in-0 zoom-in-95 duration-200 ease-out",
    backdrop: "animate-in fade-in-0 duration-200",
  },
  hideClass: {
    popup: "animate-out fade-out-0 zoom-out-95 duration-150 ease-in",
    backdrop: "animate-out fade-out-0 duration-150",
  },

  customClass: {
    container: "!p-4 !bg-black/70 backdrop-blur-md",

    // 💎 Floating Glass Card with Red Ambient Glow:
    popup:
      "!w-full !max-w-[92vw] sm:!max-w-md border border-zinc-800/80 bg-[#09090b]/95 " +
      "rounded-2xl !p-6 shadow-[0_0_50px_-12px_rgba(220,38,38,0.25)] ring-1 ring-white/5",

    // 🔤 Title & Subtitle:
    title:
      "!p-0 !m-0 !text-center text-lg font-bold text-zinc-100 tracking-tight",
    htmlContainer:
      "!m-0 !mt-2 !p-0 !text-center text-xs sm:text-sm text-zinc-400 leading-relaxed",

    // 🔘 Action Buttons Wrapper:
    actions: "!w-full !m-0 !mt-6 flex flex-row justify-end gap-3",

    // 🔴 Premium Gradient Confirm Button:
    confirmButton:
      "rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 " +
      "text-white font-medium text-xs px-5 py-2.5 transition-all duration-150 " +
      "shadow-lg shadow-red-950/60 active:scale-[0.97]",

    // ⚪ Sleek Glass Cancel Button:
    cancelButton:
      "rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 " +
      "font-medium text-xs px-5 py-2.5 transition-all duration-150 active:scale-[0.97]",

    // 📝 Dark Dropdown Input:
    input:
      "!m-0 !mt-4 !w-full rounded-xl border border-zinc-800 bg-zinc-950/90 " +
      "!px-3.5 !py-2.5 text-xs text-zinc-200 focus:border-red-600/70 focus:outline-none " +
      "focus:ring-1 focus:ring-red-600/70 transition-all",

    // 🏷️ Modern Squircle Icon (No clumsy circle):
    icon:
      "!border-none !w-12 !h-12 !rounded-2xl !bg-red-950/40 !ring-1 !ring-red-500/30 " +
      "!flex !items-center !justify-center !mx-auto !mb-3 !scale-90 text-red-500",
  },
});

// 🍞 Corner Toast:
export const DarkToast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2200,
  timerProgressBar: true,
  background: "#09090b",
  color: "#f4f4f5",
  customClass: {
    popup:
      "!border !border-zinc-800/80 !bg-[#09090b]/95 !backdrop-blur-xl " +
      "!rounded-xl !shadow-2xl !px-4 !py-3 text-xs ring-1 ring-white/5",
    title: "!text-xs font-medium !m-0 !text-zinc-200",
    timerProgressBar: "!bg-red-600",
  },
});
