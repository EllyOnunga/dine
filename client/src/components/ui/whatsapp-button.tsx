import { SiWhatsapp } from "react-icons/si";

export function WhatsAppButton() {
    const whatsappNumber = "254710297603"; // Placeholder Kenyan number based on context
    const message = "Hello! I saw your website and would like to make a reservation.";

    return (
        <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-1000"
            aria-label="Contact us on WhatsApp"
        >
            <div className="bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center">
                <SiWhatsapp className="w-6 h-6" />
            </div>
        </a>
    );
}
