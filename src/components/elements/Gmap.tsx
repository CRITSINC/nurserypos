"use client";

export default function Gmap() {
    return (
        <iframe
            title="Glen Echo Nurseries"
            src="https://maps.google.com/maps?q=15070%20Airport%20Road,%20Caledon,%20Ontario,%20Canada%20L7C%202W7&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="400"
            style={{
                border: 0,
                borderRadius: "15px",
            }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
        />
    );
}