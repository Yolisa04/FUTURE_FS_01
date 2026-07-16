import { useEffect, useState } from "react";
import client from "../api/client";

const FALLBACK_TEAM = [
  // {
  //   id: "1",
  //   name: "Mira Santos",
  //   role: "Senior Colorist",
  //   bio: "Ten years specializing in dimensional color.",
  //   specialties: ["Balayage", "Color Correction", "Luxury Treatments"],
  //   photo_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
  // },
  {
    id: "2",
    name: "Kasi Jonasi",
    role: "Master Stylist",
    bio: "Known for precision cuts and modern shag styles.",
    specialties: ["Signature Cut", "Men's Grooming"],
    photo_url: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=400&q=80",
  },
  // {
  //   id: "3",
  //   name: "Priya Nair",
  //   role: "Bridal & Events Specialist",
  //   bio: "Has styled over 200 wedding parties.",
  //   specialties: ["Bridal Styling", "Updos"],
  //   photo_url: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=400&q=80",
  // },
  // {
  //   id: "4",
  //   name: "Aria Kessler",
  //   role: "Esthetician",
  //   bio: "Focused on holistic, botanical skincare rituals.",
  //   specialties: ["Botanical Facial", "Skin Treatments"],
  //   photo_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
  // },
];

export default function Team() {
  const [team, setTeam] = useState(FALLBACK_TEAM);

  useEffect(() => {
    client
      .get("/api/stylists")
      .then((res) => {
        if (res.data?.length) {
          setTeam(
            res.data.map((s, i) => ({
              ...s,
              photo_url: s.photo_url || FALLBACK_TEAM[i % FALLBACK_TEAM.length].photo_url,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="team" className="bg-ochre-50/60 py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs tracking-[0.2em] uppercase text-ochre-600">Meet the Artists</span>
          <h2 className="font-display text-3xl md:text-4xl mt-3 mb-4">Our Team</h2>
          <p className="text-ink/60">Every stylist here trained under someone before them. Skill gets passed down, not just picked up.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <div key={member.id} className="text-center group">
              <div className="aspect-square rounded-2xl overflow-hidden mb-4 shadow-soft">
                <img
                  src={member.photo_url}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-display text-lg text-ink">{member.name}</h3>
              <p className="text-sm text-ochre-600 mb-2">{member.role}</p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {(member.specialties || []).slice(0, 3).map((s) => (
                  <span key={s} className="text-[11px] bg-white text-ink/60 border border-ochre-100 px-2 py-0.5 rounded-full">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
