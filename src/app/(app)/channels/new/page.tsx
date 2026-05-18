import AddChannelForm from "@/components/AddChannelForm";

export default function NewChannelPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-100">Add channel</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Paste a URL — we&apos;ll detect the platform automatically.
        </p>
      </div>

      <AddChannelForm />

      <div className="text-xs text-neutral-500 max-w-xl">
        Supported platforms: YouTube, X, Telegram, Facebook, Instagram, LinkedIn,
        Habr, Stack Overflow, T-Bank Pulse, Smart-Lab.
      </div>
    </div>
  );
}
